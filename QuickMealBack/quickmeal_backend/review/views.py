from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from review.models import DishReview
from dish.models import Dish
from user.models import User
from review.models import PackageReview
from package.models import Package
from review.models import StoreReview
from django.conf import settings
from django.utils import timezone

class SubmitDishReviewView(APIView):
    """
    提交菜品评价（无需登录）
    """
    permission_classes = []  # 允许匿名用户访问

    def post(self, request):
        dish_id = request.data.get('dish_id')
        user_id = request.data.get('user_id')
        rating = int(request.data.get('rating', 5))
        content = request.data.get('content', '').strip()

        if not dish_id or not user_id:
            return Response({'message': '缺少参数'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            dish = Dish.objects.get(dish_id=dish_id)
        except (User.DoesNotExist, Dish.DoesNotExist):
            return Response({'message': '用户或菜品不存在'}, status=status.HTTP_404_NOT_FOUND)


        DishReview.objects.create(
            user=user,
            dish=dish,
            rating=rating,
            content=content
        )

        return Response({'message': '评价提交成功'}, status=status.HTTP_201_CREATED)

class SubmitPackageReviewView(APIView):
    """
    提交套餐评价（无需登录）
    """
    permission_classes = []

    def post(self, request):
        package_id = request.data.get('package_id')
        user_id = request.data.get('user_id')
        rating = int(request.data.get('rating', 5))
        content = request.data.get('content', '').strip()

        if not package_id or not user_id:
            return Response({'message': '缺少参数'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            package = Package.objects.get(id=package_id)
        except (User.DoesNotExist, Package.DoesNotExist):
            return Response({'message': '用户或套餐不存在'}, status=status.HTTP_404_NOT_FOUND)

        PackageReview.objects.create(
            user=user,
            package=package,
            rating=rating,
            content=content
        )

        return Response({'message': '评价提交成功'}, status=status.HTTP_201_CREATED)

class SubmitShopReviewView(APIView):
    """
    提交门店评价（无需登录）
    """
    permission_classes = []

    def post(self, request):
        user_id = request.data.get('user_id')
        content = request.data.get('content', '').strip()

        if not user_id or not content:
            return Response({'message': '缺少参数'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'message': '用户不存在'}, status=status.HTTP_404_NOT_FOUND)

        StoreReview.objects.create(
            user=user,
            content=content
        )

        return Response({'message': '评价提交成功'}, status=status.HTTP_201_CREATED)

class DishReviewListView(APIView):
    """
    获取某个菜品的全部评价（按时间倒序）
    """

    def get(self, request, dish_id):
        reviews = DishReview.objects.filter(dish_id=dish_id).order_by('-created_at')

        result = []
        for r in reviews:
            user = r.user
            result.append({
                'id': r.id,
                'rating': r.rating,
                'content': r.content,
                'date': timezone.localtime(r.created_at).strftime('%Y-%m-%d %H:%M:%S'),
                'name': user.username or user.nickname,
                'avatar': user.avatar.url if user.avatar else ''
            })

        return Response({
            'message': '获取成功',
            'data': result
        }, status=status.HTTP_200_OK)

class PackageReviewListView(APIView):
    """
    获取某套餐的全部评价（按时间倒序）
    """
    def get(self, request, package_id):
        reviews = PackageReview.objects.filter(package_id=package_id).order_by('-created_at')

        result = []
        for r in reviews:
            user = r.user
            result.append({
                'id': r.id,
                'rating': r.rating,
                'content': r.content,
                'date': timezone.localtime(r.created_at).strftime('%Y-%m-%d %H:%M:%S'),
                'name': user.username or user.nickname,
                'avatar': user.avatar.url if user.avatar else ''
            })

        return Response({
            'message': '获取成功',
            'data': result
        }, status=status.HTTP_200_OK)
    
class ShopReviewListView(APIView):
    """
    获取全部门店评价（按时间倒序）
    """
    def get(self, request):
        reviews = StoreReview.objects.all().order_by('-created_at')

        result = []
        for r in reviews:
            user = r.user
            result.append({
                'id': r.id,
                'content': r.content,
                'date': timezone.localtime(r.created_at).strftime('%Y-%m-%d %H:%M:%S'),
                'name': user.username or getattr(user, 'nickname', '匿名用户'),
                'avatar': user.avatar.url if hasattr(user, 'avatar') and user.avatar else ''
            })

        return Response({
            'message': '获取成功',
            'data': result
        }, status=status.HTTP_200_OK)