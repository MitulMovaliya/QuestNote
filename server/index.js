import express from "express";

const app = express();
const port = 7675;

app.get("/", (req, res) => {
  res.send("Running");
});

app.listen(port, () => {
  console.log(`Server Running on port : ${port}`);
});
