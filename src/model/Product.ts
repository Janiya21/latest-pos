import mongoose from "mongoose";

interface IProduct extends Document {
  name: string;
  unitType: string;
  unitMarketValue: Number;
  purchaseQuantity: Number;
  unitPurchasePrice: Number;
  unitSellPrice: Number;
  createdAt?: Date;
  updatedAt?: Date;
  status: string;
}

const prodSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  unitType: {
    type: String,
  },
  unitMarketValue: {
    type: Number,
  },
  purchaseQuantity: {
    type: Number,
  },
  unitPurchasePrice: {
    type: Number,
  },
  unitSellPrice: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "removed"], 
    default: "active",
    required: true,
  }
},
  {
    timestamps: true,
    collection: "product",
  });

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", prodSchema);
export default Product;
