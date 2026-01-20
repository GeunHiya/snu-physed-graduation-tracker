window.StudyPlanner = React.memo(({ show, onClose, onBack, remainingCourses, config, plannerData, onUpdate, stats }) => {
    const { useState, useMemo, useEffect, useRef, useCallback } = React;

    // --- State ---
    const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
    const [editingId, setEditingId] = useState(null);
    
    // 입력 폼 State
    const [inputYear, setInputYear] = useState('');
    const [inputTerm, setInputTerm] = useState('1');
    const [inputCount, setInputCount] = useState('');

    // 선택 및 드래그
    const [selectedSemesterId, setSelectedSemesterId] = useState(null);
    const [draggedCourse, setDraggedCourse] = useState(null);
    const containerRef = useRef(null);

    // 모바일 탭 상태 ('semesters' | 'courses')
    const [mobileTab, setMobileTab] = useState('semesters');

    // 커스텀 알림창 State
    const [alertState, setAlertState] = useState({ 
        show: false, 
        message: '', 
        type: 'alert', // 'alert' | 'confirm'
        onConfirm: null 
    });

    // [수정됨] 학점 부족 여부 계산 로직 변경
    const hasShortage = useMemo(() => {
        if (!stats) return false;

        // 1. 수강 예정 목록(remainingCourses)에 있는 과목들의 학점 합계 계산
        const plannedCreditsMap = remainingCourses.reduce((acc, item) => {
            const k = item.catKey;
            acc[k] = (acc[k] || 0) + (Number(item.credits) || 0);
            return acc;
        }, {});

        // 2. 전체 총점 계산 (담은 학점 전체)
        const totalPlanned = remainingCourses.reduce((acc, item) => acc + (Number(item.credits) || 0), 0);

        const sections = ['general', 'physics', 'teaching', 'indEng', 'etcGrad'];
        const isSectionShortage = sections.some(key => {
            if (!stats[key]) return false;
            if (key === 'indEng' && config.majorPath === 'single') return false;
            
            // 기타 졸업 요건: 완료되지 않았는데 담아둔 목록에도 없으면 부족한 것으로 간주
            if (key === 'etcGrad') {
                if (!stats[key].isComplete) {
                     return !remainingCourses.some(i => i.catKey === 'etcGrad');
                }
                return false;
            }

            const earned = stats[key].earned; // 이미 이수한 학점
            const target = stats[key].target; // 목표 학점
            const planned = plannedCreditsMap[key] || 0; // 담아둔 학점
            
            // (이수 학점 + 담아둔 학점)이 목표보다 작을 때 부족하다고 판단
            return (earned + planned) < target;
        });

        // 3. 전체 130학점 기준 부족 여부 체크 추가
        const isTotalShortage = (stats.overall.earned + totalPlanned) < 130;

        return isSectionShortage || isTotalShortage;
    }, [stats, config.majorPath, remainingCourses]);

    // --- Helpers ---

    const compareSemesters = (a, b) => {
        const termOrder = { '1': 1, 'Summer': 2, '2': 3, 'Winter': 4 };
        if (a.year !== b.year) return a.year - b.year;
        return termOrder[a.term] - termOrder[b.term];
    };
    
    // ... (이하 코드는 기존과 동일하므로 생략하지 않고 전체 흐름 유지를 위해 포함)

    const sortedPlanner = useMemo(() => {
        const list = (plannerData || []).map(s => {
            if (!s.year || !s.term) {
                const y = parseInt(s.name.substring(0, 4)) || config.studentYear;
                let t = '1';
                if (s.name.includes('여름')) t = 'Summer';
                else if (s.name.includes('2학기')) t = '2';
                else if (s.name.includes('겨울')) t = 'Winter';
                return { ...s, year: y, term: t };
            }
            return s;
        });
        return list.sort(compareSemesters);
    }, [plannerData, config.studentYear]);

    const hasRegular = useMemo(() => sortedPlanner.some(s => s.type === 'regular'), [sortedPlanner]);
    const selectedSemester = useMemo(() => sortedPlanner.find(s => s.id === selectedSemesterId), [sortedPlanner, selectedSemesterId]);

    const showAlert = useCallback((message) => {
        setAlertState({ show: true, message, type: 'alert', onConfirm: null });
    }, []);

    const showConfirm = useCallback((message, onConfirmAction) => {
        setAlertState({ show: true, message, type: 'confirm', onConfirm: onConfirmAction });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertState(prev => ({ ...prev, show: false }));
    }, []);

    const handleAlertConfirm = useCallback(() => {
        if (alertState.onConfirm) alertState.onConfirm();
        closeAlert();
    }, [alertState, closeAlert]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!alertState.show) return;
            if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); alertState.type === 'confirm' ? handleAlertConfirm() : closeAlert(); }
            else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeAlert(); }
        };
        if (alertState.show) window.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, [alertState.show, handleAlertConfirm, closeAlert, alertState.type]);

    useEffect(() => {
        if (show && sortedPlanner.length === 0) setInputYear('');
        else if (show && sortedPlanner.length > 0) setInputYear(sortedPlanner[sortedPlanner.length - 1].year);
    }, [show, sortedPlanner.length]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (window.innerWidth < 768) return;
            if (containerRef.current && 
                !event.target.closest('.semester-box') && 
                !event.target.closest('.course-item') && 
                !event.target.closest('.control-btn') &&
                !event.target.closest('.phantom-area')) {
                setSelectedSemesterId(null);
            }
        };
        if (show) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [show]);

    const recalculateCounts = (currentList, targetSemId = null, targetCountVal = null) => {
        let list = [...currentList].sort(compareSemesters);
        const regulars = list.filter(s => s.type === 'regular');
        if (regulars.length === 0) return list;

        let anchorIndex = 0;
        let anchorCount = 1;

        if (targetSemId && targetCountVal) {
            const idx = regulars.findIndex(s => s.id === targetSemId);
            if (idx !== -1) { anchorIndex = idx; anchorCount = parseInt(targetCountVal); }
        } else {
             const match = regulars[0].subName.match(/(\d+)학기차/);
             if (match) anchorCount = parseInt(match[1]);
        }

        regulars.forEach((s, idx) => {
            const diff = idx - anchorIndex;
            const newCount = anchorCount + diff;
            s.subName = newCount > 0 ? `${newCount}학기차` : `1학기차`;
        });

        return list.map(s => {
            if (s.type !== 'regular') return s;
            const updated = regulars.find(r => r.id === s.id);
            return updated || s;
        });
    };

    const handleSaveSemester = () => {
        if (!inputYear) { showAlert("연도를 입력해주세요."); return; }
        const isSeasonal = (inputTerm === 'Summer' || inputTerm === 'Winter');
        const type = isSeasonal ? 'seasonal' : 'regular';
        
        if (type === 'regular' && modalMode === 'add' && !hasRegular && !inputCount) { showAlert("첫 정규 학기 등록 시에는 이수 학기 수를 입력해주세요."); return; }
        if (type === 'regular' && parseInt(inputCount) > 16) { showAlert("정규 학기는 최대 16학기까지만 등록할 수 있습니다."); return; }

        const termNameMap = { '1': '1학기', '2': '2학기', 'Summer': '여름학기', 'Winter': '겨울학기' };
        const newName = `${inputYear}년 ${termNameMap[inputTerm]}`;
        let newList = [...sortedPlanner];

        if (modalMode === 'add') {
            let subName = type === 'regular' ? `${inputCount || 1}학기차` : '';
            const newSem = { id: `sem_${Date.now()}`, year: parseInt(inputYear), term: inputTerm, name: newName, subName: subName, type: type, courses: [] };

            if (newList.some(s => s.year === newSem.year && s.term === newSem.term)) { showAlert("이미 존재하는 학기입니다."); return; }
            newList.push(newSem);
            
            if (type === 'regular') {
                if (!inputCount && hasRegular) newList = recalculateCounts(newList);
                else newList = recalculateCounts(newList, newSem.id, inputCount);
            } else { newList.sort(compareSemesters); }

        } else if (modalMode === 'edit') {
            const targetIndex = newList.findIndex(s => s.id === editingId);
            if (targetIndex === -1) return;
            const oldSem = newList[targetIndex];
            const updatedSem = { ...oldSem, year: parseInt(inputYear), term: inputTerm, name: newName, type: type };
            if (type === 'seasonal') updatedSem.subName = '';
            newList[targetIndex] = updatedSem;

            if (newList.some(s => s.id !== editingId && s.year === updatedSem.year && s.term === updatedSem.term)) { showAlert("이미 존재하는 학기입니다."); return; }

            if (type === 'regular') {
                const baseCount = inputCount ? inputCount : (oldSem.subName.match(/(\d+)/)?.[1] || 1);
                newList = recalculateCounts(newList, editingId, baseCount);
            } else { newList = recalculateCounts(newList); }
        }

        const maxRegularCount = newList.filter(s => s.type === 'regular').reduce((max, s) => {
            const count = parseInt(s.subName.match(/(\d+)/)?.[1] || 0);
            return count > max ? count : max;
        }, 0);

        if (maxRegularCount > 16) { showAlert("수정된 학기 배치로 인해 16학기를 초과하는 학기가 발생했습니다."); return; }

        onUpdate(newList);
        setModalMode(null);
    };

    const addSpecificSemester = (year, term, type) => {
        if (sortedPlanner.some(s => s.year === year && s.term === term)) { showAlert("이미 존재하는 학기입니다."); return; }
        if (type === 'regular') {
            const regulars = sortedPlanner.filter(s => s.type === 'regular');
            let nextCount = 1;
            if (regulars.length > 0) nextCount = parseInt(regulars[regulars.length - 1].subName.match(/(\d+)/)[1]) + 1;
            if (nextCount > 16) { showAlert("정규 학기는 최대 16학기까지만 생성할 수 있습니다."); return; }
        }
        const termNameMap = { '1': '1학기', '2': '2학기', 'Summer': '여름학기', 'Winter': '겨울학기' };
        const newSem = { id: `sem_${Date.now()}`, year: year, term: term, name: `${year}년 ${termNameMap[term]}`, subName: type === 'regular' ? '1학기차' : '', type: type, courses: [] };
        let newList = [...sortedPlanner, newSem];
        newList = recalculateCounts(newList); 
        onUpdate(newList);
    };

    const handleQuickAddNext = () => {
        if (sortedPlanner.length === 0) { openAddModal(); return; }
        const lastSem = sortedPlanner[sortedPlanner.length - 1];
        let nextYear = lastSem.year;
        let nextTerm = '1';
        if (lastSem.term === '1' || lastSem.term === 'Summer') nextTerm = '2';
        else { nextYear += 1; nextTerm = '1'; }
        addSpecificSemester(nextYear, nextTerm, 'regular');
    };

    const handleQuickAddSeasonal = (e) => {
        if(e) e.stopPropagation();
        if (sortedPlanner.length === 0) { openAddModal(); return; }
        const lastSem = sortedPlanner[sortedPlanner.length - 1];
        let nextYear = lastSem.year;
        let nextTerm = 'Summer';
        if (lastSem.term === '1' || lastSem.term === 'Summer') nextTerm = 'Summer'; else nextTerm = 'Winter';
        if (lastSem.term === 'Winter' && nextTerm === 'Summer') nextYear += 1;
        else if (lastSem.term === '2' && nextTerm === 'Summer') nextYear += 1; 
        
        if (lastSem.term === '2') { nextTerm = 'Winter'; nextYear = lastSem.year; }
        else if (lastSem.term === 'Winter') { nextTerm = 'Summer'; nextYear = lastSem.year + 1; }
        else { nextTerm = 'Summer'; nextYear = lastSem.year; }
        addSpecificSemester(nextYear, nextTerm, 'seasonal');
    };

    const removeSemester = (semId) => {
        showConfirm("이 학기를 삭제하시겠습니까?", () => {
            let newList = sortedPlanner.filter(s => s.id !== semId);
            newList = recalculateCounts(newList);
            onUpdate(newList);
            if (selectedSemesterId === semId) setSelectedSemesterId(null);
        });
    };

    const openAddModal = () => {
        setModalMode('add'); setEditingId(null);
        setInputYear(sortedPlanner.length > 0 ? sortedPlanner[sortedPlanner.length-1].year : '');
        setInputTerm('1'); setInputCount('');
    };

    const openEditModal = (e, sem) => {
        e.stopPropagation(); setModalMode('edit'); setEditingId(sem.id);
        setInputYear(sem.year); setInputTerm(sem.term);
        if (sem.type === 'regular') {
            const match = sem.subName.match(/(\d+)/);
            setInputCount(match ? match[1] : '');
        } else { setInputCount(''); }
    };

    const plannedCourseIds = useMemo(() => new Set(sortedPlanner.flatMap(s => s.courses.map(c => c.id))), [sortedPlanner]);
    const availableCourses = useMemo(() => remainingCourses.filter(c => !plannedCourseIds.has(c.id) && c.catKey !== 'etcGrad'), [remainingCourses, plannedCourseIds]);
    
    const groupedCourses = useMemo(() => {
        const groups = {
            general: { title: '교양', items: [], color: 'bg-slate-700 text-slate-200 border-slate-600', badge: 'bg-slate-900 text-slate-300' },
            physics: { title: '물리교육', items: [], color: 'bg-indigo-900/60 text-indigo-100 border-indigo-700/50', badge: 'bg-indigo-800 text-indigo-200' },
            double: { title: config.secondMajorTitle || '제2전공', items: [], color: 'bg-amber-900/60 text-amber-100 border-amber-700/50', badge: 'bg-amber-800 text-amber-200' },
            teaching: { title: '교직', items: [], color: 'bg-emerald-900/60 text-emerald-100 border-emerald-700/50', badge: 'bg-emerald-800 text-emerald-200' },
            others: { title: '일반선택', items: [], color: 'bg-rose-900/60 text-rose-100 border-rose-700/50', badge: 'bg-rose-800 text-rose-200' }
        };
        availableCourses.forEach(c => {
            if (c.catKey === 'general') groups.general.items.push(c);
            else if (c.catKey === 'physics') groups.physics.items.push(c);
            else if (c.catKey === 'indEng' || c.catKey === 'shared') groups.double.items.push(c);
            else if (c.catKey === 'teaching') groups.teaching.items.push(c);
            else if (c.catKey === 'elective') groups.others.items.push(c);
        });
        return groups;
    }, [availableCourses, config]);

    const addCourseToSemester = (course, semId) => {
        const semester = sortedPlanner.find(s => s.id === semId);
        if (!semester) return;
        const currentCredits = semester.courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
        const courseCredits = Number(course.credits) || 0;
        const maxCredits = semester.type === 'seasonal' ? 9 : 21;
        if (currentCredits + courseCredits > maxCredits) {
            showAlert(`[학점 초과] 최대 ${maxCredits}학점까지만 신청 가능합니다.`);
            return;
        }
        const updated = sortedPlanner.map(s => s.id === semId ? { ...s, courses: [...s.courses, course] } : s);
        onUpdate(updated);
    };

    const removeCourseFromSemester = (courseId, semId) => {
        const updated = sortedPlanner.map(s => s.id === semId ? { ...s, courses: s.courses.filter(c => c.id !== courseId) } : s);
        onUpdate(updated);
    };

    const handleDragStart = (e, course) => { setDraggedCourse(course); e.dataTransfer.effectAllowed = "copy"; };
    const handleDrop = (e, semId) => { e.preventDefault(); if (draggedCourse) { addCourseToSemester(draggedCourse, semId); setDraggedCourse(null); } };
    
    const handleCourseClick = (course) => {
        if (selectedSemesterId) {
            addCourseToSemester(course, selectedSemesterId);
        } else {
            if (window.innerWidth < 768) {
                showAlert("먼저 '학기 편집' 탭에서\n과목을 추가할 학기를 선택해주세요.");
                setMobileTab('semesters');
            } else {
                showAlert("먼저 왼쪽에서 학기를 클릭해 선택해주세요.\n선택된 학기는 테두리가 강조됩니다.");
            }
        }
    };

    const handleSemesterSelect = (semId) => {
        setSelectedSemesterId(semId);
        if (window.innerWidth < 768) {
            setMobileTab('courses');
        }
    };

    const CourseBox = ({ course, colorClass, badgeClass, onDelete, isDragging }) => (
        <div 
            draggable={!onDelete} 
            onDragStart={(e) => !onDelete && handleDragStart(e, course)} 
            onClick={(e) => { e.stopPropagation(); !onDelete && handleCourseClick(course); }} 
            className={`course-item p-3 rounded-xl border mb-2 flex justify-between items-start shadow-sm transition-all select-none ${colorClass} ${!onDelete ? 'cursor-grab hover:brightness-110 active:cursor-grabbing' : ''} ${isDragging ? 'opacity-50 scale-95 border-dashed ring-2 ring-indigo-400/50' : ''}`}
        >
            <div className="flex-1 pr-2">
                <div className="flex items-center gap-2 mb-1"><span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-tighter ${badgeClass}`}>{course.catTitle}</span>{Number(course.credits) > 0 && <span className="text-[9px] opacity-70 font-bold">{course.credits}pt</span>}</div>
                <div className="text-sm font-bold break-keep leading-snug">{course.displayName || course.name}</div>
            </div>
            {onDelete && (<button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-white/40 hover:text-red-400 transition-colors p-2 -mr-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>)}
        </div>
    );

    const getNextSemInfo = (baseSem) => {
        if (!baseSem) return null;
        let nextYear = baseSem.year;
        let nextTerm = '1';
        let seasonalTerm = 'Summer';
        let seasonalYear = baseSem.year;

        if (baseSem.term === '1' || baseSem.term === 'Summer') nextTerm = '2';
        else { nextYear += 1; nextTerm = '1'; }

        if (baseSem.term === '1') { seasonalTerm = 'Summer'; }
        else if (baseSem.term === 'Summer') { seasonalTerm = '2'; } 
        else if (baseSem.term === '2') { seasonalTerm = 'Winter'; }
        else { seasonalYear += 1; seasonalTerm = 'Summer'; }

        if (baseSem.term === '1' || baseSem.term === 'Summer') { seasonalTerm = 'Summer'; seasonalYear = baseSem.year; }
        else { seasonalTerm = 'Winter'; seasonalYear = baseSem.year; }

        return {
            reg: { year: nextYear, term: nextTerm, name: `${nextYear}년 ${nextTerm === '1' ? '1학기' : '2학기'}` },
            sea: { year: seasonalYear, term: seasonalTerm, name: `${seasonalYear}년 ${seasonalTerm === 'Summer' ? '여름' : '겨울'}학기` }
        };
    };

    const InterSemesterPhantom = ({ prevSem }) => {
        const nextInfo = getNextSemInfo(prevSem);
        if (!nextInfo) return null;

        const regExists = sortedPlanner.some(s => s.year === nextInfo.reg.year && s.term === nextInfo.reg.term);
        const seaExists = sortedPlanner.some(s => s.year === nextInfo.sea.year && s.term === nextInfo.sea.term);
        
        if (regExists && seaExists) return <div className="h-4"></div>;

        return (
            <div className="phantom-area group h-12 md:h-8 -my-2 flex items-center justify-center gap-2 opacity-100 md:opacity-0 md:hover:opacity-100 transition-all duration-200 z-10 relative hover:z-20 hover:my-1 mb-2 md:mb-0">
                <div className="absolute inset-x-0 h-px bg-indigo-500/30 border-t border-dashed border-indigo-500/50 hidden md:block"></div>
                {!regExists && (
                    <button 
                        onClick={() => addSpecificSemester(nextInfo.reg.year, nextInfo.reg.term, 'regular')}
                        className="relative z-10 px-4 py-2 md:px-3 md:py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1 transform active:scale-95 md:hover:scale-110 transition-all"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        {nextInfo.reg.name} 추가
                    </button>
                )}
                {!seaExists && (
                    <button 
                        onClick={() => addSpecificSemester(nextInfo.sea.year, nextInfo.sea.term, 'seasonal')}
                        className="relative z-10 px-4 py-2 md:px-3 md:py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs md:text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1 transform active:scale-95 md:hover:scale-110 transition-all"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        {nextInfo.sea.name} (계절)
                    </button>
                )}
            </div>
        );
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[150] bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 animation-fade-in">
            {alertState.show && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 max-w-sm w-full shadow-2xl animation-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${alertState.type === 'confirm' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-red-900/30 text-red-400'}`}>
                                {alertState.type === 'confirm' ? 
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> : 
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                }
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{alertState.type === 'confirm' ? '확인' : '알림'}</h3>
                            <p className="text-slate-300 text-sm mb-6 whitespace-pre-wrap">{alertState.message}</p>
                            <div className="flex gap-3 w-full">
                                {alertState.type === 'confirm' && (
                                    <button onClick={closeAlert} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-bold transition-colors">취소</button>
                                )}
                                <button onClick={alertState.type === 'confirm' ? handleAlertConfirm : closeAlert} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors">
                                    {alertState.type === 'confirm' ? '확인' : '닫기'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-800 w-full h-full md:h-[95%] md:max-w-[98%] rounded-none md:rounded-[2.5rem] shadow-2xl border-0 md:border border-slate-700 flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center bg-slate-800 shrink-0 gap-3 md:gap-0 safe-top-padding">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                            <span className="text-indigo-500"><Icons.Book /></span> 졸업 이수 계획
                        </h2>
                        <div className="flex md:hidden gap-2">
                            <button onClick={onBack} className="bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold">이전</button>
                            <button onClick={onClose} className="bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold">닫기</button>
                        </div>
                    </div>
                    
                    <div className="flex md:hidden w-full bg-slate-900/50 p-1 rounded-xl">
                        <button 
                            onClick={() => setMobileTab('semesters')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mobileTab === 'semesters' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
                        >
                            📅 학기 편집
                        </button>
                        <button 
                            onClick={() => setMobileTab('courses')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mobileTab === 'courses' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
                        >
                            📚 과목 담기
                        </button>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-xs text-slate-400 font-bold bg-slate-700 px-3 py-1 rounded-full">
                            <span className="text-indigo-400">①</span> 왼쪽 학기 클릭 → <span className="text-indigo-400">②</span> 오른쪽 과목 클릭하여 추가
                        </span>
                        <div className="flex gap-2">
                            <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">이전</button>
                            <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">닫기</button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                    <div 
                        className={`flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900/50 custom-scrollbar border-r border-slate-700 relative ${mobileTab === 'semesters' ? 'block' : 'hidden'} md:block`} 
                        ref={containerRef}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-200">나의 학기 계획</h3>
                            <button onClick={openAddModal} className="control-btn flex items-center gap-1.5 text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg> 
                                학기 직접 추가
                            </button>
                        </div>

                        {modalMode && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 md:absolute md:inset-auto md:bg-transparent md:block md:static md:p-0 mb-6" onClick={() => setModalMode(null)}>
                                <div className="bg-slate-800 p-6 rounded-2xl border border-indigo-500/50 shadow-xl w-full max-w-sm md:max-w-none" onClick={e => e.stopPropagation()}>
                                    <h4 className="text-sm font-black text-indigo-400 mb-4">{modalMode === 'add' ? '새 학기 추가' : '학기 정보 수정'}</h4>
                                    <div className="flex flex-col gap-4 mb-4">
                                        <div className="flex gap-3">
                                            <div className="flex-1 flex flex-col gap-1.5">
                                                <label className="text-[10px] text-slate-400 font-bold">연도</label>
                                                <input type="number" placeholder="예: 2026" value={inputYear} onChange={e => setInputYear(e.target.value)} className="bg-slate-700 text-white px-4 py-3 rounded-xl text-sm font-bold w-full outline-none focus:ring-2 focus:ring-indigo-500" />
                                            </div>
                                            <div className="flex-1 flex flex-col gap-1.5">
                                                <label className="text-[10px] text-slate-400 font-bold">학기</label>
                                                <select value={inputTerm} onChange={e => setInputTerm(e.target.value)} className="bg-slate-700 text-white px-4 py-3 rounded-xl text-sm font-bold w-full outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                                                    <option value="1">1학기</option>
                                                    <option value="Summer">여름학기</option>
                                                    <option value="2">2학기</option>
                                                    <option value="Winter">겨울학기</option>
                                                </select>
                                            </div>
                                        </div>
                                        {(!['Summer', 'Winter'].includes(inputTerm)) && ((!hasRegular && modalMode === 'add') || modalMode === 'edit') && (
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] text-slate-400 font-bold">이수 학기 수</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="number" value={inputCount} onChange={e => setInputCount(e.target.value)} placeholder="예: 1" className="bg-slate-700 text-white px-4 py-3 rounded-xl text-sm font-bold flex-1 outline-none focus:ring-2 focus:ring-indigo-500" />
                                                    <span className="text-sm text-slate-500 font-bold shrink-0">학기차</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {modalMode === 'edit' && !['Summer', 'Winter'].includes(inputTerm) && (
                                        <p className="text-[10px] text-orange-400/80 mb-4 font-bold">* 학기 차수를 수정하면 이후 정규 학기들의 차수도 자동으로 변경됩니다.</p>
                                    )}
                                    <div className="flex gap-3">
                                        <button onClick={() => setModalMode(null)} className="flex-1 py-3 bg-slate-700 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-600 transition-colors">취소</button>
                                        <button onClick={handleSaveSemester} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 shadow-lg transition-colors">{modalMode === 'add' ? '추가' : '수정'}</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex flex-col gap-0 pb-32 md:pb-20"> 
                            {sortedPlanner.length === 0 && !modalMode && (
                                <div className="text-center py-20 border-2 border-dashed border-slate-700 rounded-3xl opacity-50 my-6">
                                    <div className="text-4xl mb-4">📅</div>
                                    <p className="text-slate-400 font-bold text-lg mb-2">등록된 학기가 없습니다.</p>
                                    <button onClick={openAddModal} className="text-indigo-400 font-bold hover:underline">직접 추가하기</button>
                                </div>
                            )}

                            {sortedPlanner.map((sem, idx) => {
                                const isSelected = selectedSemesterId === sem.id;
                                const totalCredits = sem.courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
                                const maxCredits = sem.type === 'seasonal' ? 9 : 21;
                                const isOverflow = totalCredits > maxCredits;

                                return (
                                    <React.Fragment key={sem.id}>
                                        <div 
                                            onClick={(e) => { e.stopPropagation(); handleSemesterSelect(sem.id); }}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDrop(e, sem.id)}
                                            className={`semester-box rounded-2xl border-2 transition-all p-4 min-h-[140px] md:min-h-[160px] flex flex-col relative group my-2 md:my-3 ${isSelected ? 'bg-indigo-900/20 border-indigo-500 ring-2 md:ring-4 ring-indigo-500/20 shadow-xl z-10' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <div className="text-white font-black text-lg flex items-center gap-2">
                                                        {sem.name}
                                                        {sem.type === 'seasonal' ? (
                                                            <span className="text-[9px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded border border-orange-500/30 shrink-0">계절</span>
                                                        ) : (
                                                            <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/30 shrink-0">정규</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-bold mt-0.5 flex items-center">
                                                        {sem.subName}
                                                        <button onClick={(e) => openEditModal(e, sem)} className="ml-2 text-slate-600 hover:text-indigo-400 transition-colors p-1 control-btn">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-lg transition-colors ${isOverflow ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300'}`}>
                                                        {totalCredits} / {maxCredits}
                                                    </span>
                                                    <button onClick={(e) => {e.stopPropagation(); removeSemester(sem.id);}} className="control-btn text-slate-600 hover:text-red-500 transition-colors p-2 md:p-1">
                                                        <Icons.Trash />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className={`flex-1 rounded-xl p-2 transition-colors ${sem.courses.length === 0 ? 'bg-slate-900/30 border-2 border-dashed border-slate-700/50 flex items-center justify-center' : 'space-y-2'}`}>
                                                {sem.courses.length === 0 ? (
                                                    <div className="text-center pointer-events-none">
                                                        <p className="text-slate-600 text-xs font-bold mb-1">과목이 없습니다</p>
                                                        {isSelected && <p className="text-indigo-400 text-[10px] animate-pulse hidden md:block">오른쪽에서 과목을 클릭하세요!</p>}
                                                        {isSelected && <p className="text-indigo-400 text-[10px] animate-pulse md:hidden">'과목 담기' 탭에서 추가하세요!</p>}
                                                    </div>
                                                ) : (
                                                    sem.courses.map((course, idx) => {
                                                        let style = { color: 'bg-slate-700', badge: 'bg-slate-600' };
                                                        if (course.catKey === 'general') style = { color: 'bg-slate-700 text-slate-200', badge: 'bg-slate-900' };
                                                        else if (course.catKey === 'physics') style = { color: 'bg-indigo-900/80 text-indigo-100', badge: 'bg-indigo-800' };
                                                        else if (course.catKey === 'indEng' || course.catKey === 'shared') style = { color: 'bg-amber-900/80 text-amber-100', badge: 'bg-amber-800' };
                                                        else if (course.catKey === 'teaching') style = { color: 'bg-emerald-900/80 text-emerald-100', badge: 'bg-emerald-800' };
                                                        else style = { color: 'bg-rose-900/80 text-rose-100', badge: 'bg-rose-800' };

                                                        const isDragging = draggedCourse && draggedCourse.id === course.id;

                                                        return <CourseBox key={`${course.id}_${idx}`} course={course} colorClass={style.color} badgeClass={style.badge} onDelete={() => removeCourseFromSemester(course.id, sem.id)} isDragging={isDragging} />;
                                                    })
                                                )}
                                            </div>
                                        </div>

                                        {idx !== sortedPlanner.length - 1 && <InterSemesterPhantom prevSem={sem} />}
                                    </React.Fragment>
                                );
                            })}
                            
                            {sortedPlanner.length > 0 && getNextSemInfo(sortedPlanner[sortedPlanner.length-1]) && (
                                <div className="group opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity duration-300 mt-6 md:mt-4 mb-20 md:mb-0">
                                    <div 
                                        onClick={handleQuickAddNext}
                                        className="h-20 md:h-24 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-900/10 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95"
                                    >
                                        <div className="flex items-center gap-2 text-indigo-400 font-bold animate-pulse text-sm md:text-base">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                            {getNextSemInfo(sortedPlanner[sortedPlanner.length-1]).reg.name} 추가 (정규)
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end mt-3 px-2">
                                        <button 
                                            onClick={handleQuickAddSeasonal}
                                            className="text-xs text-slate-500 hover:text-slate-300 font-bold flex items-center gap-1 transition-colors p-2"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                                            {getNextSemInfo(sortedPlanner[sortedPlanner.length-1]).sea.name} 간편 추가 (계절)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div 
                        className={`w-full md:w-80 lg:w-96 bg-slate-800 flex flex-col border-l-0 md:border-l border-slate-700 shadow-2xl shrink-0 ${mobileTab === 'courses' ? 'block flex-1' : 'hidden'} md:block`} 
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="md:hidden bg-indigo-900/30 px-4 py-2 border-b border-indigo-500/20 text-center">
                            <span className="text-[10px] text-indigo-300 font-bold block mb-0.5">현재 선택된 학기</span>
                            {selectedSemester ? (
                                <span className="text-white font-black text-sm">{selectedSemester.name} ({selectedSemester.type === 'regular' ? selectedSemester.subName : '계절'})</span>
                            ) : (
                                <span className="text-slate-400 font-bold text-sm">선택된 학기 없음</span>
                            )}
                        </div>

                        <div className="p-4 border-b border-slate-700 bg-slate-800">
                            <h3 className="text-lg font-black text-slate-200 mb-1">남은 과목 목록</h3>
                            <p className="text-xs text-slate-500">
                                <span className="md:hidden">목록에서 과목을 터치하면 선택된 학기에 추가됩니다.</span>
                                <span className="hidden md:inline">왼쪽에서 학기를 먼저 선택하고 목록에서 과목을 클릭하세요.</span>
                            </p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6 pb-24 md:pb-4">
                            {Object.entries(groupedCourses).map(([key, group]) => {
                                if (group.items.length === 0) return null;
                                return (
                                    <div key={key}>
                                        <div className="flex items-center gap-2 mb-3 px-1">
                                            <div className={`w-2 h-2 rounded-full ${group.color.split(' ')[0].replace('/60','').replace('bg-','bg-')}`}></div>
                                            <span className="text-sm font-black text-slate-300">{group.title}</span>
                                            <span className="text-xs text-slate-600 font-bold ml-auto">{group.items.length}개</span>
                                        </div>
                                        <div className="space-y-2">
                                            {group.items.map(course => <CourseBox key={course.id} course={course} colorClass={group.color} badgeClass={group.badge} />)}
                                        </div>
                                        <div className="h-px bg-slate-700/50 mt-6 mx-2"></div>
                                    </div>
                                );
                            })}
                            
                            {/* Case 1: 계획할 과목이 없음 (모두 배치됨) */}
                            {availableCourses.length === 0 && (
                                <div className="text-center py-10 text-slate-500 font-bold">
                                    {hasShortage ? (
                                        <div className="flex flex-col items-center animate-pulse">
                                            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            </div>
                                            <h4 className="text-lg font-black text-amber-500 mb-2">계획할 과목이 없습니다</h4>
                                            <p className="text-xs text-amber-400/80 font-bold leading-relaxed">
                                                하지만 학점이 아직 부족합니다.<br/>
                                                메인 화면에서 과목을 더 추가해주세요.
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <Icons.Check className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                            모든 과목을 계획했습니다!
                                        </div>
                                    )}
                                </div>
                            )}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});