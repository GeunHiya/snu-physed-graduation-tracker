// --- 수강 예정 확대 보기용 컬럼 컴포넌트 ---
const RemainingColumn = React.memo(({ title, items, color }) => {
    const styles = {
        slate: { bg: 'bg-slate-500/10', title: 'text-slate-400' },
        indigo: { bg: 'bg-indigo-500/10', title: 'text-indigo-400' },
        amber: { bg: 'bg-amber-500/10', title: 'text-amber-400' },
        emerald: { bg: 'bg-emerald-500/10', title: 'text-emerald-400' },
        rose: { bg: 'bg-rose-500/10', title: 'text-rose-400' }
    };
    const s = styles[color] || styles.slate;

    // w-80 등 고정 너비를 제거하고 flex-1과 h-full로 부모 컨테이너에 맞춤
    return (
        <div className="flex-1 min-w-0 flex flex-col bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl h-full">
            <div className={`p-4 md:p-5 border-b border-slate-700 ${s.bg} shrink-0`}>
                <div className="flex justify-between items-baseline">
                    <h3 className={`font-black text-lg md:text-xl truncate ${s.title}`}>{title}</h3>
                    <span className="text-xs text-slate-500 font-bold ml-2 shrink-0">{items.length}개</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 custom-scrollbar">
                 {items.length > 0 ? items.map(i => (
                     <div key={i.id} className="bg-slate-700/50 p-3 rounded-2xl border border-slate-600/50 hover:bg-slate-700 transition-colors group">
                         <div className="flex justify-between items-start mb-0.5">
                             <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider truncate pr-2 group-hover:text-slate-400 transition-colors">{i.catTitle}</div>
                             {Number(i.credits) > 0 && <span className="text-[9px] bg-slate-600 text-slate-300 px-1.5 py-0.5 rounded-full font-bold shrink-0">{i.credits}pt</span>}
                         </div>
                         <div className="font-bold text-white text-sm leading-snug break-keep">{i.displayName || i.name}</div>
                     </div>
                 )) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-600 font-bold opacity-40">
                         <Icons.Check size={32} className="mb-2" />
                         <span className="text-xs">완료됨</span>
                     </div>
                 )}
            </div>
        </div>
    );
});

