let currentProduct = [];
let currentComment= [];

function showProductInfo(prod) {
    //Cargo la informacion de producto
    let htmlContent = "";
        let product = prod;
     htmlContent = `
          <div>
            <h2 class="catprod">${prod.category}</h2>
          </div>
          <div class="contenedor-de-producto>
            <div class="row">
                <div class="col-2" style="width: 50%; float: left;">
                     <img src="${prod.images[0]}" width="100%"  id="ProductImg" class="imgprin">
                     <div class="small-img-row"> 
                        <div class="small-img-col">
                            <img src="${prod.images[0]}" width="100%" class="small-img">
                        </div>
                        <div class="small-img-col">
                            <img src="${prod.images[1]}" width="100%" class="small-img">
                        </div>
                        <div class="small-img-col">
                            <img src="${prod.images[2]}" width="100%" class="small-img">
                        </div>
                        <div class="small-img-col">
                            <img src="${prod.images[3]}" width="100%" class="small-img">
                        </div>
                     </div>
                </div>
                <div class="col-2" style="width: 50%; float: left;"> 
                    <div class="contenedor-info">
                        <h1 class="nameprod">${prod.name}</h1>
                        <h3 class="priceprod">Precio ${prod.currency} ${product.cost}</h3>
                        <h4 class="souldprod">Cantidad de vendidos: ${prod.soldCount}</h4>
                        <h4 class="descprod">Descripcion</h4>
                        <p class="descprod">${prod.description}</p>
                        <input type="button" value="Comprar" class="botoncomprar">
                    </div> 
                </div>
            </div>
          </div>
  
        `

    document.getElementById("product_info").innerHTML = htmlContent;
    let ProductImg = document.getElementById("ProductImg");//Imagen principal
    let SmallImg = document.getElementsByClassName("small-img");//imagenes pequeñas
    SmallImg[0].onclick  = function(){
      ProductImg.src = SmallImg[0].src;
    }
    SmallImg[1].onclick  = function(){
      ProductImg.src = SmallImg[1].src;
    }
    SmallImg[2].onclick = function(){
      ProductImg.src = SmallImg[2].src;
    }
    SmallImg[3].onclick  = function(){
      ProductImg.src = SmallImg[3].src;
    }
    
}
function showProductComments() {
  let htmlContent = `<div class="comentario-box-container">`; // Contenedor para todos los comentarios
  for (let i = 0; i < currentComment.length; i++) {
    let comment = currentComment[i];
    htmlContent += `
      <div class="box">
        <div class="box-top">
          <div class="perfil">
            <div class="username">
              <h4>${comment.user}</h4>
            </div>
          </div>
          <div class="calificacion">
            ${generateStars(comment.score)}
          </div>
        </div>
        <div class="review">
          <p>${comment.description}</p>
        </div>
        <div class="fecha">
          <h4>${comment.dateTime}</h4>
        </div>
      </div>
    `;
  }
  htmlContent += `</div>`; // Cierra el contenedor
  document.getElementById("product-comment").innerHTML = htmlContent;

  function generateStars(score) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      if (i < score) {
        stars += '<i class="fas fa-star"></i>';
      } else {
        stars += '<i class="far fa-star"></i>';
      }
    }
    return stars;
  }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL  + localStorage.getItem('prodID')+'.json').then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProduct = resultObj.data
            showProductInfo(currentProduct);
        }
    });
    
});
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCT_INFO_COMMENTS_URL + localStorage.getItem('prodID')+'.json').then(function (resultObj) {
      if (resultObj.status === "ok") {
          currentComment = resultObj.data
          showProductComments(currentComment);
      }
  });
  
});
