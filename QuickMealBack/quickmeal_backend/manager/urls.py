# manager/urls.py

from django.urls import path
from .views import AdminLoginView, CreateAdminView, AdminListView

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin-login'),  # 登录接口
    path('create_admin/', CreateAdminView.as_view(), name='create-admin'),  # 创建普通管理员接口
    path('admin_list/', AdminListView.as_view(), name='admin-list'),           # 查询所有普通管理员
]
