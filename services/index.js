import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getGoogleImageData } from "./imageRecognition.js";
import { searchGoogle } from "./googleSearch.js";
import { getHistory, insertHistory } from "./database/searchHistory.js";
import { getUsers, insertUser } from "./database/userCreation.js";

const port = process.env.PORT || 9000;
const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

// endpoints
app.post("/identify", async (req, res) => {
  const googleVisionRes = await getGoogleImageData(req.body.image);
  const imageLabel = googleVisionRes[0].webDetection.bestGuessLabels[0].label;

  const searchResult = (searchResult) => {
    res.send({ searchResult, imageLabel });
  };

  await insertHistory({
    item_image: req.body.image,
    item_name: imageLabel,
    email: req.body.user,
  });
  searchGoogle(imageLabel, searchResult);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.get("/history", async (req, res) => {
  const historyRes = await getHistory();
  res.send(historyRes);
});

app.post("/signup", async (req) => {
  insertUser({ email: req.body.email });
});

app.get("/users", async (req, res) => {
  const usersRes = await getUsers();
  res.send(usersRes);
});
