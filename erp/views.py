import json
from decimal import Decimal
from django.shortcuts import render 
from django.http import JsonResponse
from django.db import transaction
from django.views.decorators.http import require_POST
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
        # Odczytujemy dane przysłane w formacie JSON z JS
        data = json.loads(request.body)
        basket = data.get('basket', {})
        payment_method = data.get('payment_method')
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