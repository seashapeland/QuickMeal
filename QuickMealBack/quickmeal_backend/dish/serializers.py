# dish/serializers.py
from rest_framework import serializers
from .models import Dish
from .models import DishCategory

class DishSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(write_only=True)  # 前端传类名
    status = serializers.CharField(write_only=True)         # 前端传“上架”或“下架”
    image_url = serializers.CharField(read_only=False)
    class Meta:
        model = Dish
        fields = [
            'dish_id', 'name', 'description', 'image_url', 'price',
            'category_name', 'status', 'is_available',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['dish_id', 'is_available', 'created_at', 'updated_at']

    def create(self, validated_data):
        category_name = validated_data.pop('category_name')
        status_str = validated_data.pop('status')

        # 查询类别对象
        try:
            category = DishCategory.objects.get(category_name=category_name)
        except DishCategory.DoesNotExist:
            raise serializers.ValidationError({'category_name': '无效的类别名称'})

        # 设置字段
        validated_data['category'] = category
        validated_data['is_available'] = status_str == '上架'

        # image_url 是由视图设置好的，不需要在 serializer 中修改
        return Dish.objects.create(**validated_data)


class DishCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DishCategory
        fields = ['category_id', 'category_name']  # 返回菜品类别的ID和名称