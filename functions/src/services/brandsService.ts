import admin from "../config/firestore";
import {Brand} from "../models/brands";
import {Model} from "../models/models";
import {logger} from "firebase-functions";
import {ErrorResponse} from "../models/response";

/**
 * Service class for brands.
 */
export class BrandsService {
  private db = admin.firestore();

  /**
   * Retrieves all brands from the database,
   *  ordered by their ID in ascending order.
   *
   * @return {Promise<Brand[] | ErrorResponse>} A promise that
   * resolves to an array of Brand objects.
   * @throws Will throw an error if
   * there is an issue retrieving the brands from the database.
   */
  async getAllBrandsService(): Promise<Brand[] | ErrorResponse> {
    try {
      const brandsSnapshot = await this.db
        .collection("brands")
        .orderBy("id", "asc")
        .get();

      // Calculate the average price of each brand
      const brands = await Promise.all(
        brandsSnapshot.docs.map(async (doc) => {
          const brandData = doc.data() as Brand;
          const modelsSnapshot = await this.db
            .collection("models")
            .where("brand_id", "==", brandData.id)
            .get();

          const models = modelsSnapshot.docs.map((modelDoc) => modelDoc.data());
          const totalModels = models.length;
          const totalPrice = models.reduce(
            (sum, model) => sum + (model.average_price || 0),
            0
          );
          const averagePrice =
            totalModels > 0 ? Math.floor(totalPrice / totalModels) : 0;

          return {...brandData, average_price: averagePrice};
        })
      );
      return brands;
    } catch (error) {
      logger.error("Error getting brands", error);
      return {
        errorCode: "BRANDS_GET_FAILED",
        errorMessage: "An error occurred while getting all the brands.",
        status: 500,
      };
    }
  }

  /**
   * Retrieves all models of a brand from the database.
   *
   * @param {number} brandId The ID of the brand to retrieve models for.
   * @return {Promise<Model[] | ErrorResponse>} A promise that
   * resolves to an array of Model objects.
   * @throws Will throw an error if
   * there is an issue retrieving the models of the brand from the database.
   */
  async getModelsOfBrandService(
    brandId: number
  ): Promise<Model[] | ErrorResponse> {
    try {
      const modelsSnapshot = await this.db
        .collection("models")
        .where("brand_id", "==", brandId)
        .orderBy("id", "asc")
        .get();
      return modelsSnapshot.docs.map((doc) => doc.data() as Model);
    } catch (error) {
      logger.error("Error getting models of brand", error);
      return {
        errorCode: "MODELBRANDS_GET_FAILED",
        errorMessage: "An error occurred while getting models of the brand.",
        status: 500,
      };
    }
  }

  /**
   * Creates a new brand in the database.
   *
   * @param {Brand} brand The brand to create.
   * @return {Promise<Brand | ErrorResponse>} A promise that
   * resolves to the created Brand object if successful,
   * or a string message if the brand already exists.
   * @throws Will throw an error if
   * there is an issue creating the brand in the database.
   */
  async createBrandService(brand: Brand): Promise<Brand | ErrorResponse> {
    try {
      const brandSnapshot = await this.db
        .collection("brands")
        .where("name", "==", brand.name)
        .get();

      // Check if brand already exists
      if (!brandSnapshot.empty) {
        return {
          errorCode: "BRAND_ALREADY_EXISTS",
          errorMessage: "A brand with this name already exists.",
          status: 400,
        };
      }

      const lastBrandSnapshot = await this.db
        .collection("brands")
        .orderBy("id", "desc")
        .limit(1)
        .get();

      const lastBrandId = lastBrandSnapshot.empty ? 0 :
        lastBrandSnapshot.docs[0].data().id;
      const newBrandId = lastBrandId + 1;

      const newBrand = {...brand, id: newBrandId};
      // Create the new brand
      await this.db
        .collection("brands")
        .doc(newBrandId.toString())
        .set(newBrand);

      return newBrand;
    } catch (error) {
      logger.error("Error creating brand", error);
      return {
        errorCode: "BRAND_CREATION_FAILED",
        errorMessage: "An error occurred while creating the brand.",
        status: 500,
      };
    }
  }

  /**
   * Creates a new model for a brand in the database.
   *
   * @param {Model} model The model to create.
   * @param {number} brandId The ID of the brand to create the model for.
   * @return {Promise<Model | ErrorResponse>} A promise that
   * resolves to the created Model object if successful,
   * or a string message if the model already exists.
   * @throws Will throw an error if
   * there is an issue creating the model in the database.
   */
  async createModelToBrandService(
    model: Model,
    brandId: number
  ): Promise<Model | ErrorResponse> {
    try {
      const modelSnapshot = await this.db
        .collection("models")
        .where("name", "==", model.name)
        .where("brand_id", "==", brandId)
        .get();

      // Check if model already exists
      if (!modelSnapshot.empty) {
        return {
          errorCode: "MODEL_ALREADY_EXISTS",
          errorMessage: "A Model with this name already exists.",
          status: 400,
        };
      }

      const lastModelSnapshot = await this.db
        .collection("models")
        .orderBy("id", "desc")
        .limit(1)
        .get();

      const lastModelId = lastModelSnapshot.empty ? 0 :
        lastModelSnapshot.docs[0].data().id;
      const newModelId = lastModelId + 1;

      const newModel = {
        ...model,
        id: newModelId,
        brand_id: brandId,
        average_price: model.average_price ?? 0,
      };
      // Create the new model
      await this.db
        .collection("models")
        .doc(newModelId.toString())
        .set(newModel);

      return newModel;
    } catch (error) {
      logger.error("Error creating model", error);
      return {
        errorCode: "MODEL_CREATION_FAILED",
        errorMessage: "An error occurred while creating the brand.",
        status: 500,
      };
    }
  }
}
