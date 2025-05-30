from django.urls import path
from .views import *

urlpatterns = [
    path('dish/submit/', SubmitDishReviewView.as_view(), name='submit-dish-review'),
    path('package/submit/', SubmitPackageReviewView.as_view()),
    path('store/submit/', SubmitShopReviewView.as_view()),
    path('dish/<int:dish_id>/list/', DishReviewListView.as_view(), name='dish-review-list'),
    path('package/<int:package_id>/list/', PackageReviewListView.as_view(), name='package-review-list'),
    path('store/list/', ShopReviewListView.as_view(), name='shop-review-list'),
]