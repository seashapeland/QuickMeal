# manager/urls.py

from django.urls import path
from .views import AdminLoginView, CreateAdminView, AdminListView, DeleteAdminView, DisableAdminView, RestoreAdminView, ChangePasswordView

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin-login'),  # 登录接口
    path('create_admin/', CreateAdminView.as_view(), name='create-admin'),  # 创建普通管理员接口
    path('admin_list/', AdminListView.as_view(), name='admin-list'),           # 查询所有普通管理员
    path('delete_admin/', DeleteAdminView.as_view(), name='delete-admin'),  # 删除管理员接口
    path('disable_admin/', DisableAdminView.as_view(), name='disable-admin'),  # 禁用管理员接口
    path('restore_admin/', RestoreAdminView.as_view(), name='restore-admin'),  # 恢复管理员接口
    path('change_password/', ChangePasswordView.as_view(), name='change-password'),  # 修改密码接口
]
