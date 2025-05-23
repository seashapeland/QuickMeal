from django.shortcuts import render
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.conf import settings
from package.models import Package, PackageItem
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
