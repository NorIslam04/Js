const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema1 =new Schema({
    Username: String,
    Password: String,
    Phone_Number : String
});

module.exports=mongoose.model("male_data",schema1)