import mongoose from "mongoose";

const { Schema } = mongoose;

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const TransactionSchema = new Schema(
  {
    userId: String,
    cost: String,
    name: String,
    products: {
      type: [Schema.Types.ObjectId],
      of: Number,
    },
    number: String,
    expmonth: String,
    expyear: String,
    cvc: String,
    createdAt: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 60 * 60 * 1000),
      get: (timestamp) => formatDate(new Date(timestamp.getTime())),
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
