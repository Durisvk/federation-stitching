import express from "express";
import * as data from "./data";
import * as client from "./client.rest";

const app = express();
app.use(express.json());

app.get("/ratings", (_, res) => {
  res.json(data.getRatings());
});

app.get("/ratings/:id", (req, res) => {
  res.json(data.getRating(req.params.id));
});

app.get("/movies/:id/rating", (req, res) => {
  res.json(data.getRatingByMovieId(req.params.id));
});

app.post("/ratings", (req, res) => {
  res.json(data.createRating(req.body));
});

app.listen(client.PORT, () => {
  console.log(`🚀 Server ready at ${client.BASE_URL}`);
});
