from django.contrib import admin
from django.urls import path
from . views import dashboard_home, warehouse_modules


urlpatterns = [
    path("", dashboard_home, name="dashboard_home"),
    path("warehouse_modules/", warehouse_modules, name="warehouse_modules"),
]