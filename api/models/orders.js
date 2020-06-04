const mongoose = require("mongoose");

/*
Order schema
Fields:
  product - id of one product, required;
  quantity - number, default value is 1;
*/
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
  quantity: {type: Number, default: 1}
});

module.exports = mongoose.model("Orders", orderSchema);
