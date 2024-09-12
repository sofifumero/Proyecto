
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

      if (nameParagraph && descriptionParagraph) {
        include =
          nameParagraph.textContent?.toLowerCase()?.includes(searchText) ||
          descriptionParagraph.textContent?.toLowerCase()?.includes(searchText)
      }

      productCard.style.display = include ? "block" : "none";
    }
  });
});

function setProdID(id,name){
  //guarda el id del producto y el nombre de la categoria en localStorage
  localStorage.setItem("prodID", id);
  localStorage.setItem("catNAME", name);
  window.location = "product-info.html"
}
