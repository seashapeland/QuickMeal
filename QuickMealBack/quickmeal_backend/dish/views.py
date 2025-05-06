# dish/views.py
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Dish, DishPriceHistory
from .serializers import DishSerializer
from .models import DishCategory
from .serializers import DishCategorySerializer
from utils.token import decode_token
from django.conf import settings
from django.utils import timezone

class CreateDishView(APIView):
    """
    创建菜品接口（仅限管理员）
    """
    def post(self, request):
        # 1. 验证身份
        token = request.META.get('HTTP_AUTHORIZATION')
        if not token or not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '权限不足，仅限管理员操作'}, status=status.HTTP_403_FORBIDDEN)

        # 2. 复制数据
        data = request.data.copy()
        name = data.get('name')
        image_file = request.FILES.get('image')

        if not name or not image_file:
            return Response({'detail': '菜品名或图片缺失'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Dish.objects.filter(name=name).exists():
            return Response({'detail': '菜品名称已存在'}, status=status.HTTP_400_BAD_REQUEST)

        # 3. 保存图片（命名为 菜品名.jpg）
        filename = f"{name}.jpg"
        image_path = os.path.join(settings.MEDIA_ROOT, 'images', filename)

        # 若 images 文件夹不存在则创建
        os.makedirs(os.path.dirname(image_path), exist_ok=True)

        # 保存文件
        with open(image_path, 'wb+') as f:
            for chunk in image_file.chunks():
                f.write(chunk)

        # 设置 image_url（只传路径字符串，不是文件）
        data['image_url'] = f'images/{filename}'

        # 4. 反序列化并保存
        serializer = DishSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': '菜品创建成功',
                'dish': serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'detail': '创建失败',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class DishListView(APIView):
    """
    获取菜品总览（支持筛选、搜索、排序）
    """
    def get(self, request):
        # 获取参数
        category_name = request.query_params.get('category', 'all')
        status_filter = request.query_params.get('status', 'all')
        sort = request.query_params.get('sort', 'default')
        keyword = request.query_params.get('keyword', '').strip()

        # 初始 QuerySet
        dishes = Dish.objects.all()

        # 1. 类别筛选
        if category_name != 'all':
            try:
                category = DishCategory.objects.get(category_name=category_name)
                dishes = dishes.filter(category=category)
            except DishCategory.DoesNotExist:
                return Response({'detail': '无效的菜品分类'}, status=status.HTTP_400_BAD_REQUEST)

        # 2. 上下架筛选
        if status_filter == 'on-shelf':
            dishes = dishes.filter(is_available=True)
        elif status_filter == 'off-shelf':
            dishes = dishes.filter(is_available=False)

        # 3. 关键词搜索（按名称模糊匹配）
        if keyword:
            dishes = dishes.filter(name__icontains=keyword)

        # 4. 排序
        if sort == 'price-asc':
            dishes = dishes.order_by('price')
        elif sort == 'price-desc':
            dishes = dishes.order_by('-price')
        elif sort == 'create-time':
            dishes = dishes.order_by('-created_at')
        elif sort == 'update-time':
            dishes = dishes.order_by('-updated_at')
        # default 不排序

        # 序列化
        serializer = DishSerializer(dishes, many=True)

        # 格式转换：适配前端字段结构
        formatted_data = []
        for dish in serializer.data:
            formatted_data.append({
                "id": dish['dish_id'],
                "name": dish['name'],
                "description": dish['description'],
                "price": float(dish['price']),
                "image": f"/media/{dish['image_url']}",  # 拼接图片路径
                "status": "上架" if dish['is_available'] else "下架",
                "createdAt": dish['created_at'],  # 截取日期
                "updatedAt": dish['updated_at']
            })

        return Response({
            "message": "菜品列表获取成功",
            "data": formatted_data
        }, status=status.HTTP_200_OK)

class DishCategoryListView(APIView):
    """
    获取所有菜品类别列表
    """
    permission_classes = [AllowAny]
    def get(self, request):
        categories = DishCategory.objects.all().order_by('category_id')  # 按 category_id 排序
        serializer = DishCategorySerializer(categories, many=True)  # 使用序列化器将数据转换为JSON
        return Response({
            'message': '菜品类别列表获取成功',
            'data': serializer.data  # 返回序列化后的菜品类别数据
        }, status=status.HTTP_200_OK)
    
class DishStatusUpdateView(APIView):
    """
    上架 / 下架菜品接口（管理员权限）
    """
    permission_classes = [AllowAny]

    def patch(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供 Token'}, status=401)
        
        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=403)

        dish_id = request.data.get('dish_id')
        action = request.data.get('action')  # 期望是 "上架" 或 "下架"

        if not dish_id or action not in ['上架', '下架']:
            return Response({'detail': '缺少参数或格式错误'}, status=400)

        try:
            dish = Dish.objects.get(pk=dish_id)
        except Dish.DoesNotExist:
            return Response({'detail': '菜品不存在'}, status=404)

        dish.is_available = (action == '上架')
        dish.updated_at = timezone.now()
        dish.save()

        return Response({'message': f'菜品已成功{action}'}, status=200)
    
class UpdateDishPriceView(APIView):
    """
    修改菜品价格接口（记录历史）
    """
    permission_classes = [AllowAny]

    def patch(self, request):
        # 1. 验证管理员身份
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=401)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=403)

        # 2. 获取参数
        dish_id = request.data.get('dish_id')
        new_price = request.data.get('new_price')

        if not dish_id or new_price is None:
            return Response({'detail': '缺少参数'}, status=400)

        try:
            dish = Dish.objects.get(pk=dish_id)
        except Dish.DoesNotExist:
            return Response({'detail': '菜品不存在'}, status=404)

        try:
            new_price = float(new_price)
        except ValueError:
            return Response({'detail': '价格格式错误'}, status=400)

        # 3. 如果价格没有变化就不做操作
        if float(dish.price) == new_price:
            return Response({'detail': '价格未变化，无需修改'}, status=400)

        # 4. 写入历史表
        DishPriceHistory.objects.create(
            dish=dish,
            original_price=dish.price,
            current_price=new_price,
            effective_date=timezone.now()
        )

        # 5. 更新菜品当前价格
        dish.price = new_price
        dish.updated_at = timezone.now()
        dish.save()

        return Response({'message': '价格修改成功'}, status=200)

