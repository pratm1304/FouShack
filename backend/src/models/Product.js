import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        imageUrl: { type: String, required: true }
    },
    {timestamps: true}
);

const Product = mongoose.model("Product", productSchema);

export default Product;