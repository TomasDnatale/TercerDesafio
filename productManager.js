const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  getProducts = async () => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
      return this.products;
    } catch (error) {
      return [];
    }
  };

  getProductById = async (id) => {
    try {
      await this.getProducts();
      const codeValue = this.products.findIndex((prod) => prod.id === id);
      if (codeValue >= 0) {
        return this.products[codeValue];
      }
    } catch (error) {
      console.log(error);
    }
  };

  addProduct = async (producto) => {
    try {
      await this.getProducts();
      console.log(this.products);
      if (
        !producto.title ||
        !producto.description ||
        !producto.price ||
        !producto.thumbnail ||
        !producto.stock ||
        !producto.code
      )
        return "Hay uno o mas elementos vacios";
      let codProd = this.products.find((prod) => prod.code === producto.code);
      if (codProd)
        return `Codigo repetido. Codigo ${producto.code} ya ha sidoutilizado.`;
      let prodId = 0;
      if (this.products.length === 0) {
        prodId = 1;
      } else {
        prodId = this.products[this.products.length - 1].id + 1;
      }
      this.products.push({ id: prodId, ...producto });
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, "utf-8", "\t")
      );
      console.log(producto);
      return `El producto ${producto.title} ha sido agregado`;
    } catch (error) {
      return error;
    }
  };

  updateProduct = async (id, prod) => {
    try {
      await this.getProducts();
      let producto = this.products.find((prod) => prod.id === id);
      if (!producto) return "No se encuentra el producto";
      producto.title = prod.title;
      producto.description = prod.description;
      producto.price = prod.price;
      producto.thumbnail = prod.thumbnail;
      producto.stock = prod.stock;
      producto.code = prod.code;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, "utf-8", "\t")
      );
      console.log(producto);
      return "Producto Actualizado";
    } catch (error) {
      return error;
    }
  };

  deleteProduct = async (idDelete) => {
    try {
      await this.getProducts();
      const remove = this.products.filter((prod) => prod.id !== idDelete);
      if (!remove) return "Id no encontrado";
      console.log(remove);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(remove, "utf-8", "\t")
      );
      await this.getProducts();
      return `Producto id ${idDelete} Eliminado`;
    } catch (error) {
      return error;
    }
  };
}

module.exports = {
  ProductManager,
};
