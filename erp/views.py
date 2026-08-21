import json
from decimal import Decimal
from django.shortcuts import render 
from django.http import JsonResponse
from django.db import transaction
from django.views.decorators.http import require_POST
from django.db.models import F
from .models import Product, Balance


def dashboard_home(request):
    return render(request, 'erp/dashboard.html')

def warehouse_modules(request):
    return render(request, 'erp/warehouse_modules.html', {'warehouse_products': Product.objects.all()}) 

def sales_modules(request):
    return render(request, 'erp/sales_modules.html', {'warehouse_products': Product.objects.all()}) 

def add_items_modules(request):
    return render(request, 'erp/add_items_modules.html', {'warehouse_products': Product.objects.all()})

def sales_modules_checkout(request):
    return render(request, 'erp/sales_modules_checkout.html')

# Odbieranie danych po wciśnięciu buttona do finalizacji transakcji
@require_POST
def finalize_transaction(request):
        # Odczytujemy dane przysłane w formacie JSON z JS - deserializacj1
        data = json.loads(request.body)
        basket = data.get('basket', {})
        payment_method = data.get('payment_method')
        # na przyszłość - jaka opcja płatności  wybrana - jak  będę robić historię operacji!
        total_amount = Decimal(str(data.get('total_amount', 0)))

        # nowe! with transaction.atomic(): jak to napiszę przed kodem, to albo uda się dokonać zadanie, albo wszystko będzie cofnięte - takie zabezpieczenie
        with transaction.atomic():
            # iteruje po koszyku, biorąc klucz czyli SKU produktu
            for item_key, item in basket.items():
                product_sku = item_key
                product_qty = int(item['qty'])

                
                product = Product.objects.get(product_code_sku=product_sku)

                # Odejmujemy ze stanu to co się sprzedało
                product.product_stock_qty -= product_qty
                # zapisujemy obiekt produkt
                product.save()

            balance_account = Balance.objects.first()

            # Jeśli nie ma jeszcze żadnej kasy na koncie, to ustawiam na 0.00
            if not balance_account:
                balance_account = Balance.objects.create(account_balance=Decimal('0.00'))

            # Zwiększamy saldo główne o kwotę zamówienia
            balance_account.account_balance += total_amount
            balance_account.save()
            return JsonResponse({'status': 'success'})

@require_POST
def migrate_products(request):
        data = json.loads(request.body)
        # iteruje przez liste produktów przesłaną z formularza dodawania produktów
        for item in data:
            print(item)
            price = float(item['price'])
            qty = int(item['qty'])
            # nowe! get_or_create() Sprawdza czy jest w bazie, jak jest ty tylko robi update danych zamiast tworzyć nowy
            # syntax:
            # obj, created = obiekt na którym bazujemy.objects.get_or_create(co sprawdzamy w obiekcie = warunek[tutaj czy kod sku się zgadza], 
            # defaults = {tutaj jeśli sprawdzenie nic nie da, to robimy nowe obiekt BAZUJĄC NA AKTUALNYM!} )
            # jeśli co sprawdzamy w obiekcie = warunek się zgadza to jest to pomijane i lecimy do if not created niżej, wtedy po prostu update aktualnych danych
            obj, created = Product.objects.get_or_create(
                product_code_sku=item['sku'],
                defaults={
                     # tworzenie nowego produktu z deafaultowych parametrów
                    'product_name': item['name'],
                    'product_price': price,
                    'product_stock_qty': qty, 
                    'product_ean': item['ean']
                }
            )
            # to się odpali, jeśli nie będzie to nowy produkt, tylko istniejący
            if not created:
                obj.product_stock_qty = F('product_stock_qty') + qty
                # F() nowość! F() to instrukcja, która robi obliczenia poprzez bazę danych (SQL), dodajemy otrzymaną liczbę produktów do istniejącej
                obj.product_price = item['price']
                obj.product_name = item['name']
                obj.product_ean = item['ean']
                obj.save()
        return JsonResponse({'status': 'success'})    