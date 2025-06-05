from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from utils.token import decode_token
from .models import Order, OrderItem
from table.models import TableStatus, Table
from dish.models import Dish
from package.models import Package

class CreateOrderView(APIView):
    """
    创建订单接口：需验证用户身份，创建订单及其明细，并更新餐桌状态。
    """
    def post(self, request):
        # 1. 提取并验证 token
        token = request.META.get('HTTP_AUTHORIZATION')
        if not token or not token.startswith('Bearer '):
            return Response({'message': '未提供Token'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = decode_token(token[7:])
        if not payload:
            return Response({'message': 'Token无效'}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = payload.get('user_id')

        # 2. 获取参数
        table_id = request.data.get('table_id')
        items = request.data.get('items', [])
        total_price = request.data.get('total_price', 0.00)

        if not table_id or not items:
            return Response({'message': '缺少参数'}, status=status.HTTP_400_BAD_REQUEST)

        # 3. 创建订单
        try:
            table = Table.objects.get(table_id=table_id)
        except Table.DoesNotExist:
            return Response({'message': '餐桌不存在'}, status=status.HTTP_404_NOT_FOUND)

        order = Order.objects.create(
            user_id=user_id,
            table=table,
            status='待餐中',
            total_price=total_price,
            created_at=timezone.now()
        )

        # 4. 创建订单明细
        for item in items:
            OrderItem.objects.create(
                order=order,
                target_type=item['type'],
                target_id=item['id'],
                quantity=item['count'],
                price=item['price']
            )

        # 5. 更新餐桌状态表
        table_status, created = TableStatus.objects.get_or_create(table=table)
        table_status.status = '待餐中'
        table_status.current_order = order
        table_status.updated_at = timezone.now()
        table_status.save()

        return Response({
            'message': '下单成功',
            'order_id': order.id
        }, status=status.HTTP_201_CREATED)

