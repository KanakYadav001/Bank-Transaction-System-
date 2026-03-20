const mongo = require("mongoose");

const bcrypt = require("bcryptjs");
const UserSchema = new mongo.Schema(
  {
    email: {
      type: String,
      required: [true, "Email Is Required For Register"],
      trim: true,
      match: [/^[^@]*amy[^@]*@[^@]+$/, "Invalid Email Format"],
      unique: [true, "Email Must be Unique"],
    },
    username: {
      type: String,
      required: [true, "Name Is Required For Register"],
    },
    password: {
      type: String,
      required: [true, "Password Is Required For Register"],
      minlength: [6, "Min Length is 6 Letters"],
      select: false,
    },
    systemUser: {
      type: Boolean,
      default: false,
      immutable: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;

  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongo.model("user", UserSchema);

module.exports = UserModel;
