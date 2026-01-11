// --- 데이터 상수 ---
window.AVAILABLE_YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

window.PHYSICS_ED_CHOICES = [{ name: '과학 논리 및 논술', credits: 2 }, { name: '물리교재 연구 및 지도법', credits: 3 }, { name: '물리교수법', credits: 3 }];
window.FOREIGN1_OPTIONS = ["대학영어 1", "대학영어 2", "고급영어", "면제"];
window.MATH1_PAIRS = [{ main: "수학 1", practice: "수학연습 1" }, { main: "고급수학 1", practice: "고급수학연습 1" }];
window.MATH2_PAIRS = [{ main: "수학 2", practice: "수학연습 2" }, { main: "고급수학 2", practice: "고급수학연습 2" }];
window.MS_OPTIONS = [
    { main: "수학 2", practice: "수학연습 2", mainCr: 2, pracCr: 1 },
    { main: "물리학 1", practice: "물리학실험 1", mainCr: 3, pracCr: 1 },
    { main: "화학 1", practice: "화학실험 1", mainCr: 3, pracCr: 1 },
    { main: "생물학 1", practice: "생물학실험 1", mainCr: 3, pracCr: 1 },
    { main: "지구과학", practice: "지구과학실험", mainCr: 3, pracCr: 1 },
    { main: "컴퓨터의 개념 및 실습", practice: null, mainCr: 3, pracCr: 0 }
];
window.COMPUTER_OPTIONS = ["컴퓨팅 기초", "컴퓨팅 핵심", "컴퓨팅 응용", "컴퓨터의 개념 및 실습"];
window.VERITAS_OPTIONS = ["베리타스 강좌1", "베리타스 강좌2", "베리타스 실천"];
window.KEYS_OPTIONS = ["문화 해석과 상상", "역사적 탐구와 철학적 사유", "인간의 이해와 사회 분석", "과학적 사고와 응용"];

