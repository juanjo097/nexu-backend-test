import admin from "../config/firestore";
import {Model} from "../models/models";
import {logger} from "firebase-functions";
import {ErrorResponse} from "../models/response";

/**
 * Service class for models.
 */
export class ModelsService {
  private db = admin.firestore();
  /**
   * Edits the average price of a model in the database.
   *
   * @param {number} modelId The ID of the model to edit.
   * @param {Model} model The model to edit.
   * @return {Promise<Model>} A promise that resolves to the edited model.
   * @throws Will throw an error if there is an
   * issue editing the average price of the model in the database.
   */
  async editAveragePriceModelService(
    modelId: number,
    model: Model
  ): Promise<Model | ErrorResponse> {
    try {
      const modelRef = this.db.collection("models").doc(modelId.toString());
      await modelRef.update({average_price: model.average_price});
      const updatedModel = await modelRef.get();
      return updatedModel.data() as Model;
    } catch (error) {
      logger.error("Error editing average price of model", error);
      return {
        errorCode: "MODEL_EDIT_FAILED",
        errorMessage: "An error occurred while edit the Model.",
        status: 500,
      };
    }
  }

  /**
   * Retrieves all models from the database.
   *
   * @param {number} greaterThan The lower bound for filtering models.
   * @param {number} lowerThan The upper bound for filtering models.
   * @return {Promise<Model[]>} A promise that resolves
   * to an array of Model objects.
   * @throws Will throw an error if there is an issue
   * retrieving the models from the database.
   */
  async getAllModelsService(
    greaterThan: number,
    lowerThan: number
  ): Promise<Model[] | ErrorResponse> {
    try {
      let query: FirebaseFirestore.Query = this.db
        .collection("models")
        .orderBy("id", "asc");

      if (!isNaN(greaterThan)) {
        query = query.where("average_price", ">", greaterThan);
      }

      if (!isNaN(lowerThan)) {
        query = query.where("average_price", "<", lowerThan);
      }

      const modelsSnapshot = await query.get();
      return modelsSnapshot.docs.map((doc) => doc.data() as Model);
    } catch (error) {
      logger.error("Error getting models", error);
      return {
        errorCode: "MODEL_GET_FAILED",
        errorMessage: "An error occurred while getting models filtered.",
        status: 500,
      };
    }
  }
}
