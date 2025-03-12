import {Router} from "express";
import {
  createBrand,
  createModelToBrand,
  getBrands,
  getModelOfBrand,
} from "../controllers/brandsController";

// eslint-disable-next-line new-cap
const router = Router();

router.get("/", getBrands);
router.post("/", createBrand);
router.get("/:id/models", getModelOfBrand);
router.post("/:id/models", createModelToBrand);

export {router as brandsRoutes};
