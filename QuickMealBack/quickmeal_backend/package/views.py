from django.shortcuts import render
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.conf import settings
from django.db.models import Q
from datetime import timedelta
from package.models import Package, PackageItem, PackagePriceHistory
from dish.models import Dish
from utils.token import decode_token

class CreatePackageView(APIView):
    """
    创建套餐接口（管理员权限）
    """
    def post(self, request):
        # Token 校验
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=401)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=403)

        # 提取字段
        name = request.data.get('name')
        description = request.data.get('description', '')
        price = request.data.get('price')
        status_str = request.data.get('status')
        image_file = request.FILES.get('image')
        items_raw = request.data.get('items')  # 是 JSON 字符串

        # ✅ 检查套餐名是否重复
        if Package.objects.filter(name=name).exists():
            return Response({'detail': '套餐名称已存在'}, status=400)

        if not all([name, price, items_raw]):
            return Response({'detail': '缺少参数'}, status=400)

        try:
            items = json.loads(items_raw)
        except Exception:
            return Response({'detail': 'items 格式错误'}, status=400)

        is_available = True if status_str == '上架' else False

        # 保存图片
        image_url = ''
        if image_file:
            filename = f"{name}.jpg"
            image_path = os.path.join(settings.MEDIA_ROOT, 'packages', filename)
            os.makedirs(os.path.dirname(image_path), exist_ok=True)
            with open(image_path, 'wb+') as f:
                for chunk in image_file.chunks():
                    f.write(chunk)
            image_url = f'packages/{filename}'

        # 创建套餐记录
        package = Package.objects.create(
            name=name,
            description=description,
            price=price,
            is_available=is_available,
            image_url=image_url,
            created_at=timezone.now(),
            updated_at=timezone.now()
        )

        # 创建菜品项
        for item in items:
            dish_id = item.get('id')
            quantity = item.get('quantity', 1)
            try:
                dish = Dish.objects.get(pk=dish_id)
                PackageItem.objects.create(package=package, dish=dish, quantity=quantity)
            except Dish.DoesNotExist:
                continue  # 忽略非法 dish

        return Response({'message': '套餐创建成功'}, status=201)

class PackageListView(APIView):
    """
    获取套餐列表（支持状态、排序、关键词筛选）
    """
    def get(self, request):
        status_filter = request.GET.get('status', 'all')
        sort_option = request.GET.get('sort', 'default')
        keyword = request.GET.get('keyword', '')

        packages = Package.objects.all()

        # 1. 关键词筛选
        if keyword:
            packages = packages.filter(
                Q(name__icontains=keyword) |
                Q(description__icontains=keyword)
            )

        # 2. 状态筛选
        if status_filter == 'on-shelf':
            packages = packages.filter(is_available=True)
        elif status_filter == 'off-shelf':
            packages = packages.filter(is_available=False)

        # 3. 排序
        if sort_option == 'price-asc':
            packages = packages.order_by('price')
        elif sort_option == 'price-desc':
            packages = packages.order_by('-price')
        elif sort_option == 'create-time':
            packages = packages.order_by('-created_at')
        elif sort_option == 'update-time':
            packages = packages.order_by('-updated_at')
        else:
            packages = packages.order_by('-created_at')  # 默认按创建时间

        # 4. 构造响应数据
        result = []
        for pkg in packages:
            items = []
            for item in PackageItem.objects.filter(package=pkg).select_related('dish'):
                dish = item.dish
                items.append({
                    'id': dish.dish_id,
                    'name': dish.name,
                    'price': float(dish.price),
                    'quantity': item.quantity,
                    'image': f'/media/{dish.image_url}'
                })

            result.append({
                'id': pkg.id,
                'name': pkg.name,
                'description': pkg.description,
                'price': float(pkg.price),
                'status': '上架' if pkg.is_available else '下架',
                'image': f'/media/{pkg.image_url}' if pkg.image_url else '',
                'createdAt': timezone.localtime(pkg.created_at).strftime('%Y-%m-%d %H:%M:%S'),
                'updatedAt': timezone.localtime(pkg.updated_at).strftime('%Y-%m-%d %H:%M:%S'),
                'items': items
            })

        return Response({'message': '获取成功', 'data': result}, status=200)
    
