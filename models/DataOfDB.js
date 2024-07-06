const mongoose = require("mongoose");
const Schema = mongoose.Schema;

 
// define the Schema (the structure of the article)
const schema_female = new Schema({
    Username: String,
    Password: String,
    Phone_Number : String

});

const schema_male =new Schema({
    Username: String,
    Password: String,
    Phone_Number : String
});

 
// Create a model based on that schema


// export the model
module.exports = {
    FemaleData: mongoose.model("female_data",schema_female),
    MaleData: mongoose.model("male_data",schema_male)
};

