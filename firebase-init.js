// --- [설정] 파이어베이스 키 ---
const firebaseConfig = {
    apiKey: "AIzaSyAKEjAy1D66DjjJGet9GNTOEoF7a6mm5m0",
    authDomain: "snu-physed-graduation-tracker.firebaseapp.com",
    projectId: "snu-physed-graduation-tracker",
    storageBucket: "snu-physed-graduation-tracker.firebasestorage.app",
    messagingSenderId: "787552743286",
    appId: "1:787552743286:web:41856a3e1fdb53c5255457"
};

// 파이어베이스 초기화
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 전역 변수로 할당 (다른 파일에서 접근 가능하도록)
window.auth = firebase.auth();
window.db = firebase.firestore();