class UpdatePackageItemsView(APIView):
    """
    更新套餐中菜品信息（添加、删除、更新数量）
    """
    def patch(self, request):
        # 1. 身份校验
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=401)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=403)

        # 2. 参数校验
        package_id = request.data.get('package_id')
        items_raw = request.data.get('items')

        if not package_id or not items_raw:
            return Response({'detail': '缺少参数'}, status=400)

        try:
            new_items = json.loads(items_raw)
        except Exception:
            return Response({'detail': 'items 格式错误'}, status=400)

        try:
            package = Package.objects.get(pk=package_id)
        except Package.DoesNotExist:
            return Response({'detail': '套餐不存在'}, status=404)

        # 3. 当前数据库已有的项目
        current_items = list(PackageItem.objects.filter(package=package))

        # 转换为字典便于比对
        current_map = {item.dish.dish_id: item for item in current_items}
        new_map = {item['id']: item for item in new_items}

        # 4. 找出要删除的项
        to_delete_ids = set(current_map.keys()) - set(new_map.keys())
        PackageItem.objects.filter(package=package, dish_id__in=to_delete_ids).delete()

        # 5. 更新已有项 or 添加新项
        for dish_id, item in new_map.items():
            quantity = item.get('quantity', 1)
            try:
                dish = Dish.objects.get(pk=dish_id)
            except Dish.DoesNotExist:
                continue

            if dish_id in current_map:
                package_item = current_map[dish_id]
                if package_item.quantity != quantity:
                    package_item.quantity = quantity
                    package_item.save()
            else:
                PackageItem.objects.create(package=package, dish=dish, quantity=quantity)

        package.updated_at = timezone.now()
        package.save()

        return Response({'message': '套餐菜品更新成功'}, status=200)
    
class UpdatePackageInfoView(APIView):
    """
    编辑套餐基础信息接口（管理员权限）
    """

    def patch(self, request):
        # Token 校验
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=401)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=403)

        package_id = request.data.get('package_id')
        name = request.data.get('name')
        description = request.data.get('description', '')
        image_file = request.FILES.get('image')

        if not package_id:
            return Response({'detail': '缺少套餐ID'}, status=400)

        try:
            package = Package.objects.get(pk=package_id)
        except Package.DoesNotExist:
            return Response({'detail': '套餐不存在'}, status=404)

        # 更新图片（如有）
        if image_file:
            filename = f"{name or package.name}.jpg"
            image_path = os.path.join(settings.MEDIA_ROOT, 'packages', filename)
            os.makedirs(os.path.dirname(image_path), exist_ok=True)
            with open(image_path, 'wb+') as f:
                for chunk in image_file.chunks():
                    f.write(chunk)
            package.image_url = f'packages/{filename}'

        # 套餐重名校验（避免套餐名重复）
        if name and name != package.name and Package.objects.filter(name=name).exclude(id=package.id).exists():
            return Response({'detail': '套餐名已存在'}, status=400)

        if name:
            package.name = name
        package.description = description
        package.updated_at = timezone.now()
        package.save()

        return Response({'message': '套餐信息更新成功'}, status=200)

class UpdatePackageStatusView(APIView):
    """
    上架 / 下架 套餐（管理员权限）
    """

    def patch(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供 Token'}, status=401)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=403)

        package_id = request.data.get('package_id')
        action = request.data.get('action')  # '上架' 或 '下架'

        if not package_id or action not in ['上架', '下架']:
            return Response({'detail': '参数错误'}, status=400)

        try:
            package = Package.objects.get(pk=package_id)
        except Package.DoesNotExist:
            return Response({'detail': '套餐不存在'}, status=404)

        package.is_available = (action == '上架')
        package.updated_at = timezone.now()
        package.save()

        return Response({'message': f'套餐已{action}成功'}, status=200)

class UpdatePackagePriceView(APIView):
    """
    修改套餐价格（记录历史）
    """

    def patch(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=401)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=403)

        package_id = request.data.get('package_id')
        new_price = request.data.get('new_price')

        if not package_id or new_price is None:
            return Response({'detail': '参数缺失'}, status=400)

        try:
            new_price = float(new_price)
        except ValueError:
            return Response({'detail': '价格格式错误'}, status=400)

        try:
            pkg = Package.objects.get(pk=package_id)
        except Package.DoesNotExist:
            return Response({'detail': '套餐不存在'}, status=404)

        if float(pkg.price) == new_price:
            return Response({'detail': '价格未变化'}, status=400)

        # 写入历史价格表
        PackagePriceHistory.objects.create(
            package=pkg,
            original_price=pkg.price,
            current_price=new_price,
            effective_date=timezone.now()
        )

        pkg.price = new_price
        pkg.updated_at = timezone.now()
        pkg.save()

        return Response({'message': '套餐价格更新成功'}, status=200)

class PackagePriceHistoryView(APIView):
    """
    获取套餐的价格变化历史
    """

    def get(self, request, package_id):
        try:
            pkg = Package.objects.get(pk=package_id)
        except Package.DoesNotExist:
            return Response({'detail': '套餐不存在'}, status=404)

        records = PackagePriceHistory.objects.filter(package=pkg).order_by('effective_date')
        data = []

        if not records.exists():
            return Response({
                'detail': '暂无价格历史',
                'data': []
            }, status=400)

        # 插入初始价格记录
        if records.exists():
            first = records.first()
            data.append({
                'date': (first.effective_date - timedelta(days=1)).strftime('%Y-%m-%d'),
                'price': float(first.original_price)
            })

        for r in records:
            data.append({
                'date': r.effective_date.strftime('%Y-%m-%d'),
                'price': float(r.current_price)
            })

        return Response({'message': '历史价格获取成功', 'data': data}, status=200)





