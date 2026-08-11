document.addEventListener('DOMContentLoaded', function () {
    // argument DOMContentLoaded, żeby skrypt wystartował dopiero po tym jak się załaduje strona //
    const search_input = document.getElementById("search_input"); 
    const productCards = document.querySelectorAll(".product_card");
    // pobieram potrzebne do wykonania skryptu elementy - input żeby móc wyszukiwać i productCards, żeby wyświetlać tylko to, co wbiłem w input //
    
    const price_value_min_slider = document.querySelector(".price_value_min_slider"); // Suwak do ustalania ceny
    const price_value_min = document.querySelector(".price_value_min"); // Tekst wyświetlający cene suwakiem, można będzie też ją ustawić ręcznie po kliknięciu

    const price_value_max_slider = document.querySelector(".price_value_max_slider");
    const price_value_max = document.querySelector(".price_value_max");

    const products_prices = document.querySelectorAll(".product_price"); // Pobieram ceny produktów
    
    // robię listę z product_prices, iteruje przez za pomocą map i biore sam text content, następnie zwracam to jako float, dzięki temu będę mógł ustalić
    // największą cene i najmniejszą, będzie mi to potrzebne to suwaków, żeby ustalić min i max range dla nich
    const products_prices_list = Array.from(products_prices).map(product => {
        let product_price = product.textContent;
        return parseFloat(product_price);
    });

    const product_prices_max_value = Math.max(...products_prices_list); // stała ta określa max wartośc z listy, ... <- to spread, dzięki niemu przechodzę przez całą listę
    const product_prices_min_value = Math.min(...products_prices_list);

    // ustawiam dla suwaka atrybuty tj. max range, min range i wartości początkowe
    price_value_min_slider.min = product_prices_min_value;
    price_value_max_slider.min = product_prices_min_value;

    price_value_min_slider.max = product_prices_max_value;
    price_value_max_slider.max = product_prices_max_value;

    price_value_max_slider.value = product_prices_max_value;
    price_value_min_slider.value = product_prices_min_value;
    price_value_min.textContent = product_prices_min_value;
    price_value_max.textContent = product_prices_max_value;

    const slider_track = document.querySelector(".slider_track"); // slider na którym są suwaki, część, którą zaznaczymy będzie podświetlona, reszta opacity 0.7, żeby było widać 
    // wizualnie jaki range mamy wzięty


    function filter_products() {
        // główna funkcja filtrująca, sprawdza ona input field jak i suwaki
        const search_input_value = search_input ? search_input.value.toLowerCase().trim() : "";
        // pobieram dane z search_input za pomocą .value i obcinam, jeśli są jakieś whitespaces z przodu lub z tyłu za pomocą trim
        const minPrice = parseFloat(price_value_min.textContent);
        const maxPrice = parseFloat(price_value_max.textContent);

        let products_shown = 0; // liczba aktualnie pokazanych produktów, zmienna ta jest potrzebna żeby w przypadku, jak nic nie pokaże, to, żeby
        // wyświetlił się komunikat, że nic nie znaleziono, domyślnie ma ustawione display = "none"

        productCards.forEach(function(card) { // iteruję przez wszystkie dostępne produkty w poszukiwaniu produktu, który wpisaliśmy w input
            // zmienna tymczasowa card jest tutaj całym obiektem product_card
            const product_name = card.querySelector(".product_name").textContent.toLowerCase();
            const product_codename = card.querySelector(".product_codename").textContent.toLowerCase();
            const product_ean = card.querySelector(".product_ean").textContent;
            const qty = card.querySelector(".product_qty")

            // parseFloat() -> wbudowana funkcja z JS, która zmienia stringa na floata, w przypadku jak chcemy pobrać dane z elementu to nie mogę użyć tylko textContent, bo stringów nie porównamy i trzeba jest zamienić na liczby
            const item_price = parseFloat(card.querySelector(".product_price").textContent);

            const matchesText = product_name.includes(search_input_value) // operator || żeby sprawdzało czy nazwa LUB kod LUB ean jest zgodny z inputem
            || product_codename.includes(search_input_value)
            || product_ean.includes(search_input_value);

            const matchesPrice = item_price >= minPrice && item_price <= maxPrice;

            if (matchesText && matchesPrice) { // jeśli wynik się zgadza, pozycja jest wyświetlona, jeśli nie display none, żeby nie pokazywało wyniku
                // filtracja produktów niedostępnych / dostępnych
                if (show_unavailable.classList.contains("filter_icon_hide") && parseFloat(qty.textContent) == 0){
                    card.style.display =  "none"
                } else {
                    card.style.display = "flex"
                    products_shown++;
                }
            } else {
                card.style.display = "none";
            }

        });
        const product_card_empty = document.querySelector(".product_card_empty");
        if (products_shown === 0) { // jeśli liczba wyświetlonych produktów po skończeniu pętli wynosi zero, to pokaże się komunikat o braku produktków
            product_card_empty.style.display = "flex";
        } else {
            product_card_empty.style.display = "none";
        }



    }


    if (search_input) { // skrypt odpali się dopiero jak będzie widział, że search_input jest na stronie, jeśli będzie on widoczny, wartość będzie True i "if" się wykona
        search_input.addEventListener("input", function() {
            // jak coś user wpisze w input, funkcja filter_products się odpala
            filter_products();

            // znikanie lupy i zamiana na X do wymazywania wprowadzonych danych
            const search_input_icon = document.querySelector(".search_icon");
            const clear_input_icon = document.querySelector(".clear_icon");

            if (search_input.value.trim().length == 0) {
                search_input_icon.style.display = "flex";
                clear_input_icon.style.display = "none";
            } else {
                search_input_icon.style.display = "none";
                clear_input_icon.style.display = "flex";
            }
        });
    }

    const clear_input_icon = document.querySelector(".clear_icon");
    if (clear_input_icon) {
        clear_input_icon.addEventListener("click", function(){
            search_input.value = ""; // po kliknięciu x, wyzeruje wyszukiwarkę
            search_input.dispatchEvent(new Event('input')); // tworzymy na search_input sztuczny event, że user zaczął coś wpisywać i odpala się
            // eventListener na search_input, co odpala funkcje i jako, że pole jest czyte, to pokazuje wszystkie produkty, tak jakby user zrobił backspace
            // i wyczyścił wszystko
        });
    }


    function slider_track_update() {
        // update danych na podstawie inputu z suwaka
        price_value_min.textContent = price_value_min_slider.value;
        price_value_max.textContent = price_value_max_slider.value;

        const slider_range = product_prices_max_value - product_prices_min_value;
        const slider_min_current_position = price_value_min_slider.value;
        const slider_max_current_position = price_value_max_slider.value;

        const slider_min_current_position_percent = ((slider_min_current_position - product_prices_min_value) / slider_range) * 100;
        const slider_max_current_position_percent = ((slider_max_current_position - product_prices_min_value) / slider_range) * 100;

        // blokada sliderów i wartości, żeby nie nachodziły na siebie i żeby min slider nie mógł przekroczyć granicy max slidera
        if (slider_min_current_position_percent >= slider_max_current_position_percent) {
            price_value_min_slider.value = price_value_max_slider.value;
            price_value_min.textContent = price_value_max.textContent;
        }

        // dynamiczna zmiana "paska" - jego wielkości na podstawie gdzie mamy postawione suwaki
        slider_track.style.background = `linear-gradient(
            to right, 
            #7f8b9d  ${slider_min_current_position_percent}%, 
            #4e5a6c ${slider_min_current_position_percent+0.1}%, 
            #4e5a6c ${slider_max_current_position_percent}%, 
            #7f8b9d  ${slider_max_current_position_percent+0.1}%
            )`;

        filter_products();
    }

    price_value_min_slider.addEventListener("input", slider_track_update);
    price_value_max_slider.addEventListener("input", slider_track_update);




    // Zachowanie buttona apply filters, zmiana wyglądu, chowanie / pokazywanie contentu
    const apply_filters_show = document.querySelector(".apply_filters_btn.active")
    const apply_filters_hide = document.querySelector(".apply_filters_btn.inactive")
    const filter_search_container_options = document.querySelector(".filter_search_container_options")


    apply_filters_show.addEventListener("click", function() {
        apply_filters_hide.classList.remove("filter_icon_hide")
        apply_filters_hide.classList.add("filter_icon_show")
        apply_filters_show.classList.remove("filter_icon_show")
        apply_filters_show.classList.add("filter_icon_hide")
        filter_search_container_options.style.display = "none"
    })

    apply_filters_hide.addEventListener("click", function(){
        apply_filters_show.classList.remove("filter_icon_hide")
        apply_filters_show.classList.add("filter_icon_show")
        apply_filters_hide.classList.remove("filter_icon_show")
        apply_filters_hide.classList.add("filter_icon_hide")
        filter_search_container_options.style.display = "block"
    })


    // Flagowanie show unavailable, logika jest w funkcji głównej filter_products()
    const show_unavailable = document.querySelector(".show_unavailable > svg")
    const show_unavailable_btn = document.querySelector(".show_unavailable")
    show_unavailable.classList.add("filter_icon_show")

    show_unavailable_btn.addEventListener("click", function(){
        if (show_unavailable.classList.contains("filter_icon_show")){
            show_unavailable.classList.remove("filter_icon_show")
            show_unavailable.classList.add("filter_icon_hide")
            filter_products()
        }else {
            show_unavailable.classList.remove("filter_icon_hide")
            show_unavailable.classList.add("filter_icon_show")
            filter_products()
        }
    })


    // Import do Excela aktualnie pokazanych produktów biorąc pod uwagę filtry

    const exportWarehouseBtn = document.getElementById("export_warehouse_btn");
    if (exportWarehouseBtn) {
        // sprawdzamy czy przycisk jest  na ekranie, jeśli tak do dodajemy do niego listenera
        exportWarehouseBtn.addEventListener("click", function () {
            // Filtrujemy tylko te, które są aktualnie widoczne dla użytkownika
            const visibleCards = Array.from(productCards).filter(card => {
                // robimy listę widocznych produktów
                // zwraca jeśli produkt nie ma display "none" i czy realnie jest pokazany (NOWOŚĆ!! getComputedStyle)
                return card.style.display !== "none" && window.getComputedStyle(card).display !== "none";
            });

            if (visibleCards.length === 0) {
                alert("No products found to export based on current filters.");
                return;
            }
            // nagłówki dla piku csv
            let csvContent = "Product Name;SKU (Code);Price (Netto);Availability (Qty);EAN Code\n";
            // Usuwanie niepotrzebnych odstępów etc.
            visibleCards.forEach(card => {
                const name = card.querySelector(".product_name")?.textContent.trim() || "";
                const sku = card.querySelector(".product_codename")?.textContent.trim() || "";
                const price = card.querySelector(".product_price")?.textContent.trim() || "";
                const qty = card.querySelector(".product_qty")?.textContent.trim() || "";
                const ean = card.querySelector(".product_ean")?.textContent.trim() || "";

                // robimy wiersz ze średnikami, tak jak wygląda struktura csv
                csvContent += `"${name}";"${sku}";"${price}";"${qty}";"${ean}"\n`;
            });
            // (NOWE!! BOM (Byte Order Mark) powoduje, że wyświetlanie jest wgl standardu UTF-8, czyli z Polskimi znakami)
            const BOM = "\uFEFF";
            // (NOWE!!! blob (Binary Large Object)
            // syntax new Blob([opcjonalny argument na Polski znaków + co ma być przekazywane], {type: "typDanych/rozszerzenie;charset=utf-8; Tutaj znów
            // deklaracja typu UTF-8" ale to dla przeglądarek, BOM jest tylko dla Excela, żeby odpowiednio traktował tekst })
            const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
            // Żeby pobrać potrzebny jest  odnośnik, tutaj robimy fake url który będzie działać lokalnie
            const url = URL.createObjectURL(blob); 


            // generowanie dokumentu i nadawanie nazwy (względem dzisiejszej daty)
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `warehouse_stock_${new Date().toISOString().slice(0, 10)}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }



    // Interakcja z kartą produktu w sell products, dodawanie produktu do koszyka i obsługa wyświetlania koszyka w karcie obok w basket summary


    const basketContainer = document.querySelector(".basket_summary");
    const emptyBasketMsg = document.querySelector(".empty_basket");
    const totalAmountText = document.querySelector(".total_amount");

    // Obiekt przechowujący produkty w koszyku (klucz to SKU, bo nawet jak będzie ta  sama nazwa to SKU jest dosyć unikalny dla każdego produktu)
    let basket = {};
    // basket zawiera słownik gdzie są ceny, nazwa produktu, ile produktu dodaliśmy do  koszyka i stan ile było na magazynie przez kliknięciem
    // użyłem let zamiast  const, bo basket jest zmienny, a nie  stały.

    // nadanie listenera na każdą pozycje z magazynie, żeby można było kliknąć i dodać to do koszyka
    productCards.forEach(function(card) {
        card.addEventListener("click", function() {
            choose_item(card);
        });
    });

    // zachowanie po kliknięciu na dany produkt, czyli wrzucenie go do koszyka po prawej stronie
    function choose_item(card) {
        // pobieram dane z produktu z magazynu, co kliknął user
        const name = card.querySelector(".product_name").textContent;
        const sku = card.querySelector(".product_codename").textContent;
        const price = parseFloat(card.querySelector(".product_price").textContent);
        const qtyElement = card.querySelector(".product_qty");
        let currentStock = parseFloat(qtyElement.textContent);

        // Sprawdzenie czy produkt jest dostępny w magazynie, jeśli nie to podnoszę bład
        if (currentStock <= 0) {
            alert("Choosen product is not available!");
            return;
        }

        // Zdejmowanie sztuki produktu z magazynu (wizualnie - faktyczne zdejmowanie będzie poprzez django data base potem)
        currentStock--;
        // odejmuje i wizualnie zmmienam bezpośrednio na elemencie w html
        qtyElement.textContent = currentStock;

        // Jeśli produkt jest już w koszyku, zwiększamy ilość, jeśli nie - dodajemy
        if (basket[sku]) {
            basket[sku].qty++;
        } else {
            basket[sku] = {
                name: name,
                price: price,
                qty: 1,
                maxStock: currentStock + 1 
                // zapamiętujemy pierwotny stan w razie resetu
            };
        }

        // Po zmianie stanu magazynowego, odpala się filtracja, jakby coś już było wpisane
        filter_products();
        
        // Render koszyka
        render_basket();
    }


    // funkcja odpowiadająca za pojawianie się kolejnych itemów w koszyku
    function render_basket() {
        // przy każdym dodaniu od początku renderujemy koszyk, czyli usuwamy to co jest i renderujemym go na nowo na podstawie danych ze zmiennej basket (słownika)
        const oldItems = basketContainer.querySelectorAll(".basket_products_list .add_product_window");
        oldItems.forEach(item => item.remove());

        const skuArray = Object.keys(basket);
        // jako, że nie można odpalić iteracji na basket, to robie array, wrzucam tam same klucze, czyli SKU w tym przypadku

        const proceed_to_checkout_btn = document.querySelector(".proceed_to_checkout_btn")
        // jeśli nie ma nic w koszyku to ikonka to przejścia dalej jest nieaktywna
        // jeśli lista jest pusta  to pokazuje komunikat, że koszyk jest pusty
        if (skuArray.length === 0) {
            proceed_to_checkout_btn.style.opacity = "0.5";
            proceed_to_checkout_btn.style.pointerEvents = "none";
            emptyBasketMsg.style.display = "block";
            totalAmountText.textContent = "total: 0.00zł";

            return;
        }
        proceed_to_checkout_btn.style.pointerEvents = "all";
        proceed_to_checkout_btn.style.opacity = "1";
        proceed_to_checkout_btn.style.cursor = "pointer";
        emptyBasketMsg.style.display = "none";
        let total = 0; 

        // iteruje forEach poprzez listę, i dla każdej iteracji  wyciągam na podstawie klucza dane ze słownika basket
        // na tej postawie tworzę obiekt w html z danymi ze słownika
        skuArray.forEach(sku => {
            const item = basket[sku];
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            const productWindow = document.createElement("div");
            productWindow.className = "add_product_window";
            // render koszyka, wstrzykuje do html pozycje do koszyka
            productWindow.innerHTML = `
                <div class="add_product_item_name">
                    <p>${item.name}</p>
                </div>
                <div class="add_product_item_qty">
                    <input type="number" class="subtext qty_amount" value="${item.qty}" min="1" data-sku="${sku}">
                    <p class="subtext">Qty.</p>
                </div>
                <div class="add_product_item_price" style="display: flex; align-items: center; gap: 10px;">
                    <p class="price_amount">${itemTotal.toFixed(2)}zł</p>
                    <button class="remove_product_btn" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-weight: bold; padding: 0 5px;">✕</button>
                </div>
            `;
            
            const productsList = basketContainer.querySelector(".basket_products_list");
            productsList.appendChild(productWindow);
            // Obsługa ręcznej zmiany ilości, jak klikniemy z liczbę, to można ręcznie sobie zmienić
            const qtyInput = productWindow.querySelector(".qty_amount");
            qtyInput.addEventListener("change", function(e) {
                update_basket_qty(sku, parseInt(e.target.value));
            });

            // Usuwanie produktu z koszyka
            const removeBtn = productWindow.querySelector(".remove_product_btn");
            removeBtn.addEventListener("click", function() {
                remove_from_basket(sku);
            });
        });

        totalAmountText.textContent = `total: ${total.toFixed(2)}zł`;
    }
    // funkcja odpowiadająca za usuwanie z koszyka
    function remove_from_basket(sku) {
        const item = basket[sku];
        if (item) {
            const card = Array.from(productCards).find(c => c.querySelector(".product_codename").textContent === sku);
            
            if (card) {
                const qtyElement = card.querySelector(".product_qty");
                qtyElement.textContent = item.maxStock;
            }
            delete basket[sku];
            

            filter_products();
            render_basket();
        }
    }
    function update_basket_qty(sku, newQty) {
        const item = basket[sku];
        const card = Array.from(productCards).find(c => c.querySelector(".product_codename").textContent === sku);
        const qtyElement = card.querySelector(".product_qty");
        
        if (!newQty || newQty <= 0) {
            qtyElement.textContent = item.maxStock;
            delete basket[sku];
        } else {
            const diff = newQty - item.qty;
            const currentStock = parseInt(qtyElement.textContent);
            if (diff > currentStock) {
                alert("Brak wystarczającej ilości w magazynie!");
                render_basket(); 
                return;
            }
            qtyElement.textContent = currentStock - diff;
            item.qty = newQty;
        }



        filter_products();
        render_basket();
    }
    
    const proceed_to_checkout_btn = document.querySelector(".proceed_to_checkout_btn");
    if (proceed_to_checkout_btn) {
        proceed_to_checkout_btn.addEventListener("click", function() {
            const skuArray = Object.keys(basket);
            // Zapisujemy koszyk w pamięci podręcznej przeglądarki
            // NOWE!! localStorage pozwala nam zatrzymać dany obiekt w pamięci przeglądarki, nawet po refreshu tam będzie
            // syntax localStorage.setItem("nazwa szufladki gdzie wrzucimy dane", dane które chcemy zatrzymać. (jako, że nie można przekazać
            // słownika basket to zamieniamy go na czysty tekst JSON))
            localStorage.setItem('active_basket', JSON.stringify(basket));
            
            // Przenosimy użytkownika na adres url gdzie będzie podsumowanie i płatność
            window.location.href = '/sales_modules_checkout/'; 
        });
    }




});