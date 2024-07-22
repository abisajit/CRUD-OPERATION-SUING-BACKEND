import { MongoClient, ObjectId } from "mongodb";
import CONST from "../constant/meta.js";

export const getSampleUser = async (_, response) => {
  try {
    const cluster = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const database = cluster.db("sample_mflix");
    const collection = database.collection("users");
    const user = await collection.find({}).toArray();
    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ message: "DB connection failed", error });
  } finally {
    cluster.close();
  }
};

export const createVendor = async (request, response) => {
  const { body } = request;
  try {
    const cluster = await MongoClient.connect(process.env.MONGO_URL)
    const database = cluster.db(CONST.DATABASE);
    const collections = (await database.listCollections().toArray()).map(({ name }) => name);
    let collection;

    if (!collections.includes(CONST.COLLECTIONS.VENDOR)) {
      collection = await database.createCollection(CONST.COLLECTIONS.VENDOR);
    } else {
      collection = database.collection(CONST.COLLECTIONS.VENDOR);
    }

    await collection.insertOne(body);
    response.status(200).json({ message: "Vendor created successfully" });
  } catch (error) {
    response.status(500).json({ message: "DB connection failed", error });
  }
};

export const findVendor = async (_, response) => {
  try {
    const cluster = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const database = cluster.db(CONST.DATABASE);
    const collection = database.collection(CONST.COLLECTIONS.VENDOR);
    const dbData = await collection.find({}, { projection: { phoneNumber: 0 } }).toArray();
    response.status(200).json({ message: "Vendors retrieved successfully", data: dbData });
  } catch (error) {
    response.status(500).json({ message: "DB connection failed", error });
  }
};

export const updateVendor = async (request, response) => {
  const { params, body } = request;
  const { userId } = params;
  try {
    const cluster = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const database = cluster.db(CONST.DATABASE);
    const collection = database.collection(CONST.COLLECTIONS.VENDOR);
    await collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: body }
    );
    response.status(200).json({ message: "Vendor updated successfully" });
  } catch (error) {
    response.status(500).json({ message: "DB connection failed", error });
  }
};
