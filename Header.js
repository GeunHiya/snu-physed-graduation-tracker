window.Header = React.memo(({ user, config, setConfig, stats, onLogout, onReset, onDeleteAccount, onOpenEditProfile, onDownloadPDF, sectionRef, isGuest, onGuestYearChange, onGuestSignup, hasUnreadNotice, onOpenNotice, isDarkMode, toggleDarkMode, onOpenTutorial }) => {
    const { useState, useRef, useEffect, useCallback } = React;
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
            <div id="header-profile-area" ref={sectionRef} className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 relative z-30 mb-6 md:mb-10 transition-all duration-300">
                
                {/* 왼쪽: 프로필 영역 */}
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                    {/* 프로필 아이콘 */}
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-white shadow-lg md:shadow-xl rotate-3 transition-transform hover:rotate-6 shrink-0 ${isGuest ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200 dark:shadow-none' : 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-indigo-200 dark:shadow-none'}`}>
                        {isGuest ? <Icons.User /> : <Icons.Cap />}
                    </div>
                    
                    {/* 텍스트 정보 */}
                    <div className="flex-1 min-w-0">
                        {isGuest ? (
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 group cursor-text">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={config.userName} 
                                            onChange={handleGuestNameChange}
                                            className="text-xl md:text-2xl font-black text-slate-800 dark:text-white bg-transparent border-b-2 border-slate-200 dark:border-slate-600 focus:border-emerald-500 outline-none w-full max-w-[140px] transition-colors py-0.5 placeholder:text-slate-300"
                                            placeholder="이름 입력"
                                        />
                                        <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </span>
                                    </div>
                                    <span className="text-slate-400 dark:text-slate-500 text-sm md:text-lg font-bold shrink-0">님</span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">GUEST</span>
                                    <select 
                                        value={config.studentYear} 
                                        onChange={handleGuestYearChange}
                                        className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs md:text-sm font-bold py-1 px-2 rounded-lg border-none outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        {AVAILABLE_YEARS.map(y => (
                                            <option key={y} value={y}>{y % 100}학번</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-1.5 md:gap-2 truncate">
                                    {config.userName}
                                    <span className="text-slate-400 dark:text-slate-500 text-sm md:text-lg font-bold">님</span>
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm md:text-base">{config.studentYear % 100}학번</span>
                                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                                    <span className="text-slate-400 dark:text-slate-500 font-medium text-xs md:text-sm font-bold truncate">{config.studentId}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 오른쪽: 학점 현황 및 액션 버튼 (통합 컨테이너) */}
                <div className="w-full md:w-auto flex flex-col md:items-end gap-3">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-[1.2rem] md:rounded-[1.5rem] border border-slate-100 dark:border-slate-700 flex items-center justify-between md:justify-end gap-2 w-full md:w-auto transition-colors">
                        
                        {/* 학점 표시 */}
                        <div className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 flex flex-col justify-center">
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Total Credits</div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">{stats.overall.earned}</span>
                                <span className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-600">/ 130</span>
                            </div>
                        </div>

                        {/* 구분선 */}
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        
                        {/* 버튼 그룹 */}
                        <div className="flex items-center gap-2 pr-1.5">
                             <button
                                onClick={toggleDarkMode}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-400 hover:text-amber-500 dark:hover:text-yellow-400 hover:border-amber-200 dark:hover:border-yellow-900 flex items-center justify-center transition-all shadow-sm active:scale-95"
                                title="다크 모드 토글"
                            >
                                {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
                            </button>

                            <div className="relative" ref={userMenuRef}>
                                <button 
                                    id="header-settings-btn"
                                    onClick={() => setShowUserMenu(!showUserMenu)} 
                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl border flex items-center justify-center transition-all shadow-sm active:scale-95 relative ${showUserMenu ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-200'}`}
                                    aria-label="설정"
                                >
                                    <Icons.Settings /> 
                                    {hasUnreadNotice && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full animate-bounce"></span>
                                    )}
                                </button>
                                
                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50 animate-fade-in origin-top-right">
                                        <div className="p-4 border-b border-slate-50 dark:border-slate-700 mb-2">
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-2">내 전공 설정</p>
                                            <div className="space-y-3">
                                                <div>
                                                    <select value={config.majorPath} onChange={handleMajorChange} className="w-full bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold py-2.5 px-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 transition-colors cursor-pointer">
                                                        <option value="single">심화전공 (단일)</option>
                                                        <option value="double">복수전공</option>
                                                        <option value="minor">부전공</option>
                                                    </select>
                                                </div>
                                                {(config.majorPath === 'double' || config.majorPath === 'minor') && (
                                                    <div>
                                                        <input type="text" value={config.secondMajorTitle} onChange={handleSecondMajorTitleChange} className="w-full bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold py-2.5 px-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 transition-colors" placeholder="예: 수학교육과" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <button onClick={() => handleMenuClick(onOpenNotice)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-between group transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <span>📢</span> 공지사항
                                                </div>
                                                {hasUnreadNotice && (
                                                    <span className="w-2 h-2 bg-red-500 rounded-full group-hover:scale-125 transition-transform"></span>
                                                )}
                                            </button>

                                            <button onClick={() => handleMenuClick(onOpenTutorial)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-2 transition-colors">
                                                <span>💡</span> 튜토리얼 다시보기
                                            </button>

                                            {isGuest && (
                                                <button onClick={() => handleMenuClick(onGuestSignup)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-2 transition-colors">
                                                    <span>🚀</span> 계정 생성 (데이터 유지)
                                                </button>
                                            )}

                                            {!isGuest && (
                                                <button onClick={() => handleMenuClick(onOpenEditProfile)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-2 transition-colors">
                                                    <span>⚙️</span> 개인정보 수정
                                                </button>
                                            )}
                                            
                                            <button onClick={() => handleMenuClick(onDownloadPDF)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-2 transition-colors">
                                                <span>📄</span> PDF 저장
                                            </button>

                                            {!isGuest && (
                                                <button onClick={() => handleMenuClick(onLogout)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-2 transition-colors">
                                                    <span>👋</span> 로그아웃
                                                </button>
                                            )}

                                            <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-700">
                                                <button onClick={() => handleMenuClick(onReset)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 text-xs font-bold flex items-center gap-2 transition-colors">
                                                    <span>🔄</span> 입력 초기화
                                                </button>
                                                
                                                {isGuest && (
                                                    <button onClick={() => handleMenuClick(onLogout)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 text-xs font-bold flex items-center gap-2 transition-colors">
                                                        <span>👋</span> 게스트 종료 (나가기)
                                                    </button>
                                                )}
                                                
                                                {!isGuest && (
                                                    <button onClick={() => handleMenuClick(onDeleteAccount)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 text-xs font-bold flex items-center gap-2 transition-colors">
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