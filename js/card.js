document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const categoria = localStorage.getItem('catID');
    const apiUrl = "https://japceibal.github.io/emercado-api/cats_products/" + categoria + ".json";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const products = data.products;
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'card';
                card.onclick = function () {
                   verProd(product.id);
                };

                const img = document.createElement('img');
                img.className = 'card-img-top';
                img.src = product.image;
                img.alt = `Imagen de ${product.name}`;

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                const name = document.createElement('p');
                name.className = 'card-text';
                name.textContent = product.name;

                const price = document.createElement('p');
                price.textContent = `Precio: ${product.cost}`;

                cardBody.appendChild(name);
                cardBody.appendChild(price);

                const extraInfo = document.createElement('div');
                extraInfo.className = 'extra-info';

                const extraName = document.createElement('p');
                extraName.textContent = product.name;

                const extraPrice = document.createElement('p');
                extraPrice.textContent = `Precio: ${product.cost}`;

                const description = document.createElement('p');
                description.className = 'info-card';
                description.textContent = `Descripción: ${product.description}`;

                const soldCount = document.createElement('p');
                soldCount.textContent = `Cantidad de vendidos: ${product.soldCount}`;

                extraInfo.appendChild(extraName);
                extraInfo.appendChild(extraPrice);
                extraInfo.appendChild(description);
                extraInfo.appendChild(soldCount);

                card.appendChild(img);
                card.appendChild(cardBody);
                card.appendChild(extraInfo);

                productContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});
function verProd(id){
    //guardo id del producto y redirecciono
    localStorage.setItem("prodID", id);
    window.location = "product-info.html";
}
