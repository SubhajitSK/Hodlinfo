const mongoose = require("mongoose");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

const mongoUri = process.env.MONGO_URI;
const apiUrl = process.env.API_URL;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const tickerSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

const Ticker = mongoose.model("Ticker", tickerSchema);

const fetchAndStoreData = async () => {
  try {
    const response = await axios.get(apiUrl);
    const tickers = Object.values(response.data);

    const inrTickers = tickers.filter((ticker) => ticker.quote_unit === "inr");

    const top10Tickers = inrTickers
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);

    await Ticker.deleteMany({});
    await Ticker.insertMany(top10Tickers);

    console.log("Data fetched and stored successfully");
  } catch (error) {
    console.error("Error fetching and storing data:", error);
  }
};

fetchAndStoreData();

setInterval(fetchAndStoreData, 60000);

app.get("/api/tickers", async (req, res) => {
  try {
    const tickers = await Ticker.find({});
    if (!tickers) {
      res.status(404).json({ error: "No data found" });
    } else {
      console.log("Data retrieved successfully");
      res.json(tickers);
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
