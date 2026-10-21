require("dotenv").config();
const { MongoClient } = require("mongodb");

async function main() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is missing from your .env file");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db("test");
    const collection = database.collection("media");

    console.log("Total documents:", await collection.countDocuments());

    const pipeline = [
      {
        $vectorSearch: {
          index: "autoembed_index",
          path: "searchText",
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
          tags: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const results = await collection.aggregate(pipeline).toArray();

    console.log("Number of results:", results.length);
    console.dir(results, { depth: null });
  } finally {
    await client.close();
  }
}

main().catch(console.error);
