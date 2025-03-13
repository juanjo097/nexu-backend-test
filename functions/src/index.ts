/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import express, {Request, Response} from "express";
import {brandsRoutes} from "./routes/brandsRoutes";
import {modelRoutes} from "./routes/modelsRoutes";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PATCH", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* load data from json file to firestore script as the test execute all the
  * app instance and the import script will be executed in the test environment
  * so we need to check if the environment is not test
  * to execute the import script
*/
if (process.env.NODE_ENV !== "test") {
  import("./config/importFirestore.js")
    .then(({importJsonToFirestore}) => importJsonToFirestore())
    .catch((err) => console.error("Error during Firestore data import", err));
}

// brands route definitions
app.get("/", (req : Request, res : Response) => {
  res.send("Welcome to the car brands API");
});
app.use("/brands", brandsRoutes);
app.use("/models", modelRoutes);


export const api = onRequest(app);

export default app;
