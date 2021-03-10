const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const QuoteModel = new mongoose.model("Quote", QuoteSchema);

module.exports = QuoteModel;
