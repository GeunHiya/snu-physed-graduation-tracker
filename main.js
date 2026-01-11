const { useState, useMemo, useEffect, useRef, useCallback } = React;

// --- Footer 컴포넌트 ---
const Footer = ({ onOpenContact }) => {
    return (
        <footer className="mt-24 pt-12 pb-12 border-t border-slate-200 text-center">
            <div className="flex flex-col items-center space-y-5">
                <h4 className="text-indigo-900 font-black text-xl tracking-tight flex items-center gap-2">
                    <Icons.Cap /> SNU PhysEd Graduation Tracker
                </h4>
                
                <div className="flex items-center gap-2 text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                    <span>v1.0.3</span>
                    <span className="w-1 h-1 bg-indigo-300 rounded-full"></span>
                    <span>Stable</span>
                </div>

                <div className="flex flex-wrap justify-center gap-4 text-sm font-bold text-slate-600 my-2">
                    <a href="https://physed.snu.ac.kr/20212022%ed%95%99%eb%b2%88/" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                        <Icons.Book /> 물리교육과 졸업사정 기준 확인
                    </a>
                    <span className="text-slate-300">|</span>
                    <button onClick={onOpenContact} className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                        <Icons.Mail /> 문의 / 민원 접수
                    </button>
                </div>

                <div className="text-[11px] text-slate-400 font-medium max-w-2xl leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="mb-3 font-bold text-slate-500">[개인정보 처리 방침]</p>
                    <p className="mb-2">
                        본 서비스는 서울대학교 물리교육과 학생들의 효율적인 졸업 이수 학점 관리를 돕기 위해 제작되었습니다. 
                        서비스 이용을 위해 수집된 정보(이메일, 이름, 학번, 수강 이력 등)는 <strong>Google Firebase</strong> 서버에 암호화되어 안전하게 저장되며, 
                        <strong>사용자의 졸업 요건 충족 여부 확인 및 데이터 동기화 목적</strong> 외에는 절대 사용되지 않습니다.
                    </p>
                    <p className="text-slate-300 mt-4 border-t border-slate-200 pt-2">
                        * 본 서비스의 소스 코드는 비공개(Closed Source)이며, 허가 없는 무단 복제 및 배포를 금합니다.
                    </p>
                </div>

                <p className="text-xs text-slate-300 font-black mt-4">
                    © {new Date().getFullYear()} Park Geun-hyeong. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [data, setData] = useState(BASE_DATA);
    
    // [변수명 변경] 실제 연락처 이메일 (userEmail)
    const [userEmail, setUserEmail] = useState('');

    const [modal, setModal] = useState({ show: false, message: '', onConfirm: null, verificationWord: '', isDestructive: false });
    const [draggedItem, setDraggedItem] = useState(null);
    const [canDrag, setCanDrag] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    
    const [editStage, setEditStage] = useState('none');
    const [showContact, setShowContact] = useState(false);

    const [verifyPassword, setVerifyPassword] = useState('');
    const [profileForm, setProfileForm] = useState({ name: '', email: '', newPw: '', confirmPw: '' });
    const [profileError, setProfileError] = useState('');

    const [newInputs, setNewInputs] = useState({ general: { name: '', credits: 3 }, teaching: { name: '', credits: 2 }, physics: { name: '', credits: 3 }, indEng: { name: '', credits: 3 }, shared: { name: '', credits: 3 }, etcGrad: { name: '', credits: 0 }, elective: { name: '', credits: 3 } });
    
    const sectionRefs = { general: useRef(null), teaching: useRef(null), physics: useRef(null), indEng: useRef(null), shared: useRef(null), etcGrad: useRef(null), elective: useRef(null), header: useRef(null) };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                try {
                    const docSnap = await db.collection("users").doc(currentUser.uid).get();
                    if (docSnap.exists) {
                        const savedData = docSnap.data();
                        
                        // [수정] DB에서 실제 이메일 로드
                        setUserEmail(savedData.email || "");

                        let loadedConfig = savedData.config || DEFAULT_CONFIG;
                        let configChanged = false;

                        // [수정] 학번(studentId) 정보를 config에 포함
                        if (savedData.studentId) {
                            loadedConfig = { ...loadedConfig, studentId: savedData.studentId };
                        }

                        // [수정] 이메일 파싱 로직 제거 -> DB의 studentYear 사용
                        if (savedData.studentYear && loadedConfig.studentYear !== savedData.studentYear) {
                            loadedConfig = { ...loadedConfig, studentYear: savedData.studentYear };
                            configChanged = true;
                        }

                        if (!loadedConfig.userName && savedData.userName) {
                            loadedConfig = { ...loadedConfig, userName: savedData.userName };
                            configChanged = true;
                        }

                        if (configChanged) {
                            db.collection("users").doc(currentUser.uid).set({ config: loadedConfig }, { merge: true });
                        }

                        setConfig(loadedConfig);
                        if (savedData.data) setData(savedData.data);
                    }
                } catch (e) { console.error(e); }
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user && !loading) {
            const timer = setTimeout(() => {
                db.collection("users").doc(user.uid).set({ config, data }, { merge: true });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [config, data, user, loading]);

    useEffect(() => {
        const genItems = getGeneralDataByYear(config.studentYear);
        const teachItems = getTeachingDataByYear(config.studentYear);
        setData(prev => {
            const next = { ...prev };
            if (genItems.length > 0 && prev.general.items.length === 0) next.general = { ...next.general, items: genItems };
            if (teachItems.length > 0 && prev.teaching.items.length === 0) next.teaching = { ...next.teaching, items: teachItems };
            return next;
        });
    }, [config.studentYear]);

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const dynamicTargets = useMemo(() => {
        const { studentYear, majorPath } = config;
        let ge = studentYear <= 22 ? 41 : (studentYear >= 25 ? 39 : 42);
        let tc = studentYear <= 23 ? 22 : 23; 
        let pri = majorPath === 'single' ? 60 : 52;
        let sec = majorPath === 'double' ? 39 : (majorPath === 'minor' ? 21 : 0);
        return { general: ge, teaching: tc, physics: pri, indEng: sec, total: 130 };
    }, [config]);

    const stats = useMemo(() => {
        const res = {};
        let totalGradEarned = 0;
        const sharedEarned = data.shared.items.filter(i => i.completed).reduce((a, c) => a + (Number(c.credits) || 0), 0);
        const electiveEarned = data.elective.items.filter(i => i.completed).reduce((a, c) => a + (Number(c.credits) || 0), 0);
        Object.keys(data).forEach(k => {
            const target = dynamicTargets[k] || 0;
            let earned = data[k].items.filter(i => !i.hidden && (i.completed || (i.multi && i.checks?.every(c => c)))).reduce((a, c) => a + (Number(c.credits) || 0), 0);
            if (k === 'physics' || k === 'indEng') earned += sharedEarned;
            if (['general', 'teaching'].includes(k)) totalGradEarned += earned;
            else if (['physics', 'indEng'].includes(k)) totalGradEarned += data[k].items.filter(i => !i.hidden && i.completed).reduce((a, c) => a + (Number(c.credits) || 0), 0);
            const visibleItems = data[k].items.filter(i => !i.hidden);
            res[k] = { earned, target, isComplete: k === 'etcGrad' ? (visibleItems.length > 0 && visibleItems.every(i => i.completed || (i.multi && i.checks?.every(c => c)))) : earned >= target, percent: target > 0 ? Math.min(100, Math.round((earned / target) * 100)) : (visibleItems.length > 0 ? Math.round((visibleItems.filter(i => i.completed || (i.multi && i.checks?.every(c => c))).length / visibleItems.length) * 100) : 0) };
        });
        const finalOverall = totalGradEarned + sharedEarned + electiveEarned;
        res.overall = { earned: finalOverall, target: 130, percent: Math.min(100, Math.round((finalOverall / 130) * 100)) };
        res.general.isRecommendedMissing = !data.general.items.some(i => i.recommendedSupport && i.isRecommended);
        return res;
    }, [data, dynamicTargets]);

    const remaining = useMemo(() => {
        const list = Object.keys(data).flatMap(k => data[k].items.filter(i => !i.hidden && (i.multi ? !i.checks?.every(c => c) : !i.completed)).map(i => {
            let nameStr = i.name;
            if (i.type === 'foreign1' || i.type === 'foreign2') nameStr = i.subName === '면제' || i.subName === '제2외국어' || (i.type === 'foreign2' && i.subName === '') ? `외국어: ${i.subName} ${i.name ? `(${i.name})` : ''}` : `외국어: ${i.subName || i.name}`;
            if (i.type === 'msSet') nameStr = `${i.name}: ${i.subName}`;
            if (i.type === 'core' || i.type === 'coreFixed' || i.type === 'pe' || i.type === 'computer' || i.type === 'veritas' || i.type === 'keys') nameStr = `${i.prefix}: ${i.name}`;
            return { ...i, displayName: nameStr, catTitle: k === 'indEng' ? `${config.secondMajorTitle} (제2전공)` : data[k].title, catKey: k };
        }));
        return config.majorPath === 'single' ? list.filter(i => i.catKey !== 'indEng' && i.catKey !== 'shared') : list;
    }, [data, config]);

    const scrollToSection = (id) => { const target = id === 'top' ? sectionRefs.header.current : sectionRefs[id]?.current; if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    const toggleItem = (ck, id) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, completed: !i.completed } : i) } }));
    const toggleMultiCheck = (ck, id, idx) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, checks: i.checks.map((c, ci) => ci === idx ? !c : c) } : i) } }));
    const updateCredits = (ck, id, val) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, credits: val === "" ? "" : parseInt(val) || 0 } : i) } }));
    const updateName = (ck, id, val) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, name: val } : i) } }));
    const toggleRecommended = (ck, id) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, isRecommended: !i.isRecommended } : i) } }));
    const handleMathChange = (ck, id, mainMath) => { const pair = MATH1_PAIRS.concat(MATH2_PAIRS).find(p => p.main === mainMath); if (!pair) return; setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => { if (i.id === id) return { ...i, subName: pair.main, name: pair.main }; if (id === 'g_m1' && i.id === 'g_mp1') return { ...i, name: pair.practice }; if (id === 'g_m2' && i.id === 'g_mp2') return { ...i, name: pair.practice }; return i; })}})); };
    const handleMSChange = (ck, id, selectedMain) => { const opt = MS_OPTIONS.find(o => o.main === selectedMain); const suffix = id.slice(-1); setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => { if (i.id === id) return { ...i, subName: opt.main, credits: opt.mainCr }; if (i.id === `g_msp${suffix}`) return { ...i, name: opt.practice || '', credits: opt.pracCr, hidden: opt.practice === null }; return i; })}})); };
    const handleCorePrefixChange = (ck, id, prefix) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, prefix } : i) } }));
    const handleForeignChange = (ck, id, field, val) => { setData(prev => { let newItems = prev[ck].items.map(i => i.id === id ? (val === '면제' ? { ...i, [field]: val, name: '' } : { ...i, [field]: val }) : i); const currentF1 = newItems.find(i => i.type === 'foreign1'); const currentF2 = newItems.find(i => i.type === 'foreign2'); if (currentF1 && currentF2) { if (currentF1.subName === '고급영어' || currentF1.subName === '면제') { if (currentF2.subName !== '제2외국어') newItems = newItems.map(i => i.id === currentF2.id ? { ...i, subName: '제2외국어', name: '' } : i); } else if (currentF1.subName === '대학영어 2') { if ((currentF2.subName === '대학영어 1' || currentF2.subName === '대학영어 2') && !['고급영어', '제2외국어'].includes(currentF2.subName)) newItems = newItems.map(i => i.id === currentF2.id ? { ...i, subName: '' } : i); } } return { ...prev, [ck]: { ...prev[ck], items: newItems } }; }); };
    const handleBasicEnglishYearChange = (ck, id, yearType) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, takenYear: yearType, credits: yearType === 'before23' ? 1 : 2 } : i) } }));
    
    const deleteItem = (ck, id) => { 
        const item = data[ck].items.find(i => i.id === id); 
        if (item.deleteMsg) { 
            setModal({ 
                show: true, 
                message: item.deleteMsg, 
                verificationWord: null, 
                onConfirm: () => { 
                    setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.filter(i => { if (id === 'g_m2' && i.id === 'g_mp2') return false; return i.id !== id; }) } })); 
                    setModal({ show: false, message: '', verificationWord: '' }); 
                },
                onCancel: () => setModal({ show: false, message: '', verificationWord: '' })
            }); 
        } else if (confirm("삭제하시겠습니까?")) {
            setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.filter(i => i.id !== id) } })); 
        }
    };
    
    const handleDragStart = (ck, index) => setDraggedItem({ cat: ck, index });
    const handleDragEnter = (ck, targetIndex) => { if (!draggedItem || draggedItem.cat !== ck || draggedItem.index === targetIndex || data[ck].dragDisabled) return; if (data[ck].items[targetIndex].fixed) return; const newItems = [...data[ck].items]; const [removed] = newItems.splice(draggedItem.index, 1); newItems.splice(targetIndex, 0, removed); setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: newItems } })); setDraggedItem({ cat: ck, index: targetIndex }); };
    const addNew = (ck) => { const input = newInputs[ck]; if (!input.name.trim()) return; setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: [...prev[ck].items, { id: `${ck}-${Date.now()}`, name: input.name.trim(), completed: false, credits: parseInt(input.credits) || 0 }] } })); setNewInputs(p => ({ ...p, [ck]: { ...p[ck], name: '' } })); };
    const handleSubjectSelect = (ck, id, selectedName) => { const option = PHYSICS_ED_CHOICES.find(o => o.name === selectedName); setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, name: option.name, credits: option.credits } : i) } })); };
    const getForeign2Options = () => { const f1 = data.general.items.find(i => i.type === 'foreign1'); if (!f1) return []; const val = f1.subName; if (val === '대학영어 1') return ['대학영어 2', '고급영어', '제2외국어']; if (val === '대학영어 2') return ['고급영어', '제2외국어']; if (val === '고급영어' || val === '면제') return ['제2외국어']; return ['대학영어 1', '대학영어 2', '고급영어', '제2외국어', '면제']; };
    
    // 섹션별 초기화 핸들러
    const handleSectionReset = (sectionKey) => {
        const sectionName = data[sectionKey].title;
        setModal({
            show: true,
            message: `정말로 '${sectionName}' 영역의 입력을 초기화하시겠습니까?\n해당 영역에 입력된 모든 내용이 삭제되고 기본 상태로 돌아갑니다.`,
            verificationWord: "확인",
            isDestructive: true,
            onConfirm: () => {
                setData(prev => {
                    const next = { ...prev };
                    let resetItems = [];

                    if (sectionKey === 'general') {
                        resetItems = getGeneralDataByYear(config.studentYear);
                    } else if (sectionKey === 'teaching') {
                        resetItems = getTeachingDataByYear(config.studentYear);
                    } else {
                        const baseDataCopy = JSON.parse(JSON.stringify(BASE_DATA));
                        resetItems = baseDataCopy[sectionKey].items || [];
                    }

                    next[sectionKey] = { ...next[sectionKey], items: resetItems };
                    return next;
                });
                setModal({ show: false, message: '', verificationWord: '' });
            },
            onCancel: () => setModal({ show: false, message: '', verificationWord: '' })
        });
    };

    const handleResetData = () => {
        setModal({
            show: true,
            message: "모든 입력 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
            verificationWord: "확인",
            isDestructive: false,
            onConfirm: async () => {
                const freshData = JSON.parse(JSON.stringify(BASE_DATA));
                const genItems = getGeneralDataByYear(config.studentYear);
                const teachItems = getTeachingDataByYear(config.studentYear);
                if (genItems.length > 0) freshData.general.items = genItems;
                if (teachItems.length > 0) freshData.teaching.items = teachItems;

                setData(freshData);
                await db.collection("users").doc(user.uid).update({ data: freshData });
                setModal({ show: false, message: '', verificationWord: '' });
            },
            onCancel: () => setModal({ show: false, message: '', verificationWord: '' })
        });
    };

    const handleDeleteAccount = () => {
        setModal({
            show: true,
            message: "정말로 계정을 삭제하시겠습니까? 모든 데이터가 영구적으로 삭제됩니다.",
            verificationWord: "삭제",
            isDestructive: true,
            onConfirm: async () => {
                try {
                    const currentUser = auth.currentUser;
                    if (!currentUser) { alert("로그인 정보가 유효하지 않습니다."); return; }
                    await db.collection("users").doc(currentUser.uid).delete();
                    await currentUser.delete();
                    setModal({ show: false, message: '', verificationWord: '' });
                } catch (error) {
                    if (error.code === 'auth/requires-recent-login') {
                        alert("보안을 위해 계정 삭제는 로그인 직후에만 가능합니다.\n\n로그아웃합니다. 다시 로그인하신 후 시도해주세요.");
                        await auth.signOut();
                    } else { alert("오류가 발생했습니다: " + error.message); }
                    setModal({ show: false, message: '', verificationWord: '' });
                }
            },
            onCancel: () => setModal({ show: false, message: '', verificationWord: '' })
        });
    };

    // 문의 제출 핸들러 (수정됨: 실제 이메일 userEmail 사용)
    const handleInquirySubmit = async (messageContent) => {
        try {
            const emailBody = {
                subject: `[서울대 물리교육 졸업관리] ${config.userName}님의 새로운 문의입니다.`,
                html: `
                    <h2>새로운 문의/민원이 접수되었습니다.</h2>
                    <p><strong>보낸 사람:</strong> ${config.userName} (${config.studentId || user.email.split('@')[0]})</p>
                    <p><strong>연락처 이메일:</strong> ${userEmail}</p>
                    
                    <hr/>
                    <h3>문의 내용:</h3>
                    <p style="white-space: pre-wrap;">${messageContent}</p>
                    <br/>
                    <p style="font-size: 12px; color: #888;">이 메일은 Firebase Trigger Email 확장을 통해 자동 발송되었습니다.</p>
                `
            };

            await db.collection('inquiries').add({
                to: ['rmsguddi@snu.ac.kr'], 
                message: emailBody,         
                createdAt: new Date(),
                userId: user.uid,           
                rawMessage: messageContent  
            });

            alert("문의가 성공적으로 접수되었습니다.\n관리자 메일로 전송되었습니다.");
            setShowContact(false);
        } catch (error) {
            console.error(error);
            alert("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    };

    const openEditProfile = () => {
        setEditStage('verify');
        setVerifyPassword('');
        setProfileError('');
        // [수정] 프로필 수정 폼에 userEmail 사용
        setProfileForm({ name: config.userName, email: userEmail, newPw: '', confirmPw: '' });
    };

    const onVerifyPassword = async () => {
        try {
            setProfileError('');
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, verifyPassword);
            await user.reauthenticateWithCredential(credential);
            setEditStage('form');
        } catch (error) {
            setProfileError("비밀번호가 일치하지 않습니다.");
        }
    };

    const onUpdateProfile = async () => {
        try {
            setProfileError('');
            if (!profileForm.name.trim()) throw new Error("이름을 입력해주세요.");
            if (profileForm.newPw) {
                if (profileForm.newPw.length < 6) throw new Error("새 비밀번호는 6자리 이상이어야 합니다.");
                if (profileForm.newPw !== profileForm.confirmPw) throw new Error("새 비밀번호가 서로 일치하지 않습니다.");
            }

            if (profileForm.name !== config.userName) {
                await db.collection("users").doc(user.uid).update({ 
                    userName: profileForm.name,
                    'config.userName': profileForm.name
                });
                setConfig(prev => ({ ...prev, userName: profileForm.name }));
            }

            if (profileForm.newPw) {
                await user.updatePassword(profileForm.newPw);
            }

            if (profileForm.email !== userEmail) {
                await db.collection("users").doc(user.uid).update({ email: profileForm.email });
                setUserEmail(profileForm.email);
            }

            alert("개인정보가 성공적으로 수정되었습니다.");
            setEditStage('none');

        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                alert("보안상 민감한 정보 변경을 위해 다시 로그인이 필요합니다.");
                await auth.signOut();
            } else {
                setProfileError(error.message);
            }
        }
    };

    const handlers = { handleForeignChange, updateName, handleMathChange, handleMSChange, handleCorePrefixChange, handleSubjectSelect, handleBasicEnglishYearChange };
    const dragHandlers = { draggedItem, setDraggedItem, canDrag, setCanDrag, handleDragStart, handleDragEnter };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-indigo-600 text-xl">데이터를 불러오는 중입니다...</div>;
    if (!user) return <AuthScreen onLoginSuccess={() => {}} />;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 relative">
            
            <AlertModal 
                show={modal.show}
                message={modal.message}
                isDestructive={modal.isDestructive}
                verificationWord={modal.verificationWord}
                onConfirm={modal.onConfirm}
                onCancel={modal.onCancel}
            />

            <ProfileEditModal 
                editStage={editStage}
                profileForm={profileForm} setProfileForm={setProfileForm}
                verifyPassword={verifyPassword} setVerifyPassword={setVerifyPassword}
                profileError={profileError}
                onVerifyPassword={onVerifyPassword}
                onUpdateProfile={onUpdateProfile}
                onCancel={() => setEditStage('none')}
            />

            <ContactModal 
                show={showContact}
                config={config}
                contactEmail={userEmail}
                onClose={() => setShowContact(false)}
                onSubmit={handleInquirySubmit}
            />
            
            <Header 
                user={user} 
                config={config} 
                setConfig={setConfig} 
                stats={stats} 
                onLogout={() => auth.signOut()}
                onReset={handleResetData}
                onDeleteAccount={handleDeleteAccount}
                onOpenEditProfile={openEditProfile}
                sectionRef={sectionRefs.header}
            />

            <Dashboard 
                config={config} 
                data={data} 
                stats={stats} 
                scrollToSection={scrollToSection} 
            />

            <CourseList 
                config={config}
                data={data}
                stats={stats}
                remaining={remaining}
                sectionRefs={sectionRefs}
                dragHandlers={dragHandlers}
                handlers={handlers}
                newInputs={newInputs}
                setNewInputs={setNewInputs}
                addNew={addNew}
                deleteItem={deleteItem}
                getForeign2Options={getForeign2Options}
                toggleItem={toggleItem}
                toggleMultiCheck={toggleMultiCheck}
                updateCredits={updateCredits}
                toggleRecommended={toggleRecommended}
                handleSectionReset={handleSectionReset}
            />

            <Footer onOpenContact={() => setShowContact(true)} />

            <button onClick={() => scrollToSection('top')} className={`fixed bottom-8 right-8 p-4 bg-indigo-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-[100] ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`} title="맨 위로"><Icons.ArrowUp /></button>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);