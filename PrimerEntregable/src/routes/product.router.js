import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();

const manager = new ProductManager('./src/files/products.json');

router.get('/', async (req, res) => {
    try {
        const limit = Number(req.query.limit);

        const products = await manager.getAll();

        if (!products) {
            return req.statusCode(404).send({ error: 'Products not found' });
        };

        if (!limit) {
            res.send({ status: 'success', products });
        } else {
            const limitProduct = products.slice(0, limit);
            res.send({ status: 'success', limitProduct });
        };

    } catch (error) {
        console.error(error);
    };
});

router.get('/:pid', async (req, res) => {
    try {
        const idProduct = Number(req.params.pid);
        const product = await manager.getById(idProduct);

        if (!product) {
            return res.status(400).send({ error: 'Product not found' });
        } else {
            res.send({ status: 'success', product });
        };

    } catch (error) {
        console.error(error);
    };
});

router.post('/', async (req, res) => {
    try {
        const product = req.body;

        if (!product.status) { product.status = true };

        const { title, description, code, price, stock, category } = product;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(404).send({ error: 'All fields are reuired' });
        };

        const products = await manager.getAll();
        const wantedCode = products.find(prod => prod.code === code);
        if (wantedCode) {
            return res.status(404).send({ error: 'The code is repeted' })
        };

        const result = await manager.addProducts(product);
        res.send({ status: 'success', result });

    } catch (error) {
        console.error(error);
    };
});

router.put('/:pid', async (req, res) => {
    try {
        const idProduct = Number(req.params.pid);
        const objproduct = req.body;

        if (objproduct.id) { objproduct.id = idProduct };

        const result = await manager.updateProduct(idProduct, objproduct);
        if (!result) {
            res.status(404).send({ error: 'Product not found' });
            return;
        }
        res.send({ status: 'cuccess', result });

    } catch (error) {
        console.error(error);
    };
});

router.delete('/:pid', async (req, res) => {
    try {
        const idProduct = Number(req.params.pid);
        await manager.deleteById(idProduct);
        res.send({ status: 'Removed product' });

    } catch (error) {
        console.error(error);
    };
});

export default router;