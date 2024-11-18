const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Load data
const jsonData = {};
loadJsonData("cats", "categories");
loadJsonData("sell", "publish");
loadJsonData("cats_products", "catsProducts");
loadJsonData("products", "products");
loadJsonData("products_comments", "productsComments");
loadJsonData("user_cart", "userCart");
loadJsonData("cart", "cartBuy");

// Middleware
app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});
app.use(express.json());




// Endpoints

// https://japceibal.github.io/emercado-api/cats/cat.json
app.get('/cats', (req, res) => {
  res.json(jsonData.categories.cat)
})

// https://japceibal.github.io/emercado-api/sell/publish.json
app.get('/sell/publish', (req, res) => {
  res.json(jsonData.publish.publish)
})

// "https://japceibal.github.io/emercado-api/cats_products/";
app.get("/cats_products/:index", (req, res) => {
  const catsProductId = req.params.index;
  res.json(jsonData.catsProducts[catsProductId]);
});

// "https://japceibal.github.io/emercado-api/products/";
app.get("/products/:index", (req, res) => {
  const productId = req.params.index;
  res.json(jsonData.products[productId]);
});

// "https://japceibal.github.io/emercado-api/products_comments/";
app.get("/products_comments/:index", (req, res) => {
  const productId = req.params.index;
  res.json(jsonData.productsComments[productId]);
});

// "https://japceibal.github.io/emercado-api/user_cart/"
app.get("/user_cart/:index", (req, res) => {
  const userId = req.params.index;
  res.json(jsonData.userCart[userId]);
});

// "https://japceibal.github.io/emercado-api/cart/buy.json";
app.get("/cart/buy", (req, res) => {
  res.json(jsonData.cartBuy.buy);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

function loadJsonData(baseDir, element) {
  const dirPath = path.join(__dirname, "json", baseDir);
  const files = fs.readdirSync(dirPath);
  
  jsonData[element] = {};
  
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const id = path.basename(file, ".json");
    
    try {
      const data = fs.readFileSync(filePath, "utf8");
      jsonData[element][id] = JSON.parse(data);
    } catch (err) {
      console.error(`Error loading file ${file}:`, err);
    }
  });
  
  console.log(`Preloaded ${element} data:`, Object.keys(jsonData[element]));
}