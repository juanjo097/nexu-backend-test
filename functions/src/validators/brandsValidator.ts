import {Response} from "express";
import {Brand} from "../models/brands";
import {Model} from "../models/models";

/**
 * Validates the brand object for creating a new brand.
 *
 * @param {Brand} brand The brand object to validate.
 * @param {Response} res The response object.
 * @return {Promise<Brand | void>} A promise
 * that resolves to the validated Brand object,
 * or void if the brand object is invalid.
 */
export const createBrandValidator = async (
  brand: Brand,
  res: Response
): Promise<Brand | void> => {
  if (!brand) {
    res.status(400).send({error: "Brand object is required"});
    return;
  }
  if (!brand.name) {
    res.status(400).send({error: "Brand name is required"});
    return;
  }
  return brand;
};

/**
 * Validates the model object for creating a new model for a brand.
 *
 * @param {Model} model The model object to validate.
 * @param {Response} res The response object.
 * @return {Promise<Model | void>} A promise
 * that resolves to the validated Model object,
 * or void if the model object is invalid.
 */
export const createModelToBrandValidator = async (
  model: Model,
  res: Response
): Promise<Model | void> => {
  if (!model) {
    res.status(400).send({error: "Model object is required"});
    return;
  }
  if (!model.name) {
    res.status(400).send({error: "Model name is required"});
    return;
  }
  if (model.average_price !== undefined) {
    if (isNaN(model.average_price)) {
      res.status(400).send({error: "Average price should be a number"});
      return;
    }
    if (model.average_price < 100000) {
      res
        .status(400)
        .send({error: "Average price should be greater than 100,000"});
      return;
    }
  }
  return model;
};
