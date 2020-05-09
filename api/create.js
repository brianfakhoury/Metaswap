const url = require("url");
const {MongoClient, ObjectID} = require("mongodb");

let cachedDb = null;

async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri, {useNewUrlParser: true});

    const db = await client.db(url.parse(uri).pathname.substr(1));

    cachedDb = db;
    return db;
}

module.exports = async (req, res) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const collection = await db.collection("items");

    const { title, imageURL, url } = req.body

    const newItem = {title: title, imageURL: imageURL, url: url}

    const item = await collection.insertOne(newItem)

    res.send(item.insertedId)
};
