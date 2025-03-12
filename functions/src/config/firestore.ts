import * as admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";

const serviceAccountPath = path.resolve(__dirname, "./serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    `❌ No se encontró el archivo de credenciales en: ${serviceAccountPath}`
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    projectId: "nexu-backend",
  });
}
if (process.env.NODE_ENV === "test") {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
}

export default admin;
