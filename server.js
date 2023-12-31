let express = require("express");
let app = express();
let { MongoClient, ServerApiVersion, collection } = require("mongodb-legacy");
const uri =
  "mongodb+srv://sit725admin:sit725admin@cluster0.x84y69q.mongodb.net/?retryWrites=true&w=majority";
let port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: false,
  },
});

async function runDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    collection = client.db().collection("kitchen");
    //console.log(collection);

    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    //console.log(
    //  "Pinged your deployment. You successfully connected to MongoDB!"
    //);
  } catch (err) {
    console.error(err);
  }
  /*
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  */
}

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/api/kitchens", (req, res) => {
  getAllKitchens((err, result) => {
    if (!err) {
      res.json({
        statusCode: 200,
        data: result,
        message: "get all kitchen success",
      });
    }
  });
});

app.get("/api/kitchens", (req, res) => {
  getAllKitchens_Promise().then((result) => {
    console.log(result);
  });
});

app.post("/api/kitchen", (req, res) => {
  let kitchen = req.body;
  postKitchen(kitchen, (err, result) => {
    if (!err) {
      result.json({ statuscode: 201, data: result, message: "success" });
    }
  });
});

function postKitchen(kitchen, callback) {
  collection.insertOne(kitchen, callback);
}

function getAllKitchens(callback) {
  collection.find({}).toArray(callback);
}

/*
let getAllKitchens_Promise = () => {
  return new Promise((resolve, reject) => {
    getAllKitchens((err, result) => {
      if (!err) return resolve(result);
    });
  });
};

getAllKitchens_Promise().then((result) => {
  console.log(result);
});
*/

app.listen(port, () => {
  //console.log("server start");
  runDB();
});
