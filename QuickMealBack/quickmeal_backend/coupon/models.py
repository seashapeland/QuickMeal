from django.db import models
from user.models import User


# Create your models here.
class Coupon(models.Model):
    coupon_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, verbose_name="优惠券名称", default="未命名优惠券")
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="优惠金额")
    min_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="满减门槛")
    
    valid_from = models.DateTimeField(verbose_name="开始时间")
    valid_to = models.DateTimeField(verbose_name="截止时间")
    
    weekdays = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="允许使用的星期几",
        help_text='如 "6,7" 表示周六周日可用；为空表示任意星期可用'
    )
    
    description = models.CharField(max_length=255, blank=True, verbose_name="使用说明")
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def is_valid_today(self):
        """校验该优惠券是否在当前时间可使用（日期范围 + 星期几）"""
        from datetime import datetime
        now = datetime.now()
        if not (self.valid_from <= now <= self.valid_to):
            return False
        if self.weekdays:
            weekday = now.isoweekday()  # Monday=1, Sunday=7
            allowed = [int(w) for w in self.weekdays.split(',')]
            return weekday in allowed
        return True

    def __str__(self):
        return f"满{self.min_amount}减{self.amount}（{self.valid_from.date()}~{self.valid_to.date()}）"

    class Meta:
        db_table = 'coupons'
        verbose_name = "优惠券"
        verbose_name_plural = "优惠券"

class UserCoupon(models.Model):
    STATUS_CHOICES = (
        ('unused', '未使用'),
        ('used', '已使用'),
        ('expired', '已过期'),
    )

    id = models.AutoField(primary_key=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_coupons', verbose_name="所属用户")
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE, related_name='user_coupons', verbose_name="优惠券模板")

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unused', verbose_name="状态")

    assigned_at = models.DateTimeField(auto_now_add=True, verbose_name="领取时间")
    expire_at = models.DateTimeField(verbose_name="过期时间")

    used_at = models.DateTimeField(blank=True, null=True, verbose_name="使用时间")
    order_id = models.IntegerField(blank=True, null=True, verbose_name="使用订单ID")

    def is_available(self):
        """判断该优惠券当前是否可用"""
        from datetime import datetime
        now = datetime.now()
        return self.status == 'unused' and now <= self.expire_at

    def __str__(self):
        return f"{self.user.username} 的优惠券：{self.coupon.amount}元（状态：{self.status}）"

    class Meta:
        db_table = 'user_coupons'
        verbose_name = "用户优惠券"
        verbose_name_plural = "用户优惠券"
        ordering = ['-assigned_at']