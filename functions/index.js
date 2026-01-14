const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// [관리자 전용] 계정 및 데이터 완전 삭제 함수
exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
    // 1. 요청자가 로그인되어 있는지 확인
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다.');
    }

    const callerUid = context.auth.uid;

    // 2. 요청자가 진짜 '관리자'인지 DB에서 확인
    const callerDoc = await admin.firestore().collection('users').doc(callerUid).get();
    if (!callerDoc.exists || !callerDoc.data().isAdmin) {
        throw new functions.https.HttpsError('permission-denied', '관리자 권한이 없습니다.');
    }

    const targetUid = data.uid;
    const targetStudentId = data.studentId;

    try {
        // 3. Authentication 계정 삭제 (가장 중요!)
        await admin.auth().deleteUser(targetUid);
        console.log(`[삭제 성공] Auth 계정 삭제됨: ${targetUid}`);

        // 4. Firestore 데이터 삭제 (users 컬렉션)
        await admin.firestore().collection('users').doc(targetUid).delete();

        // 5. Firestore 데이터 삭제 (public_users 컬렉션)
        if (targetStudentId && targetStudentId !== 'admin') {
            await admin.firestore().collection('public_users').doc(targetStudentId).delete();
        }

        return { message: "계정과 데이터가 모두 삭제되었습니다." };

    } catch (error) {
        console.error("계정 삭제 중 오류:", error);
        
        // 만약 'Auth 계정을 못 찾음(이미 삭제됨)' 오류라면, DB 삭제는 진행하도록 처리
        if (error.code === 'auth/user-not-found') {
             await admin.firestore().collection('users').doc(targetUid).delete();
             if (targetStudentId && targetStudentId !== 'admin') {
                await admin.firestore().collection('public_users').doc(targetStudentId).delete();
             }
             return { message: "이미 삭제된 계정입니다. 잔여 데이터를 정리했습니다." };
        }

        throw new functions.https.HttpsError('internal', '삭제 실패: ' + error.message);
    }
});