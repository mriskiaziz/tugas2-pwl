const express = require("express");

require("./utils/db");
const Product = require("./model/product");

const app = express();
const port = 3000;

const session = require("express-session");
const cookieparser = require("cookie-parser");
const flash = require("connect-flash");

app.use(cookieparser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.set("view engine", "ejs");

const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

app.use(express.urlencoded());

// Home Product
app.get("/", async (req, res) => {
  const product = await Product.find();

  res.render("home", {
    title: "Home",
    product,
  });
});

// Detail Product
app.get("/detail", async (req, res) => {
  const product = await Product.findOne({ _id: req.query.id });

  res.render("detail", {
    title: "Detail Product",
    product,
  });
});

// Tambah Product
app.get("/add", async (req, res) => {
  res.render("add", {
    title: "Tambah Product",
  });
});
app.post(
  "/product",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Product.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Nama Product Sudah Ada di database");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      Product.insertMany(req.body, (error, result) => {
        req.flash("msg", "Data Berhasil Ditambahkan");
        res.redirect("/");
      });
    }
  }
);

// Hapus Product
app.get("/delete", async (req, res) => {
  const product = await Product.findOne({ _id: req.query.id });

  if (!product) {
    res.status(404);
    res.send(product);
  } else {
    Product.deleteOne({ _id: product._id }).then((result) => {
      req.flash("msg", "Data Berhasil Dihapus");
      res.redirect("/");
    });
  }
});

// Update
app.get("/edit", async (req, res) => {
  const product = await Product.findOne({ _id: req.query.id });

  res.render("edit", {
    title: "Edit Product",
    product,
  });
});
app.post(
  "/product-edit",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Product.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Nama Product Sudah Ada di database");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      Product.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            harga: req.body.harga,
            kategori: req.body.kategori,
          },
        }
      ).then(() => {
        req.flash("msg", "Data Berhasil Dihapus");
        res.redirect("/");
      });
    }
  }
);

// running app
app.listen(port, () => {
  console.log(`Open App in http://localhost:${port}`);
});
