import * as fs from "fs";
import * as admin from "firebase-admin";
import {Model} from "../models/models";
import {Brand} from "../models/brands";
import {InitialModel} from "../models/initial-models";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Import the models data from models.json to Firestore collections
 */
export async function importJsonToFirestore() {
  try {
    console.log("Starting models.json data import to collections...");

    // Check if there are already data in the 'models' and 'brands' collections
    const modelsSnapshot = await db.collection("models").get();
    const brandsSnapshot = await db.collection("brands").get();

    // If the collections already contain documents, do nothing
    if (modelsSnapshot.empty || brandsSnapshot.empty) {
      // Read the models file
      const modelsData = JSON.parse(fs.readFileSync("models.json", "utf8"));

      // Create a dictionary to store brand names and their corresponding IDs
      const brandDict: Record<string, number> = {};
      let brandIdCounter = 1;

      // Map through the models data to update each model with a brand ID
      const updatedModels = modelsData.map((car: InitialModel) => {
        // Assign a new brand ID if the brand
        //  name is not already in the dictionary
        if (!brandDict[car.brand_name]) {
          brandDict[car.brand_name] = brandIdCounter++;
        }

        // Return the updated model with the brand ID
        return {
          id: car.id,
          name: car.name,
          average_price: car.average_price,
          brand_id: brandDict[car.brand_name],
        };
      });

      // Create a dictionary to store brand IDs
      // and their corresponding average prices
      const brandPrices: Record<number, number[]> = {};

      // Populate the brandPrices dictionary
      // with the average prices of each model
      updatedModels.forEach((model: Model) => {
        if (model.brand_id !== undefined && !brandPrices[model.brand_id]) {
          brandPrices[model.brand_id] = [];
        }
        if (model.brand_id !== undefined) {
          brandPrices[model.brand_id].push(model.average_price);
        }
      });

      // Create a list of brands with their average prices
      const brandsList = Object.entries(brandDict).map(([name, id]) => {
        const prices = brandPrices[id] || [];
        return {
          id: id,
          name: name,
          average_price: prices.length ?
            Math.floor(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
        };
      });

      // Save to Firestore and collections 'models' and 'brands'
      const batch = db.batch();

      updatedModels.forEach((model: Model) => {
        if (model.id !== undefined) {
          const docRef = db.collection("models").doc(model.id.toString());
          batch.set(docRef, model);
        }
      });

      brandsList.forEach((brand: Brand) => {
        if (brand.id !== undefined) {
          const docRef = db.collection("brands").doc(brand.id.toString());
          batch.set(docRef, brand);
        }
      });

      await batch.commit();
      console.log("Data successfully imported to Firestore.");
    } else {
      console.log("Data has already been initialized. Import is not executed.");
      return;
    }
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}
