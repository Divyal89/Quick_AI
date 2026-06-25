import app from "./src/app.js";
import dotenv from "dotenv";
import connectToDB from "./src/config/database.js";
import invoke from "./src/services/ai.service.js";

dotenv.config();
connectToDB();
invoke();

app.listen(3000, () => {
  console.log("Server running on 3000");
});
