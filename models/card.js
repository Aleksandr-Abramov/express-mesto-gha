const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Schema.Types;
const userScheme = require("./user");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 2,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
    ref: userScheme,
  },
  likes: {
    type: [{ type: ObjectId, ref: userScheme }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("card", cardSchema);
