const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/product");

// const product1 = new product({
//   nama: "pasta gigi",
//   harga: "10000",
//   kategori: "alat mandi",
// });
// product1.save().then(() => console.log("add product success"));
