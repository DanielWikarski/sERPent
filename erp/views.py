from django.shortcuts import render 
from . models import Product # importuje klasę produkt z pliku models.py

# zarządzanie ruchem / akcjami na stronie

def dashboard_home(request):
    return render(request, 'erp/dashboard.html')


def warehouse_modules(request):
    return render(request, 'erp/warehouse_modules.html', {'warehouse_products': Product.objects.all()}) 
# ostatni atrybut rendera to pobieranie wszystkich obiektów stworzonych przeez klasę Product
