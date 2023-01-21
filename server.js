
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app  = require('./app')

dotenv.config();
mongoose.set('strictQuery', false)

const { HOST_URI } = process.env;

async function main() {
  try {
    await mongoose.connect(HOST_URI);
    console.log("Database connection successfull");

    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000")
    })
  } catch (error) {
    console.error("Error while connecting to database server")
    process.exit(1)
  }
}
main()