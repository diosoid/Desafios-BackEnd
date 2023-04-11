import express from 'express';
import ProductManager from './ProductManager.js';


const app = express()
const PORT = process.env.PORT || 8080

const manager = new ProductManager('./src/products.json')

app.use(express.urlencoded({extended: true}))

app.get('/products', async (req, res) => {
    const productos = await manager.getProducts()
    const prods = []
    let limit = parseInt(req.query.limit)
    if(limit && limit <= productos.length){
        for (let i = 0; i < limit; i++){
            prods.push(productos[i])
        }
        return res.send(prods)
    }else {
        res.send({productos})
    }


})


app.get('/products/:pid', async (req, res) => {
    const productos = await manager.getProducts()
    let prodID = parseInt(req.params.pid)
    let producto = productos.find(p => p.id === prodID)
    if(!producto) return res.send({error:`El producto N° ${prodID} no existe`})
    res.send({producto})
})


app.listen(PORT, ()=>{console.log(`Servidor activo y esuchando en el puerto ${PORT}`)})