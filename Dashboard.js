// Dashboard.js - 모바일 홈 탭 역할 강화 및 전체 진행률 시각화

window.Dashboard = React.memo(({ config, data, stats, scrollToSection, onOpenSecondMajorModal }) => {
    // 전체 진행률 데이터 추출 (stats.overall이 있다고 가정, 없으면 안전하게 처리)
    const overallEarned = stats.overall ? stats.overall.earned : 0;
    const overallTarget = 130; // 서울대 졸업 기준 일반적 130학점 (필요시 config에서 가져오도록 확장 가능)
    const overallPercent = Math.min(100, Math.round((overallEarned / overallTarget) * 100));
    const remainingCredits = Math.max(0, overallTarget - overallEarned);

    // [신규] 빠른 이동 버튼을 위한 섹션 정의
    const navItems = [
        { key: 'general', label: '교양' },
        { key: 'physics', label: '전공' },
        { key: 'indEng', label: config.secondMajorTitle || '제2전공', condition: config.majorPath !== 'single' },
        { key: 'teaching', label: '교직' },
        { key: 'elective', label: '일반선택' },
        { key: 'etcGrad', label: '졸업요건' }
    ];

    return (
        <div id="dashboard-area" className="animate-fade-in mb-6 md:mb-12">
            {/* [신규] 전체 진행 현황 섹션 (모바일 홈 화면의 핵심) */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 mb-6 md:mb-10 shadow-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <svg className="w-48 h-48 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2">
                            안녕하세요, {config.userName}님! 👋
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base leading-relaxed">
                            졸업까지 <span className="text-indigo-600 dark:text-indigo-400 font-black text-lg">{remainingCredits}학점</span> 남았습니다.<br className="md:hidden"/>
                            오늘도 목표를 향해 한 걸음 더 나아가세요!
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600/50">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-200 dark:text-slate-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                <path className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-out" strokeDasharray={`${overallPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-xs md:text-sm font-black text-indigo-600 dark:text-indigo-400">{overallPercent}%</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Credits</div>
                            <div className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">
                                {overallEarned} <span className="text-sm text-slate-400 font-normal">/ 130</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* [신규] 모바일 전용 섹션 바로가기 버튼 */}
            <div className="md:hidden mb-8 animate-slide-up">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 px-1 uppercase tracking-wider">섹션 바로가기</h3>
                <div className="flex gap-2.5 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {navItems.map(item => {
                        if (item.condition === false) return null;
                        return (
                            <button
                                key={item.key}
                                onClick={() => scrollToSection(item.key)}
                                className="flex-shrink-0 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md"
                            >
                                <span className="whitespace-nowrap">{item.label}</span>
                                <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 개별 영역 카드 리스트 */}
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2 px-1">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                영역별 진행 현황
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 text-slate-800 dark:text-slate-100 font-bold">
                {['general', 'physics', 'indEng', 'teaching', 'etcGrad'].map(key => {
                    if (key === 'indEng' && config.majorPath === 'single') return null;
                    
                    const title = key === 'indEng' ? `${config.secondMajorTitle || '제2전공'} (${config.majorPath === 'double' ? '복수전공' : '부전공'})` : data[key].title;
                    const stat = stats[key];

                    let warningText = null;
                    const isCreditsFull = stat.earned >= stat.target;

                    if (isCreditsFull) {
                        if (stat.missingMandatory) warningText = "필수 미이수";
                        else if (stat.missingRecommended) warningText = "권장 미이수";
                    }

                    return (
                        <div 
                            key={key} 
                            onClick={() => scrollToSection(key)} 
                            className={`
                                relative overflow-hidden cursor-pointer group transition-all duration-300
                                bg-white dark:bg-slate-800 
                                p-5 md:p-6 
                                rounded-2xl md:rounded-[1.5rem] 
                                shadow-sm border
                                ${stat.isComplete 
                                    ? 'border-green-200 dark:border-green-900/50 ring-1 ring-green-50 dark:ring-green-900/10' 
                                    : (warningText ? 'border-red-200 dark:border-red-900/50' : 'border-slate-100 dark:border-slate-700')
                                }
                                hover:border-indigo-300 dark:hover:border-indigo-500 
                                hover:shadow-md active:scale-[0.98]
                            `}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex flex-col min-w-0 pr-2">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider truncate group-hover:text-indigo-500 transition-colors">
                                        {title}
                                    </span>
                                    {warningText && (
                                        <span className="text-[10px] text-red-500 dark:text-red-400 font-black mt-1 animate-pulse flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            {warningText}
                                        </span>
                                    )}
                                </div>
                                
                                {key === 'indEng' ? (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onOpenSecondMajorModal(); }}
                                        className="p-1.5 -mt-1.5 -mr-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-500 transition-colors"
                                        title="전공 설정"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </button>
                                ) : (
                                    <div className={`
                                        px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 transition-colors
                                        ${stat.isComplete 
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                        }
                                    `}>
                                        {key === 'etcGrad' ? (stat.isComplete ? '완료' : '진행') : `${stat.percent}%`}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-baseline gap-1 mb-3">
                                <span className={`text-3xl font-black tracking-tight ${stat.isComplete ? 'text-green-500 dark:text-green-400' : 'text-slate-800 dark:text-white'}`}>
                                    {key === 'etcGrad' ? (stat.isComplete ? 'DONE' : 'ING') : stat.earned}
                                </span>
                                {key !== 'etcGrad' && (
                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">
                                        / {stat.target}
                                    </span>
                                )}
                            </div>

                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className={`
                                        h-full transition-all duration-1000 ease-out rounded-full
                                        ${stat.isComplete 
                                            ? 'bg-green-500' 
                                            : (warningText ? 'bg-red-400' : 'bg-indigo-500')
                                        }
                                    `} 
                                    style={{ width: `${stat.percent}%` }} 
                                />
                            </div>
                        </div>
                    );
                })}

                {config.majorPath === 'single' && (
                    <div 
                        onClick={onOpenSecondMajorModal}
                        className="
                            group cursor-pointer min-h-[140px] flex flex-col items-center justify-center 
                            bg-slate-50 dark:bg-slate-800/30 
                            rounded-2xl md:rounded-[1.5rem] 
                            border-2 border-dashed border-slate-300 dark:border-slate-700 
                            hover:border-indigo-400 dark:hover:border-indigo-500 
                            hover:bg-indigo-50 dark:hover:bg-indigo-900/10 
                            transition-all active:scale-[0.98]
                        "
                    >
                        <div className="
                            w-10 h-10 rounded-full 
                            bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600
                            flex items-center justify-center 
                            text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all mb-2
                        ">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        </div>
                        <span className="text-xs font-black text-slate-400 group-hover:text-indigo-500 transition-colors">
                            전공 추가
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
});