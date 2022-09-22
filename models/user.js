const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
    minlength: 2,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    maxlength: 30,
    minlength: 2,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator: function isValidAvatar(v) {
        return /https?:\/\/(w{3})?[a-z0-9-]+\.[a-z0-9\S]{2,}/gi.test(v);
      },
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator(data) {
        if (isEmail(data)) {
          return true;
        }
        return false;
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model("user", userSchema);
