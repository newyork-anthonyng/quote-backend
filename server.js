const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const Quote = require("./models/Quote");

const mongoose = require("mongoose");
const MONGO_DB = process.env.MONGOD_URI || "mongodb://127.0.0.1/quote";
mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("connecting", () => console.log("Mongo connecting"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/heartbeat", (_, res) => {
  res.json({ ok: true });
});

app.post("/quote", async (req, res) => {
  const { text, author } = req.body;

  const newQuote = new Quote({ text, author });

  try {
    await newQuote.save();
    return res.json({
      ok: true,
      data: newQuote, // TODO: clean up
    });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ ok: false });
  }
});

app.get("/quote", (_, res) => {
  Quote.count().exec((err, count) => {
    const random = Math.floor(Math.random() * count);
    if (err) {
      console.error(err);
      return res.json({
        ok: false,
      });
    }

    Quote.findOne()
      .skip(random)
      .exec((err, result) => {
        if (err) {
          console.error(err);
          return res.json({
            ok: false,
          });
        }

        return res.json({
          ok: true,
          data: result, // TODO: clean up
        });
      });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
