const mongoose = require("mongoose");

/*
Product schema
Fields:
  name - string, required;
  price - number, required;
  productImage - string which is holding the url to the image file
*/
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: {type: String, required: true}
});

module.exports = mongoose.model("Product", productSchema);
