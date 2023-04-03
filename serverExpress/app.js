const { ProductManager } = require("../productManager");
const path = "../archivos/productos.json";
const manager = new ProductManager(path);

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  try {
    let { limit } = req.query;
    let data = await manager.getProducts();
    if (limit === undefined)
      return res.status(200).send({
        status: "success",
        data: data,
      });
    if ((!parseInt(limit) && parseInt(limit) !== 0) || parseInt(limit) < 0) {
      return res
        .status(400)
        .send({ status: "ERROR", error: "limit debe ser un numero positivo" });
    }
    return res.status(200).send({
      status: "success",
      data: data.slice(0, limit > data.length ? data.length : limit),
    });
  } catch (error) {
    res.status(500).send({
      status: "ERROR",
      error: "Ha ocurrido un error al obtener los productos",
    });
    return error;
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    if (!parseInt(pid) && parseInt(pid) !== 0)
      return res.status(400).send({
        status: "ERROR",
        error: "Product id debe ser un numero",
      });
    let producto = await manager.getProductById(parseInt(pid));
    if (!producto)
      return res.status(404).send({ status: "ERROR", error: "Not found" });
    return res.status(200).send({
      status: "success",
      data: producto,
    });
  } catch (error) {
    res.status(500).send({
      status: "ERROR",
      error: "Ha ocurrido un error al obtener el producto",
    });
    return error;
  }
});

app.listen(8080, () => {
  console.log("Escuchando puerto 8080");
});
