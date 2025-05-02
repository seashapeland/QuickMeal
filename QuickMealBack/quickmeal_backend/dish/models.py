from django.db import models

# Create your models here.
class DishCategory(models.Model):
    category_id = models.AutoField(primary_key=True)  # 主键，自增ID
    category_name = models.CharField(max_length=255, unique=True)  # 菜品类别名称，唯一

    def __str__(self):
        return self.category_name

    class Meta:
        db_table = 'dish_categories'  # 设置表名为 dish_categories


class Dish(models.Model):
    dish_id = models.AutoField(primary_key=True)  # 主键，自增ID
    name = models.CharField(max_length=255, unique=True)  # 菜品名称，唯一
    description = models.TextField(null=True, blank=True)  # 菜品描述（可选）
    image_url = models.ImageField(upload_to='images/', null=True, blank=True)  # 菜品图片，存储到 'images/' 文件夹
    price = models.DecimalField(max_digits=10, decimal_places=2)  # 菜品价格
    category = models.ForeignKey(DishCategory, on_delete=models.CASCADE)  # 外键关联菜品类别表
    is_available = models.BooleanField(default=True)  # 是否可用（是否下架）
    created_at = models.DateTimeField(auto_now_add=True)  # 创建时间
    updated_at = models.DateTimeField(auto_now=True)  # 更新时间

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'dishes'  # 设置表名为 dishes


class DishPriceHistory(models.Model):
    price_record_id = models.AutoField(primary_key=True)  # 主键，自增ID

    dish = models.ForeignKey(
        Dish,
        on_delete=models.CASCADE,
        related_name='price_history',
        verbose_name='关联菜品'
    )  # 外键，关联 Dish 表

    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='原价'
    )

    current_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='当前价格'
    )

    effective_date = models.DateTimeField(
        verbose_name='生效时间'
    )

    class Meta:
        db_table = 'dish_price_history'
        verbose_name = '菜品价格历史'
        verbose_name_plural = '菜品价格历史'
        ordering = ['-effective_date']  # 默认按时间倒序排列（最新在前）

    def __str__(self):
        return f"{self.dish.name} - ¥{self.current_price} @ {self.effective_date.strftime('%Y-%m-%d')}"