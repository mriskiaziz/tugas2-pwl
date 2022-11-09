const express = require("express");

const bodyparse = require("body-parser");

require("./utils/db");
const Product = require("./model/product");

const app = express();
const port = 3000;

app.use(bodyparse.json());

// Home Product
app.get("/", async (req, res) => {
  const product = await Product.find();

  res.json({
    title: "Home",
    product: product,
  });
});

// Detail Product
app.get("/detail", async (req, res) => {
  const product = await Product.findOne({ nama: req.body.nama });

  res.json({
    title: "Detail Product",
    product: product,
  });
});

// Tambah Product
app.post("/add", async (req, res) => {
  const duplikat = await Product.findOne({ nama: req.body.nama });

  if (duplikat) {
    res.send("Data Duplikat");
  } else {
    const product = new Product({
      nama: req.body.nama,
      harga: req.body.harga,
      kategori: req.body.kategori,
    });
    const save = await product.save().then((e) => {
      res.json({
        product: e,
        status: "Berhasil Menambah Data",
      });
    });
  }
});

// Delete Product
app.delete("/delete", async (req, res) => {
  const find = await Product.findOne({ nama: req.body.nama });

  if (find) {
    Product.deleteOne({ nama: req.body.nama }).then((result) => {
      res.json({
        result: result,
        status: "Berhasil Menghapus Data",
      });
    });
  } else {
    res.send("Data dengan nama tersebut Tidak Ada di database");
  }
});

// Update Product
app.put("/update", async (req, res) => {
  const find = await Product.findOne({ nama: req.body.namaLama });

  if (find) {
    const namaBaru = req.body.namaBaru ? req.body.namaBaru : find.nama;
    const hargaBaru = req.body.hargaBaru ? req.body.hargaBaru : find.harga;
    const kategoriBaru = req.body.kategoriBaru
      ? req.body.kategoriBaru
      : find.kategori;

    Product.updateOne(
      { _id: find._id },
      {
        $set: {
          nama: namaBaru,
          harga: hargaBaru,
          kategori: kategoriBaru,
        },
      }
    ).then((result) => {
      res.json({
        result: result,
        status: "Berhasil Mengupdate Data",
      });
    });
  } else {
    res.send("Data dengan namaLama tersebut Tidak Ada di database");
  }
});

// running app
app.listen(port, () => {
  console.log(`Open App in http://localhost:${port}`);
});
