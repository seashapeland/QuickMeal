from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Table, TableStatus
from utils.token import decode_token
from django.utils import timezone
from order.models import Order

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

class UpdateTableStatusView(APIView):
    """
    修改餐桌状态接口
    """
    def post(self, request):
        table_id = request.data.get('table_id')
        status_val = request.data.get('status')

        if not table_id or not status_val:
            return Response({'message': '参数不完整'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            table = Table.objects.get(table_id=table_id)
            table_status, created = TableStatus.objects.get_or_create(table=table)
            table_status.status = status_val
            table_status.updated_at = timezone.now()
            table_status.save()
            return Response({'message': '餐桌状态更新成功'}, status=status.HTTP_200_OK)
        except Table.DoesNotExist:
            return Response({'message': '餐桌不存在'}, status=status.HTTP_404_NOT_FOUND)

class UnbindOrderFromTableView(APIView):
    """
    解除餐桌绑定的当前订单ID
    """
    def post(self, request):
        table_id = request.data.get('table_id')
        if not table_id:
            return Response({'message': '缺少table_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            table = Table.objects.get(table_id=table_id)
            table_status = TableStatus.objects.get(table=table)
            table_status.current_order = None
            table_status.updated_at = timezone.now()
            table_status.save()
            return Response({'message': '订单解绑成功'}, status=status.HTTP_200_OK)
        except Table.DoesNotExist:
            return Response({'message': '餐桌不存在'}, status=status.HTTP_404_NOT_FOUND)
        except TableStatus.DoesNotExist:
            return Response({'message': '餐桌状态不存在'}, status=status.HTTP_404_NOT_FOUND)

class TableStatusListView(APIView):
    """
    获取所有餐桌的状态信息（无需 Token）
    """
    def get(self, request):
        tables = Table.objects.all().select_related('status')
        data = []

        for table in tables:
            status_obj = getattr(table, 'status', None)
            if status_obj:
                current_order_id = status_obj.current_order.id if status_obj.current_order else None
                data.append({
                    'table_id': table.table_id,
                    'status': status_obj.status,
                    'updated_at': status_obj.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'current_order_id': current_order_id
                })
            else:
                # 如果没有状态记录，视为“空闲”
                data.append({
                    'table_id': table.table_id,
                    'status': '空闲',
                    'updated_at': None,
                    'current_order_id': None
                })

        return Response({'data': data}, status=status.HTTP_200_OK)