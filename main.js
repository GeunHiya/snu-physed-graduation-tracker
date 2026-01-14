const { useState, useMemo, useEffect, useRef, useCallback } = React;

// [관리자 대시보드 컴포넌트]
const AdminDashboard = React.memo(({ onLogout, onImpersonate, setModal, onOpenEditProfile }) => {
    const [users, setUsers] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [logs, setLogs] = useState([]);
    
    // [추가] 공지사항 관련 state
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState({ title: '', content: '' });

    const [tab, setTab] = useState('users'); 
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (tab === 'users') {
                const snapshot = await db.collection('users').orderBy('studentId').get();
                setUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })));
            } else if (tab === 'inquiries') {
                const userSnap = await db.collection('users').get();
                const userMap = {};
                userSnap.docs.forEach(doc => { userMap[doc.id] = doc.data(); });
                setUsers(userSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() })));

                const inqSnap = await db.collection('inquiries').orderBy('createdAt', 'desc').get();
                setInquiries(inqSnap.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data(),
                    sender: userMap[doc.data().userId] || null
                })));
            } else if (tab === 'logs') {
                const logSnap = await db.collection('access_logs').orderBy('timestamp', 'desc').limit(100).get();
                setLogs(logSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } else if (tab === 'notices') {
                const noticeSnap = await db.collection('notices').orderBy('createdAt', 'desc').get();
                setNotices(noticeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        } catch (error) {
            console.error(error);
            if (tab === 'notices') {
                alert("공지사항을 불러오지 못했습니다.\nFirestore 규칙(Rules)에서 'notices' 컬렉션 접근 권한을 확인해주세요.");
            }
        } finally {
            setLoading(false);
        }
    }, [tab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddNotice = async () => {
        if (!newNotice.title.trim() || !newNotice.content.trim()) return alert("제목과 내용을 모두 입력해주세요.");
        if (!confirm("공지사항을 등록하시겠습니까? 모든 사용자에게 알림이 표시됩니다.")) return;
        
        try {
            await db.collection('notices').add({
                title: newNotice.title,
                content: newNotice.content,
                createdAt: new Date()
            });
            alert("등록되었습니다.");
            setNewNotice({ title: '', content: '' });
            fetchData();
        } catch (e) {
            console.error(e);
            alert("오류 발생: " + e.message + "\n(Firestore 규칙 권한 문제일 수 있습니다)");
        }
    };

    const handleDeleteNotice = async (id) => {
        if (!confirm("정말로 삭제하시겠습니까?")) return;
        try {
            await db.collection('notices').doc(id).delete();
            alert("삭제되었습니다.");
            fetchData();
        } catch (e) {
            alert("오류 발생: " + e.message);
        }
    };

    const handleDeleteUser = (uid, studentId, userName) => {
        setModal({
            show: true,
            message: `[경고] 정말로 ${userName}(${studentId}) 계정을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.\n삭제하려면 '삭제'를 입력하세요.`,
            verificationWord: "삭제",
            level: 'danger',
            onConfirm: async () => {
                try {
                    await db.collection('users').doc(uid).delete();
                    if (studentId && studentId !== 'admin') {
                        await db.collection('public_users').doc(studentId).delete();
                    }
                    setModal({ show: false, message: '', verificationWord: '' });
                    setTimeout(() => {
                        alert(`[중요] 데이터가 삭제되었습니다.\n\n하지만 로그인을 완벽하게 차단하려면,\nFirebase Console > Authentication 탭에서\n해당 사용자(${studentId})를 수동으로 삭제해야 합니다.`);
                    }, 100);
                    fetchData();
                } catch (e) {
                    alert("오류 발생: " + e.message);
                }
            },
            onCancel: () => setModal({ show: false, message: '', verificationWord: '' })
        });
    };

    const handleResetUser = (uid, userName) => {
        setModal({
            show: true,
            message: `${userName} 님의 데이터를 모두 초기화하시겠습니까?\n초기화하려면 '초기화'를 입력하세요.`,
            verificationWord: "초기화",
            level: 'warning',
            onConfirm: async () => {
                try {
                    const freshData = JSON.parse(JSON.stringify(window.BASE_DATA)); 
                    await db.collection('users').doc(uid).update({ data: freshData });
                    setModal({ show: false, message: '', verificationWord: '' });
                    alert("데이터가 초기화되었습니다.");
                } catch (e) {
                    alert("오류 발생: " + e.message);
                }
            },
            onCancel: () => setModal({ show: false, message: '', verificationWord: '' })
        });
    };

    const handleToggleLock = (uid, currentStatus, userName) => {
        const action = currentStatus ? "해제" : "정지";
        setModal({
            show: true,
            message: `${userName} 님의 계정을 정말로 ${action}하시겠습니까?\n진행하려면 '${action}'를 입력하세요.`,
            verificationWord: action,
            level: currentStatus ? 'info' : 'warning',
            onConfirm: async () => {
                try {
                    await db.collection('users').doc(uid).update({ isLocked: !currentStatus });
                    setModal({ show: false, message: '', verificationWord: '' });
                    alert(`계정이 ${action}되었습니다.`);
                    fetchData();
                } catch(e) { 
                    alert("오류 발생: " + e.message); 
                }
            },
            onCancel: () => setModal({ show: false, message: '', verificationWord: '' })
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                        <span className="text-red-500"><Icons.Shield /></span> 관리자 대시보드
                    </h1>
                    <div className="flex gap-2">
                        <button onClick={onOpenEditProfile} className="bg-white dark:bg-slate-800 dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 transition-colors flex items-center gap-2">
                            <Icons.Settings /> 정보 수정
                        </button>
                        <button onClick={onLogout} className="bg-white dark:bg-slate-800 dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 transition-colors">
                            관리자 로그아웃
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <button onClick={() => setTab('users')} className={`px-6 py-3 rounded-2xl font-black transition-all whitespace-nowrap ${tab === 'users' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-500'}`}>
                        사용자 목록
                    </button>
                    <button onClick={() => setTab('inquiries')} className={`px-6 py-3 rounded-2xl font-black transition-all whitespace-nowrap ${tab === 'inquiries' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-500'}`}>
                        문의 내역
                    </button>
                    <button onClick={() => setTab('logs')} className={`px-6 py-3 rounded-2xl font-black transition-all whitespace-nowrap ${tab === 'logs' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-500'}`}>
                        접속 기록
                    </button>
                    <button onClick={() => setTab('notices')} className={`px-6 py-3 rounded-2xl font-black transition-all whitespace-nowrap ${tab === 'notices' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-500'}`}>
                        공지사항 관리
                    </button>
                    <button onClick={fetchData} className="ml-auto px-4 py-3 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-2xl font-bold hover:text-indigo-600 whitespace-nowrap">
                        새로고침
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-400 font-bold">로딩 중...</div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                        {tab === 'users' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                                        <tr>
                                            <th className="p-4 border-b dark:border-slate-700">이름</th>
                                            <th className="p-4 border-b dark:border-slate-700">학번</th>
                                            <th className="p-4 border-b dark:border-slate-700">이메일</th>
                                            <th className="p-4 border-b dark:border-slate-700">상태</th>
                                            <th className="p-4 border-b dark:border-slate-700">최근 접속</th>
                                            <th className="p-4 border-b dark:border-slate-700 text-right">관리</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200">
                                        {users.filter(u => u.studentId !== 'admin').map((u) => (
                                            <tr key={u.uid} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${u.isLocked ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' : ''}`}>
                                                <td className="p-4">{u.userName}</td>
                                                <td className="p-4 text-indigo-600 dark:text-indigo-400">{u.studentId}</td>
                                                <td className="p-4 text-slate-400 font-normal">{u.email}</td>
                                                <td className="p-4">
                                                    {u.isLocked ? <span className="text-red-500">정지됨</span> : <span className="text-green-500">정상</span>}
                                                </td>
                                                <td className="p-4 text-xs text-slate-400">
                                                    {u.lastSessionId ? new Date(parseInt(u.lastSessionId)).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="p-4 flex justify-end gap-2">
                                                    <button onClick={() => onImpersonate(u)} className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-xs">접속</button>
                                                    <button onClick={() => handleToggleLock(u.uid, u.isLocked, u.userName)} className={`px-3 py-1.5 rounded-lg text-xs ${u.isLocked ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'}`}>
                                                        {u.isLocked ? '해제' : '정지'}
                                                    </button>
                                                    <button onClick={() => handleResetUser(u.uid, u.userName)} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 text-xs">초기화</button>
                                                    <button onClick={() => handleDeleteUser(u.uid, u.studentId, u.userName)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 text-xs">삭제</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : tab === 'inquiries' ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {inquiries.map(inq => (
                                    <div key={inq.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <div className="flex justify-between mb-4 pb-2 border-b border-slate-50 dark:border-slate-700">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{inq.message?.subject}</span>
                                                    <span className="text-xs text-slate-400">
                                                        {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleString() : '날짜 없음'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold flex gap-2 items-center">
                                                    <span>From:</span>
                                                    {inq.sender ? (
                                                        <>
                                                            <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">{inq.sender.userName}</span>
                                                            <span className="text-indigo-500 dark:text-indigo-400">{inq.sender.studentId}</span>
                                                            <span className="text-slate-400 font-normal">({inq.sender.email})</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-red-400">알 수 없는 사용자 (탈퇴 또는 오류)</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                            {inq.rawMessage}
                                        </div>
                                    </div>
                                ))}
                                {inquiries.length === 0 && <div className="p-10 text-center text-slate-400">접수된 문의가 없습니다.</div>}
                            </div>
                        ) : tab === 'logs' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                                        <tr>
                                            <th className="p-4 border-b dark:border-slate-700">시간</th>
                                            <th className="p-4 border-b dark:border-slate-700">이름</th>
                                            <th className="p-4 border-b dark:border-slate-700">학번</th>
                                            <th className="p-4 border-b dark:border-slate-700">기기 정보 (User Agent)</th>
                                            <th className="p-4 border-b dark:border-slate-700">유형</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200">
                                        {logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                                                    {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : '방금'}
                                                </td>
                                                <td className="p-4">{log.userName}</td>
                                                <td className="p-4 text-indigo-600 dark:text-indigo-400">{log.studentId}</td>
                                                <td className="p-4 text-xs text-slate-400 font-normal truncate max-w-xs" title={log.userAgent}>
                                                    {log.userAgent}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs border ${log.type === 'LOGOUT' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900'}`}>
                                                        {log.type || 'LOGIN'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {logs.length === 0 && (
                                            <tr><td colSpan="5" className="p-10 text-center text-slate-400">접속 기록이 없습니다.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 md:p-8">
                                <div className="mb-8 bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-4">새 공지사항 작성</h3>
                                    <div className="space-y-4">
                                        <input type="text" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} placeholder="제목" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 font-bold" />
                                        <textarea value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} placeholder="내용" className="w-full h-32 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 resize-none font-medium text-sm" />
                                        <button onClick={handleAddNotice} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors w-full md:w-auto">등록하기</button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">등록된 공지 목록</h3>
                                    {notices.map(notice => (
                                        <div key={notice.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex justify-between items-start hover:shadow-md transition-shadow">
                                            <div className="flex-1 pr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-black text-slate-700 dark:text-slate-200">{notice.title}</h4>
                                                    <span className="text-xs text-slate-400">{notice.createdAt?.toDate ? notice.createdAt.toDate().toLocaleDateString() : ''}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-wrap">{notice.content}</p>
                                            </div>
                                            <button onClick={() => handleDeleteNotice(notice.id)} className="text-red-400 hover:text-red-600 p-2"><Icons.Trash /></button>
                                        </div>
                                    ))}
                                    {notices.length === 0 && <div className="text-center text-slate-400 py-10">등록된 공지사항이 없습니다.</div>}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});

// Footer Component
const Footer = React.memo(({ onOpenContact }) => {
    return (
        <footer className="mt-24 pt-12 pb-12 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="flex flex-col items-center space-y-5">
                <h4 className="text-indigo-900 dark:text-indigo-300 font-black text-xl tracking-tight flex items-center gap-2">
                    <Icons.Cap /> SNU PhysEd Graduation Tracker
                </h4>
                <div className="flex items-center gap-2 text-xs font-bold bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full">
                    <span>v1.2.0</span><span className="w-1 h-1 bg-indigo-300 dark:bg-indigo-500 rounded-full"></span><span>Stable</span>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-400 my-2">
                    <a href="https://physed.snu.ac.kr/20212022%ed%95%99%eb%b2%88/" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"><Icons.Book /> 물리교육과 졸업사정 기준 확인</a>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <button onClick={onOpenContact} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"><Icons.Mail /> 문의 / 민원 접수</button>
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium max-w-2xl leading-relaxed bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="mb-3 font-bold text-slate-500 dark:text-slate-400">[개인정보 처리 방침]</p>
                    <p className="mb-2">본 서비스는 서울대학교 물리교육과 학생들의 효율적인 졸업 이수 학점 관리를 돕기 위해 제작되었습니다. 서비스 이용을 위해 수집된 정보(이메일, 이름, 학번 등)는 <strong>Google Firebase</strong> 서버에 암호화되어 저장됩니다.<br/><span className="text-emerald-500">* 게스트 모드 사용 시 모든 데이터는 사용자 기기에만 저장됩니다.</span></p>
                    <p className="text-slate-300 dark:text-slate-600 mt-4 border-t border-slate-200 dark:border-slate-700 pt-2">* 본 서비스의 소스 코드는 비공개(Closed Source)이며, 허가 없는 무단 복제 및 배포를 금합니다.</p>
                </div>
                <p className="text-xs text-slate-300 dark:text-slate-600 font-black mt-4">© {new Date().getFullYear()} Park Geun-hyeong. All rights reserved.</p>
            </div>
        </footer>
    );
});

const App = () => {
    const [user, setUser] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [data, setData] = useState(BASE_DATA);
    const [userEmail, setUserEmail] = useState('');
    const [modal, setModal] = useState({ show: false, message: '', onConfirm: null, verificationWord: '', level: 'info', onCancel: null });
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
    
    const [isGuestSignup, setIsGuestSignup] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [impersonatedUser, setImpersonatedUser] = useState(null);

    // [추가] 공지사항 관련 state
    const [notices, setNotices] = useState([]);
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [hasUnreadNotice, setHasUnreadNotice] = useState(false);

    // [NEW] 튜토리얼 관련 state
    const [showTutorial, setShowTutorial] = useState(false);

    // [추가] 다크모드 state
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || 
               (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

    const handlers = useDataHandlers(setData, setModal, setNewInputs, newInputs, config);
    const dragHandlers = useMemo(() => ({ draggedItem, setDraggedItem, canDrag, setCanDrag, handleDragStart: (cat, idx) => setDraggedItem({ cat, index: idx }), handleDragEnter: (cat, targetIndex) => { if (!draggedItem || draggedItem.cat !== cat || draggedItem.index === targetIndex || data[cat].dragDisabled) return; if (data[cat].items[targetIndex].fixed) return; const newItems = [...data[cat].items]; const [removed] = newItems.splice(draggedItem.index, 1); newItems.splice(targetIndex, 0, removed); setData(prev => ({ ...prev, [cat]: { ...prev[cat], items: newItems } })); setDraggedItem({ cat, index: targetIndex }); } }), [draggedItem, canDrag, data]);

    const stats = useMemo(() => window.calculateStats(data, config), [data, config]);
    const remaining = useMemo(() => window.calculateRemaining(data, config), [data, config]);

    const startGuestMode = useCallback((name, year) => {
        const guestConfig = { userName: name, studentYear: year, majorPath: "single", secondMajorTitle: "", isGuest: true };
        const initialData = window.getInitialGuestData(year); // data.js의 함수 사용
        localStorage.setItem('snu_guest_mode', 'true');
        localStorage.setItem('snu_guest_data', JSON.stringify({ config: guestConfig, data: initialData }));
        setConfig(guestConfig);
        setData(initialData);
        setIsGuest(true);
        setUser({ uid: 'guest' });
        setLoading(false); 
        
        setShowTutorial(true);
    }, []);

    const handleStartGuestSignup = useCallback(() => {
        setIsGuestSignup(true);
    }, []);

    const handleCancelGuestSignup = useCallback(() => {
        setIsGuestSignup(false);
    }, []);

    const handleGuestYearChange = useCallback((newYear) => {
        setModal({
            show: true, message: `${newYear}학번 기준으로 데이터를 재설정하시겠습니까?\n기존에 입력한 '교양', '전공', '교직' 등 모든 이수 내역이 초기화됩니다.`, verificationWord: "변경", level: 'warning',
            onConfirm: () => {
                const newData = JSON.parse(JSON.stringify(data));
                if (window.getGeneralDataByYear) newData.general.items = window.getGeneralDataByYear(newYear);
                if (window.getTeachingDataByYear) newData.teaching.items = window.getTeachingDataByYear(newYear);
                if (window.getPhysicsDataByYear) newData.physics.items = window.getPhysicsDataByYear(newYear);
                if (window.getEtcGradDataByYear) newData.etcGrad.items = window.getEtcGradDataByYear(newYear);

                setConfig(prev => ({ ...prev, studentYear: newYear }));
                setData(newData);
                localStorage.setItem('snu_guest_data', JSON.stringify({ config: { ...config, studentYear: newYear }, data: newData }));
                setModal({ show: false, message: '', verificationWord: '' });
            }, onCancel: () => setModal({ show: false, message: '', verificationWord: '' })
        });
    }, [data, config]);

    // [추가] 공지사항 fetch 및 읽음 여부 확인
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const snapshot = await db.collection('notices').orderBy('createdAt', 'desc').get();
                const fetchedNotices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setNotices(fetchedNotices);

                if (fetchedNotices.length > 0) {
                    const latestNoticeId = fetchedNotices[0].id;
                    const lastReadId = localStorage.getItem('snu_last_read_notice_id');
                    if (latestNoticeId !== lastReadId) {
                        setHasUnreadNotice(true);
                    } else {
                        setHasUnreadNotice(false);
                    }
                }
            } catch (e) {
                console.error("공지사항 로드 실패", e);
            }
        };

        if (user || isGuest) { // 로그인 완료 후 실행
            fetchNotices();
        }
    }, [user, isGuest]);

    const handleOpenNotice = useCallback(() => {
        setShowNoticeModal(true);
        if (notices.length > 0) {
            const latestId = notices[0].id;
            localStorage.setItem('snu_last_read_notice_id', latestId);
            setHasUnreadNotice(false);
        }
    }, [notices]);

    const handleCloseNotice = useCallback(() => {
        setShowNoticeModal(false);
    }, []);

    const handleTutorialClose = useCallback(() => {
        setShowTutorial(false);
    }, []);

    // [NEW] 로그인 성공 콜백 (신규 유저 감지)
    const onLoginSuccess = useCallback((isNewUser = false) => {
        if (isNewUser) {
            setShowTutorial(true);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                try {
                    const docSnap = await db.collection("users").doc(currentUser.uid).get();
                    if (!docSnap.exists) {
                        await auth.signOut();
                        alert("존재하지 않거나 관리자에 의해 삭제된 계정입니다.");
                        setLoading(false);
                        return;
                    }

                    const savedData = docSnap.data();
                    
                    if (savedData.isLocked) {
                        await auth.signOut();
                        alert("관리자에 의해 계정이 정지되었습니다.");
                        setLoading(false);
                        return;
                    }

                    if (savedData.isAdmin) {
                        setIsAdmin(true);
                        setLoading(false);
                        
                        setUserEmail(savedData.email || "");
                        setConfig(savedData.config || DEFAULT_CONFIG); 
                        
                        setUser(currentUser);
                        return; 
                    }

                    if (!sessionStorage.getItem('snu_session_id')) {
                        const newSessionId = Date.now().toString();
                        sessionStorage.setItem('snu_session_id', newSessionId);
                        await db.collection("users").doc(currentUser.uid).update({ lastSessionId: newSessionId });
                    }

                    setUserEmail(savedData.email || "");
                    let loadedConfig = savedData.config || DEFAULT_CONFIG;
                    if (savedData.studentId) loadedConfig = { ...loadedConfig, studentId: savedData.studentId };
                    if (savedData.studentYear && loadedConfig.studentYear !== savedData.studentYear) loadedConfig = { ...loadedConfig, studentYear: savedData.studentYear };
                    if (!loadedConfig.userName && savedData.userName) loadedConfig = { ...loadedConfig, userName: savedData.userName };
                    setConfig(loadedConfig);
                    if (savedData.data) setData(savedData.data);
                } catch (e) { console.error(e); }
                
                setIsGuest(false);
                setIsGuestSignup(false);
                setUser(currentUser);
            } else {
                const guestMode = localStorage.getItem('snu_guest_mode');
                if (guestMode === 'true') {
                    const savedGuest = localStorage.getItem('snu_guest_data');
                    if (savedGuest) {
                        const parsed = JSON.parse(savedGuest);
                        setConfig(parsed.config || DEFAULT_CONFIG);
                        setData(parsed.data || BASE_DATA);
                        setIsGuest(true);
                        setUser({ uid: 'guest' });
                    } else { setIsGuest(false); setUser(null); }
                } else { setIsGuest(false); setUser(null); }
                setIsAdmin(false);
                setImpersonatedUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user || isGuest || isAdmin) return; 
        const unsubscribeSession = db.collection("users").doc(user.uid).onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data.isLocked) {
                    alert("관리자에 의해 계정이 정지되었습니다.\n자동으로 로그아웃됩니다.");
                    auth.signOut().then(() => location.reload());
                    return;
                }
                const mySessionId = sessionStorage.getItem('snu_session_id');
                if (data.lastSessionId && data.lastSessionId !== mySessionId) {
                    setModal({ show: true, message: "다른 기기(또는 브라우저)에서 로그인이 감지되어\n현재 기기의 접속을 종료합니다.", onConfirm: async () => { setModal({ show: false, message: '', verificationWord: '' }); await auth.signOut(); location.reload(); }, onCancel: null, level: 'warning' });
                }
            }
        });
        return () => unsubscribeSession();
    }, [user, isGuest, isAdmin]);

    useEffect(() => {
        if (user && !loading && !isAdmin && !impersonatedUser) { 
            const timer = setTimeout(() => { 
                if (isGuest) localStorage.setItem('snu_guest_data', JSON.stringify({ config, data }));
                else db.collection("users").doc(user.uid).set({ config, data }, { merge: true }); 
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [config, data, user, loading, isGuest, isAdmin, impersonatedUser]);

    useEffect(() => {
        if (isGuest) return; 
        const genItems = window.getGeneralDataByYear(config.studentYear);
        const teachItems = window.getTeachingDataByYear(config.studentYear);
        const phyItems = window.getPhysicsDataByYear ? window.getPhysicsDataByYear(config.studentYear) : [];
        const etcItems = window.getEtcGradDataByYear ? window.getEtcGradDataByYear(config.studentYear) : [];

        setData(prev => {
            const next = { ...prev };
            if (genItems.length > 0 && (!prev.general.items || prev.general.items.length === 0)) next.general = { ...next.general, items: genItems };
            if (teachItems.length > 0 && (!prev.teaching.items || prev.teaching.items.length === 0)) next.teaching = { ...next.teaching, items: teachItems };
            if (phyItems.length > 0 && (!prev.physics.items || prev.physics.items.length === 0)) next.physics = { ...next.physics, items: phyItems };
            if (etcItems.length > 0 && (!prev.etcGrad.items || prev.etcGrad.items.length === 0)) next.etcGrad = { ...next.etcGrad, items: etcItems };
            return next;
        });
    }, [config.studentYear, isGuest]);

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleImpersonate = useCallback((targetUser) => {
        if (!isAdmin) return;
        setUser({ uid: targetUser.uid, email: targetUser.email }); 
        setConfig(targetUser.config || DEFAULT_CONFIG);
        setData(targetUser.data || BASE_DATA);
        setImpersonatedUser(targetUser); 
    }, [isAdmin]);

    const handleExitImpersonation = useCallback(() => {
        setUser(null);
        setImpersonatedUser(null);
    }, []);

    const scrollToSection = useCallback((id) => { const target = id === 'top' ? sectionRefs.header.current : sectionRefs[id]?.current; if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, []);
    
    const getForeign2Options = useCallback(() => { const f1 = data.general.items.find(i => i.type === 'foreign1'); if (!f1) return []; const val = f1.subName; if (val === '대학영어 1') return ['대학영어 2', '고급영어', '제2외국어']; if (val === '대학영어 2') return ['고급영어', '제2외국어']; if (val === '고급영어' || val === '면제') return ['제2외국어']; return ['대학영어 1', '대학영어 2', '고급영어', '제2외국어', '면제']; }, [data]);
    
    const handleSectionReset = useCallback((sectionKey) => {
        if (isAdmin && !impersonatedUser) return;
        setModal({
            show: true, message: `정말로 '${data[sectionKey].title}' 영역의 입력을 초기화하시겠습니까?`, verificationWord: "확인", level: 'danger',
            onConfirm: () => {
                setData(prev => {
                    const next = { ...prev };
                    let resetItems = [];
                    if (sectionKey === 'general') resetItems = window.getGeneralDataByYear(config.studentYear);
                    else if (sectionKey === 'teaching') resetItems = window.getTeachingDataByYear(config.studentYear);
                    else if (sectionKey === 'physics' && window.getPhysicsDataByYear) resetItems = window.getPhysicsDataByYear(config.studentYear);
                    else if (sectionKey === 'etcGrad' && window.getEtcGradDataByYear) resetItems = window.getEtcGradDataByYear(config.studentYear);
                    else { const baseDataCopy = JSON.parse(JSON.stringify(BASE_DATA)); resetItems = baseDataCopy[sectionKey].items || []; }
                    next[sectionKey] = { ...next[sectionKey], items: resetItems };
                    return next;
                });
                setModal({ show: false, message: '', verificationWord: '' });
            }, onCancel: () => setModal({ show: false, message: '', verificationWord: '' })
        });
    }, [data, config.studentYear, isAdmin, impersonatedUser]);

    const handleResetData = useCallback(() => {
        setModal({
            show: true, message: "모든 입력 데이터를 초기화하시겠습니까?", verificationWord: "확인", level: 'danger',
            onConfirm: async () => {
                const freshData = JSON.parse(JSON.stringify(BASE_DATA));
                const genItems = window.getGeneralDataByYear(config.studentYear);
                const teachItems = window.getTeachingDataByYear(config.studentYear);
                const phyItems = window.getPhysicsDataByYear ? window.getPhysicsDataByYear(config.studentYear) : [];
                const etcItems = window.getEtcGradDataByYear ? window.getEtcGradDataByYear(config.studentYear) : [];

                if (genItems.length > 0) freshData.general.items = genItems;
                if (teachItems.length > 0) freshData.teaching.items = teachItems;
                if (phyItems.length > 0) freshData.physics.items = phyItems;
                if (etcItems.length > 0) freshData.etcGrad.items = etcItems;

                setData(freshData);
                if (isGuest) localStorage.setItem('snu_guest_data', JSON.stringify({ config, data: freshData }));
                else if (user && !isAdmin) await db.collection("users").doc(user.uid).update({ data: freshData });
                
                setModal({ show: false, message: '', verificationWord: '' });
            }, onCancel: () => setModal({ show: false, message: '', verificationWord: '' })
        });
    }, [config.studentYear, user, isGuest, isAdmin]);

    const handleDeleteAccount = useCallback(async () => {
        if (isGuest) {
            setModal({ show: true, message: "게스트 모드를 종료하시겠습니까?\n저장된 모든 데이터가 기기에서 즉시 삭제됩니다.", verificationWord: "종료", level: 'danger', onConfirm: async () => { localStorage.removeItem('snu_guest_mode'); localStorage.removeItem('snu_guest_data'); setModal({ show: false, message: '', verificationWord: '' }); location.reload(); }, onCancel: () => setModal({ show: false, message: '', verificationWord: '' }) });
            return;
        }
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const lastSignInTime = new Date(currentUser.metadata.lastSignInTime).getTime();
        if (new Date().getTime() - lastSignInTime > 5 * 60 * 1000) {
            setModal({ show: true, message: "보안을 위해 계정 삭제는 로그인 직후에만 가능합니다.\n\n로그인한 지 5분이 지났으므로 자동 로그아웃됩니다.", onCancel: async () => { setModal({ show: false, message: '', verificationWord: '' }); await auth.signOut(); }, level: 'warning' });
            return;
        }
        setModal({ show: true, message: "정말로 계정을 삭제하시겠습니까? 모든 데이터가 영구적으로 삭제됩니다.", verificationWord: "삭제", level: 'danger', onConfirm: async () => { try { const userDoc = await db.collection("users").doc(currentUser.uid).get(); const studentId = userDoc.exists ? userDoc.data().studentId : null; const batch = db.batch(); batch.delete(db.collection("users").doc(currentUser.uid)); if (studentId) batch.delete(db.collection("public_users").doc(studentId)); await batch.commit(); await currentUser.delete(); setModal({ show: false, message: '', verificationWord: '' }); } catch (error) { if (error.code === 'auth/requires-recent-login') { setModal({ show: true, message: "보안을 위해 계정 삭제는 로그인 직후에만 가능합니다.\n\n로그아웃합니다.", onCancel: async () => { setModal({ show: false, message: '', verificationWord: '' }); await auth.signOut(); }, level: 'warning' }); } else { setModal({ show: true, message: "오류가 발생했습니다: " + error.message, onCancel: () => setModal({ show: false, message: '', verificationWord: '' }), level: 'warning' }); } } }, onCancel: () => setModal({ show: false, message: '', verificationWord: '' }) });
    }, [isGuest]);

    const handleInquirySubmit = useCallback(async (messageContent) => {
        try {
            await db.collection('inquiries').add({ to: ['rmsguddi@snu.ac.kr'], message: { subject: `[서울대 물리교육 졸업관리] ${config.userName}님의 새로운 문의입니다.`, html: `<h2>새로운 문의/민원이 접수되었습니다.</h2><p><strong>보낸 사람:</strong> ${config.userName} (${config.studentId || (isGuest ? 'GUEST' : user.email.split('@')[0])})</p><p><strong>연락처 이메일:</strong> ${userEmail || '없음(게스트)'}</p><hr/><h3>문의 내용:</h3><p style="white-space: pre-wrap;">${messageContent}</p>` }, createdAt: new Date(), userId: user.uid, rawMessage: messageContent });
            setModal({ show: true, message: "문의가 성공적으로 접수되었습니다.", onCancel: () => setModal({ show: false, message: '', verificationWord: '' }), level: 'info' });
            setShowContact(false);
        } catch (error) { setModal({ show: true, message: "전송 중 오류가 발생했습니다.", onCancel: () => setModal({ show: false, message: '', verificationWord: '' }), level: 'warning' }); }
    }, [config, user, userEmail, isGuest]);

    const openEditProfile = useCallback(() => { setEditStage('verify'); setVerifyPassword(''); setProfileError(''); setProfileForm({ name: config.userName, email: userEmail, newPw: '', confirmPw: '' }); }, [config.userName, userEmail]);
    const onVerifyPassword = useCallback(async () => { try { setProfileError(''); const credential = firebase.auth.EmailAuthProvider.credential(user.email, verifyPassword); await user.reauthenticateWithCredential(credential); setEditStage('form'); } catch (error) { setProfileError("비밀번호가 일치하지 않습니다."); } }, [user, verifyPassword]);
    
    const onUpdateProfile = useCallback(async () => { 
        try { 
            setProfileError(''); 
            if (!profileForm.name.trim()) throw new Error("이름을 입력해주세요."); 
            if (profileForm.newPw && (profileForm.newPw.length < 6 || profileForm.newPw !== profileForm.confirmPw)) throw new Error("비밀번호를 확인해주세요."); 
            
            if (profileForm.name !== config.userName) { 
                await db.collection("users").doc(user.uid).update({ userName: profileForm.name, 'config.userName': profileForm.name }); 
                setConfig(prev => ({ ...prev, userName: profileForm.name })); 
            } 
            
            if (profileForm.newPw) await user.updatePassword(profileForm.newPw); 
            
            if (profileForm.email !== userEmail) { 
                if (isAdmin) {
                    await db.collection("public_users").doc('admin').update({ email: profileForm.email });
                } else {
                    await db.collection("public_users").doc(config.studentId).update({ email: profileForm.email });
                }
                
                await db.collection("users").doc(user.uid).update({ email: profileForm.email }); 
                await user.updateEmail(profileForm.email);
                setUserEmail(profileForm.email); 
            } 
            
            setModal({ show: true, message: "개인정보가 수정되었습니다.", onCancel: () => setModal({ show: false, message: '', verificationWord: '' }), level: 'info' }); 
            setEditStage('none'); 
        } catch (error) { 
            if (error.code === 'auth/requires-recent-login') { 
                setModal({ show: true, message: "보안상 다시 로그인이 필요합니다.", onCancel: async () => { setModal({ show: false, message: '', verificationWord: '' }); await auth.signOut(); }, level: 'warning' }); 
            } else { 
                setProfileError(error.message); 
            } 
        } 
    }, [profileForm, config.userName, user, userEmail, config.studentId, isAdmin]);
    
    const handleDownloadPDF = useCallback(() => { if (window.downloadPDF) window.downloadPDF('pdf-template', `${config.studentId}_${config.userName}_졸업이수현황.pdf`); else setModal({ show: true, message: "PDF 생성 모듈 로딩 중입니다.", onCancel: () => setModal({ show: false, message: '', verificationWord: '' }), level: 'info' }); }, [config.studentId, config.userName]);
    const onModalCancel = useCallback(() => setModal({ show: false, message: '', verificationWord: '' }), []);
    const onCloseContact = useCallback(() => setShowContact(false), []);
    const onCancelEdit = useCallback(() => setEditStage('none'), []);

    const onLogout = useCallback(async () => { 
        if (isGuest) {
            handleDeleteAccount(); 
        } else { 
            if (user && !isAdmin) {
                const uid = user.uid;
                const uName = config.userName;
                const sId = config.studentId;
                await window.logAccess(uid, uName, sId, 'LOGOUT');
            } else if (isAdmin && user) {
                await window.logAccess(user.uid, '관리자', 'admin', 'LOGOUT');
            }
            auth.signOut(); 
        } 
    }, [isGuest, handleDeleteAccount, user, isAdmin, config]);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-indigo-600 text-xl">데이터를 불러오는 중입니다...</div>;
    
    if (isAdmin && !impersonatedUser) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300 relative">
                <AlertModal show={modal.show} message={modal.message} level={modal.level} verificationWord={modal.verificationWord} onConfirm={modal.onConfirm} onCancel={modal.onCancel} />
                <ProfileEditModal editStage={editStage} profileForm={profileForm} setProfileForm={setProfileForm} verifyPassword={verifyPassword} setVerifyPassword={setVerifyPassword} profileError={profileError} onVerifyPassword={onVerifyPassword} onUpdateProfile={onUpdateProfile} onCancel={onCancelEdit} isAdmin={true} />
                
                <AdminDashboard 
                    onLogout={onLogout} 
                    onImpersonate={handleImpersonate}
                    setModal={setModal} 
                    onOpenEditProfile={openEditProfile} 
                />
            </div>
        );
    }

    if (isGuest && isGuestSignup) {
        return (
            <AuthScreen 
                onLoginSuccess={() => {
                    localStorage.removeItem('snu_guest_mode');
                    localStorage.removeItem('snu_guest_data');
                    location.reload(); 
                }}
                onGuestLogin={startGuestMode} 
                guestData={data} 
                guestConfig={config} 
                onCancel={handleCancelGuestSignup}
            />
        );
    }
    
    if (!user && !isGuest && !isAdmin) return <AuthScreen onLoginSuccess={onLoginSuccess} onGuestLogin={startGuestMode} />;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 relative">
            <AlertModal show={modal.show} message={modal.message} level={modal.level} verificationWord={modal.verificationWord} onConfirm={modal.onConfirm} onCancel={modal.onCancel} />
            <ProfileEditModal editStage={editStage} profileForm={profileForm} setProfileForm={setProfileForm} verifyPassword={verifyPassword} setVerifyPassword={setVerifyPassword} profileError={profileError} onVerifyPassword={onVerifyPassword} onUpdateProfile={onUpdateProfile} onCancel={onCancelEdit} isAdmin={false} />
            <ContactModal show={showContact} config={config} contactEmail={userEmail} onClose={onCloseContact} onSubmit={handleInquirySubmit} />
            
            <NoticeModal show={showNoticeModal} notices={notices} onClose={handleCloseNotice} />

            {/* [NEW] 튜토리얼 모달 */}
            <TutorialModal show={showTutorial} onClose={handleTutorialClose} />

            <Header 
                user={user} config={config} setConfig={setConfig} stats={stats} 
                onLogout={onLogout} onReset={handleResetData} onDeleteAccount={handleDeleteAccount} 
                onOpenEditProfile={openEditProfile} onDownloadPDF={handleDownloadPDF} 
                sectionRef={sectionRefs.header} isGuest={isGuest} 
                onGuestYearChange={handleGuestYearChange} onGuestSignup={handleStartGuestSignup}
                hasUnreadNotice={hasUnreadNotice}
                onOpenNotice={handleOpenNotice}
                isDarkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
            />
            
            <Dashboard config={config} data={data} stats={stats} scrollToSection={scrollToSection} />
            <CourseList config={config} data={data} stats={stats} remaining={remaining} sectionRefs={sectionRefs} dragHandlers={dragHandlers} handlers={handlers} newInputs={newInputs} setNewInputs={setNewInputs} addNew={(ck) => handlers.addNew(ck, data)} deleteItem={(ck, id) => handlers.deleteItem(ck, id, data)} getForeign2Options={getForeign2Options} toggleItem={handlers.toggleItem} toggleMultiCheck={handlers.toggleMultiCheck} updateCredits={handlers.updateCredits} toggleRecommended={handlers.toggleRecommended} handleSectionReset={handleSectionReset} />
            <Footer onOpenContact={() => setShowContact(true)} />
            <button onClick={() => scrollToSection('top')} className={`fixed bottom-8 right-8 p-4 bg-indigo-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-[100] ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`} title="맨 위로"><Icons.ArrowUp /></button>
            {window.PDFTemplate && <window.PDFTemplate data={data} config={config} stats={stats} id="pdf-template" />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);