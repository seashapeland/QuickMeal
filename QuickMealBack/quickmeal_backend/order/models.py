from django.db import models
from django.utils import timezone
from user.models import User
from table.models import Table

class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ('申请中', 'applying'),
        ('待餐中', 'dining'),
        ('待支付', 'unpaid'),
        ('已完成', 'completed'),
        ('已取消', 'cancelled'),
        ('已退款', 'refunded'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )
    table = models.ForeignKey(
        Table,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='待餐中')  # 默认值改为中文
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"订单 {self.id} - 桌号 {self.table.table_id if self.table else 'N/A'}"

    class Meta:
        verbose_name = "订单"
        verbose_name_plural = "订单表"
        ordering = ['-created_at']

class OrderItem(models.Model):
    TARGET_TYPE_CHOICES = [
        ('dish', '菜品'),
        ('package', '套餐'),
    ]

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='所属订单'
    )
    target_type = models.CharField(
        max_length=10,
        choices=TARGET_TYPE_CHOICES,
        verbose_name='类型（菜品/套餐）'
    )
    target_id = models.PositiveIntegerField(verbose_name='菜品或套餐ID')
    quantity = models.PositiveIntegerField(default=1, verbose_name='数量')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='单价')

    def __str__(self):
        return f"{self.get_target_type_display()} #{self.target_id} x{self.quantity}"

    class Meta:
        verbose_name = '订单详情'
        verbose_name_plural = '订单详情表'