import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyA7_eicKv3FJwmlhT1HgDVsF1JHYScPv3A",
  authDomain: "webrtctest-24224.firebaseapp.com",
  projectId: "webrtctest-24224",
  storageBucket: "webrtctest-24224.appspot.com",
  messagingSenderId: "892949149643",
  appId: "1:892949149643:web:1deaa331a59c579cbe284e",
  measurementId: "G-VP49L23VQB"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};


const pc = new RTCPeerConnection(servers);


// HTML elements
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const answerButton = document.getElementById('answerButton');



callButton.onclick = async () => {
  

}

answerButton.onclick = async () => {

}