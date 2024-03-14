import fs from 'fs/promises';


class ProductManager {
    static id = 0;

    constructor(filePath) {
        this.products = [];
        this.path = filePath;
    }

    async addProduct(title, description, price, image, code, stock) {
        try {
            // Cargar productos existentes
            await this.loadProducts();

            // Verificar si el código ya existe
            const existingProduct = this.products.find(product => product.code === code);
            if (existingProduct) {
                console.log(`El código ${code} ya existe, no se generó un nuevo producto`);
                return;
            }

            // Verificar si todos los campos obligatorios están presentes
            if (!title || title.trim() === '' || !description || description.trim() === '' || price === null || price === undefined || price === '' || !code || code.trim() === '' || stock === null || stock === undefined || stock === '') {
                console.log('Todos los campos son obligatorios');
                return;
            }

            // Incrementar el ID estático
            ProductManager.id++;

            // Crear nuevo producto con el ID actualizado
            const newProduct = {
                id: ProductManager.id,
                title,
                description,
                price,
                image,
                code,
                stock
            };

            // Agregar el nuevo producto a la lista de productos
            this.products.push(newProduct);

            // Guardar la lista actualizada de productos en el archivo
            await this.saveProducts();

            return ProductManager.id;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);

            // Recuperar el ID más alto de los productos cargados
            const highestId = Math.max(...this.products.map(product => product.id));

            // Actualizar el ID estático para que sea mayor que el más alto encontrado
            ProductManager.id = highestId;
        } catch (error) {
            // Si el archivo no existe o hay algún error al leerlo, no hacer nada
            // La lista de productos permanecerá vacía
            console.error("Error al cargar los productos:", error);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error al guardar los productos:", error);
        }
    }


    async getProducts() {
        try {
            // Leo los archivos y los almaceno en una constante
            const readProductsJSON = await fs.readFile(this.path, 'utf-8');
            // Compruebo que no este vacia la constante
            if (readProductsJSON.length > 0) {
                // Convierto a formato array
                this.products = JSON.parse(readProductsJSON);
                console.log(this.products);
                return this.products;
            } else {
                console.log("JSON file is empty");
                return [];
            }
        } catch (error) {
            console.log("(getProduct) Error reading or parsing JSON file: ", error.message);
        }
    }

    async getProductById(id) {
        try {
            // Leo los archivos y los almaceno en una constante
            const readProductsJSON = await fs.readFile(this.path, 'utf-8');
            // Compruebo que no este vacia la constante
            if (!readProductsJSON || readProductsJSON.trim() === "") {
                console.log("JSON is empty");
                return 'JSON is empty';
            }
            // Convierto a formato array
            this.products = JSON.parse(readProductsJSON);
            // Busco por ID
            const foundProduct = this.products.find(product => product.id == id);
            if (foundProduct) {
                console.log(foundProduct)
                return foundProduct;
            } else {
                console.log("Not found");
                return 'Not found';
            }
        } catch (error) {
            console.log("(getProductById) Error reading or parsing JSON file: ", error.message);
        }
    }

    async updateProduct(id){
        const updateProduct = await this.getProductById(id);

        // verifico que el ID ingresado exista, caso contrario salgo del programa. 
        if (updateProduct === 'Not found') {
            console.log('Producto no encontrado.');
            return
        }

        console.log('Producto encontrado. Seleccione el campo que se desea modificar: \n',
              "1 - Titulo", '\n',
              "2 - Descripción", '\n',
              "3 - Precio", '\n',
              "4 - Imagen", '\n',
              "5 - Codigo", '\n',
              "6 - Stock", '\n'
          )

        const option = parseInt(prompt('Ingrese una option: '));

        switch (option) {
            case 1:
               updateProduct.title = prompt('Ingrese el nuevo titulo: ');
               break;
            case 2:
                updateProduct.description = prompt('Ingrese nueva descripción: ');
                break;
            case 3:
                updateProduct.price = parseInt(prompt('Ingrese nuevo precio: '));
                break;
            case 4:
                updateProduct.image = prompt('Ingrese nueva ruta de imagen: ');
                break;
            case 5:
                updateProduct.code = prompt('Ingrese nuevo código: ');
                break;
            case 6:
                updateProduct.stock = parseInt(prompt('Ingrese nuevo stock: '));
                break;
            default:
                console.log(`Opción no valida: ${option}.`)
                return 'Opción no valida';
        }

        console.log('Producto actualizado: ', updateProduct);

        this.products = await this.getProducts();

        // Con esta función busco el objeto por ID, obtengo su INDEX, compruebo que exista y con el INDEX puedo hacer el cambio.
        function replaceObjectById(array, IdObject, newObject) {
           let index = array.findIndex(object => object.id === IdObject);
           if(index !== -1) {
               array[index] = newObject;
               return array;
           }
        }

        replaceObjectById(this.products, id, updateProduct);
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));

        console.log('Nuevo Array ', this.products);

        }

        async deleteProduct(id) {
        const readProductsJSON = await fs.readFile(this.path, 'utf-8');

            // Compruebo que no este vacia la constante
            if (readProductsJSON.length > 0) {
                // Convierto a formato array
                this.products = JSON.parse(readProductsJSON);
            } else {
                console.log("JSON file is empty");
                return [];
            }

            function deleteProduct(array, idProduct) {
              return array.filter(object => object.id !== idProduct);
            }

            this.products = deleteProduct(this.products, id);
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
            console.log('Array sin producto ', this.products);
        }
}

// const producto = new ProductManager("./products.json");
export default ProductManager


// producto.addProduct('Romeo y Julieta', 'Tragedia romántica de William Shakespeare.', 4000, "url", "p001", 446);
// producto.addProduct("Hamlet", 'Tragedia de William Shakespeare sobre el príncipe de Dinamarca.', 7000, "url", "p002", 446);
// producto.addProduct("La Casa de Bernarda Alba", 'Tragedia de Federico García Lorca.', 2500, "url", "p003", 446);
// producto.addProduct("Esperando a Godot", 'Obra de teatro del escritor irlandés Samuel Beckett.', 4500, "url", "p004", 446);
// producto.addProduct("Don Juan Tenorio", 'Drama romántico de José Zorrilla.', 1000, "url", "p005", 446);
// producto.addProduct("La Celestina", 'Tragicomedia del siglo XV.', 1500, "url", "p006", 446);
// producto.addProduct("La vida es sueño", 'Obra de teatro de Calderón de la Barca.', 3000, "url", "p007", 446);
// producto.addProduct("La Casa de los Espíritus", 'Basada en la novela de Isabel Allende.', 3500, "url", "p008", 446);
// producto.addProduct("Fausto", 'Tragedia de Goethe.', 6500, "url", "p009", 446);
// producto.addProduct("Un tranvía llamado deseo", 'Obra de Tennessee Williams.', 4500, "url", "p0010", 446);



// Incorporo un producto que ya existe: 
//producto.addProduct("Un tranvía llamado deseo", 'Obra de Tennessee Williams.', 4500, "url", "p0010", 446);

// Obtengo todos los productos de products.json
//producto.getProducts()

// Obtengo un producto por su ID
//producto.getProductById(2)

// Modificar un value de un producto
//producto.updateProduct(5);

// Eliminación de un producto
//producto.deleteProduct(12);