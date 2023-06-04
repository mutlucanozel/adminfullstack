import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      trim: true,
      required: true,
      min: 5,
    },
    city: String,
    state: String,
    country: String,
    occupation: String,
    cusid:String,
    phoneNumber: String,
    transactions: Array,
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
  
  },
  { timestamps: true }

);

const User = mongoose.model("User", UserSchema);
export default User;