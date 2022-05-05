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

// Global State
const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

// HTML elements
const webcamVideo = document.getElementById('webcamVideo');
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');
const muteButton = document.getElementById('muteButton');
const soundButton = document.getElementById('soundButton');
const webcamButton = document.getElementById('webcamButton');

const camImage = document.getElementById('camImage');
const muteImage = document.getElementById('muteImage');
const soundImage = document.getElementById('soundImage');




// 1. Setup media sources
callButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  callButton.disabled = false;
  answerButton.disabled = false;

  // 2. Create OFFER

  // Reference Firestore collections for signaling
  const callDoc = firestore.collection('calls').doc();
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');

  callInput.value = callDoc.id;

  // Get candidates for caller, save to db
  pc.onicecandidate = (event) => {
    event.candidate && offerCandidates.add(event.candidate.toJSON());
  };

  // Create offer
  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await callDoc.set({ offer });

  // Listen for remote answer
  callDoc.onSnapshot((snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  // When answered, add candidate to peer connection
  answerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });
};




// 3. Answer the call with the unique ID
answerButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  const callId = callInput.value;
  const callDoc = firestore.collection('calls').doc(callId);
  const answerCandidates = callDoc.collection('answerCandidates');
  const offerCandidates = callDoc.collection('offerCandidates');

  pc.onicecandidate = (event) => {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  const callData = (await callDoc.get()).data();

  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await callDoc.update({ answer });
  offerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log(change);
      if (change.type === 'added') {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
};




muteButton.onclick = async () => {
  let localAudio = localStream.getTracks()[0];
  console.log(localAudio);
  localAudio.enabled = !(localAudio.enabled);

  if(muteImage.src.match("/images/microphone.svg")){
    muteImage.src = "/images/microphonedisabled.svg";
  }else{
    muteImage.src = "/images/microphone.svg";
  }
}




soundButton.onclick = async () => {
  let remoteAudio = remoteStream.getTracks()[0];
  console.log(remoteAudio);
  remoteAudio.enabled = !(remoteAudio.enabled);

  if(soundImage.src.match("/images/Speaker.svg")){
    soundImage.src = "/images/Speakeroff.svg";
  }else{
    soundImage.src = "/images/Speaker.svg";
  }
}




webcamButton.onclick = async () => {
  let localVideo = localStream.getTracks()[1];
  console.log(localVideo);
  localVideo.enabled = !(localVideo.enabled);

  if(camImage.src.match("/images/cam.svg")){
    camImage.src = "/images/camdisabled.svg";
  }else{
    camImage.src = "/images/cam.svg";
  }
}




hangupButton.onclick = async () => {
  pc.removeStream(localStream);
  pc.removeStream(remoteStream);
  pc.close();
}