class DishPriceHistoryView(APIView):
    """
    获取某菜品的价格变化历史（包含最早原价）
    """
    permission_classes = [AllowAny]

    def get(self, request, dish_id):
        try:
            dish = Dish.objects.get(pk=dish_id)
        except Dish.DoesNotExist:
            return Response({'detail': '菜品不存在'}, status=status.HTTP_404_NOT_FOUND)

        history = DishPriceHistory.objects.filter(dish=dish).order_by('effective_date')

        if not history.exists():
            return Response({
                'detail': '暂无价格历史',
                'data': []
            }, status=400)

        # 加入初始价格：取最早记录的 original_price
        first_record = history.first()
        data = [{
            'date': '初始',
            'price': float(first_record.original_price)
        }]

        # 然后追加每一条 current_price
        for record in history:
            data.append({
                'date': record.effective_date.strftime('%Y-%m-%d'),
                'price': float(record.current_price)
            })

        return Response({
            'message': '价格历史获取成功',
            'data': data
        }, status=200)
    
class UpdateDishInfoView(APIView):
    """
    更新菜品基本信息（名称、描述、类别、图片）
    """
    def patch(self, request):
        # 1. 身份验证
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=401)
        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=403)

        # 2. 获取数据
        dish_id = request.data.get('dish_id')
        new_name = request.data.get('name')
        new_description = request.data.get('description')
        new_category_name = request.data.get('category_name')
        image_file = request.FILES.get('image')

        if not dish_id:
            return Response({'detail': '缺少dish_id'}, status=400)

        try:
            dish = Dish.objects.get(pk=dish_id)
        except Dish.DoesNotExist:
            return Response({'detail': '菜品不存在'}, status=404)

        old_name = dish.name
        old_image_path = os.path.join(settings.MEDIA_ROOT, dish.image_url.name)  # 修正

        # 3. 替换图片（如有）
        if image_file:
            # 使用 dish.image_url.name 获取图片路径（相对路径）
            full_path = os.path.join(settings.MEDIA_ROOT, dish.image_url.name)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, 'wb+') as f:
                for chunk in image_file.chunks():
                    f.write(chunk)
            # 不改名，直接覆盖即可，无需 dish.image_url 更新

        # 4. 如果只改菜品名（未上传图片），则尝试重命名图片文件
        if new_name and new_name != old_name and not image_file:
            # 获取旧图路径和新图路径
            old_path = os.path.join(settings.MEDIA_ROOT, dish.image_url.name)
            ext = os.path.splitext(dish.image_url.name)[-1] or '.jpg'
            new_filename = f"{new_name}{ext}"
            new_path = os.path.join(settings.MEDIA_ROOT, 'images', new_filename)

            try:
                os.rename(old_path, new_path)
                dish.image_url = f'images/{new_filename}'  # 更新图片路径字段
                dish.name = new_name  # 更新菜品名称
            except Exception as e:
                return Response({'detail': '图片重命名失败', 'error': str(e)}, status=500)

        # 5. 其他字段更新
        if new_description:
            dish.description = new_description

        if new_category_name:
            try:
                category = DishCategory.objects.get(category_name=new_category_name)
                dish.category = category
            except DishCategory.DoesNotExist:
                return Response({'detail': '无效的菜品类别'}, status=400)

        dish.updated_at = timezone.now()
        dish.save()

        return Response({'message': '菜品信息更新成功'}, status=200)

