from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Table
from utils.token import decode_token

class TableQRCodeListView(APIView):
    def get(self, request):
        # Token 校验
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') != 'super_admin':
            return Response({'detail': '无权限操作'}, status=status.HTTP_403_FORBIDDEN)

        # 查询所有餐桌信息
        tables = Table.objects.all().values('table_id', 'qr_code_image')
        return Response(list(tables), status=status.HTTP_200_OK)

