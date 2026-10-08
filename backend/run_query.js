require("dotenv").config();
const { MongoClient } = require("mongodb");

async function main() {
  // Replace the placeholder with your connection string

  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("test");
    const collection = database.collection("media");

    const pipeline = [
      {
        $vectorSearch: {
          index: "autoembed_index",
          path: "fullplot",
          query: {
            text: "bird",
          },
          numCandidates: 100,
          limit: 10,
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          fullplot: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const cursor = collection.aggregate(pipeline);
    await cursor.forEach((doc) => console.log(doc));
  } finally {
    await client.close();
  }
}

main().catch(console.error);
