from django.urls import path
from .views import *

urlpatterns = [
    path('create/', CreatePackageView.as_view(), name='create-package'),
    path('list/', PackageListView.as_view(), name='package-list'),
    path('update_items/', UpdatePackageItemsView.as_view(), name='update-package-items'),
    path('update_info/', UpdatePackageInfoView.as_view(), name='update-package-info'),
    path('update_status/', UpdatePackageStatusView.as_view()),
    path('update_price/', UpdatePackagePriceView.as_view()),
    path('price_history/<int:package_id>/', PackagePriceHistoryView.as_view()),

]