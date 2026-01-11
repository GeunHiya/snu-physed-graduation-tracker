window.CourseList = ({ 
    config, data, stats, remaining, sectionRefs, 
    dragHandlers, handlers, newInputs, setNewInputs, addNew, deleteItem,
    getForeign2Options, toggleItem, toggleMultiCheck, updateCredits, toggleRecommended,
    handleSectionReset
}) => {
    const SECTION_ORDER = ['general', 'physics', 'indEng', 'shared', 'teaching', 'elective', 'etcGrad'];
    const { draggedItem, setDraggedItem, canDrag, setCanDrag, handleDragStart, handleDragEnter } = dragHandlers;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 font-bold">
            <div className="lg:col-span-2 space-y-6 md:space-y-10">
                {SECTION_ORDER.map(ck => {
                    if ((ck === 'indEng' || ck === 'shared') && config.majorPath === 'single') return null;
                    const sectionTitle = ck === 'indEng' ? `${config.secondMajorTitle || '제2전공'} (${config.majorPath === 'double' ? '복수전공' : '부전공'})` : data[ck].title;
                    return (
                        <section key={ck} ref={sectionRefs[ck]} className={`bg-white rounded-3xl md:rounded-[3rem] card-shadow overflow-hidden border ${ck === 'shared' ? 'border-amber-100' : (ck === 'elective' ? 'border-indigo-50' : 'border-slate-50')} scroll-mt-20`}>
                            <div className={`px-5 py-5 md:px-10 md:py-7 border-b flex justify-between items-center ${ck === 'shared' ? 'bg-amber-50/40 border-amber-50' : (ck === 'elective' ? 'bg-indigo-50/20 border-indigo-50' : 'bg-slate-50/50 border-slate-100')}`}>
                                <div className="flex flex-col text-slate-700">
                                    <h2 className="text-lg md:text-xl font-black flex items-center gap-2 md:gap-3 text-slate-800">
                                        {ck === 'etcGrad' ? <Icons.Shield /> : ck === 'shared' ? <Icons.Layers className="text-amber-500" /> : (ck === 'elective' ? <Icons.Zap className="text-indigo-500" /> : <Icons.Book />)}
                                        {sectionTitle}
                                    </h2>
                                    {!['shared', 'etcGrad', 'elective'].includes(ck) && (<span className="text-[10px] md:text-[11px] font-bold text-indigo-400 mt-0.5 md:mt-1 uppercase tracking-widest text-slate-400">이수: {stats[ck].earned} pt / 필요: {stats[ck].target} pt</span>)}
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <button onClick={() => handleSectionReset(ck)} className="text-[9px] md:text-[10px] font-black bg-white/80 hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-red-500 px-2 py-1 md:px-3 md:py-1.5 rounded-full transition-all shadow-sm">
                                        ↺
                                    </button>
                                    {!['shared', 'elective'].includes(ck) && (<span className={`text-[9px] md:text-[10px] font-black px-2.5 py-1.5 md:px-4 md:py-2 rounded-full ${stats[ck].isComplete ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>{stats[ck].isComplete ? '충족 ✓' : 'ING'}</span>)}
                                </div>
                            </div>
                            <div className="divide-y divide-slate-50 text-slate-700 font-bold">
                                {data[ck].items.map((i, idx) => {
                                    if (i.hidden) return null;
                                    return (
                                        // [핵심] items-start로 설정하여 내용이 2줄이 되어도 체크박스가 위쪽에 고정됨
                                        <div key={i.id} draggable={!i.fixed && !data[ck].dragDisabled && canDrag} onDragStart={() => handleDragStart(ck, idx)} onDragEnter={() => handleDragEnter(ck, idx)} onDragEnd={() => { setDraggedItem(null); setCanDrag(false); }} onDragOver={e => e.preventDefault()} className={`list-item-transition group flex items-start md:items-center justify-between p-3.5 md:p-6 hover:bg-slate-50 transition-all ${draggedItem?.cat === ck && draggedItem?.index === idx ? 'dragging' : ''}`}>
                                            <div className="flex items-start md:items-center gap-2 md:gap-4 flex-1 pr-2 mt-0.5 md:mt-0">
                                                {!i.fixed && !data[ck].dragDisabled ? (<div className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-200 rounded-lg shrink-0 transition-colors mt-0.5" onMouseDown={() => setCanDrag(true)} onMouseUp={() => setCanDrag(false)}><Icons.Grip /></div>) : <div className="p-1 shrink-0 w-6 h-6 md:w-8 md:h-8" />}
                                                {i.multi ? (<div className="flex gap-1 md:gap-2 shrink-0 mr-1 mt-0.5">{i.checks?.map((c, ci) => <button key={ci} onClick={() => toggleMultiCheck(ck, i.id, ci)} className="active:scale-90 transition-all">{c ? <Icons.Check size={18} className="text-green-500 md:w-5 md:h-5" /> : <Icons.Circle size={18} className="text-slate-300 md:w-5 md:h-5" />}</button>)}</div>) : (<button onClick={() => toggleItem(ck, i.id)} className="active:scale-90 shrink-0 mt-0.5">{i.completed ? <Icons.Check size={20} className="text-green-500 md:w-6 md:h-6" /> : <Icons.Circle size={20} className="text-slate-300 md:w-6 md:h-6" />}</button>)}
                                                <div className="flex-1 flex items-center min-w-0"><CourseInputRenderer i={i} ck={ck} handlers={handlers} getForeign2Options={getForeign2Options} studentYear={config.studentYear} data={data} /></div>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-5 shrink-0 mt-0.5 md:mt-0">
                                                {i.recommendedSupport && (<div className="flex items-center gap-0.5 md:gap-1 order-first mr-1 md:mr-2"><input type="checkbox" checked={i.isRecommended} onChange={() => toggleRecommended(ck, i.id)} className="w-3 h-3 md:w-4 md:h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /><span className="text-[9px] md:text-[10px] text-slate-400 font-black">권장</span></div>)}
                                                {(i.credits > 0 || !['etcGrad'].includes(ck)) && (<div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-xl flex items-center gap-0.5 md:gap-1 shadow-inner transition-all ${i.lockCredits ? 'bg-slate-50 border border-slate-100 text-slate-400' : 'bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 text-indigo-600'}`}><input type="number" readOnly={i.lockCredits} value={i.credits} onChange={e => updateCredits(ck, i.id, e.target.value)} className={`w-5 md:w-8 text-center text-[10px] md:text-xs font-black bg-transparent outline-none`} /><span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter">PT</span></div>)}
                                                {(!i.lockDelete || i.deleteMsg) ? (<button onClick={() => deleteItem(ck, i.id)} className="text-slate-200 hover:text-red-500 p-1 transition-all"><Icons.Trash /></button>) : <div className="w-4 md:w-6" />}
                                            </div>
                                        </div>
                                    );
                                })}
                                {!data[ck].dragDisabled && (
                                    <div className="p-4 md:p-8 bg-indigo-50/30 flex flex-col md:flex-row gap-2 md:gap-3">
                                        <input type="text" placeholder="새 항목..." value={newInputs[ck].name} onChange={e => setNewInputs(p => ({ ...p, [ck]: { ...p[ck], name: e.target.value } }))} onKeyDown={e => e.key === 'Enter' && addNew(ck)} className="flex-1 px-4 py-3 rounded-xl md:rounded-2xl bg-white border border-slate-200 text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-indigo-100" />
                                        <div className="flex gap-2">
                                            {ck !== 'etcGrad' && <input type="number" value={newInputs[ck].credits} onChange={e => setNewInputs(p => ({ ...p, [ck]: { ...p[ck], credits: e.target.value } }))} className="w-16 md:w-20 px-3 py-3 rounded-xl md:rounded-2xl bg-white border border-slate-200 text-sm font-black text-center text-indigo-600 outline-none shadow-sm" />}
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
                <div className="bg-slate-800 text-white p-6 md:p-9 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl sticky top-8 border-4 border-slate-700/50">
                    <h3 className="text-lg md:text-2xl font-black mb-4 md:mb-8 flex items-center gap-3 border-b border-slate-700/50 pb-4 md:pb-6 text-white tracking-tight">
                        <Icons.Target /> 수강 예정 ({remaining.length})
                    </h3>
                    <div className="space-y-3 md:space-y-5 max-h-[40vh] md:max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar text-white">
                        {remaining.length > 0 ? remaining.map(i => (<div key={i.id} className="bg-slate-700/40 p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-slate-600/30 group transition-all"><div className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors"> {i.catTitle} </div><div className="flex justify-between items-center text-white"><div className="truncate pr-3 font-black text-xs md:text-base"> {i.displayName || i.name} </div>{Number(i.credits) > 0 && <div className="text-[9px] md:text-[10px] font-black bg-indigo-500/30 text-indigo-200 px-2 py-1 rounded-full shrink-0"> {i.credits}pt </div>}</div></div>)) : <div className="text-center py-10 md:py-20 opacity-30 font-black tracking-widest uppercase text-white">Complete</div>}
                    </div>
                    <div className="mt-6 md:mt-10 pt-6 md:pt-8 border-t border-slate-700/50 text-white"><div className="flex justify-between items-center mb-2 text-amber-400"><span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Remaining Total</span><span className="text-2xl md:text-3xl font-black tracking-tighter"> {Math.max(0, 130 - stats.overall.earned)} <span className="text-sm font-bold uppercase"> PT </span> </span></div></div>
                </div>
            </div>
        </div>
    );
};