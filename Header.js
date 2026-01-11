window.Header = ({ user, config, setConfig, stats, onLogout, onReset, onDeleteAccount, onOpenEditProfile, onDownloadPDF, sectionRef }) => {
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
            <div ref={sectionRef} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] card-shadow border border-slate-100 mb-6 md:mb-10 flex flex-col md:flex-row items-center gap-4 md:gap-6 font-bold z-20 relative">
                
                {/* 사용자 메뉴 (왼쪽) */}
                <div ref={userMenuRef} className="relative w-full md:w-auto">
                    <div onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 md:gap-4 bg-slate-50 pl-4 pr-10 py-2 md:pl-6 md:pr-12 md:py-3 rounded-2xl md:rounded-3xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none relative group w-full md:w-auto">
                        <div className="p-2 md:p-3 bg-white rounded-full text-indigo-600 shadow-sm shrink-0">
                            <Icons.User />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <div className="flex items-center gap-2">
                                <span className="text-base md:text-lg font-black text-slate-700 truncate">{config.userName}</span>
                                <span className="text-[10px] md:text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-black shrink-0">
                                    {config.studentYear}학번
                                </span>
                            </div>
                            <span className="text-[10px] md:text-xs text-slate-400 font-bold truncate">{config.studentId || "학번 없음"}</span>
                        </div>
                        <div className={`absolute right-4 md:right-5 text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180 text-indigo-500' : 'group-hover:text-slate-600'}`}>
                            <Icons.ChevronDown />
                        </div>
                    </div>

                    {showUserMenu && (
                        <div className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 flex flex-col animation-fade-in">
                            {/* [신규] PDF 저장 버튼 (최상단) */}
                            <button onClick={() => handleMenuClick(onDownloadPDF)} className="px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors font-bold border-b border-slate-50 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                PDF 저장 (A4)
                            </button>
                            
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

                {/* 컨트롤 패널 (오른쪽: 전공선택 + 로그아웃) */}
                <div className="flex items-center justify-between w-full md:flex-1 gap-3">
                    <div className="flex flex-col gap-1 flex-1 md:flex-none">
                        <label className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1 hidden md:block">Major Path</label>
                        <div className="flex gap-2 w-full md:w-auto">
                            <select value={config.majorPath} onChange={e => setConfig(p => ({ ...p, majorPath: e.target.value }))} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none w-full md:w-auto">
                                <option value="single">단일전공</option>
                                <option value="double">복수전공</option>
                                <option value="minor">부전공</option>
                            </select>
                        </div>
                    </div>
                    {config.majorPath !== 'single' && (
                         <div className="flex-1 md:flex-none mt-0 md:mt-4">
                            <input type="text" value={config.secondMajorTitle} onChange={e => setConfig(p => ({ ...p, secondMajorTitle: e.target.value }))} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none w-full md:w-48 placeholder-gray-400" placeholder="전공명 (예: 수학)" />
                        </div>
                    )}
                    
                    <button onClick={onLogout} className="ml-auto flex items-center gap-1 md:gap-2 bg-slate-100 text-slate-500 px-4 py-2 md:px-6 md:py-3 rounded-2xl md:rounded-3xl text-xs md:text-sm font-bold hover:bg-slate-200 active:scale-95 transition-all shadow-sm h-full mt-0 md:mt-4"><Icons.Logout /> 로그아웃</button>
                </div>
            </div>

            <header className="mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 text-slate-800">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2.5 md:p-3 bg-indigo-600 rounded-xl md:rounded-2xl text-white shadow-xl shadow-indigo-100 font-black shrink-0">
                        <Icons.Cap />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
                            {config.userName ? `${config.userName}님의 ` : ''}{config.studentYear}학번 졸업 가이드
                        </h1>
                        <p className="text-slate-400 font-medium text-xs md:text-sm mt-1 font-bold break-keep">
                            물리교육(주전공) & {config.majorPath === 'single' ? '단일전공' : `${config.secondMajorTitle || '제2전공'} (${config.majorPath === 'double' ? '복수전공' : '부전공'})`} 현황
                        </p>
                    </div>
                </div>
                <div className="w-full md:w-auto bg-white px-6 py-4 md:px-8 md:py-5 rounded-3xl md:rounded-[2.5rem] card-shadow border border-indigo-50 flex items-center justify-between md:justify-start gap-4 md:gap-8 font-black">
                    <div>
                        <div className="text-[9px] md:text-[10px] text-indigo-400 uppercase tracking-[0.2em] mb-1">TOTAL CREDITS</div>
                        <div className="flex items-baseline gap-2 font-black">
                            <span className="text-3xl md:text-4xl">{stats.overall.earned}</span>
                            <span className="text-sm md:text-lg text-slate-300">/ 130</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-indigo-100 flex items-center justify-center text-indigo-600 text-sm md:text-lg">
                        {stats.overall.percent}%
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};