import {Request, Response} from "express";
import {editAveragePriceModelValidator} from "../validators/modelsValidator";
import {logger} from "firebase-functions";
import {ModelsService} from "../services/modelsService";


const modelsService = new ModelsService();

export const editAveragePriceModel = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).send({error: "Model ID is required"});
    }
    const validatedModel = await editAveragePriceModelValidator(req.body, res);
    if (!validatedModel) {
      return validatedModel;
    }

    const model = await modelsService.editAveragePriceModelService(
      parseInt(id),
      validatedModel
    );
    return res.status(200).send(model);
  } catch (error) {
    logger.error("Error editing average price of model", error);
    return res.status(500).send(error);
  }
};

export const getModels = async (req: Request, res: Response) => {
  try {
    const {greater, lower} = req.query;
    const modelsList = await modelsService.getAllModelsService(
      Number(greater),
      Number(lower)
    );
    return res.status(200).send(modelsList);
  } catch (error) {
    logger.error("Error getting models", error);
    return res.status(500).send(error);
  }
};
