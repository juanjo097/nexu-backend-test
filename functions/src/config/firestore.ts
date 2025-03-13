import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
} else {
  admin.app();
}
if (process.env.NODE_ENV === "test") {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  console.log("Connected to Firestore Emulator at localhost:8080");
}

export default admin;
