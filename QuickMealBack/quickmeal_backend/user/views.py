from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .models import User
import time, jwt
import shutil
import os
import requests
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.core.files.base import ContentFile
from rest_framework.parsers import MultiPartParser, FormParser
from utils.token import decode_token
from django.utils import timezone
from .models import Favorite, User
from dish.models import Dish
from package.models import Package


class RegisterView(APIView):
    """
    账号密码注册接口：自动拷贝默认头像
    """

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response({'message': '用户名和密码不能为空'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'message': '该用户名已被注册'}, status=status.HTTP_400_BAD_REQUEST)

        # 自动拷贝默认头像
        default_avatar_path = os.path.join(settings.MEDIA_ROOT, 'default-avatar.png')
        user_avatar_dir = os.path.join(settings.MEDIA_ROOT, 'avatars')
        os.makedirs(user_avatar_dir, exist_ok=True)

        user_avatar_filename = f"{username}.png"
        user_avatar_path = os.path.join(user_avatar_dir, user_avatar_filename)

        try:
            shutil.copy(default_avatar_path, user_avatar_path)
        except Exception as e:
            return Response({'message': f'头像拷贝失败：{str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 存入数据库：avatar 为相对路径 avatars/xxx.png
        avatar_relative_path = f"avatars/{user_avatar_filename}"
        User.objects.create(
            username=username,
            password=make_password(password),
            avatar=avatar_relative_path
        )

        return Response({'message': '注册成功'}, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    """
    用户登录接口（支持账号密码 + 微信 openid）
    """

    def post(self, request):
        login_type = request.data.get('type', 'password')  # "password" 或 "wechat"

        if login_type == 'password':
            return self.login_with_password(request)
        elif login_type == 'wechat':
            return self.login_with_wechat(request)
        else:
            return Response({'message': '无效的登录方式'}, status=400)

    def login_with_password(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response({'message': '用户名和密码不能为空'}, status=400)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'message': '用户不存在'}, status=404)

        if not check_password(password, user.password):
            return Response({'message': '密码错误'}, status=400)

        token = self.generate_token(user)

        return Response({
            'message': '登录成功',
            'token': token,
            'user_id': user.id,
            'username': user.username,
            'avatar': user.avatar.url if user.avatar else ''
        })

    def login_with_wechat(self, request):
        nickname = request.data.get('nickname', '微信用户')
        avatar_url = request.data.get('avatar')

        code = request.data.get('openid')  # 实际是 code
        openid, wx_data = self.get_openid_from_wechat(code)
        if not openid:
            return Response({'message': '获取 openid 失败', 'wx_error': wx_data}, status=400)


        # 查找或创建用户
        user, created = User.objects.get_or_create(openid=openid, defaults={
            'nickname': nickname,
            'username': nickname  # 同步设置 username
        })

        if created:
            # 下载微信头像
            if avatar_url:
                try:
                    response = requests.get(avatar_url)
                    if response.status_code == 200:
                        filename = f"{nickname}.jpg"
                        user.avatar.save(filename, ContentFile(response.content), save=False)
                except Exception as e:
                    print(f"[⚠️] 微信头像下载失败: {e}")
            user.save()

        token = self.generate_token(user)

        return Response({
            'message': '微信登录成功',
            'token': token,
            'user_id': user.id,
            'username': user.username or user.nickname,
            'avatar': user.avatar.url if user.avatar else ''
        }, status=200)

    def generate_token(self, user):
        payload = {
            'user_id': user.id,
            'username': user.username or user.nickname,
            'exp': int(time.time()) + 60 * 60 * 24,  # 1 天有效
            'iat': int(time.time()),
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    def get_openid_from_wechat(self, code):
        appid = 'wx8eb6cb1ec79222d7'
        secret = '55cbabf597cd21cd2a7f76484531d3ad'
        url = f"https://api.weixin.qq.com/sns/jscode2session?appid={appid}&secret={secret}&js_code={code}&grant_type=authorization_code"

        resp = requests.get(url)
        data = resp.json()
        print(f"[⚠️] 微信登录响应: {data}")
        return data.get('openid'), data
    
class UpdateUserInfoView(APIView):
    """
    更新用户信息：用户名（同步 nickname） + 头像（重命名并替换）
    """
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user_id = request.data.get('user_id')
        new_username = request.data.get('username', '').strip()
        avatar = request.FILES.get('avatar')

        if not user_id:
            return Response({'message': '缺少用户ID'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'message': '用户不存在'}, status=status.HTTP_404_NOT_FOUND)

        # 检查用户名是否重复（不包括自己）
        if new_username and new_username != user.username:
            if User.objects.filter(username=new_username).exclude(id=user_id).exists():
                return Response({'message': '用户名已存在'}, status=status.HTTP_400_BAD_REQUEST)

        # 获取原头像路径
        old_avatar_path = user.avatar.path if user.avatar else None

        # 替换头像（先保存临时头像）
        if avatar:
            temp_name = f"temp_{user.id}.jpg"
            temp_path = os.path.join(settings.MEDIA_ROOT, 'avatars', temp_name)
            with open(temp_path, 'wb+') as f:
                for chunk in avatar.chunks():
                    f.write(chunk)

        # 更新用户名（同时更新nickname）
        if new_username:
            user.username = new_username
            user.nickname = new_username

        # 重命名头像文件并更新路径
        if avatar:
            final_filename = f"{user.username or user.nickname}.jpg"
            final_path = os.path.join(settings.MEDIA_ROOT, 'avatars', final_filename)

            # 删除旧头像
            if old_avatar_path and os.path.exists(old_avatar_path):
                try:
                    os.remove(old_avatar_path)
                except Exception as e:
                    print(f"[⚠️] 删除旧头像失败: {e}")

            # 移动并重命名新头像
            try:
                shutil.move(temp_path, final_path)
                user.avatar.name = f"avatars/{final_filename}"  # 相对路径
            except Exception as e:
                return Response({'message': f'头像保存失败: {str(e)}'}, status=500)

        user.save()

        return Response({
            'message': '更新成功',
            'username': user.username,
            'avatar': user.avatar.url if user.avatar else ''
        }, status=200)
    
class UserListView(APIView):
    """
    获取全部用户列表（仅限管理员）
    """

    def get(self, request):
        # 1. 验证管理员身份
        token = request.META.get('HTTP_AUTHORIZATION')
        if not token or not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = decode_token(token[7:])  # 去掉 "Bearer "
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '权限不足，仅限管理员操作'}, status=status.HTTP_403_FORBIDDEN)

        # 2. 查询所有用户
        users = User.objects.all().order_by('-id')

        user_data = []
        for user in users:
            user_data.append({
                'id': user.id,
                'username': user.username,
                'nickname': user.nickname,
                'avatar': user.avatar.url if user.avatar else '',
                'created_at': timezone.localtime(user.created_at).strftime('%Y-%m-%d %H:%M:%S')
            })

        return Response({
            'message': '用户列表获取成功',
            'data': user_data
        }, status=status.HTTP_200_OK)

class FavoriteToggleView(APIView):
    """
    添加或取消收藏
    """
    def post(self, request):
        user_id = request.data.get('user_id')
        target_id = request.data.get('target_id')
        target_type = request.data.get('target_type')

        if target_type not in ['dish', 'package']:
            return Response({'message': '无效的收藏类型'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'message': '用户不存在'}, status=status.HTTP_404_NOT_FOUND)

        favorite, created = Favorite.objects.get_or_create(
            user=user,
            target_id=target_id,
            target_type=target_type
        )

        if not created:
            favorite.delete()
            return Response({'message': '已取消收藏'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': '收藏成功'}, status=status.HTTP_201_CREATED)

class FavoriteListView(APIView):
    """
    获取用户收藏列表
    """
    def get(self, request, user_id):
        favorites = Favorite.objects.filter(user_id=user_id).order_by('-created_at')
        data = []

        for fav in favorites:
            if fav.target_type == 'dish':
                try:
                    dish = Dish.objects.get(dish_id=fav.target_id)
                    data.append({
                        'id': dish.dish_id,
                        'type': 'dish',
                        'name': dish.name,
                        'image': dish.image_url.url if dish.image_url else '',
                        'price': dish.price,
                    })
                except Dish.DoesNotExist:
                    continue
            elif fav.target_type == 'package':
                try:
                    pkg = Package.objects.get(id=fav.target_id)
                    data.append({
                        'id': pkg.id,
                        'type': 'package',
                        'name': pkg.name,
                        'image': f'/media/{pkg.image_url}' if pkg.image_url else '',
                        'price': pkg.price,
                    })
                except Package.DoesNotExist:
                    continue

        return Response({'data': data}, status=status.HTTP_200_OK)

class FavoriteStatusView(APIView):
    """
    判断是否已收藏
    """
    def get(self, request):
        user_id = request.query_params.get('user_id')
        target_id = request.query_params.get('target_id')
        target_type = request.query_params.get('target_type')

        exists = Favorite.objects.filter(
            user_id=user_id,
            target_id=target_id,
            target_type=target_type
        ).exists()

        return Response({'is_favorited': exists}, status=status.HTTP_200_OK)




