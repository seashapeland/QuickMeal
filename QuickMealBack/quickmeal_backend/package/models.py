from django.db import models
from dish.models import Dish

# Create your models here.
class Package(models.Model):
    name = models.CharField(max_length=255, unique=True)  # 套餐名称
    description = models.TextField(blank=True)            # 套餐描述（可选）
    image_url = models.CharField(max_length=255, blank=True)  # 套餐图片相对路径
    price = models.DecimalField(max_digits=10, decimal_places=2)  # 当前价格
    is_available = models.BooleanField(default=False)     # 是否上架
    created_at = models.DateTimeField(auto_now_add=True)  # 创建时间
    updated_at = models.DateTimeField(auto_now=True)      # 更新时间

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'packages'


class PackageItem(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='items')
    dish = models.ForeignKey('dish.Dish', on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)  # 份数，默认1份

    def __str__(self):
        return f"{self.package.name} - {self.dish.name} × {self.quantity}"

    class Meta:
        db_table = 'package_items'
        unique_together = ('package', 'dish')  # 防止同一套餐内重复添加相同菜品


class PackagePriceHistory(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    effective_date = models.DateTimeField()  # 生效时间

    def __str__(self):
        return f"{self.package.name} - ￥{self.original_price} → ￥{self.current_price} @ {self.effective_date}"

    class Meta:
        db_table = 'package_price_history'
        ordering = ['effective_date']
