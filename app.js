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
  getDoc,
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

const getAllTestimonials = async () => {
  try {
    let itemsCollectionRef = collection(db, "testimonials");
    let itemsSnapshot = await getDocs(itemsCollectionRef);
    let items = itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return items;
  } catch (error) {
    console.error("Error fetching testimonials: ", error);
    throw error;
  }
};

const getUserInfo = async (userId) => {
  try {
    console.log(userId);
    let itemsCollectionRef = doc(db, "users", userId);
    let itemsSnapshot = await getDoc(itemsCollectionRef);
    let items = { id: itemsSnapshot.id, ...itemsSnapshot.data() };
    return items;
  } catch (error) {
    console.error("Error fetching UserInfo: ", error);
    throw error;
  }
};
const getOptedCourses = async (userId) => {
  try {
    let itemsCollectionRef = collection(
      doc(db, "users", userId),
      "OptedCourses"
    );
    let itemsSnapshot = await getDocs(itemsCollectionRef);
    let items = itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return items;
  } catch (error) {
    console.error("Error fetching UserInfo: ", error);
    throw error;
  }
};

const createTestimonial = async (userName, desc) => {
  try {
    let itemsCollectionRef = collection(db, "testimonials");
    let newItem = {
      name: userName,
      description: desc,
    };
    await addDoc(itemsCollectionRef, newItem);
  } catch (error) {
    console.error("Error fetching courses: ", error);
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

app.get("/courses/lessons", async (req, res) => {
  let Id = req.query.courseId;
  let recievedItems = await getAllLessons(Id);
  res.send(recievedItems);
});

app.get("/testimonials", async (req, res) => {
  let recievedItems = await getAllTestimonials();
  res.send(recievedItems);
});

app.get("/users/userInfo", async (req, res) => {
  let Id = req.query.userId;
  let recievedItems = await getUserInfo(Id);
  res.send(recievedItems);
});

app.get("/users/optedCourses", async (req, res) => {
  let userId = req.query.userId;
  let recievedItems = await getOptedCourses(userId);
  res.send(recievedItems);
});

app.post("/addTestimonial", async (req, res) => {
  let userName = req.query.userName;
  let desc = req.query.description;
  await createTestimonial(userName, desc);
  res.send("Added to database");
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
