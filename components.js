// ... (아이콘 컴포넌트 부분은 기존과 동일하므로 생략, 필요한 경우 파일에서 복사) ...
// --- 아이콘 컴포넌트 ---
window.Icons = {
    Cap: React.memo(() => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm0 0V20"/></svg>),
    Book: React.memo(() => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>),
    Check: React.memo(({ className = "text-green-500", size = 20 }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>),
    Circle: React.memo(({ className = "text-slate-300 dark:text-slate-600", size = 20 }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/></svg>),
    Trash: React.memo(() => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2m3 3h8M4 7h16"/></svg>),
    Save: React.memo(() => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>),
    Target: React.memo(({ size = 24, className = "text-amber-400" }) => <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a.75.75 0 001.034-.141 11.96 11.96 0 0115.26 0 .75.75 0 101.033 1.085 13.46 13.46 0 00-17.327 0 .75.75 0 001.034-1.085z"/></svg>),
    Shield: React.memo(() => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
    Grip: React.memo(() => <svg className="w-4 h-4 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/></svg>),
    ArrowUp: React.memo(() => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>),
    Zap: React.memo(({ className = "w-5 h-5 text-indigo-500" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
    User: React.memo(() => <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
    Layers: React.memo(({ className = "w-5 h-5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>),
    Logout: React.memo(() => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>),
    Mail: React.memo(() => <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>),
    ChevronDown: React.memo(() => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>),
    Settings: React.memo(() => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
    Sun: React.memo(() => <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>),
    Moon: React.memo(() => <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>)
};

// --- 입력 필드 렌더러 ---
window.CourseInputRenderer = React.memo(({ i, ck, handlers, getForeign2Options, studentYear, data }) => {
    const { handleForeignChange, updateName, handleMathChange, handleMSChange, handleCorePrefixChange, handleSubjectSelect, handleBasicEnglishYearChange, handleEnglish1420Change, handleElectiveModalOpen } = handlers;
    
    // 4자리 -> 2자리 변환
    const y = studentYear > 2000 ? studentYear % 100 : studentYear;

    const containerClass = "flex flex-col items-start gap-1.5 w-full md:flex-row md:items-center md:gap-2 text-sm font-bold";
    const selectClass = "bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 outline-none font-bold w-full md:w-auto text-slate-700 dark:text-slate-200 text-xs md:text-sm border-none transition-colors";
    const inputClass = "bg-transparent border-none outline-none text-sm w-full font-bold input-underline focus:text-indigo-600 dark:focus:text-indigo-400 border-b border-transparent focus:border-transparent text-slate-700 dark:text-slate-200 py-1 transition-colors";
    const colonClass = "hidden md:block text-slate-400 dark:text-slate-500 shrink-0";

    const englishSubjects = ['대학영어 1', '대학영어 2', '고급영어'];

    // [신규] 교직 과목 선택박스 렌더링
    if (i.type === 'teachingSelect') {
        const currentSelections = data[ck].items
            .filter(item => item.type === 'teachingSelect' && item.id !== i.id)
            .map(item => item.name);

        const availableOptions = TEACHING_SUBJECTS.filter(opt => !currentSelections.includes(opt));

        return (
            <div className={containerClass}>
                <select value={i.name} onChange={(e) => updateName(ck, i.id, e.target.value)} className={`${selectClass} w-full`}>
                    <option value="" disabled>과목 선택</option>
                    {i.name && !availableOptions.includes(i.name) && <option value={i.name}>{i.name}</option>}
                    {availableOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
        );
    }

    if (i.type === 'majorElectiveTrigger') {
        return (
            <div className="w-full">
                <button 
                    onClick={handleElectiveModalOpen}
                    className="w-full py-2 px-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-black text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center gap-2 border border-indigo-100 dark:border-indigo-900/30"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    전공선택 과목 담기
                </button>
            </div>
        );
    }

    if (i.id === 'g_be') {
        if (y >= 24) return <div className={containerClass}><span className="text-slate-700 dark:text-slate-200 shrink-0">기초 영어</span></div>;
        return <div className={containerClass}><span className="text-slate-700 dark:text-slate-200 shrink-0">기초 영어</span><span className={colonClass}>:</span><select value={i.takenYear || 'before23'} onChange={(e) => handleBasicEnglishYearChange(ck, i.id, e.target.value)} className={selectClass}><option value="before23">2023학년도 이전 수강 (1pt)</option><option value="after24">2024학년도 이후 수강 (2pt)</option></select></div>;
    }
    if (i.type === 'foreign1') {
        return (
            <div className={containerClass}>
                <span className="text-slate-400 dark:text-slate-500 shrink-0">외국어 1</span>
                <span className={colonClass}>:</span>
                <select value={i.subName} onChange={(e) => handleForeignChange(ck, i.id, 'subName', e.target.value)} className={selectClass}>
                    {FOREIGN1_OPTIONS.map(opt => <option key={opt} value={opt}>{opt === '면제' ? '제2외국어(면제)' : opt}</option>)}
                </select>
                {i.isEnglish1420 && englishSubjects.includes(i.subName) && (
                    <select value={i.takenTime1420 || 'before21'} onChange={(e) => handleEnglish1420Change(ck, i.id, e.target.value)} className={selectClass}>
                        <option value="before21">2020년 이전 수강 (2pt)</option>
                        <option value="after21">2021년 이후 수강 (3pt)</option>
                    </select>
                )}
                {i.subName === '면제' && <input type="text" value={i.name || ''} onChange={(e) => updateName(ck, i.id, e.target.value)} className={inputClass} placeholder="과목명..." />}
            </div>
        );
    }
    if (i.type === 'foreign2') {
        return (
            <div className={containerClass}>
                <span className="text-slate-400 dark:text-slate-500 shrink-0">외국어 2</span>
                <span className={colonClass}>:</span>
                <select value={i.subName} onChange={(e) => handleForeignChange(ck, i.id, 'subName', e.target.value)} className={selectClass}>
                    <option value="" disabled>선택</option>
                    {getForeign2Options().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                {i.isEnglish1420 && englishSubjects.includes(i.subName) && (
                    <select value={i.takenTime1420 || 'before21'} onChange={(e) => handleEnglish1420Change(ck, i.id, e.target.value)} className={selectClass}>
                        <option value="before21">2020년 이전 수강 (2pt)</option>
                        <option value="after21">2021년 이후 수강 (3pt)</option>
                    </select>
                )}
                {i.subName === '제2외국어' && <input type="text" value={i.name || ''} onChange={(e) => updateName(ck, i.id, e.target.value)} className={inputClass} placeholder="과목명..." />}
            </div>
        );
    }
    if (i.type === 'mathSet') return <div className={containerClass}><select value={i.subName} onChange={(e) => handleMathChange(ck, i.id, e.target.value)} className={selectClass}>{(i.id === 'g_m2' ? MATH2_PAIRS : MATH1_PAIRS).map(p => <option key={p.main} value={p.main}>{p.main}</option>)}</select></div>;
    if (i.type === 'msSet') return <div className={containerClass}><span className="text-slate-400 dark:text-slate-500 shrink-0">{i.name}</span><span className={colonClass}>:</span><select value={i.subName} onChange={(e) => handleMSChange(ck, i.id, e.target.value)} className={selectClass}><option value={i.subName} disabled>{i.subName}</option>{((y === 23 || y === 24) ? MS_OPTIONS.filter(o => ['물리학 1', '화학 1', '생물학 1', '지구과학'].includes(o.main)) : MS_OPTIONS).map(o => <option key={o.main} value={o.main}>{o.main}</option>)}</select></div>;
    if (i.type === 'physics1Select') return <div className={containerClass}><select value={i.name} onChange={(e) => updateName(ck, i.id, e.target.value)} className={selectClass}><option value="물리학 1">물리학 1</option><option value="고급물리학 1">고급물리학 1</option></select></div>;
    if (i.type === 'computer') return <div className={containerClass}><span className="text-slate-400 dark:text-slate-500 shrink-0 font-bold">{i.prefix}</span><span className={colonClass}>:</span><select value={i.name} onChange={(e) => updateName(ck, i.id, e.target.value)} className={selectClass}><option value="선택" disabled>선택</option>{i.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>;
    if (i.type === 'keys') {
        const currentKeysItems = data[ck].items.filter(item => item.type === 'keys');
        const selectedOptions = currentKeysItems.map(item => item.prefix).filter(p => KEYS_OPTIONS.includes(p));
        const availableOptions = KEYS_OPTIONS.map(opt => ({ value: opt, disabled: selectedOptions.includes(opt) && opt !== i.prefix }));
        return <div className={containerClass}><select value={i.prefix} onChange={e => handleCorePrefixChange(ck, i.id, e.target.value)} className={selectClass}><option value={i.prefix} disabled hidden>{i.prefix}</option>{availableOptions.map(opt => <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.value}</option>)}</select><span className={colonClass}>:</span><input type="text" value={i.name} onChange={e => updateName(ck, i.id, e.target.value)} className={inputClass} placeholder="과목명..." /></div>;
    }
    if (i.type === 'core' || i.type === 'pe' || i.type === 'veritas') return <div className={containerClass}>{i.options ? <select value={i.prefix} onChange={e => handleCorePrefixChange(ck, i.id, e.target.value)} className={selectClass}>{i.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select> : <span className="text-slate-400 dark:text-slate-500 shrink-0 font-bold">{i.prefix}</span>}<span className={colonClass}>:</span><input type="text" value={i.name} onChange={e => updateName(ck, i.id, e.target.value)} className={inputClass} placeholder="과목명..." /></div>;
    if (i.type === 'coreFixed') return <div className={containerClass}><span className="text-slate-400 dark:text-slate-500 shrink-0 font-bold">{i.prefix}</span><span className={colonClass}>:</span><input type="text" value={i.name} onChange={e => updateName(ck, i.id, e.target.value)} className={inputClass} placeholder="과목명..." /></div>;
    if (i.selectable) {
        const choices = i.limitedChoices ? PHYSICS_ED_CHOICES.filter(o => o.name !== '과학 논리 및 논술') : PHYSICS_ED_CHOICES;
        return <select value={i.name.includes('[') ? '' : i.name} onChange={(e) => handleSubjectSelect(ck, i.id, e.target.value)} className={`bg-slate-50 dark:bg-slate-700 border-none outline-none text-sm font-bold text-slate-700 dark:text-slate-200 py-2 px-3 rounded-xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 w-full transition-colors ${i.completed ? 'text-slate-300 dark:text-slate-600 font-normal' : ''}`}><option value="" disabled>{i.name}</option>{choices.map(opt => <option key={opt.name} value={opt.name}>{opt.name} ({opt.credits}pt)</option>)}</select>;
    }
    return <input type="text" value={i.name} readOnly={i.fixedName || i.fixed} onChange={e => updateName(ck, i.id, e.target.value)} draggable={false} placeholder={i.placeholder} className={`bg-transparent border-none outline-none text-sm w-full font-bold focus:text-indigo-600 dark:focus:text-indigo-400 transition-colors ${!i.fixedName && !i.fixed ? 'input-underline border-b border-transparent focus:border-transparent' : ''} ${(i.completed || (i.multi && i.checks?.every(c => c))) ? 'text-slate-300 dark:text-slate-600 line-through font-normal' : (i.placeholder && !i.name ? 'text-gray-400 dark:text-gray-500' : 'text-slate-700 dark:text-slate-200')} ${i.fixed && !i.deleteMsg ? 'cursor-default' : ''}`} />;
});

// 데이터 조작 핸들러 훅
window.useDataHandlers = (setData, setModal, setNewInputs, newInputs, config, setShowElectiveModal) => {
    const { useCallback } = React;

    const toggleItem = useCallback((ck, id) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, completed: !i.completed } : i) } })), [setData]);
    const toggleMultiCheck = useCallback((ck, id, idx) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, checks: i.checks.map((c, ci) => ci === idx ? !c : c) } : i) } })), [setData]);
    const updateCredits = useCallback((ck, id, val) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, credits: val === "" ? "" : parseInt(val) || 0 } : i) } })), [setData]);
    const updateName = useCallback((ck, id, val) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, name: val } : i) } })), [setData]);
    const toggleRecommended = useCallback((ck, id) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, isRecommended: !i.isRecommended } : i) } })), [setData]);
    
    // [신규] 제2전공 섹션의 '중복 인정' 여부 토글
    const toggleShared = useCallback((ck, id) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, isShared: !i.isShared } : i) } })), [setData]);
    
    // [신규] 제2전공 섹션의 '필수 이수 완료' 체크박스 토글
    const toggleMandatory = useCallback((ck) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], mandatoryCompleted: !prev[ck].mandatoryCompleted } })), [setData]);

    const handleMathChange = useCallback((ck, id, mainMath) => { const pair = MATH1_PAIRS.concat(MATH2_PAIRS).find(p => p.main === mainMath); if (!pair) return; setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => { if (i.id === id) return { ...i, subName: pair.main, name: pair.main }; if (id === 'g_m1' && i.id === 'g_mp1') return { ...i, name: pair.practice }; if (id === 'g_m2' && i.id === 'g_mp2') return { ...i, name: pair.practice }; return i; })}})); }, [setData]);
    const handleMSChange = useCallback((ck, id, selectedMain) => { const opt = MS_OPTIONS.find(o => o.main === selectedMain); const suffix = id.slice(-1); setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => { if (i.id === id) return { ...i, subName: opt.main, credits: opt.mainCr }; if (i.id === `g_msp${suffix}`) return { ...i, name: opt.practice || '', credits: opt.pracCr, hidden: opt.practice === null }; return i; })}})); }, [setData]);
    const handleCorePrefixChange = useCallback((ck, id, prefix) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, prefix } : i) } })), [setData]);
    const handleForeignChange = useCallback((ck, id, field, val) => { setData(prev => { let newItems = prev[ck].items.map(i => i.id === id ? (val === '면제' ? { ...i, [field]: val, name: '' } : { ...i, [field]: val }) : i); const currentF1 = newItems.find(i => i.type === 'foreign1'); const currentF2 = newItems.find(i => i.type === 'foreign2'); if (currentF1 && currentF2) { if (currentF1.subName === '고급영어' || currentF1.subName === '면제') { if (currentF2.subName !== '제2외국어') newItems = newItems.map(i => i.id === currentF2.id ? { ...i, subName: '제2외국어', name: '', credits: 3 } : i); } else if (currentF1.subName === '대학영어 2') { if ((currentF2.subName === '대학영어 1' || currentF2.subName === '대학영어 2') && !['고급영어', '제2외국어'].includes(currentF2.subName)) newItems = newItems.map(i => i.id === currentF2.id ? { ...i, subName: '' } : i); } } return { ...prev, [ck]: { ...prev[ck], items: newItems } }; }); }, [setData]);
    const handleBasicEnglishYearChange = useCallback((ck, id, yearType) => setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, takenYear: yearType, credits: yearType === 'before23' ? 1 : 2 } : i) } })), [setData]);
    const handleEnglish1420Change = useCallback((ck, id, timeVal) => { setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, takenTime1420: timeVal, credits: timeVal === 'after21' ? 3 : 2 } : i) } })); }, [setData]);

    const handleElectiveModalOpen = useCallback(() => {
        if (setShowElectiveModal) setShowElectiveModal(true);
    }, [setShowElectiveModal]);

    const deleteItem = useCallback((ck, id, data) => { 
        const item = data[ck].items.find(i => i.id === id); 
        const handleDelete = () => {
            setData(prev => {
                // [수정] 메인 리스트에서 삭제 시 플래너(졸업이수계획)에서도 해당 과목을 제거하도록 로직 추가
                const idsToRemove = [id];
                if (id === 'g_m2') idsToRemove.push('g_mp2');
                
                const y = config.studentYear > 2000 ? config.studentYear % 100 : config.studentYear;
                if (id === 'g_w1' && y >= 14 && y <= 18) idsToRemove.push('g_w2');

                // 플래너 클린업 헬퍼 함수
                const cleanPlanner = (plannerData) => {
                    if (!plannerData) return [];
                    return plannerData.map(sem => ({
                        ...sem,
                        courses: sem.courses.filter(c => !idsToRemove.includes(c.id))
                    }));
                };

                let newItems = prev[ck].items.filter(i => { if (id === 'g_m2' && i.id === 'g_mp2') return false; return i.id !== id; });

                if (id === 'g_w2' && y >= 19) {
                    const p12Idx = prev.physics.items.findIndex(i => i.id === 'p12');
                    const newPhysicsItems = [...prev.physics.items];
                    if (!newPhysicsItems.some(i => i.id === 'p_kwanon')) {
                        newPhysicsItems.splice(p12Idx + 1, 0, { id: 'p_kwanon', name: '과학 논리 및 논술', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: false, deleteMsg: "과학 논리 및 논술을 삭제하면 대학글쓰기 2를 수강해야 합니다.\n삭제하시겠습니까?" });
                    }
                    const filteredPhysics = newPhysicsItems.filter(i => i.id !== 'p_sel2');
                    const pSel1 = filteredPhysics.find(i => i.id === 'p_sel1');
                    if (pSel1) { pSel1.name = '[교과교육 선택]'; pSel1.limitedChoices = true; }
                    return { 
                        ...prev, 
                        [ck]: { ...prev[ck], items: newItems }, 
                        physics: { ...prev.physics, items: filteredPhysics },
                        planner: cleanPlanner(prev.planner) // 플래너 동기화
                    };
                }

                if (id === 'p_kwanon' && y >= 19) {
                    const w1Idx = prev.general.items.findIndex(i => i.id === 'g_w1');
                    const newGeneralItems = [...prev.general.items];
                    if (!newGeneralItems.some(i => i.id === 'g_w2')) {
                        newGeneralItems.splice(w1Idx + 1, 0, { id: 'g_w2', name: '대학 글쓰기 2 : 과학과 기술 글쓰기', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, deleteMsg: "과학논리 및 논술을 수강하였거나 수강하실 예정입니까?" });
                    }
                    const newPhysicsItems = prev.physics.items.filter(i => i.id !== 'p_kwanon'); 
                    let targetPhysicsItems = (ck === 'physics') ? newItems : newPhysicsItems;
                    if (!targetPhysicsItems.some(i => i.id === 'p_sel2')) {
                        const sel1Idx = targetPhysicsItems.findIndex(i => i.id === 'p_sel1');
                        if (sel1Idx !== -1) { targetPhysicsItems.splice(sel1Idx + 1, 0, { id: 'p_sel2', name: '[교과교육 선택 2]', completed: false, credits: 0, fixed: true, lockCredits: true, selectable: true, lockDelete: true }); }
                    }
                    const pSel1 = targetPhysicsItems.find(i => i.id === 'p_sel1');
                    if (pSel1) { pSel1.name = '[교과교육 선택 1]'; delete pSel1.limitedChoices; }
                    return { 
                        ...prev, 
                        general: { ...prev.general, items: newGeneralItems }, 
                        physics: { ...prev.physics, items: targetPhysicsItems },
                        planner: cleanPlanner(prev.planner) // 플래너 동기화
                    };
                }

                if (id === 'g_wb') {
                    const writingItems = [{ id: 'g_w1', name: '대학글쓰기 1', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true, deleteMsg: "제1영역에서 1개 교과목(3학점)을 수강해야 합니다." }, { id: 'g_w2', name: '대학 글쓰기 2 : 과학과 기술 글쓰기', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, deleteMsg: "대학글쓰기 2를 수강하지 않았나요?" }];
                    const targetIdx = newItems.findIndex(i => i.id === 'g_be') > -1 ? newItems.findIndex(i => i.id === 'g_be') : 0;
                    newItems.splice(targetIdx, 0, ...writingItems);
                }
                
                if (id === 'g_w1' && y >= 14 && y <= 18) { newItems = newItems.filter(i => i.id !== 'g_w2'); }

                // 기본 삭제 로직 (플래너 동기화 포함)
                return { 
                    ...prev, 
                    [ck]: { ...prev[ck], items: newItems },
                    planner: cleanPlanner(prev.planner) 
                };
            });
            setModal({ show: false, message: '', verificationWord: '' });
        };

        if (item.deleteMsg) { 
            setModal({ show: true, message: item.deleteMsg, verificationWord: null, level: 'warning', onConfirm: handleDelete, onCancel: () => setModal({ show: false, message: '', verificationWord: '' }) }); 
        } else {
            setModal({ show: true, message: `'${item.name || '항목'}'을(를) 정말로 삭제하시겠습니까?`, verificationWord: null, level: 'danger', onConfirm: handleDelete, onCancel: () => setModal({ show: false, message: '', verificationWord: '' }) });
        }
    }, [setData, setModal, config.studentYear]);

    const addNew = useCallback((ck, data) => { 
        const input = newInputs[ck]; 
        const trimmedName = input.name.trim();
        if (!trimmedName) return; 
        const normalize = (str) => str.replace(/\s/g, '');
        const targetName = normalize(trimmedName);
        for (const key of Object.keys(data)) {
            // [FIXED] planner 등 items가 없는 키는 건너뛰도록 수정 (에러 방지)
            if (!data[key].items) continue;
            
            const found = data[key].items.find(i => !i.hidden && normalize(i.name || '') === targetName);
            if (found) {
                const sectionTitle = key === 'indEng' ? `${config.secondMajorTitle || '제2전공'} (${config.majorPath === 'double' ? '복수전공' : '부전공'})` : data[key].title;
                setModal({ show: true, message: `'${trimmedName}'은(는) 이미 '${sectionTitle}' 영역에 존재합니다.`, onCancel: () => setModal({ show: false, message: '', verificationWord: '' }), level: 'warning' });
                return;
            }
        }
        setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: [...prev[ck].items, { id: `${ck}-${Date.now()}`, name: trimmedName, completed: false, credits: parseInt(input.credits) || 0 }] } })); 
        setNewInputs(p => ({ ...p, [ck]: { ...p[ck], name: '' } })); 
    }, [setData, setNewInputs, setModal, newInputs, config]);

    const handleSubjectSelect = useCallback((ck, id, selectedName) => { const option = PHYSICS_ED_CHOICES.find(o => o.name === selectedName); setData(prev => ({ ...prev, [ck]: { ...prev[ck], items: prev[ck].items.map(i => i.id === id ? { ...i, name: option.name, credits: option.credits } : i) } })); }, [setData]);

    return {
        toggleItem, toggleMultiCheck, updateCredits, updateName, toggleRecommended, toggleShared, toggleMandatory, handleMathChange, handleMSChange, handleCorePrefixChange, handleForeignChange, handleBasicEnglishYearChange, handleEnglish1420Change, deleteItem, addNew, handleSubjectSelect, handleElectiveModalOpen
    };
};