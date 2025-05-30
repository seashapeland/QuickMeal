from django.urls import path
from .views import *

urlpatterns = [
   path('register/', RegisterView.as_view(), name='register'),
   path('login/', UserLoginView.as_view(), name='user-login'),
   path('update/', UpdateUserInfoView.as_view(), name='user-update'),
   path('list/', UserListView.as_view(), name='user-list'),
   path('favorite/toggle/', FavoriteToggleView.as_view()),
   path('favorite/list/<int:user_id>/', FavoriteListView.as_view()),
   path('favorite/status/', FavoriteStatusView.as_view()),

]