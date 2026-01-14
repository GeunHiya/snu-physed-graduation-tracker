window.Dashboard = React.memo(({ config, data, stats, scrollToSection }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 mb-8 md:mb-12 text-slate-800 dark:text-slate-100 font-bold">
            {['general', 'physics', 'indEng', 'teaching', 'etcGrad'].map(key => {
                if (key === 'indEng' && config.majorPath === 'single') return null;
                
                const title = key === 'indEng' ? `${config.secondMajorTitle || '제2전공'} (${config.majorPath === 'double' ? '복수전공' : '부전공'})` : data[key].title;
                return (
                    <div key={key} onClick={() => scrollToSection(key)} className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl md:rounded-[2rem] card-shadow border border-slate-50 dark:border-slate-700 transition-all hover:border-indigo-300 dark:hover:border-indigo-500 hover:scale-[1.02] cursor-pointer group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2 md:mb-4 font-black">
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate mr-1 font-black">{title}</span>
                                {key === 'general' && config.studentYear < 25 && <span className="text-[8px] text-red-500 dark:text-red-400 font-black mt-1 truncate">권장과목 미이수</span>}
                            </div>
                            <div className={`px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-lg text-[8px] md:text-[9px] font-black shrink-0 ${stats[key].isComplete ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-400'}`}>
                                {key === 'etcGrad' ? (stats[key].isComplete ? '완료' : 'ING') : `${stats[key].percent}%`}
                            </div>
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
        </div>
    );
});