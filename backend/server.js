import app from "./src/app.js";
import dotenv from "dotenv";
import connectToDB from "./src/config/database.js";

dotenv.config();
connectToDB();

app.listen(3000, () => {
  console.log("Server running on 3000");
});
