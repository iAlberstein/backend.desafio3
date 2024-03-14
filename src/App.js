import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
const producto = new ProductManager("./products.json");

const PUERTO = 8080;

app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
    res.send("Probando el servidor")
})

app.get("/products", async (req, res) => {
    try {
        const products = await producto.getProducts();
        let limit = parseInt(req.query.limit)

        if(limit >= 0) {
            let newArrayProducts = products.slice(0,limit);
            res.send(newArrayProducts);
        }else {
            res.send(products);
        }
    } catch (error) {
        console.log("Error al obtener los productos ", error.message);
        res.send("error al obtener los productos.")
    }
})

app.get("/products/:pid", async (req, res) => {
    const products = await producto.getProducts();

    let pid = parseInt(req.params.pid);
    let product = products.find(product => product.id === pid);

    if(product) {
        res.send(product);
    } else {
        res.send("Producto no encontrado.")
    }
});

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto http://localhost:${PUERTO}`);
})