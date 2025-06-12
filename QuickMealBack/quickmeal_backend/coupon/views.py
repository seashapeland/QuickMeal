from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from coupon.models import Coupon, UserCoupon
from utils.token import decode_token
from django.utils.dateparse import parse_datetime
from django.utils import timezone
from user.models import User
from order.models import Order

class CreateCouponView(APIView):
    def post(self, request):
        # Token 校验
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=status.HTTP_403_FORBIDDEN)

        # 2. 获取请求数据
        data = request.data
        try:
            name = data.get('name', '').strip()
            amount = float(data.get('amount', 0))
            min_amount = float(data.get('min_amount', 0))
            valid_from = parse_datetime(data.get('valid_from'))
            valid_to = parse_datetime(data.get('valid_to'))
            weekdays = data.get('weekdays', '')
            description = data.get('description', '')
        except Exception as e:
            print("参数解析异常：", e)
            return Response({'message': '参数解析错误', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # 3. 校验
        if not name:
            return Response({'message': '优惠券名称不能为空'}, status=status.HTTP_400_BAD_REQUEST)
        if amount <= 0:
            return Response({'message': '优惠金额必须大于0'}, status=status.HTTP_400_BAD_REQUEST)

        if min_amount < 0:
            return Response({'message': '满减门槛不能为负数'}, status=status.HTTP_400_BAD_REQUEST)

        if min_amount > 0 and amount >= min_amount:
            return Response({'message': '有门槛时，优惠金额不能大于等于门槛金额'}, status=status.HTTP_400_BAD_REQUEST)
        if not valid_from or not valid_to or valid_to <= valid_from:
            return Response({'message': '请填写合法的有效期'}, status=status.HTTP_400_BAD_REQUEST)

        # 4. 创建优惠券
        coupon = Coupon.objects.create(
            name=name,
            amount=amount,
            min_amount=min_amount,
            valid_from=valid_from,
            valid_to=valid_to,
            weekdays=weekdays,
            description=description,
        )

        return Response({
            'message': '优惠券创建成功',
            'coupon_id': coupon.coupon_id,
            'name': coupon.name,
            'amount': coupon.amount,
            'min_amount': coupon.min_amount,
            'valid_from': coupon.valid_from,
            'valid_to': coupon.valid_to,
            'weekdays': coupon.weekdays,
            'description': coupon.description,
        }, status=status.HTTP_201_CREATED)

class CouponListView(APIView):
    def get(self, request):
        # Token 校验
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=status.HTTP_403_FORBIDDEN)

        # 获取所有优惠券
        coupons = Coupon.objects.all().order_by('-created_date')

        # 序列化数据
        data = []
        for c in coupons:
            data.append({
                'coupon_id': c.coupon_id,
                'name': c.name,
                'amount': float(c.amount),
                'min_amount': float(c.min_amount),
                'valid_from': timezone.localtime(c.valid_from).strftime('%Y-%m-%d %H:%M:%S'),
                'valid_to': timezone.localtime(c.valid_to).strftime('%Y-%m-%d %H:%M:%S'),
                'weekdays': c.weekdays,
                'description': c.description,
                'created_date': timezone.localtime(c.created_date).strftime('%Y-%m-%d %H:%M:%S'),
            })

        return Response({'coupons': data}, status=status.HTTP_200_OK)
    
class DeleteCouponView(APIView):
    def delete(self, request, coupon_id):
        # Token 校验
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=status.HTTP_403_FORBIDDEN)

        try:
            coupon = Coupon.objects.get(coupon_id=coupon_id)
        except Coupon.DoesNotExist:
            return Response({'detail': '优惠券不存在'}, status=status.HTTP_404_NOT_FOUND)

        # ✅ 删除限制：未过期不能删除
        now = timezone.now()
        if now < coupon.valid_to:
            return Response({'detail': '优惠券未过期，禁止删除'}, status=status.HTTP_400_BAD_REQUEST)

        coupon.delete()
        return Response({'message': '优惠券已成功删除'}, status=status.HTTP_200_OK)
    
