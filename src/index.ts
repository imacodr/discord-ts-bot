import express from "express";
require("./client");

//START DISCORD BOT

const PORT = process.env.PORT || 4001;

const app = express();

app.get("/", async function (req: express.Request, res: express.Response) {
  res.send({ response: "The bot is running" });
});

app.listen(PORT, function () {
  console.log("Listening on Port " + PORT);
});