window.DEFAULT_CONFIG = { userName: "", studentYear: 22, majorPath: "single", secondMajorTitle: "" };
window.BASE_DATA = {
    general: { title: "교양", target: 41, items: [] },
    teaching: { title: "교직", target: 22, dragDisabled: true, items: [] },
    physics: { title: "물리교육 (주전공)", target: 60, items: [
        { id: 'p1', name: '일반물리학 및 실험2', completed: false, credits: 4, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p2', name: '역학 및 교육 1', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p3', name: '전자기 및 교육 1', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p4', name: '전산물리 및 교육', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p5', name: '현대물리 및 교육', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p6', name: '양자물리 및 교육1', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p7', name: '파동 및 광학 교육', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p8', name: '열통계물리 및 교육', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p9', name: '물리실험 및 시범1', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p10', name: '물리실험 및 시범2', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p11', name: '물리교육실험', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p12', name: '물리교육론', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'p_sel1', name: '[교과교육 선택 1]', completed: false, credits: 0, fixed: true, lockCredits: true, selectable: true, lockDelete: true },
        { id: 'p_sel2', name: '[교과교육 선택 2]', completed: false, credits: 0, fixed: true, lockCredits: true, selectable: true, lockDelete: true }
    ]},
    indEng: { title: "제2전공", target: 0, items: [] },
    shared: { title: "중복 인정 과목", target: 0, items: [] },
    etcGrad: { title: "기타 졸업 요건", target: 0, dragDisabled: true, items: [
        { id: 'ex1', name: '성인지 교육 (4회)', multi: true, checks: [false, false, false, false], credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex2', name: '심폐소생술 교육 (2회)', multi: true, checks: [false, false], credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex3', name: '교직인적성 검사 (2회)', multi: true, checks: [false, false], credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex5', name: "무시험 검정 (졸업학기)", completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex4', name: "중독 검사 (졸업학기)", completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex6', name: "졸업 논문", completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex7', name: "전체 평점 기준 요건", completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true }
    ]},
    elective: { title: "일반 선택", target: 0, items: [] }
};

// --- 헬퍼 함수들 ---
window.getGeneralDataByYear = (year) => {
    const basicEnglishCredits = year >= 24 ? 2 : 1;
    const basicEnglishFixed = year >= 24;
    const tepsDeleteMsg = year >= 24 ? "TEPS 268점 이상인가요?" : "TEPS 298점 이상인가요?";

    const common = [
        { id: 'g_w1', name: '대학글쓰기 1', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'g_w2', name: '대학 글쓰기 2 : 과학과 기술 글쓰기', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, deleteMsg: "과학논리 및 논술을 이수하였나요?" },
        { 
            id: 'g_be', 
            name: '기초 영어', 
            completed: false, 
            credits: basicEnglishCredits, 
            fixed: true, 
            fixedName: true, 
            deleteMsg: tepsDeleteMsg, 
            takenYear: year >= 24 ? 'after24' : 'before23', 
            isFixedCredits: basicEnglishFixed,
            lockCredits: true
        },
        { id: 'g_f1', name: '', type: 'foreign1', subName: '대학영어 1', completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'g_f2', name: '', type: 'foreign2', subName: '', completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'g_m1', name: '수학 1', type: 'mathSet', subName: '수학 1', completed: false, credits: 2, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'g_mp1', name: '수학연습 1', completed: false, credits: 1, fixed: true, lockCredits: true, lockDelete: true },
    ];
    const math2 = [{ id: 'g_m2', name: '수학 2', type: 'mathSet', subName: '수학 2', completed: false, credits: 2, fixed: true, lockCredits: true, deleteMsg: "수학 2/고급수학 2를 수강하지 않았나요?" }, { id: 'g_mp2', name: '수학연습 2', completed: false, credits: 1, fixed: true, lockCredits: true, lockDelete: true }];
    const science_21_22 = [{ id: 'g_ms1', name: '과학적 사고와 실험 1', type: 'msSet', subName: '[과목 선택]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true }, { id: 'g_msp1', name: '[실험/연습]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true, parentId: 'g_ms1' }, { id: 'g_ms2', name: '과학적 사고와 실험 2', type: 'msSet', subName: '[과목 선택]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true }, { id: 'g_msp2', name: '[실험/연습]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true, parentId: 'g_ms2' }, { id: 'g_ms3', name: '과학적 사고와 실험 3', type: 'msSet', subName: '[과목 선택]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true }, { id: 'g_msp3', name: '[실험/연습]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true, parentId: 'g_ms3' }, { id: 'g_ms4', name: '과학적 사고와 실험 4', type: 'msSet', subName: '[과목 선택]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true }, { id: 'g_msp4', name: '[실험/연습]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true, parentId: 'g_ms4' }];
    const science_23_24 = [{ id: 'g_ms1', name: '과학적 사고와 실험 1', type: 'msSet', subName: '[과목 선택]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true }, { id: 'g_msp1', name: '[실험]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true, parentId: 'g_ms1' }, { id: 'g_ms2', name: '과학적 사고와 실험 2', type: 'msSet', subName: '[과목 선택]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true }, { id: 'g_msp2', name: '[실험]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true, parentId: 'g_ms2' }, { id: 'g_ms3', name: '과학적 사고와 실험 3', type: 'msSet', subName: '[과목 선택]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true }, { id: 'g_msp3', name: '[실험]', completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true, parentId: 'g_ms3' }];
    const science_25_26 = [{ id: 'g_ph1', name: '물리학 1', type: 'physics1Select', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }, { id: 'g_ph1_lab', name: '물리학실험 1', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }, { id: 'g_ch', name: '화학', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }, { id: 'g_ch_lab', name: '화학실험', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }, { id: 'g_bio', name: '생물학', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }, { id: 'g_bio_lab', name: '생물학실험', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }, { id: 'g_es', name: '지구과학', completed: false, credits: 3, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }, { id: 'g_es_lab', name: '지구과학실험', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }];
    const computer_23_24 = [{ id: 'g_comp', name: '선택', type: 'computer', prefix: '컴퓨터', options: COMPUTER_OPTIONS, completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true }];
    const keys_25_later = [{ id: 'g_key1', name: '', type: 'keys', prefix: '지성의 열쇠 1', completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true }, { id: 'g_key2', name: '', type: 'keys', prefix: '지성의 열쇠 2', completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true }, { id: 'g_key3', name: '', type: 'keys', prefix: '지성의 열쇠 3', completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true }];
    const veritas_25_later = [{ id: 'g_veritas', name: '', type: 'veritas', prefix: '베리타스', options: VERITAS_OPTIONS, completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true }];
    
    // [수정됨] 역사와 철학(g_c2)을 'coreFixed' -> 'core'로 변경하고 options 추가
    const core = [
        { id: 'g_c1', name: '', type: 'core', prefix: '언어와 문학', options: ["언어와 문학", "문화와 예술"], completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true, recommendedSupport: true, isRecommended: false },
        // ▼ 여기를 수정했습니다 (기존: coreFixed -> 변경: core, options 추가)
        { id: 'g_c2', name: '', type: 'core', prefix: '역사와 철학', options: ["역사와 철학"], completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true, recommendedSupport: true, isRecommended: false },
        { id: 'g_c3', name: '', type: 'core', prefix: '정치와 경제', options: ["정치와 경제", "인간과 사회"], completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'g_c4', name: '', type: 'core', prefix: '자연과 기술', options: ["자연과 기술", "생명과 환경"], completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true }
    ];
    
    const pe_common = [{ id: 'g_pe1', name: '', type: 'pe', prefix: '체육 1', completed: false, credits: 1, fixed: true, lockCredits: true, lockDelete: true }, { id: 'g_pe2', name: '', type: 'pe', prefix: '체육 2', completed: false, credits: 1, fixed: true, lockCredits: true, lockDelete: true }];
    const pe_25_later = [{ id: 'g_pe', name: '', type: 'pe', prefix: '체육', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }];

    if (year === 21 || year === 22) return [...common, ...science_21_22, ...core, ...pe_common];
    if (year === 23 || year === 24) return [...common, ...math2, ...science_23_24, ...computer_23_24, ...core, ...pe_common];
    if (year >= 25) return [...common, ...math2, ...science_25_26, ...keys_25_later, ...veritas_25_later, ...pe_25_later];
    return [];
};

window.getTeachingDataByYear = (year) => {
    const basicItems = [
        { id: 't1', name: '교육학개론', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'ts1', name: '', placeholder: '입력...', completed: false, credits: 2, lockCredits: true, lockDelete: true },
        { id: 'ts2', name: '', placeholder: '입력...', completed: false, credits: 2, lockCredits: true, lockDelete: true },
        { id: 'ts3', name: '', placeholder: '입력...', completed: false, credits: 2, lockCredits: true, lockDelete: true },
        { id: 'ts4', name: '', placeholder: '입력...', completed: false, credits: 2, lockCredits: true, lockDelete: true },
        { id: 'ts5', name: '', placeholder: '입력...', completed: false, credits: 2, lockCredits: true, lockDelete: true },
        { id: 't6', name: '교직실무', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 't7', name: '특수교육학개론', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 't8', name: '학교폭력예방 및 학생의 이해', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 't9', name: '학교현장실습', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 't10', name: '교육봉사활동 1', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 't11', name: '교육봉사활동 2', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }
    ];
    if (year >= 24) {
        const newItems = [...basicItems];
        newItems.splice(9, 0, { id: 't_digi', name: '디지털 교육', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true });
        return newItems;
    }
    return basicItems;
};