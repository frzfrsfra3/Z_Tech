import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
async function createIndexes() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db();
        const collection = db.collection("users");
        await collection.createIndex({ email: 1 }, { unique: true });
        console.log("✅ Created unique index on email field");
        await collection.createIndex({ createdAt: 1 });
        console.log("✅ Created index on createdAt field");
    }
    catch (err) {
        console.error("❌ Error creating indexes:", err);
    }
    finally {
        await client.close();
    }
}
createIndexes();
