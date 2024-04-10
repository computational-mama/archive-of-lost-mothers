import fetch from "node-fetch";
import fs from "fs";
import OpenAI from "openai";
import express from "express";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// import * as "gpt.js"
dotenv.config();
const openai = new OpenAI({apiKey:process.env.OPENAPI_KEY});

const port = process.env.PORT || "8080";
var appExpress = express();
// For parsing application/json
appExpress.use(express.json());

// For parsing application/x-www-form-urlencoded
appExpress.use(express.urlencoded({ extended: true }));


var image_link;
var story_output;
var instruction;

try {
  // Intitializing the readFileLines with filename
  var story = fs.readFileSync("gptprompt.txt", "utf8");

  // Printing the response
  // console.log(promptGTP3.toString());
} catch (e) {
  // Printing error
  console.log("Error:", e.stack);
}
// const p1 = "cat ears"
// const p2 = "fishing tank"

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// callApi();
appExpress.use(express.static("public"));
appExpress.use(express.static("src"));

appExpress.post("/api", (request, response, next) => {
  console.log("i got a request");
  // console.log(request.body);

  const text2img = request.body;
  let prompt1 = text2img.p1;
  let prompt2 = text2img.p2;
  // console.log(prompt1, prompt2);
  // next();
  var outputimage = image(prompt1, prompt2);
  var gptResponse;
  var gptCall = main(prompt1, prompt2)
    .then((dataprompt) => {
      gptResponse = dataprompt
    })
    .catch((err) => {
      console.error(err);
    });

  // console.log("gptCall: "+gptResponse)
  var fullprompt =
    "an archival photograph of a tired ((young)) indian (((mother))) with" +
    prompt1 +
    ", in the background there is a  mid-century " +
    "(" +
    prompt2 +
    ")" +
    "inside a bombay hospital, cinematic, film noir, grainy, ilford, hasselblad, albumen print";
  // console.log(outputimage);
  outputimage
    .then((data) => {
      var JSONdata = data
      writeNewPost(fullprompt, JSONdata, gptResponse);
      // console.log(fullprompt, JSONdata);
      // console.log(story_output)
      // response.send(gptResponse)
      response.send({
        imagelink: JSONdata,
        caption: gptResponse,
      });
      return;
    })
    .catch((err) => {
      console.error(err);
    });
});
// Server setup
appExpress.listen(port, () => {
  console.log("server running");
});



async function main(p1,p2) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: story + "\n\n---\n\nCreate one more story like these above make sure to use smaller Indian cities and villages in the geography. Story must include an extraordinary human evolution with" +  p1 + " during, before or after pregnancy and it must include one sentence about" +  p2   +  ".Do not write stories about other medical ailments.Story should NOT be positive."}],
    model: "gpt-4",
  });

  console.log(completion.choices[0].message.content);
  const dataOPENAI = completion.choices[0].message.content
  return dataOPENAI
}

async function image(p1,p2) {
  const image = await openai.images.generate({ model: "dall-e-3", prompt: "an archival photograph of a tired young indian mother with " +
  p1 +
  ", in the background there is " +
  p2 +
  "inside a bombay hospital, cinematic, film noir, grainy, ilford, hasselblad, albumen print+", });

  console.log(image.data[0].url);
  const imgOPENAI = image.data[0].url
  return imgOPENAI
}
image();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  child,
  push,
  update,
  onValue,
  orderByKey,
  query,
} from "firebase/database";
import { updateDoc, serverTimestamp } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "archive-lost-mothers.firebaseapp.com",
  projectId: "archive-lost-mothers",
  storageBucket: "archive-lost-mothers.appspot.com",
  messagingSenderId: "292387369053",
  appId: "1:292387369053:web:a4795e1310d4b651881db4",
  measurementId: "G-Z420Y6VGSP",
  databaseURL:
    "https://archive-lost-mothers-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function writeNewPost(prompt, link, caption) {
  const db = getDatabase();
  // const caption = "test";
  // console.log("caption "+caption)
  // console.log("link "+link)
  // A post entry.
  const postData = {
    caption: caption,
    createdOn: serverTimestamp(),
    link: link,
    prompt: prompt,
  };

  // Get a key for a new Post.
  const newPostKey = push(child(ref(db), "runs/mothers")).key;
  // console.log(newPostKey)

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates["/runs/mothers/" + newPostKey] = postData;
  // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  // console.log(postData);
  // getLink();
  return update(ref(db), updates);
}

//-NSu006ti4tsqcOC4z3I

appExpress.post("/gallery", (req, res, next) => {
  function getList() {
    const db = getDatabase();
    return onValue(
      ref(db, "/runs/mothers"),
      (snapshot) => {
        const list = snapshot.val();
        // console.log(list)
        res.send(list);
        // ...
      },
      {
        onlyOnce: true,
      }
    );
  }
  getList();
});

