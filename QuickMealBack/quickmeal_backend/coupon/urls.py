from django.urls import path
from .views import *

urlpatterns = [
    path('create/', CreateCouponView.as_view(), name='create-coupon'),
    path('list/', CouponListView.as_view(), name='coupon-list'),
    path('delete/<int:coupon_id>/', DeleteCouponView.as_view(), name='delete-coupon'),
    path('assign/', AssignCouponView.as_view(), name='assign-coupon'),
]