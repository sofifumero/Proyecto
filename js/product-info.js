let currentProduct = [];

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
