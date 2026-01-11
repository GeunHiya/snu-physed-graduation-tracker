window.Header = ({ user, config, setConfig, stats, onLogout, onReset, onDeleteAccount, onOpenEditProfile, sectionRef }) => {
    const { useState, useRef, useEffect } = React;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuClick = (action) => {
        action();
        setShowUserMenu(false);
    };

    return (
        <React.Fragment>
            <div ref={sectionRef} className="bg-white p-6 rounded-[2.5rem] card-shadow border border-slate-100 mb-10 flex flex-col md:flex-row items-center gap-6 font-bold z-20 relative">
                
                <div ref={userMenuRef} className="relative">
                    <div onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-4 bg-slate-50 pl-6 pr-12 py-3 rounded-3xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none relative group">
                        <div className="p-3 bg-white rounded-full text-indigo-600 shadow-sm">
                            <Icons.User />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-slate-700">{config.userName}</span>
                                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-black">
                                    {config.studentYear}학번
                                </span>
                            </div>
                            {/* [수정] DB에 저장된 학번 표시 */}
                            <span className="text-xs text-slate-400 font-bold">{config.studentId || "학번 없음"}</span>
                        </div>
                        <div className={`absolute right-5 text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180 text-indigo-500' : 'group-hover:text-slate-600'}`}>
                            <Icons.ChevronDown />
                        </div>
                    </div>

                    {showUserMenu && (
                        <div className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 flex flex-col animation-fade-in">
                            <button onClick={() => handleMenuClick(onOpenEditProfile)} className="px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors font-bold border-b border-slate-50 flex items-center gap-2">
                                <Icons.Settings /> 개인정보 수정
                            </button>
                            <button onClick={() => handleMenuClick(onReset)} className="px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors font-bold border-b border-slate-50">
                                입력 초기화
                            </button>
                            <button onClick={() => handleMenuClick(onDeleteAccount)} className="px-4 py-3 text-left text-sm text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors font-bold">
                                계정 삭제
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Major Path</label>
                    <div className="flex gap-2">
                        <select value={config.majorPath} onChange={e => setConfig(p => ({ ...p, majorPath: e.target.value }))} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700 outline-none">
                            <option value="single">단일전공</option>
                            <option value="double">복수전공</option>
                            <option value="minor">부전공</option>
                        </select>
                        {config.majorPath !== 'single' && (
                            <input type="text" value={config.secondMajorTitle} onChange={e => setConfig(p => ({ ...p, secondMajorTitle: e.target.value }))} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700 outline-none w-64 placeholder-gray-400" placeholder="전공명 (예: 수학교육과)" />
                        )}
                    </div>
                </div>
                <button onClick={onLogout} className="ml-auto flex items-center gap-2 bg-slate-100 text-slate-500 px-6 py-4 rounded-3xl font-bold hover:bg-slate-200 active:scale-95 transition-all shadow-sm"><Icons.Logout /> 로그아웃</button>
            </div>

            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-slate-800">
                <div className="flex items-center gap-4"><div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100 font-black"><Icons.Cap /></div><div><h1 className="text-3xl font-black tracking-tight">{config.userName ? `${config.userName}님의 ` : ''}{config.studentYear}학번 졸업 가이드</h1><p className="text-slate-400 font-medium text-sm mt-1 font-bold">물리교육(주전공) & {config.majorPath === 'single' ? '단일전공' : `${config.secondMajorTitle || '제2전공'} (${config.majorPath === 'double' ? '복수전공' : '부전공'})`} 현황</p></div></div>
                <div className="bg-white px-8 py-5 rounded-[2.5rem] card-shadow border border-indigo-50 flex items-center gap-8 font-black"><div><div className="text-[10px] text-indigo-400 uppercase tracking-[0.2em] mb-1">TOTAL CREDITS</div><div className="flex items-baseline gap-2 font-black"><span className="text-4xl">{stats.overall.earned}</span><span className="text-lg text-slate-300">/ 130</span></div></div><div className="w-14 h-14 rounded-full border-4 border-indigo-100 flex items-center justify-center text-indigo-600 text-lg">{stats.overall.percent}%</div></div>
            </header>
        </React.Fragment>
    );
};