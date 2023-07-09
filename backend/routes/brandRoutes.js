import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { brandControlller, createBrandController, deleteBrandCOntroller, singleBrandController, updateBrandController } from "../controllers/brandController.js";



const router = express.Router();

//routes
// create category
router.post(
  "/create-brand",
  requireSignIn,
  isAdmin,
  createBrandController
);

//update category
router.put(
  "/update-brand/:id",
  requireSignIn,
  isAdmin,
  updateBrandController
);

//getALl category
router.get("/get-brand", brandControlller);

//single category
router.get("/single-brand/:slug", singleBrandController);

//delete category
router.delete(
  "/delete-brand/:id",
  requireSignIn,
  isAdmin,
  deleteBrandCOntroller
);

export default router;