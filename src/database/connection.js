import { getDatabase , set , get } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAfd0MgpjtLToGLm4g_ZO8V2Nsh-_gNkzc",
    authDomain: "discord-bot-e55e9.firebaseapp.com",
    projectId: "discord-bot-e55e9",
    storageBucket: "discord-bot-e55e9.appspot.com",
    messagingSenderId: "679115039279",
    appId: "1:679115039279:web:69bdc55ccc1139b5ea9cda",
    measurementId: "G-D48BMDQLWE"
};
  
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)

export { database , set , get } 