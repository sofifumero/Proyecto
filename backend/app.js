const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

///////////////////
//// Constantes////
//////////////////

const Port = 3000;

//Usuarios de prueba (en producción usar base de datos)
const Users = [
  {
    username: 'usuario@mail.com',
    password: '12345'
  },
  {
    username: 'estudiante@hotmail.com',
    password: '12345'
  },
  {
    username: 'agusuran@hotmail.com',
    password: '12345'
  },
  ,
  {
    username: 'agustina.uran@hotmail.com',
    password: '12345'
  }
];

const StatusCodeUnauthorized = 401;
const UnauthorizedResponseBody = { title: 'Unauthorized', message: "Credenciales inválidas" };
const UnauthorizedResponseInvalidTokenBody = { title: 'Unauthorized', message: "Invalid token" };

const JWT_SECRET = 'claveSecreta';
const TOKEN_EXPIRATION = '604800s'; // una semana

const PublicEndpoints = ["/login", "/signup"];

const DisableTokenValidation = false;

///////////////
// APP ////////
///////////////
const app = express();

// Load data
const jsonData = {};
loadJsonData("cats", "categories");
loadJsonData("sell", "publish");
loadJsonData("cats_products", "catsProducts");
loadJsonData("products", "products");
loadJsonData("products_comments", "productsComments");
loadJsonData("user_cart", "userCart");
loadJsonData("cart", "cartBuy");

////////////////
// Middleware///
////////////////

app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});
app.use((req, res, next) => {
  if (DisableTokenValidation || PublicEndpoints.includes(req.path)) {
    return next();
  }
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(StatusCodeUnauthorized)
      .json(UnauthorizedResponseInvalidTokenBody);;
  }
  
  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      return res
        .status(StatusCodeUnauthorized)
        .json(UnauthorizedResponseInvalidTokenBody);
    } else {
      req.user = user;
      next();
    }
  })
})
app.use(express.json());

////////////////
// Endpoints ///
////////////////

// Index
app.get('/',(req, res) => {
  res.send('Backend API ecommerce - Servidor corriendo en http://localhost:' + Port)
})

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const existeUsuario = Users.some(usuario => {
    return usuario.username === username && usuario.password === password
  })

  if (existeUsuario) {
    const token = createToken(username);
    res.json({ token });
  } else {
    res.status(StatusCodeUnauthorized).json(UnauthorizedResponseBody);
  }
});

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

app.listen(Port, () => {
  console.log(`Servidor corriendo en http://localhost:${Port}`);
});

function createToken(username) {
  return jwt.sign(
    { username: username },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );
}

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
    } catch (error) {
      console.error(`Error loading file ${file}:`, error);
    }
  });

  console.log(`Preloaded ${element} data:`, Object.keys(jsonData[element]));
}


