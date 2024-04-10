import fetch from "node-fetch";
import fs from "fs";
import OpenAI from "openai";

import express from "express";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// import * as "gpt.js"
dotenv.config();

const openai = new OpenAI({apiKey:process.env.OPENAPI_KEY});

async function image() {
  const image = await openai.images.generate({ model: "dall-e-3", prompt: "an archival photograph of a tired young indian mother with cat ears, in the background there is glass mri scanner inside a bombay hospital, cinematic, film noir, grainy, ilford, hasselblad, albumen print" });

  console.log(image.data[0]);
}
image();
