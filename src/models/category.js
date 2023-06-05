import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: String,
        products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("category", categorySchema);