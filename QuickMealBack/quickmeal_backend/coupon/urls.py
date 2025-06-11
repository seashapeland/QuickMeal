from django.urls import path
from .views import *

urlpatterns = [
    path('create/', CreateCouponView.as_view(), name='create-coupon'),
    path('list/', CouponListView.as_view(), name='coupon-list'),
    path('delete/<int:coupon_id>/', DeleteCouponView.as_view(), name='delete-coupon'),
    path('assign/', AssignCouponView.as_view(), name='assign-coupon'),
    path('user/<int:user_id>/', UserCouponListView.as_view(), name='user-coupon-list'),
    path('coupon/use/', UseCouponView.as_view(), name='use-coupon'),
    path('return/', ReturnCouponView.as_view(), name='return-coupon'),
]