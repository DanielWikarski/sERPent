document.addEventListener('DOMContentLoaded', function () {
    // argument DOMContentLoaded, żeby skrypt wystartował dopiero po tym jak się załaduje strona //
    const show_available = document.querySelector(".show_available")
    const show_unavailable = document.querySelector(".show_unavailable")
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
            
            // parseFloat() -> wbudowana funkcja z JS, która zmienia stringa na floata, w przypadku jak chcemy pobrać dane z elementu to nie mogę użyć tylko textContent, bo stringów nie porównamy i trzeba jest zamienić na liczby
            const item_price = parseFloat(card.querySelector(".product_price").textContent);

            const matchesText = product_name.includes(search_input_value) // operator || żeby sprawdzało czy nazwa LUB kod LUB ean jest zgodny z inputem
            || product_codename.includes(search_input_value)
            || product_ean.includes(search_input_value);

            const matchesPrice = item_price >= minPrice && item_price <= maxPrice;

            if (matchesText && matchesPrice) { // jeśli wynik się zgadza, pozycja jest wyświetlona, jeśli nie display none, żeby nie pokazywało wyniku
                card.style.display = "flex";
                products_shown++;
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

});