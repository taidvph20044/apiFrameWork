import Joi from "joi";
import Product from "../models/product";
import Category from "../models/category";

const productSchema = Joi.object({
    name: Joi.string().required(),
    audio: Joi.string().required(),
    image: Joi.string().required(),
    author: Joi.string().required(),
});

export const getAll = async function (req, res) {
    // products: 10, sort price, order desc, asc
    // GET /products?_sort=price&_order=asc&limit=10
    const { _sort = "createAt", _order = "asc", _limit = 5, _page = 1 } = req.query;

    const options = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _order == "desc" ? -1 : 1,
        },
    };

    try {
        const { docs, totalDocs, totalPages } = await Product.paginate({}, options);
        if (docs.length === 0) {
            return res.status(400).json({ message: "Không có sản phẩm nào" });
        }
        return res.status(200).json({ data: docs, totalDocs, totalPages });
    } catch (error) {
        return res.json({
            message: error.message,
        });
    }
};
export const remove = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        return res.json({ message: "Xóa thành công", product });
    } catch (error) {
        return res.json({
            message: error.message,
        });
    }
};
export const create = async (req, res) => {
    try {
        const body = req.body;
        const { error } = productSchema.validate(body);
        if (error) {
            const errors = error.details.map((errorItem) => errorItem.message);
            return res.status(400).json({
                message: errors,
            });
        }

        const product = await Product.create(body);
        await Category.findByIdAndUpdate(product.categoryId, {
            $addToSet: {
                products: product._id,
            },
        });
        if (!product) {
            return res.status(400).json({ message: "Thêm sản phẩm thất bại" });
        }
        return res.json({
            message: "Thêm sản phẩm thành công",
            product,
        });
    } catch (error) {
        return res.json({
            message: error.message,
        });
    }
};
export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const data = await Product.findOneAndUpdate({ _id: id }, body, { new: true });
        if (!data) {
            return res.status(400).json({ message: "Cập nhật thất bại" });
        }
        return res.json({
            message: "Cập nhật thành công",
            data,
        });
    } catch (error) {
        return res.json({
            message: error.message,
        });
    }
};
export const get = async function (req, res) {
    try {
        const data = await Product.findOne({ _id: req.params.id }).populate({
            path: "categoryId",
        });
        if (!data) {
            return res.status(400).json({ message: "Không có sản phẩm nào" });
        }
        return res.json(data);
    } catch (error) {
        return res.json({
            message: error.message,
        });
    }
};

// computed property name

// const myName = "sort";

// const myInfo = {
//     [myName] : "Dat"
// }

// console.log(myInfo.sort)
