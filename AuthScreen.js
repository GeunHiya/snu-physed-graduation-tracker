window.AuthScreen = ({ onLoginSuccess }) => {
    const { useState } = React;
    const [view, setView] = useState('login'); 
    
    // Form Inputs
    const [studentId, setStudentId] = useState(""); 
    const [userEmail, setUserEmail] = useState(""); 
    const [name, setName] = useState("");
    const [pw, setPw] = useState("");
    const [confirmPw, setConfirmPw] = useState(""); 
    
    // Status
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            // --- 공통 유효성 검사 ---
            const idRegex = /^\d{4}-\d{5}$/;
            if (!idRegex.test(studentId)) {
                throw new Error("학번 형식이 올바르지 않습니다. (예: 2024-12345)");
            }
            
            const year = parseInt(studentId.split('-')[0]);
            if (!AVAILABLE_YEARS.includes(year)) {
                throw new Error(`지원하지 않는 학번입니다. (${AVAILABLE_YEARS.join(', ')}년도만 가능)`);
            }

            // ----------------------------------------------------
            // 1. 비밀번호 재설정 (보안 강화: 에러 메시지 통일)
            // ----------------------------------------------------
            if (view === 'reset') {
                if (!studentId) throw new Error("학번을 입력해주세요.");
                if (!userEmail) throw new Error("가입 시 등록한 이메일을 입력해주세요.");

                // [보안] 구체적인 에러 대신 뭉뚱그린 메시지 정의
                const authMismatchMsg = "학번 또는 이메일 정보를 확인해주세요.";

                // DB 조회
                const userQuery = await db.collection("users").where("studentId", "==", studentId).get();
                
                // Case 1: 학번 자체가 없는 경우
                if (userQuery.empty) {
                    throw new Error(authMismatchMsg);
                }

                // Case 2: 학번은 있는데 이메일이 다른 경우
                const userData = userQuery.docs[0].data();
                if (userData.email !== userEmail) {
                    throw new Error(authMismatchMsg);
                }

                // 정보 일치 시 메일 발송
                await auth.sendPasswordResetEmail(userEmail);
                
                setMessage("재설정 링크를 메일로 보냈습니다.\n메일이 안 오면 [스팸 메일함]을 꼭 확인해주세요.");
                setLoading(false);
                return;
            }

            // ----------------------------------------------------
            // 2. 회원가입
            // ----------------------------------------------------
            if (view === 'register') {
                if (!name) throw new Error("이름을 입력해주세요.");
                if (!userEmail.includes('@')) throw new Error("유효한 이메일을 입력해주세요.");
                if (pw.length < 6) throw new Error("비밀번호는 6자리 이상이어야 합니다.");
                if (pw !== confirmPw) throw new Error("비밀번호가 일치하지 않습니다.");

                const duplicateIdCheck = await db.collection("users").where("studentId", "==", studentId).get();
                if (!duplicateIdCheck.empty) throw new Error("이미 가입된 학번입니다.");

                const duplicateEmailCheck = await db.collection("users").where("email", "==", userEmail).get();
                if (!duplicateEmailCheck.empty) throw new Error("이미 가입된 이메일입니다.");

                const userCred = await auth.createUserWithEmailAndPassword(userEmail, pw);
                let derivedYear = parseInt(studentId.substring(2, 4));

                await db.collection("users").doc(userCred.user.uid).set({
                    userName: name,
                    studentId: studentId,
                    email: userEmail, 
                    studentYear: derivedYear,
                    majorPath: "single",
                    config: { userName: name, studentYear: derivedYear, majorPath: "single", secondMajorTitle: "" },
                    data: BASE_DATA 
                }, { merge: true });
                
                alert("가입이 완료되었습니다.");
                onLoginSuccess();
            } 
            // ----------------------------------------------------
            // 3. 로그인
            // ----------------------------------------------------
            else {
                if (!pw) throw new Error("비밀번호를 입력해주세요.");

                // 구버전(가짜메일) 로그인 시도
                try {
                    const legacyFakeEmail = `${studentId}@snu.grad.test`;
                    await auth.signInWithEmailAndPassword(legacyFakeEmail, pw);
                    onLoginSuccess();
                    return; 
                } catch (legacyError) {}

                // 신버전(실제메일) 로그인 시도
                const userQuery = await db.collection("users").where("studentId", "==", studentId).get();
                
                if (userQuery.empty) throw new Error("학번 또는 비밀번호를 확인해주세요.");

                const userData = userQuery.docs[0].data();
                if (userData.email) {
                    await auth.signInWithEmailAndPassword(userData.email, pw);
                    onLoginSuccess();
                } else {
                    throw new Error("계정 정보를 찾을 수 없습니다.");
                }
            }

        } catch (err) {
            let msg = "오류 발생";
            if (err.code === 'auth/invalid-credential' || 
                err.code === 'auth/user-not-found' || 
                err.code === 'auth/wrong-password' ||
                err.code === 'auth/invalid-login-credentials') {
                msg = "학번 또는 비밀번호를 확인해주세요.";
            }
            else if (err.code === 'auth/email-already-in-use') msg = "이미 가입된 이메일입니다.";
            else if (err.code === 'auth/weak-password') msg = "비밀번호는 6자리 이상이어야 합니다.";
            else if (err.code === 'auth/invalid-email') msg = "이메일 형식이 올바르지 않습니다.";
            else msg = err.message;
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (view === 'reset') return "비밀번호 재설정";
        if (view === 'register') return "새 계정 만들기";
        return "졸업 관리 로그인";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md border border-slate-100 transition-all">
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-50 p-4 rounded-full text-indigo-600">
                        {view === 'reset' ? <Icons.Zap /> : <Icons.Cap />}
                    </div>
                </div>
                
                <h2 className="text-2xl font-black text-indigo-900 mb-2 text-center">{getTitle()}</h2>
                
                {view === 'reset' && !message && (
                    <p className="text-sm text-slate-500 text-center mb-4 px-4">
                        가입하신 <strong>학번</strong>과 <strong>이메일</strong>을 입력하시면<br/>재설정 링크를 보내드립니다.
                    </p>
                )}

                <form onSubmit={handleAuth} className="space-y-4 font-bold">
                    
                    {/* 학번 입력 */}
                    <div>
                        <label className="block text-xs text-slate-400 mb-1 ml-1">학번</label>
                        <div className="relative">
                            <input type="text" value={studentId} onChange={e=>setStudentId(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100" placeholder="예: 2024-12345" required />
                            {view === 'register' && <p className="text-[10px] text-slate-400 mt-1 ml-1">* {AVAILABLE_YEARS[0]}~{AVAILABLE_YEARS[AVAILABLE_YEARS.length-1]}학번만 가입 가능</p>}
                        </div>
                    </div>

                    {/* 이메일 입력 */}
                    {(view === 'register' || view === 'reset') && (
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">이메일</label>
                            <div className="relative">
                                <div className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <Icons.Mail />
                                </div>
                                <input type="email" value={userEmail} onChange={e=>setUserEmail(e.target.value)} className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100" placeholder="name@example.com" required />
                            </div>
                        </div>
                    )}

                    {/* 이름 입력 */}
                    {view === 'register' && (
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">이름</label>
                            <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100" placeholder="본명" required />
                        </div>
                    )}

                    {/* 비밀번호 입력 */}
                    {view !== 'reset' && (
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">비밀번호</label>
                            <input type="password" value={pw} onChange={e=>setPw(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100" placeholder="6자리 이상" required />
                        </div>
                    )}

                    {/* 비밀번호 확인 */}
                    {view === 'register' && (
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">비밀번호 확인</label>
                            <input type="password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} className={`w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ${confirmPw && pw !== confirmPw ? 'focus:ring-red-200 bg-red-50' : 'focus:ring-indigo-100'}`} placeholder="비밀번호 다시 입력" required />
                            {confirmPw && pw !== confirmPw && <p className="text-[10px] text-red-500 mt-1 ml-1 font-black">비밀번호가 일치하지 않습니다.</p>}
                        </div>
                    )}

                    {view === 'login' && (
                        <div className="text-right mt-2 mr-1">
                            <button type="button" onClick={() => { setView('reset'); setError(""); setMessage(""); setUserEmail(""); setStudentId(""); }} className="text-xs text-slate-400 hover:text-indigo-500 font-bold">비밀번호를 잊으셨나요?</button>
                        </div>
                    )}

                    {error && <div className="text-red-500 text-sm text-center font-black bg-red-50 p-2 rounded-lg">{error}</div>}
                    {message && <div className="text-green-600 text-sm text-center font-black bg-green-50 p-3 rounded-lg whitespace-pre-wrap leading-relaxed">{message}</div>}

                    <button type="submit" disabled={loading || (view === 'reset' && !!message)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                        {loading ? "처리중..." : (view === 'login' ? "로그인" : view === 'register' ? "가입하기" : "재설정 이메일 보내기")}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    {view === 'login' ? (
                        <button onClick={() => { setView('register'); setError(""); setStudentId(""); setUserEmail(""); setPw(""); setName(""); setConfirmPw(""); }} className="text-slate-400 text-sm font-bold hover:text-indigo-500 transition-colors">계정이 없으신가요? 회원가입</button>
                    ) : (
                        <button onClick={() => { setView('login'); setError(""); setMessage(""); setStudentId(""); setPw(""); }} className="text-slate-400 text-sm font-bold hover:text-indigo-500 transition-colors">로그인 화면으로 돌아가기</button>
                    )}
                </div>
            </div>
        </div>
    );
};