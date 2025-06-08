from django.urls import path
from .views import *

urlpatterns = [
    path('qrcodes/', TableQRCodeListView.as_view()),
    path('update_status/', UpdateTableStatusView.as_view()),   # ✅ 修改餐桌状态
    path('unbind_order/', UnbindOrderFromTableView.as_view()), # ✅ 解绑当前订单
    path('status/list/', TableStatusListView.as_view(), name='table-status-list'),
]