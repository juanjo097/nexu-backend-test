/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {importJsonToFirestore} from "./config/importFirestore";
import * as admin from "firebase-admin";
import express from "express";
import {brandsRoutes} from "./routes/brandsRoutes";
import {modelRoutes} from "./routes/modelsRoutes";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const app = express();

if (!admin.apps.length) {
  admin.initializeApp();
} else {
  admin.app();
}

// load data from json file to firestore script
importJsonToFirestore();


// brands route definitions
app.use("/brands", brandsRoutes);
app.use("/models", modelRoutes);


export const api = onRequest(app);

