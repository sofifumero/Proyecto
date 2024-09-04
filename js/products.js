document.addEventListener('DOMContentLoaded', function() {
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sortBySelect = document.getElementById('sort-by');
    const productContainer = document.getElementById('product-container');
  
    let products = [];
  
    // Función para cargar productos desde la API
    async function fetchProducts() {
      try {
        const response = await fetch('https://japceibal.github.io/emercado-api/cats_products/101.json');
        const data = await response.json();
        products = data.products;
        console.log('Productos cargados:', products); // Verificar datos
        displayProducts(products); // Mostrar productos inicialmente
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  
    // Función para mostrar productos en el contenedor
    function displayProducts(productsToDisplay) {
      productContainer.innerHTML = ''; // Limpiar productos existentes
      productsToDisplay.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <img src="${product.image}" class="card-img-top" alt="${product.name}" />
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">Precio: $${product.price}</p>
            <p class="card-text">Vendido: ${product.soldCount}</p>
          </div>
        `;
        productContainer.appendChild(card);
      });
    }
  
    // Función para filtrar productos por rango de precio
    function filterProducts() {
      const minPrice = parseFloat(minPriceInput.value) || 0;
      const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
      return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
    }
  
    // Función para ordenar productos
    function sortProducts(filteredProducts) {
      const sortBy = sortBySelect.value;
      if (sortBy === 'price-asc') {
        return filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        return filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'relevance-desc') {
        return filteredProducts.sort((a, b) => b.soldCount - a.soldCount);
      }
      return filteredProducts;
    }
  
    // Función para manejar filtro y ordenamiento
    function handleFilterAndSort() {
      const filteredProducts = filterProducts();
      console.log('Productos filtrados:', filteredProducts); // Verificar datos filtrados
      const sortedProducts = sortProducts(filteredProducts);
      console.log('Productos ordenados:', sortedProducts); // Verificar datos ordenados
      displayProducts(sortedProducts);
    }
  
    // Configurar eventos de los botones y el selector
    searchBtn.addEventListener('click', handleFilterAndSort);
    clearBtn.addEventListener('click', function() {
      minPriceInput.value = '';
      maxPriceInput.value = '';
      sortBySelect.value = 'price-asc';
      displayProducts(products); // Volver a mostrar todos
  