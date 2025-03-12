import {Request, Response} from "express";
import {BrandsService} from "../services/brandsService";
import {logger} from "firebase-functions";
import {
  createBrandValidator,
  createModelToBrandValidator,
} from "../validators/brandsValidator";

const brandsService = new BrandsService();

/**
 * Retrieves all brands from the database.
 *
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @return {Promise<Response>} A promise that resolves to the response object.
 */
export const getBrands = async (req: Request, res: Response) => {
  try {
    const brandsList = await brandsService.getAllBrandsService();
    return res.status(200).send(brandsList);
  } catch (error) {
    logger.error("Error getting brands", error);
    return res.status(500).send(error);
  }
};

/**
 * Retrieves all models of a brand from the database.
 *
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @return {Promise<Response>} A promise that resolves to the response object.
 */
export const getModelOfBrand = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).send({error: "Brand ID is required"});
    }
    const modelsList = await brandsService.getModelsOfBrandService(
      parseInt(id)
    );
    return res.status(200).send(modelsList);
  } catch (error) {
    logger.error("Error getting models of brand", error);
    return res.status(500).send(error);
  }
};

/**
 * Creates a new brand in the database.
 *
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @return {Promise<Response>} A promise that resolves to the response object.
 */
export const createBrand = async (req: Request, res: Response) => {
  try {
    const validatedBrand = await createBrandValidator(req.body, res);
    if (!validatedBrand) return;

    const newBrand = await brandsService.createBrandService(validatedBrand);
    return res.status(201).send(newBrand);
  } catch (error) {
    logger.error("Error creating brand", error);
    return res.status(500).send(error);
  }
};

/**
 * Creates a new model for a brand in the database.
 *
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @return {Promise<Response>} A promise that resolves to the response object.
 */
export const createModelToBrand = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).send({error: "Brand ID is required"});
    }
    const validatedModel = await createModelToBrandValidator(req.body, res);
    if (!validatedModel) return;
    const newModel = await brandsService.createModelToBrandService(
      validatedModel,
      parseInt(id)
    );
    return res.status(201).send(newModel);
  } catch (error) {
    logger.error("Error creating model", error);
    return res.status(500).send(error);
  }
};
