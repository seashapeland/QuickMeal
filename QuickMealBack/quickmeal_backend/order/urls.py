from django.urls import path
from .views import *

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='create-order'),
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('user/orders/', UserOrderListView.as_view(), name='user-order-list'),
    path('order/<int:order_id>/', OrderDetailView.as_view(), name='order-detail'),
    path('update_status/', OrderStatusUpdateView.as_view(), name='order-update-status'),
]