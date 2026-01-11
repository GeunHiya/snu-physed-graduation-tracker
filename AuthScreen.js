window.AuthScreen = ({ onLoginSuccess }) => {
    const { useState } = React;
    const [view, setView] = useState('login'); 
    
    // Form Inputs
    const [studentId, setStudentId] = useState(""); 
    const [userEmail, setUserEmail] = useState(""); 
    const [name, setName] = useState("");
    const [pw, setPw] = useState("");
    const [confirmPw, setConfirmPw] = useState(""); 
    
    // Global Status
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // 실시간 유효성 검사 에러 상태
    const [idError, setIdError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [pwError, setPwError] = useState("");

    // ----------------------------------------------------------------
    // 1. 실시간 검사 함수들 (onBlur)
    // ----------------------------------------------------------------
    const handleIdBlur = async () => {
        if (!studentId) return;
        setIdError(""); 

        const idRegex = /^\d{4}-\d{5}$/;
        if (!idRegex.test(studentId)) {
            setIdError("학번 형식이 올바르지 않습니다. (예: 2024-12345)");
            return;
        }
        const year = parseInt(studentId.split('-')[0]);
        if (!AVAILABLE_YEARS.includes(year)) {
            setIdError(`가입 가능한 학번이 아닙니다. (${AVAILABLE_YEARS[0]}~${AVAILABLE_YEARS[AVAILABLE_YEARS.length-1]}학번)`);
            return;
        }

        if (view === 'register') {
            try {
                const doc = await db.collection("public_users").doc(studentId).get();
                if (doc.exists) {
                    setIdError("이미 가입된 학번입니다.");
                }
            } catch (e) { console.error(e); }
        }
    };

    const handleEmailBlur = async () => {
        if (!userEmail) return;
        setEmailError("");
        if (!userEmail.includes('@')) {
            setEmailError("유효한 이메일 형식이 아닙니다.");
            return;
        }
        if (view === 'register') {
            try {
                const query = await db.collection("public_users").where("email", "==", userEmail).get();
                if (!query.empty) {
                    setEmailError("이미 가입된 이메일입니다.");
                }
            } catch (e) { console.error(e); }
        }
    };

    const handlePwBlur = () => {
        if (!pw) return;
        setPwError("");
        if (pw.length < 6) {
            setPwError("비밀번호는 6자리 이상이어야 합니다.");
        }
    };

    // ----------------------------------------------------------------
    // 2. 최종 제출 처리
    // ----------------------------------------------------------------
    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (idError || emailError || pwError) return; 

        setLoading(true);

        try {
            const idRegex = /^\d{4}-\d{5}$/;
            if (!idRegex.test(studentId)) throw new Error("학번 형식이 올바르지 않습니다.");
            
            // A. 비밀번호 재설정
            if (view === 'reset') {
                if (!studentId || !userEmail) throw new Error("학번과 이메일을 입력해주세요.");
                await auth.sendPasswordResetEmail(userEmail);
                setMessage("가입된 정보가 맞다면 재설정 메일이 발송됩니다.\n[스팸 메일함]도 꼭 확인해주세요.");
                setLoading(false);
                return;
            }

            // B. 회원가입
            if (view === 'register') {
                if (!name) throw new Error("이름을 입력해주세요.");
                if (!userEmail.includes('@')) throw new Error("유효한 이메일을 입력해주세요.");
                if (pw.length < 6) throw new Error("비밀번호는 6자리 이상이어야 합니다.");
                if (pw !== confirmPw) throw new Error("비밀번호가 일치하지 않습니다.");

                const idCheckDoc = await db.collection("public_users").doc(studentId).get();
                if (idCheckDoc.exists) throw new Error("이미 가입된 학번입니다.");
                
                const emailCheckQuery = await db.collection("public_users").where("email", "==", userEmail).get();
                if (!emailCheckQuery.empty) throw new Error("이미 가입된 이메일입니다.");

                // 계정 생성
                const userCred = await auth.createUserWithEmailAndPassword(userEmail, pw);
                let derivedYear = parseInt(studentId.substring(2, 4));

                // [핵심 변경] 가입 시점에 학번에 맞는 데이터 미리 생성!
                const initialData = JSON.parse(JSON.stringify(BASE_DATA)); // 빈 데이터 복사
                
                // 학번에 맞는 교양/교직 데이터 채워넣기
                if (window.getGeneralDataByYear) {
                    const genItems = window.getGeneralDataByYear(derivedYear);
                    if (genItems.length > 0) initialData.general.items = genItems;
                }
                if (window.getTeachingDataByYear) {
                    const teachItems = window.getTeachingDataByYear(derivedYear);
                    if (teachItems.length > 0) initialData.teaching.items = teachItems;
                }

                const batch = db.batch();
                const userRef = db.collection("users").doc(userCred.user.uid);
                batch.set(userRef, {
                    userName: name,
                    studentId: studentId,
                    email: userEmail, 
                    studentYear: derivedYear,
                    majorPath: "single",
                    config: { userName: name, studentYear: derivedYear, majorPath: "single", secondMajorTitle: "" },
                    data: initialData // [중요] 꽉 찬 데이터로 저장
                }, { merge: true });

                const publicRef = db.collection("public_users").doc(studentId);
                batch.set(publicRef, { email: userEmail, taken: true });

                await batch.commit();
                alert("가입이 완료되었습니다.");
                onLoginSuccess();
            } 
            // C. 로그인
            else {
                if (!pw) throw new Error("비밀번호를 입력해주세요.");

                const publicDoc = await db.collection("public_users").doc(studentId).get();
                
                if (!publicDoc.exists) {
                    try {
                        const legacyFakeEmail = `${studentId}@snu.grad.test`;
                        await auth.signInWithEmailAndPassword(legacyFakeEmail, pw);
                        onLoginSuccess();
                        return;
                    } catch (e) {
                        throw new Error("LOGIN_FAIL");
                    }
                }

                const targetEmail = publicDoc.data().email;
                await auth.signInWithEmailAndPassword(targetEmail, pw);
                onLoginSuccess();
            }

        } catch (err) {
            let msg = "오류 발생";
            
            if (err.message === "LOGIN_FAIL" || 
                err.code === 'auth/user-not-found' || 
                err.code === 'auth/wrong-password' || 
                err.code === 'auth/invalid-login-credentials' || 
                err.code === 'auth/invalid-credential') {
                msg = "학번 또는 비밀번호를 확인해주세요.";
            } 
            else if (err.code === 'permission-denied') msg = "보안 오류: 접근 권한이 없습니다.";
            else if (err.code === 'auth/email-already-in-use') msg = "이미 가입된 이메일입니다.";
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

    const switchView = (newView) => {
        setView(newView);
        setError(""); setMessage(""); 
        setIdError(""); setEmailError(""); setPwError("");
        setStudentId(""); setUserEmail(""); setPw(""); setName(""); setConfirmPw("");
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
                    
                    {/* 학번 */}
                    <div>
                        <label className="block text-xs text-slate-400 mb-1 ml-1">학번</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={studentId} 
                                onChange={e=>setStudentId(e.target.value)} 
                                onBlur={handleIdBlur} 
                                className={`w-full p-4 rounded-2xl outline-none focus:ring-2 transition-colors ${idError ? 'bg-red-50 focus:ring-red-200' : 'bg-slate-50 focus:ring-indigo-100'}`} 
                                placeholder="예: 2024-12345" 
                                required 
                            />
                            {idError ? (
                                <p className="text-[10px] text-red-500 mt-1 ml-1 font-black">{idError}</p>
                            ) : (
                                view === 'register' && <p className="text-[10px] text-slate-400 mt-1 ml-1">* {AVAILABLE_YEARS[0]}~{AVAILABLE_YEARS[AVAILABLE_YEARS.length-1]}학번만 가입 가능</p>
                            )}
                        </div>
                    </div>

                    {/* 이메일 (회원가입/재설정만) */}
                    {(view === 'register' || view === 'reset') && (
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">이메일</label>
                            <div className="relative">
                                <div className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <Icons.Mail />
                                </div>
                                <input 
                                    type="email" 
                                    value={userEmail} 
                                    onChange={e=>setUserEmail(e.target.value)} 
                                    onBlur={handleEmailBlur}
                                    className={`w-full p-4 pl-12 rounded-2xl outline-none focus:ring-2 transition-colors ${emailError ? 'bg-red-50 focus:ring-red-200' : 'bg-slate-50 focus:ring-indigo-100'}`} 
                                    placeholder="name@example.com" 
                                    required 
                                />
                            </div>
                            {emailError && <p className="text-[10px] text-red-500 mt-1 ml-1 font-black">{emailError}</p>}
                        </div>
                    )}

                    {/* 이름 (회원가입만) */}
                    {view === 'register' && (
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">이름</label>
                            <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100" placeholder="본명" required />
                        </div>
                    )}

                    {/* 비밀번호 (로그인/회원가입) */}
                    {view !== 'reset' && (
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">비밀번호</label>
                            <input 
                                type="password" 
                                value={pw} 
                                onChange={e=>setPw(e.target.value)} 
                                onBlur={handlePwBlur}
                                className={`w-full p-4 rounded-2xl outline-none focus:ring-2 transition-colors ${pwError ? 'bg-red-50 focus:ring-red-200' : 'bg-slate-50 focus:ring-indigo-100'}`} 
                                placeholder="6자리 이상" 
                                required 
                            />
                            {pwError && <p className="text-[10px] text-red-500 mt-1 ml-1 font-black">{pwError}</p>}
                        </div>
                    )}

                    {/* 비밀번호 확인 (회원가입만) */}
                    {view === 'register' && (
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">비밀번호 확인</label>
                            <input 
                                type="password" 
                                value={confirmPw} 
                                onChange={e=>setConfirmPw(e.target.value)} 
                                className={`w-full p-4 rounded-2xl outline-none focus:ring-2 ${confirmPw && pw !== confirmPw ? 'focus:ring-red-200 bg-red-50' : 'focus:ring-indigo-100 bg-slate-50'}`} 
                                placeholder="비밀번호 다시 입력" 
                                required 
                            />
                            {confirmPw && pw !== confirmPw && <p className="text-[10px] text-red-500 mt-1 ml-1 font-black">비밀번호가 일치하지 않습니다.</p>}
                        </div>
                    )}

                    {view === 'login' && (
                        <div className="text-right mt-2 mr-1">
                            <button type="button" onClick={() => switchView('reset')} className="text-xs text-slate-400 hover:text-indigo-500 font-bold">비밀번호를 잊으셨나요?</button>
                        </div>
                    )}

                    {error && <div className="text-red-500 text-sm text-center font-black bg-red-50 p-2 rounded-lg">{error}</div>}
                    {message && <div className="text-green-600 text-sm text-center font-black bg-green-50 p-3 rounded-lg whitespace-pre-wrap leading-relaxed">{message}</div>}

                    <button 
                        type="submit" 
                        disabled={loading || (view === 'reset' && !!message)} 
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "처리중..." : (view === 'login' ? "로그인" : view === 'register' ? "가입하기" : "재설정 이메일 보내기")}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    {view === 'login' ? (
                        <button onClick={() => switchView('register')} className="text-slate-400 text-sm font-bold hover:text-indigo-500 transition-colors">계정이 없으신가요? 회원가입</button>
                    ) : (
                        <button onClick={() => switchView('login')} className="text-slate-400 text-sm font-bold hover:text-indigo-500 transition-colors">로그인 화면으로 돌아가기</button>
                    )}
                </div>
            </div>
        </div>
    );
};