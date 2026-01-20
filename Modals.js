window.AlertModal = React.memo(({ show, message, level = 'info', isDestructive = false, verificationWord, onConfirm, onCancel }) => {
    const { useState, useEffect } = React;
    const [input, setInput] = useState('');

    useEffect(() => {
        if (show) setInput('');
    }, [show]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!show) return;
            if (e.key === 'Enter') {
                e.preventDefault();
                if (verificationWord) {
                    if (input === verificationWord) onConfirm(input);
                } else {
                    if (onConfirm) onConfirm();
                    else if (onCancel) onCancel();
                }
            }
            if (e.key === 'Escape') {
                if (onCancel) onCancel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [show, input, verificationWord, onConfirm, onCancel]);

    if (!show) return null;

    const styles = {
        info: { container: "max-w-sm border-slate-100 dark:border-slate-700", iconBg: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400", btnColor: "bg-indigo-600 hover:bg-indigo-700", icon: <Icons.Check /> },
        warning: { container: "max-w-sm border-amber-100 dark:border-amber-900/30", iconBg: "bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400", btnColor: "bg-amber-500 hover:bg-amber-600", icon: <Icons.Target /> },
        danger: { container: "max-w-md border-red-100 dark:border-red-900/30 shadow-red-100/50 dark:shadow-none", iconBg: "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400", btnColor: "bg-red-500 hover:bg-red-600", icon: <Icons.Trash /> }
    };

    const currentLevel = (isDestructive ? 'danger' : level) || 'info';
    const currentStyle = styles[currentLevel];

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animation-fade-in">
            <div className={`bg-white dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 w-full shadow-2xl border font-bold text-center transform transition-all scale-100 ${currentStyle.container}`}>
                <div className="flex justify-center mb-5 md:mb-6">
                    <div className={`p-4 rounded-full font-black ${currentStyle.iconBg}`}>
                        {verificationWord ? <Icons.Shield /> : currentStyle.icon}
                    </div>
                </div>
                <h3 className="text-lg md:text-xl mb-4 leading-relaxed whitespace-pre-wrap break-keep text-slate-800 dark:text-slate-100">{message}</h3>
                {verificationWord && (
                    <div className="mb-6">
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">아래에 <span className="font-black text-slate-600 dark:text-slate-300">'{verificationWord}'</span>을(를) 입력하세요.</p>
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100" placeholder={verificationWord} autoFocus />
                    </div>
                )}
                <div className="flex gap-3">
                    {onCancel && <button onClick={onCancel} className="flex-1 py-3.5 md:py-3 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-colors text-sm md:text-base">{onConfirm ? "취소" : "닫기"}</button>}
                    {onConfirm && <button onClick={() => onConfirm(input)} disabled={verificationWord && input !== verificationWord} className={`flex-1 py-3.5 md:py-3 text-white rounded-2xl shadow-lg transition-all active:scale-95 text-sm md:text-base ${verificationWord && input !== verificationWord ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed opacity-50 shadow-none' : currentStyle.btnColor}`}>{verificationWord ? "확인" : (currentLevel === 'danger' ? "삭제" : "확인")}</button>}
                </div>
            </div>
        </div>
    );
});

