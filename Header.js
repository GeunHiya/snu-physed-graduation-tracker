window.Header = React.memo(({ user, config, setConfig, stats, onLogout, onReset, onDeleteAccount, onOpenEditProfile, onDownloadPDF, sectionRef, isGuest, onGuestYearChange, onGuestSignup, hasUnreadNotice, onOpenNotice, isDarkMode, toggleDarkMode, onOpenTutorial }) => {    const { useState, useRef, useEffect, useCallback } = React;
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

    const handleMenuClick = useCallback((action) => {
        if (action) action();
        setShowUserMenu(false);
    }, []);

    const handleMajorChange = useCallback((e) => {
        setConfig(p => ({ ...p, majorPath: e.target.value }));
    }, [setConfig]);

    const handleSecondMajorTitleChange = useCallback((e) => {
        setConfig(p => ({ ...p, secondMajorTitle: e.target.value }));
    }, [setConfig]);

    const handleGuestNameChange = useCallback((e) => {
        setConfig(p => ({ ...p, userName: e.target.value }));
    }, [setConfig]);

    const handleGuestYearChange = useCallback((e) => {
        const newYear = parseInt(e.target.value);
        if (onGuestYearChange) {
            onGuestYearChange(newYear);
        } else {
            setConfig(p => ({ ...p, studentYear: newYear }));
        }
    }, [setConfig, onGuestYearChange]);

    return (
        <React.Fragment>
            <div id="header-profile-area" ref={sectionRef} className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] card-shadow border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 mb-8 md:mb-12 transition-colors">
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] flex items-center justify-center text-white shadow-xl rotate-3 transition-transform hover:rotate-6 ${isGuest ? 'bg-emerald-500 shadow-emerald-200 dark:shadow-none' : 'bg-indigo-600 shadow-indigo-200 dark:shadow-none'}`}>
                        {isGuest ? <Icons.User /> : <Icons.Cap />}
                    </div>
                    
                    <div className="flex-1">
                        {isGuest ? (
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 group cursor-text">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={config.userName} 
                                            onChange={handleGuestNameChange}
                                            className="text-xl md:text-2xl font-black text-slate-800 dark:text-white bg-transparent border-b-2 border-slate-200 dark:border-slate-600 hover:border-emerald-400 focus:border-emerald-500 outline-none w-32 md:w-40 transition-colors py-1"
                                            placeholder="이름 입력"
                                        />
                                        <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-emerald-400 transition-colors">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </span>
                                    </div>
                                    <span className="text-slate-400 dark:text-slate-500 text-lg md:text-xl font-bold ml-2">님</span>
                                    <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-black border border-emerald-100 dark:border-emerald-900 shrink-0">GUEST</div>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <select 
                                        value={config.studentYear} 
                                        onChange={handleGuestYearChange}
                                        className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs md:text-sm font-bold py-1 px-2 rounded-lg border-none outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        {/* [수정] 학번 표시를 두 자리(22학번)로 변경 */}
                                        {AVAILABLE_YEARS.map(y => (
                                            <option key={y} value={y}>{y % 100}학번</option>
                                        ))}
                                    </select>
                                    <span className="text-slate-300 dark:text-slate-600 text-xs md:text-sm font-bold">|</span>
                                    <span className="text-slate-400 dark:text-slate-500 text-xs md:text-sm font-bold">졸업 가이드</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                                    {config.userName}님, <span className="text-indigo-600 dark:text-indigo-400">{config.studentYear % 100}학번</span>
                                </h1>
                                <p className="text-slate-400 dark:text-slate-500 font-medium text-xs md:text-sm mt-1 font-bold break-keep">
                                    {config.studentId}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-end gap-3">
                    <div className="w-full md:w-auto bg-white dark:bg-slate-800 px-6 py-4 md:px-8 md:py-5 rounded-3xl md:rounded-[2.5rem] card-shadow border border-indigo-50 dark:border-indigo-900/30 flex items-center justify-between md:justify-start gap-4 md:gap-8 font-black transition-colors">
                        <div>
                            <div className="text-[9px] md:text-[10px] text-indigo-400 dark:text-indigo-500 uppercase tracking-[0.2em] mb-1">TOTAL CREDITS</div>
                            <div className="flex items-baseline gap-2 font-black text-slate-800 dark:text-white">
                                <span className="text-3xl md:text-4xl">{stats.overall.earned}</span>
                                <span className="text-sm md:text-lg text-slate-300 dark:text-slate-600">/ 130</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                             <button
                                onClick={toggleDarkMode}
                                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-indigo-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-slate-500 transition-all shadow-sm"
                                aria-label="다크 모드 토글"
                            >
                                {isDarkMode ? <Icons.Moon /> : <Icons.Sun />}
                            </button>

                            <div className="relative" ref={userMenuRef}>
                                <button 
                                    id="header-settings-btn"
                                    onClick={() => setShowUserMenu(!showUserMenu)} 
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-indigo-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-slate-500 transition-all shadow-sm relative"
                                    aria-label="설정"
                                >
                                    <Icons.Settings /> 
                                    {hasUnreadNotice && (
                                        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                                    )}
                                </button>
                                
                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-4 w-60 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-2 z-50 animation-fade-in origin-top-right">
                                        <div className="p-4 border-b border-slate-50 dark:border-slate-700 mb-2">
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-1">내 전공 설정</p>
                                            <div className="space-y-3">
                                                <div>
                                                    <select value={config.majorPath} onChange={handleMajorChange} className="w-full bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold py-2 px-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800">
                                                        <option value="single">심화전공 (단일)</option>
                                                        <option value="double">복수전공</option>
                                                        <option value="minor">부전공</option>
                                                    </select>
                                                </div>
                                                {(config.majorPath === 'double' || config.majorPath === 'minor') && (
                                                    <div>
                                                        <input type="text" value={config.secondMajorTitle} onChange={handleSecondMajorTitleChange} className="w-full bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold py-2 px-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800" placeholder="예: 수학교육과" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <button onClick={() => handleMenuClick(onOpenNotice)} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-between group">
                                                <div className="flex items-center gap-2">
                                                    <span>📢</span> 공지사항
                                                </div>
                                                {hasUnreadNotice && (
                                                    <span className="w-2 h-2 bg-red-500 rounded-full group-hover:scale-125 transition-transform"></span>
                                                )}
                                            </button>

                                            <button onClick={() => handleMenuClick(onOpenTutorial)} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-2">
                                                <span>💡</span> 튜토리얼 다시보기
                                            </button>

                                            {isGuest && (
                                                <button onClick={() => handleMenuClick(onGuestSignup)} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-2">
                                                    <span>🚀</span> 계정 생성 (데이터 유지)
                                                </button>
                                            )}

                                            {!isGuest && (
                                                <button onClick={() => handleMenuClick(onOpenEditProfile)} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-2">
                                                    <span>⚙️</span> 개인정보 수정
                                                </button>
                                            )}
                                            
                                            <button onClick={() => handleMenuClick(onDownloadPDF)} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-2">
                                                <span>📄</span> PDF 저장
                                            </button>

                                            {!isGuest && (
                                                <button onClick={() => handleMenuClick(onLogout)} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-2">
                                                    <span>👋</span> 로그아웃
                                                </button>
                                            )}

                                            <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-700">
                                                <button onClick={() => handleMenuClick(onReset)} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                                                    <span>🔄</span> 입력 초기화
                                                </button>
                                                
                                                {isGuest && (
                                                    <button onClick={() => handleMenuClick(onLogout)} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-2">
                                                        <span>👋</span> 게스트 종료 (나가기)
                                                    </button>
                                                )}
                                                
                                                {!isGuest && (
                                                    <button onClick={() => handleMenuClick(onDeleteAccount)} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                                                        <span>⚠️</span> 계정 삭제
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
});