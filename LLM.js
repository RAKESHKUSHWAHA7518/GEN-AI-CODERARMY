import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';
const ai = new GoogleGenAI({  apiKey: " " });
// const History=[]

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history:[],
  })


 

async function main(){
  const userProblem=  readlineSync.question("Ask me anythings==>")
     const response1 = await chat.sendMessage({
    message: userProblem,
  });
  console.log("Chat response 1:", response1.text);
  main()
}
main();
