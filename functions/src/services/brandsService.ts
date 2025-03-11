import * as admin from "firebase-admin";
import {Brand} from "../models/brands";
import {Model} from "../models/models";
import {logger} from "firebase-functions";

/**
 * Service class for brands.
 */
export class BrandsService {
  private db: FirebaseFirestore.Firestore;

  /**
   * Constructs a new instance of the BrandsService class.
   * Initializes the Firestore database connection.
   */
  constructor() {
    this.db = admin.firestore();
  }

  /**
   * Retrieves all brands from the database,
   *  ordered by their ID in ascending order.
   *
   * @return {Promise<Brand[]>} A promise that
   * resolves to an array of Brand objects.
   * @throws Will throw an error if
   * there is an issue retrieving the brands from the database.
   */
  async getAllBrandsService(): Promise<Brand[]> {
    try {
      const brandsSnapshot = await this.db
        .collection("brands")
        .orderBy("id", "asc")
        .get();
      return brandsSnapshot.docs.map((doc) => doc.data() as Brand);
    } catch (error) {
      logger.error("Error getting brands", error);
      throw error;
    }
  }

  /**
   * Retrieves all models of a brand from the database.
   *
   * @param {number} brandId The ID of the brand to retrieve models for.
   * @return {Promise<Model[]>} A promise that
   * resolves to an array of Model objects.
   * @throws Will throw an error if
   * there is an issue retrieving the models of the brand from the database.
   */
  async getModelsOfBrandService(brandId: number): Promise<Model[]> {
    try {
      const modelsSnapshot = await this.db
        .collection("models")
        .where("brand_id", "==", brandId)
        .orderBy("id", "asc")
        .get();
      return modelsSnapshot.docs.map((doc) => doc.data() as Model);
    } catch (error) {
      logger.error("Error getting models of brand", error);
      throw error;
    }
  }

  /**
   * Creates a new brand in the database.
   *
   * @param {Brand} brand The brand to create.
   * @return {Promise<Brand | string>} A promise that
   * resolves to the created Brand object if successful,
   * or a string message if the brand already exists.
   * @throws Will throw an error if
   * there is an issue creating the brand in the database.
   */
  async createBrandService(brand: Brand): Promise<Brand | string> {
    try {
      const brandSnapshot = await this.db
        .collection("brands")
        .where("name", "==", brand.name)
        .get();

      // Check if brand already exists
      if (!brandSnapshot.empty) {
        return "Brand already exists";
      }

      const lastBrandSnapshot = await this.db
        .collection("brands")
        .orderBy("id", "desc")
        .limit(1)
        .get();

      const lastBrandId = lastBrandSnapshot.empty ?
        0 : lastBrandSnapshot.docs[0].data().id;
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
      throw error;
    }
  }

  /**
   * Creates a new model for a brand in the database.
   *
   * @param {Model} model The model to create.
   * @param {number} brandId The ID of the brand to create the model for.
   * @return {Promise<Model | string>} A promise that
   * resolves to the created Model object if successful,
   * or a string message if the model already exists.
   * @throws Will throw an error if
   * there is an issue creating the model in the database.
   */
  async createModelToBrandService(
    model: Model,
    brandId: number
  ): Promise<Model | string> {
    try {
      const modelSnapshot = await this.db
        .collection("models")
        .where("name", "==", model.name)
        .where("brand_id", "==", brandId)
        .get();

      // Check if model already exists
      if (!modelSnapshot.empty) {
        return "Model already exists";
      }

      const lastModelSnapshot = await this.db
        .collection("models")
        .orderBy("id", "desc")
        .limit(1)
        .get();

      const lastModelId = lastModelSnapshot.empty ?
        0 : lastModelSnapshot.docs[0].data().id;
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
      throw error;
    }
  }
}
