
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