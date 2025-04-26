# manager/models.py

from django.db import models

class AdminInfo(models.Model):
    # 表明是管理员用户
    SUPER_ADMIN = 'super_admin'
    ADMIN = 'admin'

    ROLE_CHOICES = [
        (SUPER_ADMIN, 'Super Admin'),  # 超级管理员
        (ADMIN, 'Admin'),              # 普通管理员
    ]

    admin_id = models.AutoField(primary_key=True)  # 主键，自增ID
    username = models.CharField(max_length=255, unique=True)  # 管理员用户名，唯一
    password_hash = models.CharField(max_length=255)  # 密码的哈希值
    role = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        default=ADMIN  # 默认角色为普通管理员
    )  # 角色（super_admin, admin）
    status = models.BooleanField(default=True)  # 账户是否有效
    last_login_time = models.DateTimeField(null=True, blank=True)  # 上次登录时间
    created_at = models.DateTimeField(auto_now_add=True)  # 账户创建时间

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'admin_infos'  # 设置数据库表名为 `admin_infos`
