"use strict";

const mongoose = require("mongoose");
mongoose.connect("mongodb://kRpzUanaoL:YiiG4tHAf3@20.61.20.19:27017/copaco");
const { Schema } = mongoose;

const LanguageTitle = new Schema({
  "xml:lang": String,
  $t: String,
});

const CategorySchema = new Schema({
  name: String,
  domain: String,
  default: String,
  hotdeal: String,
});

const ManufacturerSchema = new Schema({
  "manufacturer-name": String,
  "manufacturer-sku": String,
});

const AttributeSchema = new Schema({
  "dt:dt": String,
  name: String,
  $t: String,
});

const SpecificationsT = new Schema({
  name: String,
  presentationValue: String,
  value: String,
  specId: String,
  specGroupId: String,
});

const SpecificationsSchema = new Schema({
  "xml:lang": String,
  $t: [SpecificationsT],
});

const copacoSchema = new Schema({
  sku: [String],
  name: [LanguageTitle],
  "short-description": [LanguageTitle],
  "long-description": [LanguageTitle],
  available: String,
  online: String,
  "tax-class": {
    id: { type: String },
  },
  "category-links": {
    "category-link": { type: [CategorySchema] },
  },
  manufacturer: {
    "manufacturer-name": { type: String },
    "manufacturer-sku": { type: String },
  },
  "custom-attributes": {
    "custom-attribute": { type: [AttributeSchema] },
  },
  specifications: [SpecificationsSchema],
  images: {
    H: { type: String },
    M: { type: String },
    L: { type: String },
  },
});

const Product = mongoose.model("Product", copacoSchema);

module.exports = Product;
