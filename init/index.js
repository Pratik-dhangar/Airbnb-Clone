const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require('../models/listing.js');

// copy from app.js to etsablish connection with database
const MONGO_URL = "mongodb://127.0.0.1:27017/bhatktiAtma";

main().then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

async function main() { 
    await mongoose.connect(MONGO_URL);
};

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data =initData.data.map((obj)=>({...obj, owner:'679d7b933ea680f37bcbf564'}));
    await Listing.insertMany(initData.data);
    console.log("Data initialized");
};

initDb();