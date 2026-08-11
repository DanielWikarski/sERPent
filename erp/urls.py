from django.contrib import admin
from django.urls import path
from . views import dashboard_home, warehouse_modules, sales_modules, sales_modules_checkout


urlpatterns = [
    path("", dashboard_home, name="dashboard_home"),
    path("warehouse_modules/", warehouse_modules, name="warehouse_modules"),
    path("sales_modules/", sales_modules, name="sales_modules"),
    path("sales_modules_checkout/", sales_modules_checkout, name="sales_modules_checkout"),
]