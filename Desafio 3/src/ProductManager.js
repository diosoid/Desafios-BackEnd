import fs, { existsSync } from 'fs';

class ProductManager {
    
constructor(path){
    this.path = path;
}

    getProducts = async () => {
        try {
            if(existsSync(this.path)){
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        } else {
            return []
        }
        } catch (error) {
            console.log(error);
        }
    }


    addProduct = async (
        title,
        description,
        price,
        thumbnail,
        code,
        stock
        ) => {
        
        try {

        const products = await this.getProducts()

        if(!title || !description || !price || !thumbnail || !code || !stock) {
            console.log(`Todos los campos son obligatorios, por favor revisa tu entrada.`)
            return
        }

        const producto = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        
        const foundCode = products.find(prod => prod.code === producto.code)

        if(!foundCode){
            
            if (products.length === 0){
                producto.id = 1
            } else{
                producto.id = products[products.length - 1].id + 1
            }
            products.push(producto)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        } else{
            console.log(`El código de producto ${producto.code} coincide con uno existente, coloque otro por favor.`)
        }

        } catch (error) {
            console.log(error)
        }

    }


    getProductById = async (productId) => {
        try {
            const products = await this.getProducts()

            const found = products.find( prodId => prodId.id === productId)
            
            if(!found){
                console.log(`Not Found`)
            } else {
                console.log(`El producto elegido es -${found.title}-`)
                return found
            }
        } catch (error) {
            console.log(error)
        }

    }


    updateProduct = async (id, updates) => {
        try{
            let products = await this.getProducts()
            products = products.map(prod => {
                if(prod.id === id){
                prod = {...prod, ...updates}
                }
                return prod
            })
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        }
        catch(error){
            console.log(error)
        }
    }


    deleteProduct = async (id) => {
        try {
            let products = await this.getProducts()
            
            const found = products.find((prod) => prod.id === id)
            const index = products.indexOf(found)
            if (found) {
            products.splice(index, 1)
            }else{
                console.log(`El producto no existe`)
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        } catch (error) {
            console.log(error)
        }

    }
}

export default ProductManager