from django.db import models

# proces tworzenia bazy danych dla erp, klasy opisujące baze danych 

class Product(models.Model):
    product_name = models.CharField(max_length=50) # maksymalna długość nazwy produktu to 50 znaków
    product_price = models.DecimalField(max_digits=10, decimal_places=2) # maksymalna ilość liczb to 10, wymagamy, aby liczba była floatem, 2 miejsca po przecinku max
    product_stock_qty = models.IntegerField(default=0) # ustalamy, że liczba sztuk na stanie ma być intem, jeśli nie zostanie nic wpisane to podstawi 0 sztuk
    product_code_sku = (models.CharField(max_length=50, unique=True)) # kod SKU, zmodyfikowana nazwa produktu, ułatwia ona tracking produktu, format: RAZER-ORNATA-KEY-BLACK czyli MARKA-MODEL-TYP-KOLOR (w tym przypadku klawiatura razer model ornata w kolorze czarnym), maks liczba znaków to 50
    product_ean = models.CharField(max_length=13) # kod ean, max 13 znaków

class Balance(models.Model):
    account_balance = models.DecimalField(max_digits=10, decimal_places=2)