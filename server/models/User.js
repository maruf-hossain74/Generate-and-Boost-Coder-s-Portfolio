const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    codefolioId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    badges: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    providerId: {
      type: String,
      default: "",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  if (!this.codefolioId && this.email) {
    this.codefolioId = this.email.split("@")[0];
  }
});

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
