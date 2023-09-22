const express = require("express");
const app = express();
//const mongoose = require("mongoose");

require('dotenv').config()

app.use(express.json())

const connectDB = require('./connectMongo')

connectDB()

// import the model here
const ShortURL = require("./models/url");
const QRCode = require("qrcode");

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false })); // allow us the get something on back-end

app.get("/", async (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");
  const allData = await ShortURL.find(); //wait
  res.render("index", { baseUrl, shortUrls: allData });
});

app.post("/short", async (req, res) => {
  // Grab the fullUrl parameter from the req.body
  const url = req.body.fullUrl;

  const record = new ShortURL({
    full: url,
  });

  await record.save();

  // insert and wait for the recod to be inserted using the model
  res.redirect("/");
});

app.get("/:shortid", async (req, res) => {
  //grab the :shortid param
  const shortid = req.params.shortid;

  // perform the mongoose call to find the long URL
  const data = await ShortURL.findOne({ short: shortid });

  // if null, set status to 404 (res.sendStatus(404))
  if (!data) {
    return res.sendStatus(404);
  }

  // if not null, increment the click count in database
  data.clicks += 1;
  await data.save();

  // redirect the user to original link
  res.redirect(data.full);
});

// Route to generate QR code for a given URL
app.get("/qrcode/:shortid", async (req, res) => {
  const shortid = req.params.shortid;
  const baseUrl = req.protocol + "://" + req.get("host");

  try {
    const data = await ShortURL.findOne({ short: shortid });

    if (!data) {
      return res.sendStatus(404);
    }
    const qrLink = baseUrl + "/" + data.short;

    // Generate the QR code for the original URL
    QRCode.toDataURL(qrLink, (err, qrCodeDataUrl) => {
      if (err) {
        console.error("Error generating QR code:", err);
        res.sendStatus(500);
      } else {
        // Render the 'qrcode' template with the QR code data and original URL
        res.render("qrcode", {
          qrCodeUrl: qrCodeDataUrl,
          originalUrl: qrLink,
        });
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res.sendStatus(500);
  }
});

app.post("/delete/:shortid", async (req, res) => {
  const shortid = req.params.shortid;

  try {
    const data = await ShortURL.findOne({ short: shortid });

    if (!data) {
      return res.sendStatus(404);
    }

    // Mark the URL as deleted
    data.deleted = true;
    await data.save();

    res.redirect("/");
  } catch (err) {
    console.error("Error:", err);
    res.sendStatus(500);
  }
});
/*

const PORT = process.env.PORT

app.listen(8080, () => {
  console.log("Server is running on port 8080")
})