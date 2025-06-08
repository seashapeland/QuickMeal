from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from utils.token import decode_token
from .models import Order, OrderItem
from table.models import TableStatus, Table
from dish.models import Dish
from package.models import Package, PackageItem
from user.models import User

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

class AdminOrderListView(APIView):
    def get(self, request):
        orders = Order.objects.all().select_related('user', 'table').prefetch_related('items')
        order_data = []
        for order in orders:
            user_info = {
                'id': order.user.id if order.user else None,
                'name': order.user.username if order.user else '未知用户',
                'avatar': order.user.avatar.url if order.user and order.user.avatar else None
            }
            items_data = []
            for item in order.items.all():
                if item.target_type == 'dish':
                    try:
                        dish = Dish.objects.get(dish_id=item.target_id)
                        items_data.append({
                            'type': 'dish',
                            'name': dish.name,
                            'image': f"/media/{dish.image_url}" if dish.image_url else '',
                            'price': item.price,
                            'quantity': item.quantity
                        })
                    except Dish.DoesNotExist:
                        continue
                elif item.target_type == 'package':
                    try:
                        pkg = Package.objects.get(id=item.target_id)
                        pkg_items = PackageItem.objects.filter(package=pkg)
                        pkg_detail = []
                        for pkg_item in pkg_items:
                            d = pkg_item.dish
                            pkg_detail.append({
                                'name': d.name,
                                'image': f"/media/{d.image_url}" if d.image_url else '',
                                'price': d.price,
                                'quantity': pkg_item.quantity
                            })
                        items_data.append({
                            'type': 'package',
                            'name': pkg.name,
                            'image': f'/media/{pkg.image_url}' if pkg.image_url else '',
                            'price': item.price,
                            'quantity': item.quantity,
                            'details': pkg_detail
                        })
                    except Package.DoesNotExist:
                        continue
            order_data.append({
                'order_id': order.id,
                'status': order.status,
                'user': user_info,
                'created_at': timezone.localtime(order.created_at).strftime('%Y-%m-%d %H:%M:%S'),
                'paid_at': timezone.localtime(order.paid_at).strftime('%Y-%m-%d %H:%M:%S'),
                'table_id': order.table.table_id if order.table else None,
                'total_price': order.total_price,
                'items': items_data
            })
        return Response(order_data, status=status.HTTP_200_OK)

class UserOrderListView(APIView):
    def get(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        if not token or not token.startswith('Bearer '):
            return Response({'message': '未提供Token'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = decode_token(token[7:])
        if not payload:
            return Response({'message': 'Token无效'}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = payload.get('user_id')
        orders = Order.objects.filter(user_id=user_id).select_related('table').prefetch_related('items')  # 修改1

        order_data = []
        for order in orders:
            items_data = []
            for item in order.items.all():  # 修改2
                if item.target_type == 'dish':  # 修改3
                    try:
                        dish = Dish.objects.get(dish_id=item.target_id)  # 修改4
                        items_data.append({
                            'type': 'dish',
                            'name': dish.name,
                            'image': f"/media/{dish.image_url}" if dish.image_url else '',  # 修改5
                            'price': item.price,
                            'quantity': item.quantity
                        })
                    except Dish.DoesNotExist:
                        continue
                elif item.target_type == 'package':  # 修改6
                    try:
                        pkg = Package.objects.get(id=item.target_id)
                        pkg_items = PackageItem.objects.filter(package=pkg)
                        pkg_detail = []
                        for pkg_item in pkg_items:
                            d = pkg_item.dish
                            pkg_detail.append({
                                'name': d.name,
                                'image': f"/media/{d.image_url}" if d.image_url else '',  # 修改7
                                'price': d.price,
                                'quantity': pkg_item.quantity
                            })
                        items_data.append({
                            'type': 'package',
                            'name': pkg.name,
                            'image': f"/media/{pkg.image_url}" if pkg.image_url else '',  # 修改8
                            'price': item.price,
                            'quantity': item.quantity,
                            'details': pkg_detail
                        })
                    except Package.DoesNotExist:
                        continue
            order_data.append({
                'order_id': order.id,
                'status': order.status,
                'created_at': timezone.localtime(order.created_at).strftime('%Y-%m-%d %H:%M:%S'),
                'paid_at': timezone.localtime(order.paid_at).strftime('%Y-%m-%d %H:%M:%S'),
                'table_id': order.table.table_id if order.table else None,
                'total_price': order.total_price,
                'items': items_data
            })
        return Response(order_data, status=status.HTTP_200_OK)
    
class OrderDetailView(APIView):
    def get(self, request, order_id):
        try:
            order = Order.objects.select_related('user', 'table').prefetch_related('items').get(id=order_id)
        except Order.DoesNotExist:
            return Response({'message': '订单不存在'}, status=status.HTTP_404_NOT_FOUND)

        user = order.user
        items_data = []

        for item in order.items.all():
            if item.target_type == 'dish':
                try:
                    dish = Dish.objects.get(dish_id=item.target_id)
                    items_data.append({
                        'type': 'dish',
                        'name': dish.name,
                        'image': f"/media/{dish.image_url}" if dish.image_url else '',
                        'price': item.price,
                        'quantity': item.quantity
                    })
                except Dish.DoesNotExist:
                    continue
            elif item.target_type == 'package':
                try:
                    pkg = Package.objects.get(id=item.target_id)
                    pkg_items = PackageItem.objects.filter(package=pkg)
                    pkg_detail = [{
                        'name': d.name,
                        'image': f"/media/{d.image_url}" if d.image_url else '',
                        'price': d.price,
                        'quantity': pi.quantity
                    } for pi in pkg_items for d in [pi.dish]]
                    items_data.append({
                        'type': 'package',
                        'name': pkg.name,
                        'image': f"/media/{pkg.image_url}" if pkg.image_url else '',
                        'price': item.price,
                        'quantity': item.quantity,
                        'details': pkg_detail
                    })
                except Package.DoesNotExist:
                    continue

        result = {
            'order_id': order.id,
            'status': order.status,
            'user': {
                'id': user.id,
                'name': user.username,
                'avatar': f"/media/{user.avatar}" if user.avatar else ''
            },
            'created_at': timezone.localtime(order.created_at).strftime('%Y-%m-%d %H:%M:%S'),
            'paid_at': order.paid_at,
            'table_id': order.table.table_id if order.table else None,
            'total_price': order.total_price,
            'items': items_data
        }

        return Response(result, status=status.HTTP_200_OK)
    
class OrderStatusUpdateView(APIView):
    authentication_classes = []  # 不需要TOKEN
    permission_classes = []      # 不需要权限验证

    def post(self, request):
        order_id = request.data.get('order_id')
        new_status = request.data.get('status')

        if not order_id or not new_status:
            return Response({'error': '缺少参数'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=order_id)
            order.status = new_status
            if new_status == '已完成':
                order.paid_at = timezone.now()
            order.save()
            return Response({'message': '订单状态更新成功'}, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({'error': '订单不存在'}, status=status.HTTP_404_NOT_FOUND)
