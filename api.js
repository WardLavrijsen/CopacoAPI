"use strict";

const express = require("express");
const app = express();
app.use(express.json());

const icecat = require("icecat");
const icecatClient = new icecat("CopacoXML", "1T7vybJ");

const Product = require("./productmodel");

const keys = ["a69880a7-ccc6-458a-8d6e-caa4ca0970b3"];

const fs = require("fs");

const sendCopacoStatusEmail = require("./email");

const throwError = (res, sta, err) => {
  return res.status(sta).json({
    status: "error",
    message: err,
  });
};

const protect = function (req, res, next) {
  if (!req.headers.authorization)
    return throwError(res, 401, "no authorization header");
  if (!keys.includes(req.headers.authorization))
    return throwError(res, 401, "no auth");
  next();
};

app.use(protect);

app.post("/getproduct", async (req, res) => {
  try {
    if (!req.body.lang) return throwError(res, 400, "No lang");
    if (req.body.id && req.body.id > 0) {
      icecatClient.openCatalog
        .getProductById(req.body.lang, req.body.id)
        .then(function (productIceCat) {
          if (productIceCat.productData.$.Code == "-1") {
            console.log(productIceCat.productData.$.ErrorMessage);
            return throwError(res, 400, "ICECAT ID ERROR");
          }
          res.status(200).json({
            message: "ok",
            product: productIceCat.productData,
            specs: productIceCat.getSpecifications(),
          });
        });
    } else if (req.body.ean && req.body.ean > 0) {
      icecatClient.openCatalog
        .getProduct(req.body.lang, req.body.ean)
        .then(function (productIceCat) {
          if (productIceCat.productData.$.Code == "-1") {
            console.log(productIceCat.productData.$.ErrorMessage);
            return throwError(res, 400, "ICECAT EAN ERROR");
          }
          res.status(200).json({
            message: "ok",
            product: productIceCat.productData,
            specs: productIceCat.getSpecifications(),
          });
        });
    } else {
      return throwError(res, 400, "no id or ean");
    }
  } catch (err) {
    return throwError(res, 400, err);
  }
});

app.get("/export", async (req, res) => {
  try {
    const amount = await Product.count({});

    for (let i = 0; i < amount; i += 1000) {
      const data = await Product.find({}, null, { skip: i, limit: 1000 });
      let outputData = JSON.stringify(data);
      fs.writeFileSync(`export/output-${i / 1000}.json`, outputData);
      console.log(i + 1000);
    }

    res.status(200).json({
      message: "ok",
      response: amount,
    });
  } catch (error) {
    return throwError(res, 400, error);
  }
});

app.post("/sendmail", async (req, res) => {
  try {
    if (!(req.body.emails && req.body.message))
      return throwError(res, 400, "no email or message");
    await sendCopacoStatusEmail({
      emails: req.body.emails,
      message: req.body.message,
    });
    res.send("email send");
  } catch (err) {
    return throwError(res, 400, err);
  }
});

app.listen(8082, () => console.log(`Api listening on port 8082!`));
