// Dashboard.js 전체 수정

window.Dashboard = React.memo(({ config, data, stats, scrollToSection, onOpenSecondMajorModal }) => {
    return (
        <div id="dashboard-area" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 mb-8 md:mb-12 text-slate-800 dark:text-slate-100 font-bold">
            {['general', 'physics', 'indEng', 'teaching', 'etcGrad'].map(key => {
                // 심화전공일 때 indEng(제2전공) 카드는 숨김 (대신 아래에서 + 버튼으로 대체)
                if (key === 'indEng' && config.majorPath === 'single') return null;
                
                const title = key === 'indEng' ? `${config.secondMajorTitle || '제2전공'} (${config.majorPath === 'double' ? '복수전공' : '부전공'})` : data[key].title;
                
                return (
                    <div key={key} onClick={() => scrollToSection(key)} className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl md:rounded-[2rem] card-shadow border border-slate-50 dark:border-slate-700 transition-all hover:border-indigo-300 dark:hover:border-indigo-500 hover:scale-[1.02] cursor-pointer group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2 md:mb-4 font-black">
                            <div className="flex flex-col min-w-0 pr-2">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate mr-1 font-black">{title}</span>
                                {key === 'general' && config.studentYear < 25 && <span className="text-[8px] text-red-500 dark:text-red-400 font-black mt-1 truncate">권장과목 미이수</span>}
                            </div>
                            
                            {/* [신규] 제2전공 카드일 경우 설정 버튼 표시 */}
                            {key === 'indEng' ? (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onOpenSecondMajorModal(); }}
                                    className="p-1.5 -mt-1.5 -mr-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-500 transition-colors"
                                    title="전공 설정 변경"
                                >
                                    <Icons.Settings />
                                </button>
                            ) : (
                                <div className={`px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-lg text-[8px] md:text-[9px] font-black shrink-0 ${stats[key].isComplete ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-400'}`}>
                                    {key === 'etcGrad' ? (stats[key].isComplete ? '완료' : 'ING') : `${stats[key].percent}%`}
                                </div>
                            )}
                        </div>
                        <div className="text-xl md:text-2xl font-black mb-2 md:mb-3 tracking-tighter">
                            {key === 'etcGrad' ? (stats[key].isComplete ? 'DONE' : 'ING') : <React.Fragment>{stats[key].earned}<span className="text-[10px] md:text-xs text-slate-300 dark:text-slate-600 ml-0.5 md:ml-1 font-black">/ {stats[key].target}</span></React.Fragment>}
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 md:h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-700 ${stats[key].isComplete ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${stats[key].percent}%` }} />
                        </div>
                    </div>
                );
            })}

            {/* [신규] 심화전공(Single)일 때 나타나는 '복수/부전공 추가' 버튼 */}
            {config.majorPath === 'single' && (
                <div 
                    onClick={onOpenSecondMajorModal}
                    className="bg-slate-50 dark:bg-slate-800/50 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group min-h-[140px]"
                >
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                    </div>
                    <span className="text-xs font-black text-slate-400 group-hover:text-indigo-500 transition-colors">복수/부전공 추가</span>
                </div>
            )}
        </div>
    );
});