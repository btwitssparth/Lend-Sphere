import "dotenv/config"; // 🔥 MUST be first — no exceptions

import connectDb from "./src/db/index.js";
import { app } from "./app.js";

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
