import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
} else {
  admin.app();
}

export default admin;
