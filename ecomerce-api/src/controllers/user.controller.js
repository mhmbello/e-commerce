import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import createError from "http-errors";
import { createToken } from "../helpers/jsonwebtoken.js";
import { errorResponse, successResponse } from "./response.controller.js";
import { adminEmail, adminPassword, jwtSecret } from "../secret.js";
import jwt from "jsonwebtoken";
const handleRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await userModel.findOne({ email });
    if (existUser) {
      throw createError(400, "Email already used. Try another email ID");
    }

    //validating emal and password
    if (!validator.isEmail(email)) {
      throw createError(400, "Please inter a valid email");
    }

    if (!validator.isStrongPassword(password)) {
      throw createError(
        400,
        "Password must be 8char+ long with one uppercase ,lowercase and symbol"
      );
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
    });
    if (!user) {
      throw createError(404, "User not found");
    }

    //create token
    const token = createToken(user._id);
    if (!token) {
      throw createError(400, "Token not found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "User created successfully",
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existEmail = await userModel.findOne({ email });

    if (!existEmail) {
      throw createError(400, "Email not exist ,please register first");
    }

    const matchPassword = bcrypt.compare(password, existEmail.password);

    if (!matchPassword) {
      throw createError(400, "Password not match!");
    }

    const token = createToken(existEmail._id);

    return successResponse(res, {
      statusCode: 200,
      message: "User login successfully",
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

const handleAdminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(email + password, jwtSecret);

      return successResponse(res, {
        statusCode: 200,
        message: "Admin was login successfully",
        payload: token,
      });
    } else {
      errorResponse(res, {
        statusCode: 400,
        message: "Admin login failed",
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({}, "-password");

    // "-password" exclut le champ password pour plus de sécurité

    if (!users || users.length === 0) {
      throw createError(404, "No users found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Users fetched successfully",
      payload: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUsersWithOrderCount = async (req, res, next) => {
  try {
    const users = await userModel.aggregate([
      {
        $lookup: {
          from: "orders", // doit correspondre au nom exact de la collection
          let: { userId: { $toString: "$_id" } }, // convertir ObjectId en string
          pipeline: [
            { $match: { $expr: { $eq: ["$userId", "$$userId"] } } }
          ],
          as: "orders",
        },
      },
      {
        $addFields: {
          orderCount: { $size: "$orders" }, // nombre de commandes
        },
      },
      {
        $project: {
          password: 0, // ne pas exposer le mot de passe
          orders: 0,   // optionnel : ne pas renvoyer les détails des commandes
        },
      },
    ]);

    res.status(200).json({ success: true, payload: users });
  } catch (error) {
    next(error);
  }
};


// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message,
    });
  }
};

export { handleRegister, handleLogin, handleAdminLogin, getAllUsers, getUsersWithOrderCount };
