
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



/* Filtros */

document.addEventListener('DOMContentLoaded', function() {
  const productContainer = document.getElementById('product-container');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const searchBtn = document.getElementById('search-btn');
  const clearBtn = document.getElementById('clear-btn');
  const sortBySelect = document.getElementById('sort-by');
  
  let products = []; // Array para almacenar los productos

  // Cargar productos
  function loadProducts() {
    fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
      .then(response => response.json())
      .then(data => {
        products = data.products;
        displayProducts(products);
      });
  }

  // Mostrar productos
  function displayProducts(productsToDisplay) {
    productContainer.innerHTML = ''; // Limpiar el contenedor

    productsToDisplay.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
     /* productCard.innerHTML = `
        <h5>${product.name}</h5>
        <p>Precio: $${product.cost}</p>
        <p>Cantidad Vendida: ${product.sold_count}</p>
      `; */
      productContainer.appendChild(productCard);
    });
  }

  // Filtrar productos por precio
  function filterProducts() {
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    const filteredProducts = products.filter(product => {
      return product.cost >= minPrice && product.cost <= maxPrice;
    });

    displayProducts(filteredProducts);
  }

  // Ordenar productos
  function sortProducts(criteria) {
    let sortedProducts = [...products];

    if (criteria === 'price-asc') {
      sortedProducts.sort((a, b) => a.cost - b.cost);
    } else if (criteria === 'price-desc') {
      sortedProducts.sort((a, b) => b.cost - a.cost);
    } else if (criteria === 'relevance-desc') {
      sortedProducts.sort((a, b) => b.sold_count - a.sold_count);
    }

    displayProducts(sortedProducts);
  }

  // Eventos
  searchBtn.addEventListener('click', filterProducts);
  clearBtn.addEventListener('click', function() {
    minPriceInput.value = '';
    maxPriceInput.value = '';
    displayProducts(products);
  });
  sortBySelect.addEventListener('change', function() {
    sortProducts(sortBySelect.value);
  });

  // Inicializar
  loadProducts();
});