window.ContactModal = React.memo(({ show, config, contactEmail, onClose, onSubmit }) => {
    const { useState, useEffect } = React;
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (show) { setMessage(''); setIsSending(false); }
    }, [show]);

    if (!show) return null;

    const handleSubmit = async () => {
        if (!message.trim()) return;
        setIsSending(true);
        await onSubmit(message);
        setIsSending(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animation-fade-in overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-700 font-bold relative my-auto">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50 dark:border-slate-700">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2.5 rounded-full text-indigo-600 dark:text-indigo-400"><Icons.Mail /></div>
                    <div><h3 className="text-xl font-black text-slate-800 dark:text-slate-100">문의 / 민원 접수</h3><p className="text-xs text-slate-400 mt-1">관리자에게 메일이 전송됩니다.</p></div>
                </div>
                <div className="space-y-4">
                    {/* 모바일에서 세로 배치 (flex-col) */}
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        <div className="flex-1">
                            <label className="block text-xs text-slate-400 mb-1.5 ml-1">보내는 사람</label>
                            <input type="text" value={config?.userName || ''} readOnly className="w-full p-3.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 text-sm outline-none cursor-default font-bold" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-slate-400 mb-1.5 ml-1">연락처 이메일</label>
                            <input type="text" value={contactEmail || ''} readOnly className="w-full p-3.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 text-sm outline-none cursor-default font-bold" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1.5 ml-1">문의 내용</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full h-40 md:h-32 p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 resize-none text-slate-700 dark:text-slate-200 leading-relaxed custom-scrollbar font-medium" placeholder="이곳에 문의하실 내용을 적어주세요. (버그 제보, 건의사항 등)" />
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={onClose} disabled={isSending} className="flex-1 py-3.5 md:py-3 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-colors">취소</button>
                        <button onClick={handleSubmit} disabled={!message.trim() || isSending} className="flex-1 py-3.5 md:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100">{isSending ? "전송 중..." : "보내기"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
});

window.ProfileEditModal = React.memo(({ 
    editStage, 
    profileForm, setProfileForm, 
    verifyPassword, setVerifyPassword, 
    profileError, 
    onVerifyPassword, onUpdateProfile, onCancel,
    isAdmin 
}) => {
    if (editStage === 'none') return null;

    const handleEnter = (e, action) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            action();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animation-fade-in overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-700 font-bold my-auto">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50 dark:border-slate-700">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2.5 rounded-full text-indigo-600 dark:text-indigo-400"><Icons.Settings /></div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">개인정보 수정</h3>
                </div>

                {editStage === 'verify' ? (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">본인 확인을 위해 현재 비밀번호를 입력해주세요.</p>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">비밀번호</label>
                            <input 
                                type="password" 
                                value={verifyPassword}
                                onChange={(e) => setVerifyPassword(e.target.value)}
                                onKeyDown={(e) => handleEnter(e, onVerifyPassword)}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 dark:text-white"
                                placeholder="비밀번호 입력"
                                autoFocus
                            />
                        </div>
                        {profileError && <p className="text-red-500 dark:text-red-400 text-sm font-black text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{profileError}</p>}
                        <div className="flex gap-3 mt-4">
                            <button onClick={onCancel} className="flex-1 py-3 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-colors">취소</button>
                            <button onClick={onVerifyPassword} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all active:scale-95">확인</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">이름</label>
                            <input 
                                type="text" 
                                value={profileForm.name}
                                onChange={(e) => setProfileForm(p => ({...p, name: e.target.value}))}
                                onKeyDown={(e) => handleEnter(e, onUpdateProfile)}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 dark:text-white font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">이메일</label>
                            {isAdmin ? (
                                <input 
                                    type="email" 
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm(p => ({...p, email: e.target.value}))}
                                    onKeyDown={(e) => handleEnter(e, onUpdateProfile)}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 dark:text-white font-bold"
                                    placeholder="변경할 이메일 입력"
                                />
                            ) : (
                                <div className="flex items-center w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-transparent focus-within:ring-2 focus-within:ring-indigo-100 dark:focus:ring-indigo-800 focus-within:bg-white dark:focus-within:bg-slate-600 transition-colors">
                                    <input 
                                        type="text" 
                                        value={profileForm.email.includes('@') ? profileForm.email.split('@')[0] : profileForm.email}
                                        onChange={(e) => {
                                            const idPart = e.target.value.replace(/@.*/, ''); 
                                            setProfileForm(p => ({...p, email: `${idPart}@snu.ac.kr`}));
                                        }}
                                        onKeyDown={(e) => handleEnter(e, onUpdateProfile)}
                                        className="bg-transparent outline-none flex-1 font-bold text-slate-800 dark:text-white"
                                        placeholder="아이디"
                                    />
                                    <span className="text-slate-400 font-bold ml-1">@snu.ac.kr</span>
                                </div>
                            )}
                        </div>
                        <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                            <p className="text-xs text-indigo-400 font-bold mb-3 ml-1">비밀번호 변경 (선택사항)</p>
                            <div className="space-y-3">
                                <input 
                                    type="password" 
                                    value={profileForm.newPw}
                                    onChange={(e) => setProfileForm(p => ({...p, newPw: e.target.value}))}
                                    onKeyDown={(e) => handleEnter(e, onUpdateProfile)}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 placeholder:text-slate-300 dark:placeholder:text-slate-500 dark:text-white font-bold"
                                    placeholder="새 비밀번호"
                                />
                                <input 
                                    type="password" 
                                    value={profileForm.confirmPw}
                                    onChange={(e) => setProfileForm(p => ({...p, confirmPw: e.target.value}))}
                                    onKeyDown={(e) => handleEnter(e, onUpdateProfile)}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 placeholder:text-slate-300 dark:placeholder:text-slate-500 dark:text-white font-bold"
                                    placeholder="새 비밀번호 확인"
                                />
                            </div>
                        </div>
                        {profileError && <p className="text-red-500 dark:text-red-400 text-sm font-black text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{profileError}</p>}
                        <div className="flex gap-3 mt-6">
                            <button onClick={onCancel} className="flex-1 py-3 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-colors">취소</button>
                            <button onClick={onUpdateProfile} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all active:scale-95">저장하기</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

window.NoticeModal = React.memo(({ show, notices, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animation-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-700 font-bold max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50 dark:border-slate-700 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-rose-50 dark:bg-rose-900/30 p-2.5 rounded-full text-rose-500 dark:text-rose-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">공지사항</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1 space-y-4 pr-2">
                    {notices && notices.length > 0 ? (
                        notices.map((notice) => (
                            <div key={notice.id} className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-600">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-slate-800 dark:text-slate-200 font-black text-lg">{notice.title}</h4>
                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold bg-white dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700 shrink-0 ml-2">
                                        {notice.createdAt?.toDate ? notice.createdAt.toDate().toLocaleDateString() : '날짜 없음'}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                                    {notice.content}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400">등록된 공지사항이 없습니다.</div>
                    )}
                </div>

                <div className="mt-6 pt-2 shrink-0">
                    <button onClick={onClose} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all active:scale-95 text-sm font-black">
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
});

// [NEW] 몰입형 튜토리얼 모달
window.TutorialModal = React.memo(({ show, onClose }) => {
    const { useState, useEffect, useCallback } = React;
    const [step, setStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);

    const steps = [
        {
            target: null, // 중앙 팝업
            title: "환영합니다! 👋",
            content: "서울대학교 물리교육과 졸업 이수 학점 관리 서비스입니다.\n\n복잡한 졸업 요건, 이제 한눈에 확인하고\n간편하게 관리해보세요!",
            icon: <Icons.Cap />
        },
        {
            target: "#header-profile-area", // 프로필 영역
            title: "나만의 정보 ⚙️",
            content: "현재 로그인된 사용자의 이름과 학번입니다. 본인 정보가 맞는지 확인해주세요.\n\n(본 서비스는 개인의 학점 이수 현황을 저장하여 편리한 관리를 돕습니다)",
            position: "bottom"
        },
        {
            target: "#header-settings-btn", // 설정 버튼
            title: "설정 및 메뉴 🛠️",
            content: "이 버튼을 눌러보세요.\n\n전공 변경(복수/부전공), PDF 저장, 튜토리얼 다시보기, 다크모드 전환 등 다양한 기능을 여기서 이용할 수 있습니다.",
            position: "bottom" 
        },
        {
            target: "#dashboard-area", // 대시보드
            title: "한눈에 보는 진행률 📊",
            content: "졸업 요건(교양, 전공, 교직 등)별 달성도가 이곳에 표시됩니다.\n\n각 카드를 클릭하면 해당 목록으로 자동 스크롤됩니다. 100%를 달성하면 초록색으로 변해요!",
            position: "bottom"
        },
        {
            target: "#course-list-area section:first-of-type > div:first-child", 
            title: "쉽고 빠른 과목 관리 📝",
            content: "이미 수강한 과목은 체크(✅)하고, 없는 과목은 아래 입력창에 적어서 추가하세요.\n\n• ➕ 버튼: 직접 과목 추가\n• 🗑️ 버튼: 과목 삭제\n• 드래그: 과목 순서 변경",
            position: "bottom"
        },
        {
            target: "#remaining-area h3", // 수강 예정 패널 제목
            title: "놓친 과목은 없는지? 🔭",
            content: "졸업을 위해 앞으로 수강해야 할 과목들이 이곳에 자동으로 정리됩니다.\n\n이 패널을 클릭하면 전체 화면으로 상세 목록을 확인하고 학기별 이수 계획을 세울 수 있습니다.",
            position: "left"
        },
        {
            target: "footer", // Footer
            title: "문의 및 정보 ℹ️",
            content: "졸업 사정 기준 확인 링크, 관리자 문의(메일), 개인정보 처리방침 등을 이곳에서 확인할 수 있습니다.",
            position: "top" 
        },
        {
            target: null, // 마지막
            title: "이제 시작해보세요! 🚀",
            content: "직접 졸업 요건을 채워나가며\n여러분의 성공적인 졸업을 계획해보세요.",
            icon: <Icons.Check />
        }
    ];

    const updateTargetRect = useCallback(() => {
        if (!show) return;
        const currentTargetSelector = steps[step].target;
        
        if (currentTargetSelector) {
            const el = document.querySelector(currentTargetSelector);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    const rect = el.getBoundingClientRect();
                    setTargetRect({
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        bottom: rect.bottom,
                        right: rect.right
                    });
                }, 400);
            } else {
                setTargetRect(null); 
            }
        } else {
            setTargetRect(null);
        }
    }, [step, show]);

    useEffect(() => {
        if (show) {
            setStep(0);
            updateTargetRect();
        }
    }, [show]);

    useEffect(() => {
        updateTargetRect();
        window.addEventListener('resize', updateTargetRect);
        return () => window.removeEventListener('resize', updateTargetRect);
    }, [step, updateTargetRect]);

    const handleNext = useCallback(() => {
        if (step < steps.length - 1) {
            setStep(p => p + 1);
        } else {
            onClose();
        }
    }, [step, steps.length, onClose]);

    const handlePrev = useCallback(() => {
        if (step > 0) setStep(p => p - 1);
    }, [step]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!show) return;
            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                e.preventDefault();
                handleNext();
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePrev();
            }
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [show, handleNext, handlePrev, onClose]);

    if (!show) return null;

    const currentStep = steps[step];
    const isTargetMode = !!targetRect;

    const getTooltipStyle = () => {
        if (!targetRect) return {};
        const spacing = 20; 
        const tooltipWidth = Math.min(384, window.innerWidth * 0.9);
        const tooltipHeight = 250; 
        const position = currentStep.position || 'bottom';
        
        let top, left, transform;
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;

        if (position === 'bottom') {
            top = targetRect.bottom + spacing;
            left = centerX;
            transform = 'translateX(-50%)';
        } else if (position === 'top') {
            top = targetRect.top - tooltipHeight - spacing;
            left = centerX;
            transform = 'translateX(-50%)';
            if (top < 0) top = targetRect.bottom + spacing;
        } else if (position === 'left') {
            top = centerY;
            left = targetRect.left - tooltipWidth - spacing; 
            transform = 'translateY(-50%)';
            if (left < 0) {
                left = targetRect.right + spacing;
                transform = 'translateY(-50%)';
            }
        }

        const safePadding = 20;
        
        if (transform && transform.includes('translateX(-50%)')) {
            const minX = tooltipWidth / 2 + safePadding;
            const maxX = window.innerWidth - (tooltipWidth / 2) - safePadding;
            left = Math.max(minX, Math.min(left, maxX));
        } else {
            left = Math.max(safePadding, Math.min(left, window.innerWidth - tooltipWidth - safePadding));
        }

        const maxTop = window.innerHeight - tooltipHeight - safePadding;
        if (top > maxTop) top = maxTop;
        
        if (transform && transform.includes('translateY(-50%)')) {
             top = Math.max(tooltipHeight/2 + safePadding, Math.min(top, window.innerHeight - tooltipHeight/2 - safePadding));
        } else {
             if (top < safePadding) top = safePadding;
        }

        return { top, left, transform };
    };

    return (
        <div className="fixed inset-0 z-[300] overflow-hidden">
            {isTargetMode ? (
                <div className="absolute inset-0 transition-all duration-500 ease-out" style={{ boxShadow: `inset 0 0 0 2000px rgba(15, 23, 42, 0.75)` }}>
                    <div className="absolute border-4 border-indigo-400 rounded-2xl transition-all duration-300 ease-out animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                         style={{
                             top: targetRect.top - 4,
                             left: targetRect.left - 4,
                             width: targetRect.width + 8,
                             height: targetRect.height + 8,
                         }}
                    />
                </div>
            ) : (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-all duration-500" />
            )}

            <div 
                className={`absolute transition-all duration-300 ease-out flex flex-col items-center ${isTargetMode ? '' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}
                style={isTargetMode ? getTooltipStyle() : {}}
            >
                <div className={`bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-2xl border-2 border-indigo-100 dark:border-slate-600 font-bold relative animate-slide-up max-w-sm w-[90vw] md:w-[24rem]`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {steps.map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                ))}
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold ml-1 whitespace-nowrap">{step + 1} / {steps.length}</span>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-indigo-500 transition-colors text-xs font-bold p-1 flex items-center gap-1 -mt-1 -mr-2">✕ 건너뛰기</button>
                    </div>

                    {!isTargetMode && currentStep.icon && (
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-2xl shadow-sm">
                                {currentStep.icon}
                            </div>
                        </div>
                    )}

                    <h3 className={`text-xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight ${!isTargetMode && 'text-center'}`}>
                        {currentStep.title}
                    </h3>
                    <p className={`text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mb-6 ${!isTargetMode && 'text-center'}`}>
                        {currentStep.content}
                    </p>

                    <div className="flex gap-3">
                        <button onClick={step === 0 ? onClose : handlePrev} className="flex-1 py-3 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-colors text-sm font-bold">
                            {step === 0 ? '닫기' : '이전'}
                        </button>
                        <button onClick={handleNext} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all active:scale-95 text-sm font-black">
                            {step === steps.length - 1 ? "시작하기" : "다음"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

// [신규] 전공선택 과목 다중 선택 모달
window.MajorElectiveModal = React.memo(({ show, onClose, currentItems, onUpdate }) => {
    const { useState, useEffect } = React;
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (show) {
            const currentNames = currentItems.map(i => i.name);
            const initialSelected = PHYSICS_ELECTIVES.filter(name => currentNames.includes(name));
            setSelected(initialSelected);
        }
    }, [show, currentItems]);

    const handleToggle = (name) => {
        setSelected(prev => {
            if (prev.includes(name)) return prev.filter(n => n !== name);
            return [...prev, name];
        });
    };

    const handleSave = () => {
        onUpdate(selected);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animation-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-700 font-bold max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50 dark:border-slate-700 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2.5 rounded-full text-indigo-600 dark:text-indigo-400">
                            <Icons.Book />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">전공선택 과목 담기</h3>
                    </div>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
                     <div className="space-y-2">
                        {PHYSICS_ELECTIVES.map((subject) => {
                            const isChecked = selected.includes(subject);
                            return (
                                <div 
                                    key={subject}
                                    onClick={() => handleToggle(subject)}
                                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.98] ${isChecked ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-700 border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                                >
                                    <span className={`text-sm font-bold ${isChecked ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {subject}
                                    </span>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-slate-500'}`}>
                                        {isChecked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                </div>
                            );
                        })}
                     </div>
                </div>

                <div className="mt-6 pt-2 shrink-0 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl transition-colors font-bold text-sm">
                        취소
                    </button>
                    <button onClick={handleSave} className="flex-[2] py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all active:scale-95 font-black text-sm">
                        적용 ({selected.length})
                    </button>
                </div>
            </div>
        </div>
    );
});

window.SecondMajorModal = React.memo(({ show, onClose, config, onUpdate }) => {
    const { useState, useEffect } = React;
    const [type, setType] = useState('single');
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (show) {
            setType(config.majorPath);
            setTitle(config.secondMajorTitle || '');
        }
    }, [show, config]);

    const handleSave = () => {
        onUpdate(type, title);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animation-fade-in overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-700 font-bold my-auto">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50 dark:border-slate-700">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2.5 rounded-full text-indigo-600 dark:text-indigo-400">
                        <Icons.Layers />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">전공 과정 설정</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs text-slate-400 mb-2 ml-1">이수 과정 선택</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { val: 'single', label: '심화전공' },
                                { val: 'double', label: '복수전공' },
                                { val: 'minor', label: '부전공' }
                            ].map(opt => (
                                <button
                                    key={opt.val}
                                    onClick={() => setType(opt.val)}
                                    className={`py-3.5 rounded-xl text-sm font-black transition-all ${type === opt.val ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(type === 'double' || type === 'minor') && (
                        <div className="animation-fade-in">
                            <label className="block text-xs text-slate-400 mb-2 ml-1">전공명 입력</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 dark:text-white font-bold placeholder:font-normal placeholder:text-slate-400"
                                placeholder="예: 수학교육과, 컴퓨터공학부"
                            />
                        </div>
                    )}

                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        💡 설정한 내용은 우측 상단 <span className="font-bold whitespace-nowrap inline-flex items-center align-bottom">설정(<svg className="w-3 h-3 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>)</span> 메뉴에서도 언제든지 다시 변경할 수 있습니다.
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-3.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-colors font-bold text-sm">
                            취소
                        </button>
                        <button onClick={handleSave} className="flex-[2] py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all active:scale-95 font-black text-sm">
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});