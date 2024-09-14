
// Evento carga inicial de productos
let searchProducts = []
document.addEventListener('DOMContentLoaded', () => {
  const productContainer = document.getElementById('product-container');
  const categoria = localStorage.getItem('catID');
  const apiUrl = "https://japceibal.github.io/emercado-api/cats_products/" + categoria + ".json";

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      searchProducts = data.products;
      const products = data.products;
      products.forEach(product => {
        const card = createProductCard(product);
        productContainer.appendChild(card);
      });
    })
    .catch(error => console.error('Error al cargar los productos:', error));
});

// Eventos busqueda de productos
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchProductInput");
  const productContainer = document.getElementById('product-container');
  searchInput.addEventListener("input", (event) => {
    const searchText = searchInput.value.toLowerCase();
    const productCards = productContainer.getElementsByClassName('card');

    for (let productCard of productCards) {
      let include = true;

      const nameParagraph = productCard.getElementsByClassName('card-text')[0];
      const descriptionParagraph = productCard.getElementsByClassName('info-card')[0];
      const existenLosElementos = nameParagraph && descriptionParagraph;

      if (existenLosElementos) {
        include =
          nameParagraph.textContent?.toLowerCase()?.includes(searchText) ||
          descriptionParagraph.textContent?.toLowerCase()?.includes(searchText)
      }

      productCard.style.display = include ? "block" : "none";
    }
  });
});

// Eventos filtros de productos
document.addEventListener('DOMContentLoaded', function () {
  const productContainer = document.getElementById('product-container');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const searchBtn = document.getElementById('search-btn');
  const clearBtn = document.getElementById('clear-btn');
  const sortBySelect = document.getElementById('sort-by');

  searchBtn.addEventListener('click', filterProducts);

  clearBtn.addEventListener('click', function () {
    minPriceInput.value = '';
    maxPriceInput.value = '';
    setProductCards(searchProducts);
  });

  sortBySelect.addEventListener('change', function () {
    sortProducts(sortBySelect.value);
  });
});

function filterProducts() {
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

  const filteredProducts = searchProducts.filter(product => {
    return product.cost >= minPrice && product.cost <= maxPrice;
  });

  setProductCards(filteredProducts);
}

function sortProducts(criteria) {
  let sortedProducts = [...searchProducts];

  if (criteria === 'price-asc') {
    sortedProducts.sort((a, b) => a.cost - b.cost);
  } else if (criteria === 'price-desc') {
    sortedProducts.sort((a, b) => b.cost - a.cost);
  } else if (criteria === 'relevance-desc') {
    sortedProducts.sort((a, b) => b.sold_count - a.sold_count);
  }

  setProductCards(sortedProducts);
}

function setProductCards(products) {
  const productContainer = document.getElementById('product-container');
  productContainer.innerHTML = '';
  products.forEach(product => {
    const card = createProductCard(product);
    productContainer.appendChild(card);
  });
}

function createProductCard(product) {
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
  return card;
}

function verProd(id) {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html";
}

function setProdID(id, name) {
  //guarda el id del producto y el nombre de la categoria en localStorage
  localStorage.setItem("prodID", id);
  localStorage.setItem("catNAME", name);
  window.location = "product-info.html"
}
