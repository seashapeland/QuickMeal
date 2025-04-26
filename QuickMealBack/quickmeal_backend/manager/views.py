# manager/views.py

import hashlib
import jwt
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from django.conf import settings
from .models import AdminInfo
import time
from .serializers import AdminInfoSerializer

def decode_token(request):
    """解析Authorization里的Token并加错误处理"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        print('Authorization头缺失')
        return None

    try:
        prefix, token = auth_header.split(' ')
        if prefix.lower() != 'bearer':
            print('Authorization前缀错误')
            return None

        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        print('Token已过期')
        return None
    except jwt.InvalidTokenError:
        print('无效的Token')
        return None
    except Exception as e:
        print('解析Token异常:', e)
        return None


class AdminLoginView(APIView):
    """
    自定义管理员登录接口（手动生成JWT）
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'detail': '用户名和密码不能为空'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            admin = AdminInfo.objects.get(username=username)
        except AdminInfo.DoesNotExist:
            return Response({'detail': '账号不存在'}, status=status.HTTP_404_NOT_FOUND)

        password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()

        if admin.password_hash != password_hash:
            return Response({'detail': '密码错误'}, status=status.HTTP_400_BAD_REQUEST)

        if not admin.status:
            return Response({'detail': '账户已被禁用'}, status=status.HTTP_403_FORBIDDEN)

        # 更新最后登录时间
        admin.last_login_time = timezone.now()
        admin.save()

        # 手动生成JWT Token
        payload = {
            'admin_id': admin.admin_id,
            'username': admin.username,
            'role': admin.role,
            'exp': int(time.time()) + 60 * 60 * 24,  # 当前时间 + 1天（秒）
            'iat': int(time.time()),                 # 当前时间戳
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return Response({
            'message': '登录成功',
            'token': token,
            'admin_id': admin.admin_id,
            'username': admin.username,
            'role': admin.role,
        }, status=status.HTTP_200_OK)

class CreateAdminView(APIView):
    """
    创建普通管理员接口（只能超级管理员调用）
    """
    permission_classes = [permissions.AllowAny]  # 不要再用IsAuthenticated

    def post(self, request):
        payload = decode_token(request)
        if not payload:
            return Response({'detail': '无效的Token'}, status=status.HTTP_401_UNAUTHORIZED)

        if payload.get('role') != 'super_admin':
            return Response({'detail': '无权限操作，只有超级管理员可以创建'}, status=status.HTTP_403_FORBIDDEN)

        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'detail': '用户名和密码不能为空'}, status=status.HTTP_400_BAD_REQUEST)

        if AdminInfo.objects.filter(username=username).exists():
            return Response({'detail': '用户名已存在'}, status=status.HTTP_400_BAD_REQUEST)

        password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()

        admin = AdminInfo.objects.create(
            username=username,
            password_hash=password_hash,
            role='admin',
            status=True,
            created_at=timezone.now()
        )

        return Response({
            'message': '普通管理员创建成功',
            'admin_id': admin.admin_id,
            'username': admin.username,
            'role': admin.role,
        }, status=status.HTTP_201_CREATED)

class AdminListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        payload = decode_token(request)
        if not payload:
            return Response({'detail': '无效的Token'}, status=status.HTTP_401_UNAUTHORIZED)

        if payload.get('role') != 'super_admin':
            return Response({'detail': '无权限访问，只有超级管理员可以查看'}, status=status.HTTP_403_FORBIDDEN)

        admins = AdminInfo.objects.filter(role='admin')

        serializer = AdminInfoSerializer(admins, many=True)

        return Response({
            'message': '普通管理员列表获取成功',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