class AssignCouponView(APIView):
    def post(self, request):
        # Token 校验
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作'}, status=status.HTTP_403_FORBIDDEN)

        # ✅ 获取参数
        user_id = request.data.get('user_id')
        coupon_id = request.data.get('coupon_id')

        if not user_id or not coupon_id:
            return Response({'detail': '缺少 user_id 或 coupon_id'}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ 获取用户与优惠券
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'detail': '用户不存在'}, status=status.HTTP_404_NOT_FOUND)

        try:
            coupon = Coupon.objects.get(coupon_id=coupon_id)
        except Coupon.DoesNotExist:
            return Response({'detail': '优惠券不存在'}, status=status.HTTP_404_NOT_FOUND)

        # ✅ 检查是否过期
        if timezone.now() > coupon.valid_to:
            return Response({'detail': '该优惠券已过期，无法发放'}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ 创建 user_coupon 记录
        user_coupon = UserCoupon.objects.create(
            user=user,
            coupon=coupon,
            status='unused',
            assigned_at=timezone.now(),
            expire_at=coupon.valid_to
        )

        return Response({
            'message': '优惠券发放成功',
            'user_coupon_id': user_coupon.id
        }, status=status.HTTP_201_CREATED)

class UserCouponListView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'detail': '用户不存在'}, status=status.HTTP_404_NOT_FOUND)

        user_coupons = UserCoupon.objects.filter(user=user).select_related('coupon').order_by('-assigned_at')

        data = []
        for uc in user_coupons:
            c = uc.coupon
            data.append({
                'user_coupon_id': uc.id,
                'coupon_id': c.coupon_id,
                'name': c.name,
                'amount': float(c.amount),
                'min_amount': float(c.min_amount),
                'valid_from': timezone.localtime(c.valid_from).strftime('%Y-%m-%d %H:%M:%S'),
                'valid_to': timezone.localtime(c.valid_to).strftime('%Y-%m-%d %H:%M:%S'),
                'expire_at': timezone.localtime(uc.expire_at).strftime('%Y-%m-%d %H:%M:%S'),
                'status': uc.status,
                'assigned_at': timezone.localtime(uc.assigned_at).strftime('%Y-%m-%d %H:%M:%S'),
                'used_at': timezone.localtime(uc.used_at).strftime('%Y-%m-%d %H:%M:%S') if uc.used_at else None,
                'order_id': uc.order_id,
                'description': c.description,
                'weekdays': c.weekdays
            })

        return Response({'coupons': data}, status=status.HTTP_200_OK)
    
class UseCouponView(APIView):
    def post(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = decode_token(token[7:])
        if not payload or not payload.get('user_id'):
            return Response({'detail': '无效Token'}, status=status.HTTP_403_FORBIDDEN)

        user_id = payload['user_id']
        order_id = request.data.get('order_id')
        user_coupon_id = request.data.get('user_coupon_id')

        if not order_id or not user_coupon_id:
            return Response({'detail': '参数不完整'}, status=status.HTTP_400_BAD_REQUEST)

        # 订单验证
        try:
            order = Order.objects.get(id=order_id, user_id=user_id)
        except Order.DoesNotExist:
            return Response({'detail': '订单不存在或无权操作'}, status=status.HTTP_404_NOT_FOUND)

        # 优惠券验证
        try:
            user_coupon = UserCoupon.objects.get(id=user_coupon_id, user_id=user_id)
        except UserCoupon.DoesNotExist:
            return Response({'detail': '优惠券不存在或不属于当前用户'}, status=status.HTTP_404_NOT_FOUND)

        if user_coupon.status != 'unused':
            return Response({'detail': '该优惠券已被使用'}, status=status.HTTP_400_BAD_REQUEST)

        if timezone.now() > user_coupon.expire_at:
            return Response({'detail': '优惠券已过期'}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ 更新优惠券使用状态
        user_coupon.status = 'used'
        user_coupon.used_at = timezone.now()
        user_coupon.order_id = order.id
        user_coupon.save()

        return Response({'message': '优惠券使用成功'}, status=status.HTTP_200_OK)
    
class ReturnCouponView(APIView):
    def post(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', '')
        if not token.startswith('Bearer '):
            return Response({'detail': '未提供Token'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = decode_token(token[7:])
        if not payload or payload.get('role') not in ['admin', 'super_admin']:
            return Response({'detail': '无权限操作，仅限管理员'}, status=status.HTTP_403_FORBIDDEN)

        order_id = request.data.get('order_id')

        if not order_id:
            return Response({'detail': '缺少订单ID'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_coupon = UserCoupon.objects.get(order_id=order_id)
        except UserCoupon.DoesNotExist:
            return Response({'detail': '该订单未绑定任何优惠券'}, status=status.HTTP_404_NOT_FOUND)

        if user_coupon.status != 'used':
            return Response({'detail': '优惠券未使用，无需退还'}, status=status.HTTP_400_BAD_REQUEST)


        user_coupon.status = 'unused'
        user_coupon.used_at = None
        user_coupon.order_id = None
        user_coupon.save()

        return Response({'message': '优惠券已成功退还'}, status=status.HTTP_200_OK)