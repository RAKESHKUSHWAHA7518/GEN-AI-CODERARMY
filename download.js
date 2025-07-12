// exportFirestore.js
const admin = require("firebase-admin");
const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

const serviceAccount = require("./nextvise-firebase-adminsdk-fbsvc-2e7ebc1053.json"); // 🔑 Download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Recursive function to get all data including subcollections
async function getAllCollectionsData(ref, path = "") {
  const data = {};

  const snapshot = await ref.get();
  for (const doc of snapshot.docs) {
    const docData = doc.data();
    const fullPath = path ? `${path}/${doc.id}` : doc.id;

    // Get subcollections recursively
    const subcollections = await doc.ref.listCollections();
    const subData = {};
    for (const sub of subcollections) {
      subData[sub.id] = await getAllCollectionsData(sub, `${fullPath}/${sub.id}`);
    }

    data[doc.id] = { ...docData, ...(Object.keys(subData).length ? { subcollections: subData } : {}) };
  }

  return data;
}

// Export entire Firestore DB
app.get("/export", async (req, res) => {
  try {
    const allData = {};
    const collections = await db.listCollections();

    for (const collection of collections) {
      allData[collection.id] = await getAllCollectionsData(collection);
    }

    const fileName = "firestore_backup.json";
    fs.writeFileSync(fileName, JSON.stringify(allData, null, 2));

    res.download(fileName, () => {
      fs.unlinkSync(fileName); // Clean up
    });
  } catch (err) {
    console.error("Error exporting Firestore:", err);
    res.status(500).send("Export failed");
  }
});

app.use("/", (req, res) => {
  res.send(`hrtgrtt`)
});

app.listen(PORT, () => {
  console.log(`🔥 Firestore export server running at http://localhost:${PORT}`);
});
