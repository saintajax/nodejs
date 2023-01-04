const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");

require("dotenv").config();

const routerApi = require("./api");

const app = express();

app.use(logger("dev")).use(cors()).use(express.json()).use("/api", routerApi);

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

mongoose.Promise = global.Promise;

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`)
  );