window.CourseList = React.memo(({ 
    config, data, stats, remaining, sectionRefs, 
    dragHandlers, handlers, newInputs, setNewInputs, addNew, deleteItem,
    getForeign2Options, toggleItem, toggleMultiCheck, updateCredits, toggleRecommended,
    handleSectionReset
}) => {
    const { useState, useMemo } = React;
    const [isExpanded, setIsExpanded] = useState(false);

    const SECTION_ORDER = ['general', 'physics', 'indEng', 'shared', 'teaching', 'elective', 'etcGrad'];
    const { draggedItem, setDraggedItem, canDrag, setCanDrag, handleDragStart, handleDragEnter } = dragHandlers;

    const groupedRemaining = useMemo(() => {
        const groups = {
            general: [],
            physics: [],
            double: [], 
            teaching: [],
            others: [] 
        };

        remaining.forEach(item => {
            if (item.catKey === 'general') groups.general.push(item);
            else if (item.catKey === 'physics') groups.physics.push(item);
            else if (item.catKey === 'indEng' || item.catKey === 'shared') groups.double.push(item);
            else if (item.catKey === 'teaching') groups.teaching.push(item);
            else groups.others.push(item);
        });
        return groups;
    }, [remaining]);

    return (
        <React.Fragment>
            {/* --- 확대 모달 (오버레이) --- */}
            {isExpanded && (
                <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-2 md:p-6 animation-fade-in" onClick={() => setIsExpanded(false)}>
                    {/* 모달 높이를 h-[95%]로 늘려 세로 공간 확보 */}
                    <div className="bg-slate-800 text-white w-full max-w-[98%] h-[95%] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-600/50 flex flex-col overflow-hidden relative animate-scale-up" onClick={e => e.stopPropagation()}>
                        
                        {/* Header: 높이 축소 */}
                        <div className="px-6 py-4 md:px-8 md:py-5 border-b border-slate-700 flex justify-between items-center shrink-0 bg-slate-800">
                            <h2 className="text-xl md:text-2xl font-black flex items-center gap-3 text-slate-100">
                                <Icons.Target /> 수강 예정 목록 ({remaining.length})
                            </h2>
                            <button onClick={() => setIsExpanded(false)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors group">
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        {/* Content Grid: 가로 스크롤 제거, Flex/Grid로 한눈에 보기 */}
                        {/* 모바일(lg 미만)에서는 세로 스크롤 허용, 데스크탑(lg 이상)에서는 한 화면 고정 */}
                        <div className="flex-1 overflow-y-auto lg:overflow-hidden p-4 md:p-6 bg-slate-900/50">
                             <div className="flex flex-col lg:flex-row h-auto lg:h-full gap-4 lg:gap-4">
                                <RemainingColumn title="교양" items={groupedRemaining.general} color="slate" />
                                <RemainingColumn title="물리교육" items={groupedRemaining.physics} color="indigo" />
                                {(config.majorPath !== 'single') && <RemainingColumn title={config.secondMajorTitle || "복수/부전공"} items={groupedRemaining.double} color="amber" />}
                                <RemainingColumn title="교직" items={groupedRemaining.teaching} color="emerald" />
                                <RemainingColumn title="기타" items={groupedRemaining.others} color="rose" />
                             </div>
                        </div>

                        {/* Footer Summary: 높이 축소 */}
                        <div className="px-6 py-4 bg-slate-900 border-t border-slate-700 flex justify-between items-center shrink-0">
                            <span className="text-slate-500 font-bold text-xs md:text-sm">졸업까지 남은 학점</span>
                            <span className="text-xl md:text-2xl font-black text-amber-400 tracking-tight">{Math.max(0, 130 - stats.overall.earned)} PT</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 font-bold">
                <div id="course-list-area" className="lg:col-span-2 space-y-6 md:space-y-10">
                    {SECTION_ORDER.map(ck => {
                        if ((ck === 'indEng' || ck === 'shared') && config.majorPath === 'single') return null;
                        const sectionTitle = ck === 'indEng' ? `${config.secondMajorTitle || '제2전공'} (${config.majorPath === 'double' ? '복수전공' : '부전공'})` : data[ck].title;
                        const isSharedOrElective = ['shared', 'etcGrad', 'elective'].includes(ck);
                        
                        return (
                            <section key={ck} ref={sectionRefs[ck]} className={`bg-white dark:bg-slate-800 rounded-3xl md:rounded-[3rem] card-shadow overflow-hidden border ${ck === 'shared' ? 'border-amber-100 dark:border-amber-900/30' : (ck === 'elective' ? 'border-indigo-50 dark:border-indigo-900/30' : 'border-slate-50 dark:border-slate-700')} scroll-mt-20 transition-colors`}>
                                <div className={`px-5 py-5 md:px-10 md:py-7 border-b flex justify-between items-center ${ck === 'shared' ? 'bg-amber-50/40 dark:bg-amber-900/10 border-amber-50 dark:border-amber-900/20' : (ck === 'elective' ? 'bg-indigo-50/20 dark:bg-indigo-900/10 border-indigo-50 dark:border-indigo-900/20' : 'bg-slate-50/50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-700')}`}>
                                    <div className="flex flex-col text-slate-700 dark:text-slate-300">
                                        <h2 className="text-lg md:text-xl font-black flex items-center gap-2 md:gap-3 text-slate-800 dark:text-slate-100">
                                            {ck === 'etcGrad' ? <Icons.Shield /> : ck === 'shared' ? <Icons.Layers className="text-amber-500" /> : (ck === 'elective' ? <Icons.Zap className="text-indigo-500" /> : <Icons.Book />)}
                                            {sectionTitle}
                                        </h2>
                                        {!isSharedOrElective && (<span className="text-[10px] md:text-[11px] font-bold text-indigo-400 dark:text-indigo-300 mt-0.5 md:mt-1 uppercase tracking-widest text-slate-400 dark:text-slate-500">이수: {stats[ck].earned} pt / 필요: {stats[ck].target} pt</span>)}
                                    </div>
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <button onClick={() => handleSectionReset(ck)} className="text-[9px] md:text-[10px] font-black bg-white/80 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 border border-transparent hover:border-slate-200 dark:hover:border-slate-500 text-slate-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 px-2 py-1 md:px-3 md:py-1.5 rounded-full transition-all shadow-sm">
                                            ↺
                                        </button>
                                        {!['shared', 'elective'].includes(ck) && (<span className={`text-[9px] md:text-[10px] font-black px-2.5 py-1.5 md:px-4 md:py-2 rounded-full ${stats[ck].isComplete ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400'}`}>{stats[ck].isComplete ? '충족 ✓' : 'ING'}</span>)}
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-50 dark:divide-slate-700/50 text-slate-700 dark:text-slate-200 font-bold">
                                    {data[ck].items.map((i, idx) => {
                                        if (i.hidden) return null;
                                        const isDragging = draggedItem?.cat === ck && draggedItem?.index === idx;
                                        
                                        return (
                                            <div key={i.id} draggable={!i.fixed && !data[ck].dragDisabled && canDrag} onDragStart={() => handleDragStart(ck, idx)} onDragEnter={() => handleDragEnter(ck, idx)} onDragEnd={() => { setDraggedItem(null); setCanDrag(false); }} onDragOver={e => e.preventDefault()} className={`list-item-transition group flex items-start md:items-center justify-between p-3.5 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all ${isDragging ? 'dragging' : ''}`}>
                                                <div className="flex items-start md:items-center gap-2 md:gap-4 flex-1 pr-2 mt-0.5 md:mt-0">
                                                    {!i.fixed && !data[ck].dragDisabled ? (<div className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg shrink-0 transition-colors mt-0.5" onMouseDown={() => setCanDrag(true)} onMouseUp={() => setCanDrag(false)}><Icons.Grip /></div>) : <div className="p-1 shrink-0 w-6 h-6 md:w-8 md:h-8" />}
                                                    {i.multi ? (<div className="flex gap-1 md:gap-2 shrink-0 mr-1 mt-0.5">{i.checks?.map((c, ci) => <button key={ci} onClick={() => toggleMultiCheck(ck, i.id, ci)} className="active:scale-90 transition-all">{c ? <Icons.Check size={18} className="text-green-500 md:w-5 md:h-5" /> : <Icons.Circle size={18} className="text-slate-300 dark:text-slate-600 md:w-5 md:h-5" />}</button>)}</div>) : (<button onClick={() => toggleItem(ck, i.id)} className="active:scale-90 shrink-0 mt-0.5">{i.completed ? <Icons.Check size={20} className="text-green-500 md:w-6 md:h-6" /> : <Icons.Circle size={20} className="text-slate-300 dark:text-slate-600 md:w-6 md:h-6" />}</button>)}
                                                    <div className="flex-1 flex items-center min-w-0"><CourseInputRenderer i={i} ck={ck} handlers={handlers} getForeign2Options={getForeign2Options} studentYear={config.studentYear} data={data} /></div>
                                                </div>
                                                <div className="flex items-center gap-2 md:gap-5 shrink-0 mt-0.5 md:mt-0">
                                                    {i.recommendedSupport && (<div className="flex items-center gap-0.5 md:gap-1 order-first mr-1 md:mr-2"><input type="checkbox" checked={i.isRecommended} onChange={() => toggleRecommended(ck, i.id)} className="w-3 h-3 md:w-4 md:h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-slate-700" /><span className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-black">권장</span></div>)}
                                                    {(i.credits > 0 || !['etcGrad'].includes(ck)) && (<div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-xl flex items-center gap-0.5 md:gap-1 shadow-inner transition-all ${i.lockCredits ? 'bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500' : 'bg-slate-100 dark:bg-slate-700 focus-within:bg-white dark:focus-within:bg-slate-600 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-800 text-indigo-600 dark:text-indigo-400'}`}><input type="number" readOnly={i.lockCredits} value={i.credits} onChange={e => updateCredits(ck, i.id, e.target.value)} className={`w-5 md:w-8 text-center text-[10px] md:text-xs font-black bg-transparent outline-none`} /><span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter">PT</span></div>)}
                                                    {(!i.lockDelete || i.deleteMsg) ? (<button onClick={() => deleteItem(ck, i.id)} className="text-slate-200 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 p-1 transition-all"><Icons.Trash /></button>) : <div className="w-4 md:w-6" />}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* [추가] 리스트 반복문(map)이 끝난 직후, 여기에 코드를 넣어주세요 */}
                                    {ck === 'physics' && (
                                        <div className="px-3 md:px-6 pb-2">
                                            <button 
                                                onClick={handlers.handleElectiveModalOpen}
                                                className="w-full py-3 px-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-black text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center gap-2 border border-indigo-100 dark:border-indigo-900/30 dashed-border"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                                                전공선택 과목 담기 (체크박스)
                                            </button>
                                        </div>
                                    )}

                                    {!data[ck].dragDisabled && (
                                        <div className="p-4 md:p-8 bg-indigo-50/30 dark:bg-indigo-900/10 flex flex-col md:flex-row gap-2 md:gap-3">
                                            <input type="text" placeholder="새 항목..." value={newInputs[ck].name} onChange={e => setNewInputs(p => ({ ...p, [ck]: { ...p[ck], name: e.target.value } }))} onKeyDown={e => e.key === 'Enter' && addNew(ck)} className="flex-1 px-4 py-3 rounded-xl md:rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                                            <div className="flex gap-2">
                                                {ck !== 'etcGrad' && <input type="number" value={newInputs[ck].credits} onChange={e => setNewInputs(p => ({ ...p, [ck]: { ...p[ck], credits: e.target.value } }))} className="w-16 md:w-20 px-3 py-3 rounded-xl md:rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-black text-center text-indigo-600 dark:text-indigo-400 outline-none shadow-sm" />}
                                                <button onClick={() => addNew(ck)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl md:rounded-2xl shadow-lg transition-all active:scale-95 flex-1 md:flex-none flex justify-center items-center">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
                
                <div className="space-y-6 md:space-y-8 font-black">
                    <div 
                        id="remaining-area"
                        onClick={() => setIsExpanded(true)}
                        className="bg-slate-800 dark:bg-slate-800 text-white p-6 md:p-9 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl sticky top-8 border-4 border-slate-700/50 dark:border-slate-600/50 cursor-pointer hover:bg-slate-750 transition-colors group"
                    >
                        <h3 className="text-lg md:text-2xl font-black mb-4 md:mb-8 flex items-center gap-3 border-b border-slate-700/50 dark:border-slate-600/50 pb-4 md:pb-6 text-white tracking-tight">
                            <Icons.Target /> 수강 예정 ({remaining.length})
                            <span className="text-[10px] md:text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">확대하기</span>
                        </h3>
                        <div className="space-y-3 md:space-y-5 max-h-[40vh] md:max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar text-white">
                            {remaining.length > 0 ? remaining.map(i => (<div key={i.id} className="bg-slate-700/40 dark:bg-slate-700/60 p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-slate-600/30 dark:border-slate-500/30 group transition-all"><div className="text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors"> {i.catTitle} </div><div className="flex justify-between items-center text-white"><div className="truncate pr-3 font-black text-xs md:text-base"> {i.displayName || i.name} </div>{Number(i.credits) > 0 && <div className="text-[9px] md:text-[10px] font-black bg-indigo-500/30 text-indigo-200 px-2 py-1 rounded-full shrink-0"> {i.credits}pt </div>}</div></div>)) : <div className="text-center py-10 md:py-20 opacity-30 font-black tracking-widest uppercase text-white">Complete</div>}
                        </div>
                        <div className="mt-6 md:mt-10 pt-6 md:pt-8 border-t border-slate-700/50 dark:border-slate-600/50 text-white"><div className="flex justify-between items-center mb-2 text-amber-400"><span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">Remaining Total</span><span className="text-2xl md:text-3xl font-black tracking-tighter"> {Math.max(0, 130 - stats.overall.earned)} <span className="text-sm font-bold uppercase"> PT </span> </span></div></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
});