// --- 알림/확인 모달 ---
window.AlertModal = ({ show, message, isDestructive, verificationWord, onConfirm, onCancel }) => {
    const { useState, useEffect } = React;
    const [input, setInput] = useState('');

    useEffect(() => {
        if (show) setInput('');
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 font-bold text-center">
                <div className="flex justify-center mb-6">
                    <div className={`p-4 rounded-full font-black ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Icons.Shield />
                    </div>
                </div>
                <h3 className="text-xl mb-4 leading-relaxed whitespace-pre-wrap break-keep">{message}</h3>
                
                {verificationWord && (
                    <div className="mb-6">
                        <p className="text-xs text-slate-400 mb-2">아래에 <span className="font-black text-slate-600">'{verificationWord}'</span>을(를) 입력하세요.</p>
                        <input 
                            type="text" 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
                            placeholder={verificationWord}
                        />
                    </div>
                )}

                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors">취소</button>
                    <button 
                        onClick={() => onConfirm(input)}
                        disabled={verificationWord && input !== verificationWord}
                        className={`flex-1 py-3 text-white rounded-2xl shadow-lg transition-all active:scale-95 ${
                            verificationWord && input !== verificationWord
                            ? 'bg-slate-300 cursor-not-allowed opacity-50 shadow-none'
                            : (isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700')
                        }`}
                    >
                        {isDestructive ? "삭제" : "확인"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 문의/민원 모달 (수정됨: 변수명 명확화) ---
window.ContactModal = ({ show, config, contactEmail, onClose, onSubmit }) => {
    const { useState, useEffect } = React;
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (show) {
            setMessage('');
            setIsSending(false);
        }
    }, [show]);

    if (!show) return null;

    const handleSubmit = async () => {
        if (!message.trim()) return;
        setIsSending(true);
        await onSubmit(message);
        setIsSending(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 font-bold">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                    <div className="bg-indigo-50 p-2.5 rounded-full text-indigo-600">
                        <Icons.Mail />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800">문의 / 민원 접수</h3>
                        <p className="text-xs text-slate-400 mt-1">관리자에게 메일이 전송됩니다.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs text-slate-400 mb-1 ml-1">보내는 사람</label>
                            <input type="text" value={config?.userName || ''} readOnly className="w-full p-3 bg-slate-50 rounded-xl text-slate-600 text-sm outline-none cursor-default" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-slate-400 mb-1 ml-1">연락처 이메일</label>
                            <input type="text" value={contactEmail || ''} readOnly className="w-full p-3 bg-slate-50 rounded-xl text-slate-600 text-sm outline-none cursor-default" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-1 ml-1">문의 내용</label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-32 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 resize-none text-slate-700 leading-relaxed custom-scrollbar"
                            placeholder="이곳에 문의하실 내용을 적어주세요. (버그 제보, 건의사항 등)"
                        />
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button onClick={onClose} disabled={isSending} className="flex-1 py-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors">취소</button>
                        <button 
                            onClick={handleSubmit}
                            disabled={!message.trim() || isSending}
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isSending ? "전송 중..." : "보내기"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 개인정보 수정 모달 ---
window.ProfileEditModal = ({ 
    editStage, 
    profileForm, setProfileForm, 
    verifyPassword, setVerifyPassword, 
    profileError, 
    onVerifyPassword, onUpdateProfile, onCancel 
}) => {
    if (editStage === 'none') return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 font-bold">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                    <div className="bg-indigo-50 p-2.5 rounded-full text-indigo-600">
                        <Icons.Settings />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">개인정보 수정</h3>
                </div>

                {editStage === 'verify' ? (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-4">본인 확인을 위해 현재 비밀번호를 입력해주세요.</p>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">비밀번호</label>
                            <input 
                                type="password" 
                                value={verifyPassword}
                                onChange={(e) => setVerifyPassword(e.target.value)}
                                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100"
                                placeholder="비밀번호 입력"
                            />
                        </div>
                        {profileError && <p className="text-red-500 text-sm font-black text-center">{profileError}</p>}
                        <div className="flex gap-3 mt-4">
                            <button onClick={onCancel} className="flex-1 py-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors">취소</button>
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
                                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 ml-1">이메일</label>
                            <input 
                                type="email" 
                                value={profileForm.email}
                                onChange={(e) => setProfileForm(p => ({...p, email: e.target.value}))}
                                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div className="pt-4 border-t border-slate-50">
                            <p className="text-xs text-indigo-400 font-bold mb-3 ml-1">비밀번호 변경 (선택사항)</p>
                            <div className="space-y-3">
                                <input 
                                    type="password" 
                                    value={profileForm.newPw}
                                    onChange={(e) => setProfileForm(p => ({...p, newPw: e.target.value}))}
                                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300"
                                    placeholder="새 비밀번호 (변경시에만 입력)"
                                />
                                <input 
                                    type="password" 
                                    value={profileForm.confirmPw}
                                    onChange={(e) => setProfileForm(p => ({...p, confirmPw: e.target.value}))}
                                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300"
                                    placeholder="새 비밀번호 확인"
                                />
                            </div>
                        </div>
                        {profileError && <p className="text-red-500 text-sm font-black text-center">{profileError}</p>}
                        <div className="flex gap-3 mt-6">
                            <button onClick={onCancel} className="flex-1 py-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors">취소</button>
                            <button onClick={onUpdateProfile} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all active:scale-95">저장하기</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};