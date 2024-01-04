import fetch from "node-fetch";
import fs from "fs";

import express from "express";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// import * as "gpt.js"
dotenv.config();
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
  var promptGTP3 = fs.readFileSync("gptprompt.txt", "utf8");

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
  var outputimage = callApi(prompt1, prompt2);
  var gptResponse;
  var gptCall = callGPT3(prompt1, prompt2)
    .then((dataprompt) => {
      gptResponse = dataprompt.output.output_text.gpt_4_turbo[0];
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
      var JSONdata = data.output.output_images.dall_e_3[0];
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

async function callGPT3(p1, p2) {
  const instruction =
    "Create one more story like these above make sure to use smaller Indian cities and villages in the geography. Story must include an extraordinary human evolution with " +
    p1 +
    " during, before or after pregnancy and it must include one sentence about " +
    p2 +
    ". Do not write stories about other medical ailments. Story should NOT be positive.";
  const response = await fetch("https://api.gooey.ai/v2/CompareLLM/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.GOOEY_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input_prompt: promptGTP3.toString() + instruction,
      selected_models: ["gpt_4_turbo"],
      avoid_repetition: true,
      num_outputs: 1,
      quality: 1,
      max_tokens: 500,
      sampling_temperature: 0.3,
      variables: null,
    }),
  });

  const dataprompt = await response.json();
  // const story_output =  dataprompt.output.output_text.text_davinci_003[0]
  // console.log(JSON.stringify(story_output));
  return dataprompt;
}

async function callApi(p1, p2) {
  const response = await fetch("https://api.gooey.ai/v2/CompareText2Img/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.GOOEY_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      seed: getRandomInt(3008484884),
      output_width: 1024,
      output_height: 1024,
      num_outputs: 1,
      quality: 140,
      dall_e_3_quality: "standard",
      dall_e_3_style: "vivid",
      guidance_scale: 7,
      seed: 2746317213,
      sd_2_upscaling: false,
      selected_models: ["dall_e_3"],
      scheduler: null,
      edit_instruction: null,
      image_guidance_scale: 1.2,
      text_prompt:
        "an archival photograph of a tired ((young)) indian (((mother))) with (((" +
        p1 +
        "))), in the background there is ((" +
        p2 +
        ")) inside a bombay hospital, cinematic, film noir, grainy, ilford, hasselblad, albumen print",
      negative_prompt: "out of frame, old, older woman, modelshoot",
    }),
  });
  // console.log("an archival photograph of a tired ((young)) indian (((mother))) with" + p1 +", in the background there is" + +p2 + "inside a bombay hospital, cinematic, film noir, grainy, ilford, hasselblad, albumen print")
  const data = await response.json();
  image_link = data.output.output_images.dall_e_3[0];
  // console.log(response.status, image_link);
  return data;
}

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

