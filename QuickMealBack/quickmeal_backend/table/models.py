from django.db import models

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
