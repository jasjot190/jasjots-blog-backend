const express = require("express");
const cors = require("cors");

const app = express();

const port = 5500;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Welcome to JasjotsBlog Backend!</h1>");
});

const start = async () => {
  try {
    app.listen(port, (err) => {
      if (err) {
        console.log(`ERROR : while listening to app\nErr: ${err}`);
        return;
      }
      console.log(`listening on port : ${`http://localhost:${port}`}`);
    });
  } catch (err) {
    console.log(`ERROR : while connecting to DB\nErr : ${err}`);
  }
};

start();
