from django.db import models
from django.utils import timezone

class Table(models.Model):
    table_id = models.PositiveIntegerField(unique=True, verbose_name="餐桌号")
    qr_code_image = models.ImageField(
        upload_to='codes/',  # 存放于 MEDIA_ROOT/codes/
        verbose_name="二维码图片路径"
    )

    def __str__(self):
        return f"{self.table_id}号桌"

    class Meta:
        verbose_name = "餐桌"
        verbose_name_plural = "餐桌管理"

class TableStatus(models.Model):
    THEME_STATUS_CHOICES = [
        ('空闲', 'green'),
        ('点菜中', 'blue'),
        ('待餐中', 'yellow'),
        ('待餐较久', 'orange'),
        ('待餐过久', 'red'),
        ('故障中', 'black'),
        ('待支付', 'deepblue'),
    ]

    table = models.OneToOneField(
        Table, 
        on_delete=models.CASCADE,
        related_name='status'
    )
    status = models.CharField(max_length=20, choices=THEME_STATUS_CHOICES, default='空闲')  # 默认值改为中文
    current_order = models.ForeignKey(
        'order.Order',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='table_status'
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.table.table_id}号桌状态：{self.get_status_display()}"

    class Meta:
        verbose_name = "餐桌状态"
        verbose_name_plural = "餐桌状态表"