import {Response} from "express";
import {Model} from "../models/models";


/**
 * Validates the model object for editing the average price of a model.
 *
 * @param {Model} model The model object to validate.
 * @param {Response} res The response object.
 * @return {Promise<Model | void>} A promise
 * that resolves to the validated Model object,
 * or void if the model object is invalid.
 */
export const editAveragePriceModelValidator = async (
  model: Model,
  res: Response
): Promise<Model | void> => {
  if (!model.average_price) {
    res.status(400).send({error: "Average price is required"});
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
