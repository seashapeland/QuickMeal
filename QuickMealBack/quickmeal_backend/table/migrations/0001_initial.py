# Generated by Django 5.2 on 2025-05-31 13:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Table",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "table_id",
                    models.PositiveIntegerField(unique=True, verbose_name="餐桌号"),
                ),
                (
                    "qr_code_image",
                    models.ImageField(
                        upload_to="codes/", verbose_name="二维码图片路径"
                    ),
                ),
            ],
            options={
                "verbose_name": "餐桌",
                "verbose_name_plural": "餐桌管理",
            },
        ),
    ]
