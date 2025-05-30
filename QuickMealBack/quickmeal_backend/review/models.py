from django.db import models
from user.models import User
from dish.models import Dish
from package.models import Package

class DishReview(models.Model):
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, verbose_name="菜品")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="用户")
    rating = models.IntegerField(verbose_name="评分", default=5)
    content = models.TextField(verbose_name="评价内容", blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="评价时间")

    def __str__(self):
        return f"{self.user.nickname} 对 {self.dish.name} 的评价"

class PackageReview(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, verbose_name="套餐")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="用户")
    rating = models.IntegerField(verbose_name="评分", default=5)
    content = models.TextField(verbose_name="评价内容", blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="评价时间")

    def __str__(self):
        return f"{self.user.nickname} 对 {self.package.name} 的评价"

class StoreReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="用户")
    content = models.TextField(verbose_name="评价内容")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="评价时间")

    def __str__(self):
        return f"{self.user.nickname} 的门店评价"

