import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';
const ai = new GoogleGenAI({ });
const History=[]
async function Chatting(userProblem) {
    History.push({
        role: 'user',
        parts: [{text:userProblem}]
    })
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:   History
  });
  console.log(response.text);
  History.push({
        role: 'model',
        parts: [{text:response.text}]
    })
}

async function main(){
  const userProblem=  readlineSync.question("Ask me anythings==>")
  await Chatting(userProblem);
  main()
}
main();
