require("dotenv").config();
const { MongoClient } = require("mongodb");
const { setTimeout } = require("timers/promises");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("test");
    const collection = database.collection("media");

    console.log("Database:", database.databaseName);
    console.log("Collection:", collection.collectionName);
    console.log("Document count:", await collection.countDocuments());

    await collection.updateMany({}, [
      {
        $set: {
          searchText: {
            $concat: [
              { $ifNull: ["$title", ""] },
              " ",
              {
                $reduce: {
                  input: { $ifNull: ["$tags", []] },
                  initialValue: "",
                  in: {
                    $concat: ["$$value", " ", "$$this"],
                  },
                },
              },
            ],
          },
        },
      },
    ]);

    console.log("Updated searchText fields.");
    console.log("Sample document:", await collection.findOne());

    const index = {
      name: "autoembed_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "autoEmbed",
            modality: "text",
            path: "searchText",
            model: "voyage-4",
          },
        ],
      },
    };

    const indexes = await collection.listSearchIndexes().toArray();
    const existingIndex = indexes.find((item) => item.name === index.name);

    if (existingIndex) {
      console.log("Existing index definition:");
      console.dir(existingIndex.latestDefinition, { depth: null });

      const existingFields = existingIndex.latestDefinition?.fields ?? [];

      const isCorrect = existingFields.some(
        (field) => field.path === "searchText" && field.type === "autoEmbed",
      );

      if (!isCorrect) {
        console.log(
          "The existing index uses a different field. Delete autoembed_index in Atlas, then run this script again.",
        );
        return;
      }

      console.log("Index already uses searchText.");
    } else {
      const result = await collection.createSearchIndex(index);
      console.log(`Created index: ${result}`);
    }

    console.log("Checking index status...");

    while (true) {
      const [indexData] = await collection
        .listSearchIndexes(index.name)
        .toArray();

      if (indexData?.queryable) {
        console.log("Index is ready for querying.");
        break;
      }

      console.log("Index is still building. Checking again in 5 seconds...");
      await setTimeout(5000);
    }
  } finally {
    await client.close();
  }
}

run().catch(console.error);
