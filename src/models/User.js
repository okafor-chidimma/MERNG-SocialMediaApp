import mongoose from "mongoose";
const { Schema, model } = mongoose;
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
});
//by default mongoose adds id field to every model


/*
The first argument of model() is the singular name of the collection(table) your model is for. Mongoose automatically looks for the plural, lower cased version of your model name. Thus, for an example, the model User is for the users collection in the database.
*/
export default model("User", userSchema);
