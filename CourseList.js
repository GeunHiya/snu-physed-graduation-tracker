window.CourseList = React.memo(({ 
    config, data, stats, remaining, sectionRefs, 
    dragHandlers, handlers, newInputs, setNewInputs, addNew, deleteItem,
    getForeign2Options, toggleItem, toggleMultiCheck, updateCredits, toggleRecommended,
    handleSectionReset,
    onOpenPlanner, 
    isExpanded, setIsExpanded 
}) => {
    const { useMemo } = React;

    const SECTION_ORDER = ['general', 'physics', 'indEng', 'shared', 'teaching', 'elective', 'etcGrad'];
    const { draggedItem, setDraggedItem, canDrag, setCanDrag, handleDragStart, handleDragEnter } = dragHandlers;

    // [수정됨] RemainingColumn 컴포넌트
    const RemainingColumn = React.memo(({ title, items, color, stats }) => {
        const styles = {
            slate: { bg: 'bg-slate-500/10', title: 'text-slate-400' },
            indigo: { bg: 'bg-indigo-500/10', title: 'text-indigo-400' },
            amber: { bg: 'bg-amber-500/10', title: 'text-amber-400' },
            emerald: { bg: 'bg-emerald-500/10', title: 'text-emerald-400' },
            rose: { bg: 'bg-rose-500/10', title: 'text-rose-400' }
        };
        const s = styles[color] || styles.slate;
        const required = stats ? stats.target : 0;
        const earned = stats ? stats.earned : 0;
        const shortage = Math.max(0, required - earned);

        // 목록에 있는 과목들의 총 예정 학점 계산
        const plannedCredits = items.reduce((acc, item) => acc + (Number(item.credits) || 0), 0);

        // 부족한 학점보다 담아둔 학점이 충분한지 여부 (시각적 강조용)
        const isSufficient = shortage > 0 && plannedCredits >= shortage;

        return (
            <div className="flex-1 min-w-0 flex flex-col bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl h-full scroll-snap-align-start">
                {/* --- 상단 헤더 영역 --- */}
                <div className={`p-5 border-b border-slate-700 ${s.bg} shrink-0`}>
                    <div className="flex justify-between items-center mb-1 gap-2">
                        {/* 제목 및 부족 학점 (공간 확보를 위해 flex-1 적용) */}
                        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                            <h3 className={`font-black text-lg md:text-xl truncate ${s.title}`} title={title}>
                                {title}
                            </h3>
                            {shortage > 0 && (
                                <span className="text-xs font-bold text-red-400 shrink-0 animate-pulse bg-red-400/10 px-1.5 py-0.5 rounded">
                                    -{shortage}
                                </span>
                            )}
                        </div>
                        
                        {/* 개수 표시 (학점 표시는 하단으로 이동됨) */}
                        <span className="text-xs text-slate-500 font-bold bg-slate-900/50 px-2 py-1 rounded-lg shrink-0">
                            {items.length}개
                        </span>
                    </div>
                    {stats && (
                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden mt-2">
                            <div className="bg-slate-500 h-full transition-all" style={{ width: `${Math.min(100, (earned/required)*100)}%` }}></div>
                        </div>
                    )}
                </div>

                {/* --- 리스트 영역 --- */}
                <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 custom-scrollbar">
                     {items.length > 0 ? items.map(i => (
                         <div key={i.id} className="bg-slate-700/50 p-3.5 rounded-2xl border border-slate-600/50 hover:bg-slate-700 transition-colors group active:scale-[0.98]">
                             <div className="flex justify-between items-start mb-1">
                                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider truncate pr-2 group-hover:text-slate-400 transition-colors">{i.catTitle}</div>
                                 {Number(i.credits) > 0 && <span className="text-[10px] bg-slate-600 text-slate-300 px-1.5 py-0.5 rounded-md font-bold shrink-0">{i.credits}pt</span>}
                             </div>
                             <div className="font-bold text-white text-sm leading-snug break-keep">{i.displayName || i.name}</div>
                         </div>
                     )) : (
                         shortage > 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-red-400/80 font-bold p-4 text-center min-h-[150px]">
                                <Icons.Target size={32} className="mb-2 opacity-80" />
                                <span className="text-sm text-red-400">학점이 부족합니다</span>
                                <span className="text-[10px] mt-1 text-red-400/60">아래 목록에서 과목을<br/>더 추가해주세요.</span>
                            </div>
                         ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 font-bold opacity-40 min-h-[150px]">
                                <Icons.Check size={32} className="mb-2" />
                                <span className="text-xs">완료됨</span>
                            </div>
                         )
                     )}
                </div>

                {/* --- [신규] 하단 학점 합계 영역 --- */}
                <div className={`px-5 py-3 border-t border-slate-700/50 ${s.bg} flex justify-between items-center shrink-0`}>
                    <span className={`text-xs font-bold ${s.title} opacity-70`}>
                        담은 학점 합계
                    </span>
                    <div className={`text-sm font-black flex items-center gap-1 ${isSufficient ? 'text-emerald-400' : 'text-slate-200'}`}>
                        <span>+{plannedCredits}</span>
                        <span className="text-xs font-bold opacity-70">pt</span>
                    </div>
                </div>
            </div>
        );
    });

    const groupedRemaining = useMemo(() => {
        const groups = { general: [], physics: [], double: [], teaching: [], others: [] };
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
            {isExpanded && (
                <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-0 md:p-6 animation-fade-in" onClick={() => setIsExpanded(false)}>
                    {/* ... (수강 예정 확대 모달 내용 기존과 동일) ... */}
                    <div className="bg-slate-800 text-white w-full h-full md:max-w-[98%] md:h-[95%] md:rounded-[2.5rem] shadow-2xl border-0 md:border border-slate-600/50 flex flex-col overflow-hidden relative animate-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 md:px-8 md:py-5 border-b border-slate-700 flex justify-between items-center shrink-0 bg-slate-800 safe-top-padding">
                            <div className="flex items-center gap-3 md:gap-4">
                                <h2 className="text-lg md:text-2xl font-black flex items-center gap-2 md:gap-3 text-slate-100 truncate">
                                    <Icons.Target /> 수강 예정 목록 ({remaining.length})
                                </h2>
                                <button onClick={() => { setIsExpanded(false); onOpenPlanner(); }} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-indigo-500/30 whitespace-nowrap">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    이수 계획 세우기
                                </button>
                            </div>
                            <button onClick={() => setIsExpanded(false)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors group shrink-0">
                                <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto lg:overflow-hidden p-4 md:p-6 bg-slate-900/50">
                             <div className="flex flex-col lg:flex-row h-auto lg:h-full gap-4 lg:gap-4 pb-10 md:pb-0">
                                <RemainingColumn title="교양" items={groupedRemaining.general} color="slate" stats={stats.general} />
                                <RemainingColumn title="물리교육" items={groupedRemaining.physics} color="indigo" stats={stats.physics} />
                                {(config.majorPath !== 'single') && <RemainingColumn title={config.secondMajorTitle || "복수/부전공"} items={groupedRemaining.double} color="amber" stats={stats.indEng} />}
                                <RemainingColumn title="교직" items={groupedRemaining.teaching} color="emerald" stats={stats.teaching} />
                                <RemainingColumn title="기타" items={groupedRemaining.others} color="rose" stats={null} />
                             </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-900 border-t border-slate-700 flex justify-between items-center shrink-0 safe-bottom-padding">
                            <span className="text-slate-500 font-bold text-xs md:text-sm">졸업까지 남은 학점</span>
                            <span className="text-xl md:text-2xl font-black text-amber-400 tracking-tight">{Math.max(0, 130 - stats.overall.earned)} PT</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 font-bold">
                <div id="course-list-area" className="lg:col-span-2 space-y-6 md:space-y-10 pb-20 md:pb-0 relative">
                    {/* ... (기존 섹션 렌더링 코드 동일) ... */}
                    {SECTION_ORDER.map(ck => {
                        if (ck === 'shared') return null;
                        if ((ck === 'indEng') && config.majorPath === 'single') return null;

                        const sectionTitle = ck === 'indEng' ? `${config.secondMajorTitle || '제2전공'} (${config.majorPath === 'double' ? '복수전공' : '부전공'})` : data[ck].title;
                        const isSharedOrElective = ['etcGrad', 'elective'].includes(ck);
                        
                        let statusBadge = null;
                        const isCreditsFull = stats[ck].earned >= stats[ck].target;

                        if (stats[ck].isComplete) {
                            statusBadge = <span className="text-[10px] md:text-[11px] font-black px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm border border-green-200 dark:border-green-800">충족 ✓</span>;
                        } else if (isCreditsFull && stats[ck].missingMandatory) {
                            statusBadge = <span className="text-[10px] md:text-[11px] font-black px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse shadow-sm border border-red-200 dark:border-red-800">필수 미이수</span>;
                        } else if (isCreditsFull && stats[ck].missingRecommended) {
                            statusBadge = <span className="text-[10px] md:text-[11px] font-black px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse shadow-sm border border-red-200 dark:border-red-800">권장 미이수</span>;
                        } else {
                            statusBadge = <span className="text-[10px] md:text-[11px] font-black px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-600">진행중</span>;
                        }

                        return (
                            <section key={ck} ref={sectionRefs[ck]} className={`bg-white dark:bg-slate-800 rounded-3xl md:rounded-[3rem] card-shadow overflow-hidden border ${ck === 'shared' ? 'border-amber-100 dark:border-amber-900/30' : (ck === 'elective' ? 'border-indigo-50 dark:border-indigo-900/30' : 'border-slate-100 dark:border-slate-700')} scroll-mt-32 transition-colors`}>
                                <div className={`px-5 py-5 md:px-10 md:py-7 border-b ${ck === 'shared' ? 'bg-amber-50/40 dark:bg-amber-900/10 border-amber-50 dark:border-amber-900/20' : (ck === 'elective' ? 'bg-indigo-50/20 dark:bg-indigo-900/10 border-indigo-50 dark:border-indigo-900/20' : 'bg-slate-50/50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-700')}`}>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
                                        <div className="flex flex-col text-slate-700 dark:text-slate-300 w-full md:w-auto">
                                            <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                                {ck === 'etcGrad' ? <Icons.Shield /> : ck === 'shared' ? <Icons.Layers className="text-amber-500" /> : <Icons.Book />}
                                                {sectionTitle}
                                            </h2>
                                            
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                {!isSharedOrElective && (
                                                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
                                                        {stats[ck].earned} / {stats[ck].target} PT
                                                    </span>
                                                )}
                                                
                                                {ck === 'indEng' && (
                                                    <label className="flex items-center cursor-pointer group bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                                                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${data.indEng.mandatoryCompleted ? 'bg-indigo-600 border-indigo-600' : 'border-slate-400 bg-white dark:bg-slate-700 dark:border-slate-500'}`}>
                                                            {data.indEng.mandatoryCompleted && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                        </div>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={!!data.indEng.mandatoryCompleted} 
                                                            onChange={() => handlers.toggleMandatory(ck)} 
                                                            className="hidden" 
                                                        />
                                                        <span className={`text-[10px] ml-1.5 font-bold ${data.indEng.mandatoryCompleted ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>필수 이수 완료</span>
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full md:w-auto gap-2 mt-1 md:mt-0">
                                            {!['elective'].includes(ck) && statusBadge}
                                            <button onClick={() => handleSectionReset(ck)} className="text-[10px] font-black bg-white/80 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 border border-transparent hover:border-slate-200 dark:hover:border-slate-500 text-slate-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1 ml-auto md:ml-0">
                                                <span>초기화</span> ↺
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-50 dark:divide-slate-700/50 text-slate-700 dark:text-slate-200 font-bold">
                                    {data[ck].items.map((i, idx) => {
                                        if (i.hidden) return null;
                                        const isDragging = draggedItem?.cat === ck && draggedItem?.index === idx;
                                        
                                        return (
                                            <div key={i.id} draggable={!i.fixed && !data[ck].dragDisabled && canDrag} onDragStart={() => handleDragStart(ck, idx)} onDragEnter={() => handleDragEnter(ck, idx)} onDragEnd={() => { setDraggedItem(null); setCanDrag(false); }} onDragOver={e => e.preventDefault()} className={`list-item-transition group flex items-start justify-between p-4 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all ${isDragging ? 'dragging' : ''} min-h-[3.5rem]`}>
                                                
                                                <div className="flex items-start gap-3 md:gap-4 flex-1 pr-2 w-full min-w-0">
                                                    {!i.fixed && !data[ck].dragDisabled ? (
                                                        <div className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg shrink-0 transition-colors mt-0.5 text-slate-300 dark:text-slate-600" onMouseDown={() => setCanDrag(true)} onMouseUp={() => setCanDrag(false)}>
                                                            <Icons.Grip />
                                                        </div>
                                                    ) : <div className="p-1.5 shrink-0 w-7" />}
                                                    
                                                    {i.multi ? (
                                                        <div className="flex gap-1.5 shrink-0 mr-1 mt-0.5">
                                                            {i.checks?.map((c, ci) => (
                                                                <button key={ci} onClick={() => toggleMultiCheck(ck, i.id, ci)} className="active:scale-90 transition-all p-0.5">
                                                                    {c ? <Icons.Check size={22} className="text-green-500" /> : <Icons.Circle size={22} className="text-slate-300 dark:text-slate-600 hover:text-slate-400" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => toggleItem(ck, i.id)} className="active:scale-90 shrink-0 mt-0.5 p-0.5 transition-transform">
                                                            {i.completed ? <Icons.Check size={24} className="text-green-500" /> : <Icons.Circle size={24} className="text-slate-300 dark:text-slate-600 hover:text-slate-400" />}
                                                        </button>
                                                    )}

                                                    <div className="flex-1 flex flex-col md:flex-row md:items-center items-start w-full min-w-0 gap-2 md:gap-0">
                                                        <CourseInputRenderer i={i} ck={ck} handlers={handlers} getForeign2Options={getForeign2Options} studentYear={config.studentYear} data={data} />
                                                        
                                                        {ck === 'indEng' && (
                                                            <button 
                                                                onClick={() => handlers.toggleShared(ck, i.id)} 
                                                                className={`md:ml-2 px-2 py-1 rounded-lg text-[10px] font-black border transition-all whitespace-nowrap ${i.isShared ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-600 hover:border-amber-300 hover:text-amber-400'}`}
                                                            >
                                                                {i.isShared ? "중복 인정됨" : "중복 인정"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4 shrink-0 pl-2">
                                                    {i.recommendedSupport && (
                                                        <label className="flex items-center gap-1 md:mr-2 cursor-pointer p-1">
                                                            <input type="checkbox" checked={i.isRecommended} onChange={() => toggleRecommended(ck, i.id)} className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-slate-700 accent-indigo-600" />
                                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black">권장</span>
                                                        </label>
                                                    )}
                                                    
                                                    {(i.credits > 0 || !['etcGrad'].includes(ck)) && (
                                                        <div className={`h-8 px-2 md:px-3 rounded-xl flex items-center gap-1 shadow-inner transition-all ${i.lockCredits ? 'bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500' : 'bg-slate-100 dark:bg-slate-700 focus-within:bg-white dark:focus-within:bg-slate-600 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus:ring-indigo-800 text-indigo-600 dark:text-indigo-400'}`}>
                                                            <input type="number" readOnly={i.lockCredits} value={i.credits} onChange={e => updateCredits(ck, i.id, e.target.value)} className={`w-6 md:w-8 text-center text-xs md:text-sm font-black bg-transparent outline-none`} />
                                                            <span className="text-[9px] font-black uppercase tracking-tighter opacity-70">PT</span>
                                                        </div>
                                                    )}
                                                    
                                                    {(!i.lockDelete || i.deleteMsg) ? (
                                                        <button onClick={() => deleteItem(ck, i.id)} className="w-8 h-8 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                                                            <Icons.Trash />
                                                        </button>
                                                    ) : <div className="w-8" />}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {ck === 'physics' && (
                                        <div className="px-4 py-3 md:px-6 md:pb-6">
                                            <button 
                                                onClick={handlers.handleElectiveModalOpen}
                                                className="w-full py-4 px-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center gap-2 border border-indigo-100 dark:border-indigo-900/30 dashed-border shadow-sm active:scale-[0.98]"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                                                전공선택 과목 담기
                                            </button>
                                        </div>
                                    )}

                                    {!data[ck].dragDisabled && (
                                        <div className="p-4 md:p-6 bg-indigo-50/50 dark:bg-indigo-900/10 flex flex-col md:flex-row gap-3">
                                            <input 
                                                type="text" 
                                                placeholder="새 항목 이름 입력..." 
                                                value={newInputs[ck].name} 
                                                onChange={e => setNewInputs(p => ({ ...p, [ck]: { ...p[ck], name: e.target.value } }))} 
                                                onKeyDown={e => e.key === 'Enter' && addNew(ck)} 
                                                className="flex-1 h-12 md:h-auto px-4 rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow" 
                                            />
                                            <div className="flex gap-2 h-12 md:h-auto">
                                                {ck !== 'etcGrad' && (
                                                    <div className="relative">
                                                        <input 
                                                            type="number" 
                                                            value={newInputs[ck].credits} 
                                                            onChange={e => setNewInputs(p => ({ ...p, [ck]: { ...p[ck], credits: e.target.value } }))} 
                                                            className="w-20 h-full px-3 rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-black text-center text-indigo-600 dark:text-indigo-400 outline-none shadow-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900" 
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none">PT</span>
                                                    </div>
                                                )}
                                                <button onClick={() => addNew(ck)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex-1 md:flex-none flex justify-center items-center font-black gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                                                    <span className="md:hidden">추가</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
                
                {/* 우측 수강 예정 패널 (데스크탑 전용 - 기존 코드 유지) */}
                <div className="hidden lg:block space-y-8 font-black">
                    <div 
                        id="remaining-area"
                        onClick={() => setIsExpanded(true)}
                        className="bg-slate-800 dark:bg-slate-800 text-white p-8 rounded-[3rem] shadow-2xl sticky top-8 border-4 border-slate-700/50 dark:border-slate-600/50 cursor-pointer hover:bg-slate-750 transition-all group hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {/* ... (기존 우측 패널 내용 생략) ... */}
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-3 border-b border-slate-700/50 dark:border-slate-600/50 pb-6 text-white tracking-tight">
                            <Icons.Target /> 수강 예정 ({remaining.length})
                            <span className="text-xs bg-indigo-500 text-white px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ml-auto">확대</span>
                        </h3>
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar text-white">
                            {remaining.length > 0 ? remaining.map(i => (
                                <div key={i.id} className="bg-slate-700/40 dark:bg-slate-700/60 p-4 rounded-[1.2rem] border border-slate-600/30 dark:border-slate-500/30 group transition-all hover:bg-slate-700">
                                    <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors"> {i.catTitle} </div>
                                    <div className="flex justify-between items-center text-white">
                                        <div className="truncate pr-3 font-black text-base"> {i.displayName || i.name} </div>
                                        {Number(i.credits) > 0 && <div className="text-[10px] font-black bg-indigo-500/30 text-indigo-200 px-2 py-1 rounded-full shrink-0"> {i.credits}pt </div>}
                                    </div>
                                </div>
                            )) : <div className="text-center py-20 opacity-30 font-black tracking-widest uppercase text-white">Complete</div>}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-700/50 dark:border-slate-600/50 text-white">
                            <div className="flex justify-between items-center mb-2 text-amber-400">
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">Remaining Total</span>
                                <span className="text-3xl font-black tracking-tighter"> {Math.max(0, 130 - stats.overall.earned)} <span className="text-sm font-bold uppercase"> PT </span> </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
});