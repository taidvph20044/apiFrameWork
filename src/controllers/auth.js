import User from "../models/user";
import { signinSchema, signupSchema } from "../schemas/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const { error } = signupSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => err.message);
            // ['Trường tên là bắt buộc', 'Email không đúng định dạng']
            return res.status(400).json({
                messsages: errors,
            });
        }
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(400).json({
                message: "Email đã tồn tại",
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        const accessToken = jwt.sign({ _id: user._id }, "banThayDat", { expiresIn: "1d" });

        return res.status(201).json({
            message: "Đăng ký tk thành công",
            accessToken,
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

// B1: Validate object từ client gửi lên(name, email, password, confirmPassword)
// B2: Kiểm tra email đã tồn tại chưa(Nếu mà có rồi thì trả về lỗi: Email đã tồn tại)
// B3: Mã hóa mật khẩu
// B4: Tạo user mới
// B5: Tạo token
// B6: Trả về token và user
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = signinSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                messages: errors,
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Bạn chưa đăng ký tài khoản",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu không đúng",
            });
        }

        const accessToken = jwt.sign({ _id: user._id }, "banThayDat", { expiresIn: "1d" });

        return res.status(201).json({
            message: "Đăng ký tk thành công",
            accessToken,
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

export const get = async function (req, res) {
    // products: 10, sort price, order desc, asc
    // GET /products?_sort=price&_order=asc&limit=10

    try {
       
      
        return res.status(200).json({ data});
    } catch (error) {
        return res.json({
            message: error.message,
        });
    }
};
// B1: Validate object từ client gửi lên(email, password)
// B2: Kiểm tra email đã tồn tại chưa (Nếu không có thì trả về lỗi: Bạn chưa đăng ký tài khoản)
// B3: So sánh giá trị(password) từ client nó giống với password ở db không?
// B4: Tạo token
// B5: Trả về token và user

// Nhìn
// Hiểu
// ---- Giải thích từng bước 1
// Nhớ
// Code lại
// Repeat
