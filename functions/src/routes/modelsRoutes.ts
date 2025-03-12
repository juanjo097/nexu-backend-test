import {Router} from "express";
import {
  editAveragePriceModel,
  getModels,
} from "../controllers/modelsControllers";


// eslint-disable-next-line new-cap
const router = Router();

router.get("/", getModels);
router.put("/:id", editAveragePriceModel);

export {router as modelRoutes};
