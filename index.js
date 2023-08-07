import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import routerError from "./api/routers/routersError.js";

dotenv.config();

const app = express();
// eslint-disable-next-line
const port = process.env.PORT;

(async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    next();
  });

  //! Error Middlewere
  app.use(routerError);
  // eslint-disable-next-line
  app.use(async (error, req, res, next) => {
    let pesan;
    let status;
    if (error.statusCode === 500) {
      status = error.statusCode;
      pesan = "server bermasalah / Endpoint tidak ditemukan";
      return res
        .status(status)
        .json({ error: { pesan: `${pesan + " " + status}` } });
    }

    status = error.statusCode || 401;
    pesan = error.message;
    await res
      .status(status)
      .json({ error: { pesan: `${pesan + " " + status}` } });
  });

  const connectDB = async () => {
    try {
      // eslint-disable-next-line
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
      console.log(err);
      /* eslint-disable */
      process.exit(1);
    }
  };

  connectDB().then(() => {
    app.listen(port, () => {
      console.log("listening for requests", `konek`);
    });
  });
})();
