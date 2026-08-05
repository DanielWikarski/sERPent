from django.contrib import admin
from .models import Product  # z pliku obok models.py importuję klasę Product

# rejestracja klasy Product, w tym miejscu rejestrujej każdą klasę ważną dla bazy danych
admin.site.register(Product)