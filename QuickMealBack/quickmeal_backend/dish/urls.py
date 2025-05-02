from django.urls import path
from .views import *

urlpatterns = [
    path('create/', CreateDishView.as_view(), name='create-dish'),  # 创建菜品
    path('list/', DishListView.as_view(), name='dish-list'),        # 获取菜品列表
    path('categories/', DishCategoryListView.as_view(), name='dish-category-list'),  # 获取菜品类别列表
    path('changeStatus/', DishStatusUpdateView.as_view(), name='dish-status-update'),  # 上架 / 下架菜品
    path('update_price/', UpdateDishPriceView.as_view(), name='update-dish-price'),
    path('price_history/<int:dish_id>/', DishPriceHistoryView.as_view(), name='dish-price-history'),
    path('update/', UpdateDishInfoView.as_view(), name='update-dish-info'),
]