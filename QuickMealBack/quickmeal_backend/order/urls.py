from django.urls import path
from .views import *

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='create-order'),

]