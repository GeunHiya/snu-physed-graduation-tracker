const firebaseConfig = {
    apiKey: "AIzaSyAKEjAy1D66DjjJGet9GNTOEoF7a6mm5m0",
    authDomain: "snu-physed-graduation-tracker.firebaseapp.com",
    projectId: "snu-physed-graduation-tracker",
    storageBucket: "snu-physed-graduation-tracker.firebasestorage.app",
    messagingSenderId: "787552743286",
    appId: "1:787552743286:web:41856a3e1fdb53c5255457"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

window.auth = firebase.auth();
window.db = firebase.firestore();

// [추가] 전역 로그 기록 함수 (로그인/로그아웃 공용)
window.logAccess = async (uid, userName, studentId, type = 'LOGIN') => {
    if (!uid) return;
    try {
        await window.db.collection('access_logs').add({
            uid: uid,
            userName: userName || 'Unknown',
            studentId: studentId || 'Unknown',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent,
            type: type
        });
    } catch (e) {
        console.error("로그 기록 실패:", e);
    }
};