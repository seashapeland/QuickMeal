from django.db import models

class User(models.Model):
    username = models.CharField(max_length=50, unique=True, null=True, blank=True)
    password = models.CharField(max_length=128, null=True, blank=True)
    openid = models.CharField(max_length=64, unique=True, null=True, blank=True)  # 微信用户唯一标识
    nickname = models.CharField(max_length=50, default='微信用户')
    
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True, verbose_name="头像")  # ✅ 本地存储头像
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username or self.nickname
    
class Favorite(models.Model):
    FAVORITE_TYPE_CHOICES = (
        ('dish', '菜品'),
        ('package', '套餐'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    target_id = models.IntegerField()  # 菜品ID或套餐ID
    target_type = models.CharField(max_length=10, choices=FAVORITE_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'target_id', 'target_type')

