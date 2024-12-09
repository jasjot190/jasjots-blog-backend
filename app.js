require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());
const db = require("./_utils/firebase").db;
const {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  doc,
  setDoc,
} = require("firebase/firestore");

// const getAllCourses = async () => {
//   let itemsCollectionRef = collection(db, "courses");
//   let itemsSnapshot = await getDocs(itemsCollectionRef);
//   let items = itemsSnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
//   return items;
// };

const getAllCourses = async () => {
  try {
    let itemsCollectionRef = collection(db, "courses");
    let itemsSnapshot = await getDocs(itemsCollectionRef);
    let items = itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return items;
  } catch (error) {
    console.error("Error fetching courses: ", error);
    throw error;
  }
};

const getAllLessons = async (courseId) => {
  try {
    let itemsCollectionRef = collection(
      doc(db, "courses", courseId),
      "Lessons"
    );
    let itemsSnapshot = await getDocs(itemsCollectionRef);
    let items = itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return items;
  } catch (error) {
    console.error("Error fetching Lessons: ", error);
    throw error;
  }
};

app.get("/", (req, res) => {
  res.send("<h1>Welcome to JasjotsBlog Backend!</h1>");
});

app.get("/courses", async (req, res) => {
  let recievedItems = await getAllCourses();

  res.send(recievedItems);
});

app.get("/lessons", async (req, res) => {
  let Id = req.query.courseId;
  let recievedItems = await getAllLessons(Id);
  res.send(recievedItems);
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
