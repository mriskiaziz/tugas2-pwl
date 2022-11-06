// Schema
const mongoose = require("mongoose");
const product = mongoose.model("Product", {
  nama: {
    type: String,
    require: true,
  },
  harga: {
    type: String,
    require: true,
  },
  kategori: {
    type: String,
    require: true,
  },
});

module.exports = product;
