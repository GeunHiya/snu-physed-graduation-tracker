window.AuthScreen = React.memo(({ onLoginSuccess, onGuestLogin, guestData, guestConfig, onCancel }) => {
    const { useState, useCallback, useEffect } = React;
    const [view, setView] = useState(guestConfig ? 'register' : 'login'); 
    
    const [studentId, setStudentId] = useState(""); 
    const [idSuffix, setIdSuffix] = useState(""); 
    const [emailId, setEmailId] = useState(""); 
    const [name, setName] = useState(guestConfig ? guestConfig.userName : "");
    const [pw, setPw] = useState("");
    const [confirmPw, setConfirmPw] = useState(""); 
    
    const [guestName, setGuestName] = useState("");
    const [guestYear, setGuestYear] = useState(AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1] % 100); 

    const [isAutoLogin, setIsAutoLogin] = useState(false);
    const [isSaveId, setIsSaveId] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [authModal, setAuthModal] = useState({ show: false, message: '', onConfirm: null });

    const [idError, setIdError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [pwError, setPwError] = useState("");

    const fixedYearPrefix = guestConfig ? `20${guestConfig.studentYear % 100}-` : "";

    useEffect(() => {
        const savedId = localStorage.getItem('snu_saved_student_id');
        if (savedId && !guestConfig) {
            setStudentId(savedId);
            setIsSaveId(true);
        }
    }, [guestConfig]);

    const handleIdBlur = useCallback(async () => {
        if (guestConfig) {
            if (!idSuffix) return;
            setIdError("");
            if (!/^\d{5}$/.test(idSuffix)) {
                setIdError("학번 뒷자리 5자리를 입력해주세요.");
                return;
            }
            const fullId = `${fixedYearPrefix}${idSuffix}`;
            try {
                const doc = await db.collection("public_users").doc(fullId).get();
                if (doc.exists) setIdError("이미 가입된 학번입니다.");
            } catch (e) { console.error(e); }
        } else {
            if (!studentId) return;
            setIdError(""); 
            
            // 관리자 아이디('admin')는 형식 검사 건너뜀
            if (studentId === 'admin') return;

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
                    if (doc.exists) setIdError("이미 가입된 학번입니다.");
                } catch (e) { console.error(e); }
            }
        }
    }, [studentId, idSuffix, view, guestConfig, fixedYearPrefix]);

    const handleEmailBlur = useCallback(async () => {
        if (!emailId) return;
        setEmailError("");
        
        // admin이면 입력값 그대로, 아니면 @snu.ac.kr 붙임
        const fullEmail = (studentId === 'admin') ? emailId : `${emailId}@snu.ac.kr`;
        
        // 관리자('admin') 가입 시 DB 중복 체크 건너뜀
        if (studentId === 'admin') return;

        if (view === 'register') {
            try {
                const query = await db.collection("public_users").where("email", "==", fullEmail).get();
                if (!query.empty) setEmailError("이미 가입된 아이디(이메일)입니다.");
            } catch (e) { console.error(e); }
        }
    }, [emailId, view, studentId]);

    const handlePwBlur = useCallback(() => {
        if (!pw) return;
        setPwError("");
        if (pw.length < 6) setPwError("비밀번호는 6자리 이상이어야 합니다.");
    }, [pw]);

    const handleGuestLogin = useCallback((e) => {
        e.preventDefault();
        if (!guestName.trim()) {
            setError("이름을 입력해주세요.");
            return;
        }
        setLoading(true);
        const fullYear = guestYear < 100 ? 2000 + guestYear : guestYear;
        setTimeout(() => {
            onGuestLogin(guestName, fullYear);
            setLoading(false);
        }, 300);
    }, [guestName, guestYear, onGuestLogin]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (idError || emailError || pwError) return; 

        setLoading(true);

        try {
            let finalStudentId = studentId;
            let fullEmail = (studentId === 'admin') ? emailId : `${emailId}@snu.ac.kr`;

            // 학번 유효성 검사 (admin 제외)
            if (finalStudentId !== 'admin') {
                if (guestConfig) {
                    if (!/^\d{5}$/.test(idSuffix)) throw new Error("학번 뒷자리 5자리를 정확히 입력해주세요.");
                    finalStudentId = `${fixedYearPrefix}${idSuffix}`;
                } else {
                    const idRegex = /^\d{4}-\d{5}$/;
                    if (view !== 'guest' && !idRegex.test(finalStudentId)) throw new Error("학번 형식이 올바르지 않습니다.");
                }
            }
            
            if (isSaveId) localStorage.setItem('snu_saved_student_id', finalStudentId);
            else localStorage.removeItem('snu_saved_student_id');

            if (view === 'reset') {
                if (!finalStudentId || !emailId) throw new Error("학번과 아이디(이메일)를 입력해주세요.");
                await auth.sendPasswordResetEmail(fullEmail);
                setMessage("가입된 정보가 맞다면 재설정 메일이 발송됩니다.\n[스팸 메일함]도 꼭 확인해주세요.");
                setLoading(false);
                return;
            }

            const persistenceMode = isAutoLogin ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
            await auth.setPersistence(persistenceMode);

            if (view === 'register') {
                if (!name) throw new Error("이름을 입력해주세요.");
                if (!emailId) throw new Error("아이디(이메일)를 입력해주세요.");
                if (pw.length < 6) throw new Error("비밀번호는 6자리 이상이어야 합니다.");
                if (pw !== confirmPw) throw new Error("비밀번호가 일치하지 않습니다.");

                const idCheckDoc = await db.collection("public_users").doc(finalStudentId).get();
                if (idCheckDoc.exists) throw new Error("이미 가입된 학번(ID)입니다.");
                
                // admin이 아닐 때만 이메일 중복 DB 체크
                if (finalStudentId !== 'admin') {
                    const emailCheckQuery = await db.collection("public_users").where("email", "==", fullEmail).get();
                    if (!emailCheckQuery.empty) throw new Error("이미 가입된 아이디입니다.");
                }

                const userCred = await auth.createUserWithEmailAndPassword(fullEmail, pw);
                const newSessionId = Date.now().toString();
                sessionStorage.setItem('snu_session_id', newSessionId);

                let derivedYear = 0;
                let initialData;
                let finalConfig;

                // 일반 유저 데이터 설정
                if (finalStudentId !== 'admin') {
                    derivedYear = parseInt(finalStudentId.substring(2, 4));
                    // 2000년대 학번 가정
                    derivedYear = 2000 + derivedYear;

                    if (guestData && guestConfig) {
                        initialData = guestData;
                        finalConfig = { ...guestConfig, studentId: finalStudentId, email: fullEmail, studentYear: derivedYear };
                    } else {
                        initialData = JSON.parse(JSON.stringify(BASE_DATA)); 
                        if (window.getGeneralDataByYear) {
                            const genItems = window.getGeneralDataByYear(derivedYear);
                            if (genItems.length > 0) initialData.general.items = genItems;
                        }
                        if (window.getTeachingDataByYear) {
                            const teachItems = window.getTeachingDataByYear(derivedYear);
                            if (teachItems.length > 0) initialData.teaching.items = teachItems;
                        }
                        // [신규] 기타 졸업요건 초기화
                        if (window.getEtcGradDataByYear) {
                            const etcItems = window.getEtcGradDataByYear(derivedYear);
                            if (etcItems.length > 0) initialData.etcGrad.items = etcItems;
                        }
                        finalConfig = { userName: name, studentYear: derivedYear, majorPath: "single", secondMajorTitle: "" };
                    }
                } else {
                    // 관리자용 데이터 설정
                    finalConfig = { userName: name, studentYear: 0, majorPath: "admin", secondMajorTitle: "" };
                    initialData = {};
                }

                const batch = db.batch();
                const userRef = db.collection("users").doc(userCred.user.uid);
                
                const userData = {
                    userName: name,
                    studentId: finalStudentId,
                    email: fullEmail, 
                    studentYear: derivedYear,
                    majorPath: finalConfig.majorPath,
                    config: finalConfig,
                    data: initialData,
                    lastSessionId: newSessionId,
                    // [중요] Firestore 규칙 준수를 위해 isAdmin, isLocked 필드 제거
                    // 규칙: !request.resource.data.keys().hasAny(['isAdmin', 'isLocked'])
                    // 값이 false여도 키가 존재하면 규칙 위반으로 생성 거부됨.
                };

                batch.set(userRef, userData, { merge: true });

                // [수정] public_users 저장 시 uid 필드 추가 (Firestore 규칙 준수)
                const publicRef = db.collection("public_users").doc(finalStudentId);
                batch.set(publicRef, { 
                    email: fullEmail, 
                    taken: true,
                    uid: userCred.user.uid // <-- 필수 필드
                });

                await batch.commit();
                await window.logAccess(userCred.user.uid, name, finalStudentId, 'LOGIN');

                if (guestConfig) {
                    localStorage.removeItem('snu_guest_mode');
                    localStorage.removeItem('snu_guest_data');
                }
                
                setAuthModal({
                    show: true,
                    message: guestConfig ? "계정이 생성되었습니다.\n기존 데이터가 그대로 유지됩니다." : "가입이 완료되었습니다.",
                    onConfirm: () => {
                        setAuthModal({ show: false, message: '', onConfirm: null });
                        onLoginSuccess(true);
                    }
                });
            } else {
                if (!pw) throw new Error("비밀번호를 입력해주세요.");
                
                const publicDoc = await db.collection("public_users").doc(finalStudentId).get();
                if (!publicDoc.exists) {
                    try {
                        const legacyFakeEmail = `${finalStudentId}@snu.grad.test`;
                        await auth.signInWithEmailAndPassword(legacyFakeEmail, pw);
                    } catch (e) { throw new Error("LOGIN_FAIL"); }
                } else {
                    const targetEmail = publicDoc.data().email;
                    await auth.signInWithEmailAndPassword(targetEmail, pw);
                }

                const currentUser = auth.currentUser;
                const userDoc = await db.collection("users").doc(currentUser.uid).get();
                
                if (userDoc.exists && userDoc.data().isLocked) {
                    await auth.signOut();
                    throw new Error("관리자에 의해 계정이 정지되었습니다.");
                }

                const newSessionId = Date.now().toString();
                sessionStorage.setItem('snu_session_id', newSessionId);
                await db.collection("users").doc(currentUser.uid).update({ lastSessionId: newSessionId });
                
                if (userDoc.exists) {
                    const uData = userDoc.data();
                    await window.logAccess(currentUser.uid, uData.userName, uData.studentId, 'LOGIN');
                } else if (finalStudentId === 'admin') {
                    await window.logAccess(currentUser.uid, '관리자', 'admin', 'LOGIN');
                }

                onLoginSuccess(false);
            }
        } catch (err) {
            let msg = "오류 발생";
            if (err.message === "LOGIN_FAIL" || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-login-credentials' || err.code === 'auth/invalid-credential') {
                msg = "학번 또는 비밀번호를 확인해주세요.";
            } else if (err.code === 'permission-denied') msg = "보안 오류: 접근 권한이 없습니다.";
            else if (err.code === 'auth/email-already-in-use') msg = "이미 가입된 아이디입니다.";
            else if (err.code === 'auth/invalid-email') msg = "이메일 형식이 올바르지 않습니다.";
            else msg = err.message;
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (guestConfig) return "계정 생성 (데이터 유지)";
        if (view === 'reset') return "비밀번호 재설정";
        if (view === 'register') return "새 계정 만들기";
        if (view === 'guest') return "게스트 시작";
        return "졸업 관리 로그인";
    };

    const switchView = useCallback((newView) => {
        setView(newView);
        setError(""); setMessage(""); 
        setIdError(""); setEmailError(""); setPwError("");
        if (!isSaveId) setStudentId(""); 
        setEmailId(""); setPw(""); setName(""); setConfirmPw("");
        setGuestName("");
    }, [isSaveId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <AlertModal show={authModal.show} message={authModal.message} onConfirm={authModal.onConfirm} level="info" />

            <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md border border-slate-100 transition-all relative">
                {guestConfig && (
                    <button onClick={onCancel} className="absolute top-8 right-8 text-slate-400 hover:text-indigo-600 transition-colors">
                        <span className="text-xs font-bold">취소</span>
                    </button>
                )}

                <div className="flex justify-center mb-6">
                    <div className={`p-4 rounded-full ${view === 'guest' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {view === 'reset' ? <Icons.Zap /> : view === 'guest' ? <Icons.User /> : <Icons.Cap />}
                    </div>
                </div>
                
                <h2 className={`text-2xl font-black mb-2 text-center ${view === 'guest' ? 'text-emerald-900' : 'text-indigo-900'}`}>{getTitle()}</h2>
                
                {view === 'reset' && !message && (
                    <p className="text-sm text-slate-500 text-center mb-4 px-4">가입하신 <strong>학번</strong>과 <strong>아이디(이메일)</strong>를 입력하시면<br/>재설정 링크를 보내드립니다.</p>
                )}

                {view === 'guest' ? (
                    <form onSubmit={handleGuestLogin} className="space-y-4 font-bold">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">이름</label>
                            <input type="text" value={guestName} onChange={e=>setGuestName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100" placeholder="이름 (또는 닉네임)" required />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">입학 연도 (학번)</label>
                            <div className="relative">
                                <select value={guestYear} onChange={e=>setGuestYear(parseInt(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 appearance-none font-bold text-slate-700 cursor-pointer">
                                    {AVAILABLE_YEARS.map(y => <option key={y} value={y % 100}>{y % 100}학번</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                        {error && <div className="text-red-500 text-sm text-center font-black bg-red-50 p-2 rounded-lg">{error}</div>}
                        <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                            {loading ? "시작하는 중..." : "게스트로 시작하기"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleAuth} className="space-y-4 font-bold">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">학번</label>
                            {guestConfig ? (
                                <div className={`flex items-center w-full px-4 py-4 rounded-2xl transition-colors border border-transparent ${idError ? 'bg-red-50 ring-2 ring-red-200' : 'bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-100'}`}>
                                    <span className="text-slate-500 font-bold mr-1 shrink-0 select-none">{fixedYearPrefix}</span>
                                    <input 
                                        type="text" 
                                        value={idSuffix} 
                                        onChange={e => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            if(val.length <= 5) setIdSuffix(val);
                                        }} 
                                        onBlur={handleIdBlur} 
                                        className="bg-transparent outline-none flex-1 w-full min-w-0 font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal" 
                                        placeholder="12345" 
                                        required 
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    <input type="text" value={studentId} onChange={e=>setStudentId(e.target.value)} onBlur={handleIdBlur} className={`w-full p-4 rounded-2xl outline-none focus:ring-2 transition-colors ${idError ? 'bg-red-50 focus:ring-red-200' : 'bg-slate-50 focus:ring-indigo-100'}`} placeholder="예: 2024-12345" required />
                                </div>
                            )}
                            
                            {idError ? <p className="text-[10px] text-red-500 mt-1 ml-1 font-black">{idError}</p> : (view === 'register' && !guestConfig) && <p className="text-[10px] text-slate-400 mt-1 ml-1">* {AVAILABLE_YEARS[0]}~{AVAILABLE_YEARS[AVAILABLE_YEARS.length-1]}학번만 가입 가능</p>}
                        </div>

                        {(view === 'register' || view === 'reset') && (
                            <div>
                                <label className="block text-xs text-slate-400 mb-1 ml-1">{studentId === 'admin' ? '관리자 이메일' : '마이스누 아이디 (mySNU)'}</label>
                                <div className={`flex items-center w-full px-4 py-4 rounded-2xl transition-colors border border-transparent ${emailError ? 'bg-red-50 ring-2 ring-red-200' : 'bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-100'}`}>
                                    <div className="text-slate-400 mr-3 pointer-events-none shrink-0"><Icons.Mail /></div>
                                    <input 
                                        type={studentId === 'admin' ? "email" : "text"} 
                                        value={emailId} 
                                        onChange={e=>setEmailId(e.target.value)} 
                                        onBlur={handleEmailBlur} 
                                        className="bg-transparent outline-none flex-1 w-full min-w-0 font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal" 
                                        placeholder={studentId === 'admin' ? "이메일 전체 입력 (예: admin@naver.com)" : "아이디 입력"} 
                                        required 
                                    />
                                    {studentId !== 'admin' && <span className="text-slate-500 font-bold ml-1 shrink-0">@snu.ac.kr</span>}
                                </div>
                                {emailError && <p className="text-[10px] text-red-500 mt-1 ml-1 font-black">{emailError}</p>}
                            </div>
                        )}
                        {view === 'register' && (
                            <div>
                                <label className="block text-xs text-slate-400 mb-1 ml-1">이름</label>
                                <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100" placeholder="본명" required />
                            </div>
                        )}
                        {view !== 'reset' && (
                            <div>
                                <label className="block text-xs text-slate-400 mb-1 ml-1">비밀번호</label>
                                <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onBlur={handlePwBlur} className={`w-full p-4 rounded-2xl outline-none focus:ring-2 transition-colors ${pwError ? 'bg-red-50 focus:ring-red-200' : 'bg-slate-50 focus:ring-indigo-100'}`} placeholder="6자리 이상" required />
                                {pwError && <p className="text-[10px] text-red-500 mt-1 ml-1 font-black">{pwError}</p>}
                            </div>
                        )}
                        {view === 'register' && (
                            <div>
                                <label className="block text-xs text-slate-400 mb-1 ml-1">비밀번호 확인</label>
                                <input type="password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} className={`w-full p-4 rounded-2xl outline-none focus:ring-2 ${confirmPw && pw !== confirmPw ? 'focus:ring-red-200 bg-red-50' : 'focus:ring-indigo-100 bg-slate-50'}`} placeholder="비밀번호 다시 입력" required />
                                {confirmPw && pw !== confirmPw && <p className="text-[10px] text-red-500 mt-1 ml-1 font-black">비밀번호가 일치하지 않습니다.</p>}
                            </div>
                        )}
                        {view === 'login' && (
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isAutoLogin ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                                            {isAutoLogin && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <input type="checkbox" checked={isAutoLogin} onChange={e => setIsAutoLogin(e.target.checked)} className="hidden" />
                                        <span className={`text-xs ml-2 font-bold ${isAutoLogin ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`}>자동 로그인</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSaveId ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                                            {isSaveId && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <input type="checkbox" checked={isSaveId} onChange={e => setIsSaveId(e.target.checked)} className="hidden" />
                                        <span className={`text-xs ml-2 font-bold ${isSaveId ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`}>아이디 저장</span>
                                    </label>
                                </div>
                                <button type="button" onClick={() => switchView('reset')} className="text-xs text-slate-400 hover:text-indigo-500 font-bold">비밀번호 찾기</button>
                            </div>
                        )}
                        {error && <div className="text-red-500 text-sm text-center font-black bg-red-50 p-2 rounded-lg">{error}</div>}
                        {message && <div className="text-green-600 text-sm text-center font-black bg-green-50 p-3 rounded-lg whitespace-pre-wrap leading-relaxed">{message}</div>}
                        <button type="submit" disabled={loading || (view === 'reset' && !!message)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                            {loading ? "처리중..." : (view === 'login' ? "로그인" : view === 'register' ? "가입하기" : "재설정 이메일 보내기")}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center space-y-2">
                    {!guestConfig && (view === 'login' ? (
                        <div className="flex flex-col gap-2">
                            <button onClick={() => switchView('register')} className="text-slate-400 text-sm font-bold hover:text-indigo-500 transition-colors">계정이 없으신가요? 회원가입</button>
                            <button onClick={() => switchView('guest')} className="text-emerald-500 text-sm font-bold hover:text-emerald-600 transition-colors">로그인 없이 게스트로 시작하기</button>
                        </div>
                    ) : (
                        <button onClick={() => switchView('login')} className="text-slate-400 text-sm font-bold hover:text-indigo-500 transition-colors">로그인 화면으로 돌아가기</button>
                    ))}
                </div>
            </div>
        </div>
    );
});