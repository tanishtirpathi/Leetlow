import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.get("/", (req, res) => {
  res.send(
    "Hey everyone this is just my first project which is a leetcode clone "
  );
});

app.listen(process.env.PORT, () => {
  console.log(`your port is running on the port : -  ${process.env.PORT}`);
});
