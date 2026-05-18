import dotenv from "dotenv";

const env = process.env.NODE_ENV as string;

const envFile =
    env === "production"
        ? ".env"
        : `.env.${env}`;

const result = dotenv.config({ path: envFile });

if (result.error && !process.env.DATABASE_URL) {
    console.error(`❌ Failed to load ${envFile} and DATABASE_URL is not set`);
    process.exit(1);
}

console.log("NODE_ENV:", env);
console.log("Loaded env file:", envFile);

import express from "express";
import cors from "cors";
import { connectDB } from "./config/dbconnect.ts";
import fileRoutes from "./routes/fileRoutes.ts";
import applyRoutes from "./routes/applyRoutes.ts";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.ts";
import hrRoutes from "./routes/hrRoutes.ts";
import adminRoutes from "./routes/adminRoutes.ts";
import studentRoutes from "./routes/studentRoutes.ts";

const app = express();

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use(express.json());
app.use(cors());

const hostname = process.env.HOST || "localhost";
const PORT = parseInt(process.env.PORT as string, 10) || 7000;

connectDB()
  .then(() => {
    app.use("/", adminRoutes);
    app.use("/", studentRoutes);
    app.use("/", applyRoutes);
    app.use("/", jobApplicationRoutes);
    app.use("/", hrRoutes);
    app.use("/", fileRoutes);

    app.listen(PORT, hostname, () => {
      console.log(`🚀 Server running on http://${hostname}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });



