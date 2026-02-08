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

const getAllMessages = async () => {
  try {
    let itemsCollectionRef = collection(db, "messages");
    let itemsSnapshot = await getDocs(itemsCollectionRef);
    let items = itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return items;
  } catch (error) {
    console.error("Error fetching Messages: ", error);
    throw error;
  }
};

const createMessage = async (name, email, message) => {
  try {
    let itemsCollectionRef = collection(db, "messages");
    let newItem = {
      Name: name,
      Email: email,
      Message: message,
      Responded: false,
      Response: "",
    };
    await addDoc(itemsCollectionRef, newItem);
  } catch (error) {
    console.error("Error creating message: ", error);
    throw error;
  }
};

const updateMessage = async (id, responded, response) => {
  try {
    const itemsCollectionRef = doc(db, "messages", id);

    await setDoc(
      itemsCollectionRef,
      {
        Responded: responded,
        Response: response,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating message: ", error);
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

app.get("/messages", async (req, res) => {
  let recievedItems = await getAllMessages();
  res.send(recievedItems);
});

app.post("/addMessage", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  await createMessage(name, email, message);
  res.send("Message added");
});

app.put("/updateMessage", async (req, res) => {
  let id = req.query.id;
  responded = req.query.responded;
  response = req.query.response;
  await updateMessage(id, responded, response);
  res.send("Message updated");
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
