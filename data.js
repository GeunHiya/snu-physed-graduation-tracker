// --- 데이터 상수 ---
window.AVAILABLE_YEARS = Array.from({ length: 13 }, (_, i) => 2014 + i); // [2014, ..., 2026]

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

// [신규] 교직 과목 목록
window.TEACHING_SUBJECTS = [
    "생활지도 및 상담",
    "교육심리",
    "교육철학 및 교육사",
    "교육사회",
    "교육행정 및 교육경영",
    "교육방법 및 교육공학",
    "교육과정",
    "교육평가"
];

// [신규] 물리교육과 전선 선택 항목 목록
window.PHYSICS_ELECTIVES = [
    "물리수학 및 교육1",
    "물리수학 및 교육2",
    "역학 및 교육2",
    "전자기 및 교육2",
    "양자물리 및 교육2",
    "물리학 개념의 역사적 발달",
    "교사를 위한 과학사",
    "전자물리 및 교육",
    "음향학탐구 및 교육"
];

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
    // [수정] 제2전공에 mandatoryCompleted 플래그 추가
    indEng: { title: "제2전공", target: 0, items: [], mandatoryCompleted: false },
    shared: { title: "중복 인정 과목", target: 0, items: [] }, // 유지하되 UI에서 숨김 처리 예정
    etcGrad: { title: "기타 졸업 요건", target: 0, dragDisabled: true, items: [] },
    elective: { title: "일반 선택", target: 0, items: [] },
    planner: [] 
};

window.getGeneralDataByYear = (year) => {
    // 4자리 연도 -> 2자리 변환
    const y = year > 2000 ? year % 100 : year;

    // 14-20학번: 영어 기본 2학점 (선택 가능)
    const isEnglish1420 = (y >= 14 && y <= 20);
    const basicEnglishCredits = (y >= 24) ? 2 : 1; 
    const basicEnglishFixed = y >= 24;
    const tepsDeleteMsg = y >= 24 ? "TEPS 268점 이상인가요?" : "TEPS 298점 이상인가요?";

    // [글쓰기 영역 로직]
    const writingItems = [];
    if (y >= 14 && y <= 18) {
        // 14-18학번: 글쓰기의 기초 (3학점)
        writingItems.push({ 
            id: 'g_wb', name: '글쓰기의 기초', completed: false, credits: 3, 
            fixed: true, lockCredits: true, fixedName: true, 
            deleteMsg: "글쓰기의 기초를 수강하지 않았나요?\n(제1영역에서 1개 교과목(3학점)을 수강해야 합니다.)" 
        });
    } else {
        // 19학번 이후: 대학글쓰기 1 (2학점)
        writingItems.push({ id: 'g_w1', name: '대학글쓰기 1', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true });
        
        // 19학번 이후: 대학글쓰기 2 (2학점)
        if (y >= 19) {
            writingItems.push({ 
                id: 'g_w2', name: '대학 글쓰기 2 : 과학과 기술 글쓰기', completed: false, credits: 2, 
                fixed: true, lockCredits: true, fixedName: true, 
                deleteMsg: "과학논리 및 논술을 수강하였거나 수강하실 예정입니까?" 
            });
        }
    }

    const common = [
        ...writingItems,
        { id: 'g_be', name: '기초 영어', completed: false, credits: basicEnglishCredits, fixed: true, fixedName: true, deleteMsg: tepsDeleteMsg, takenYear: y >= 24 ? 'after24' : 'before23', isFixedCredits: basicEnglishFixed, lockCredits: true },
        // 14-20학번 영어: isEnglish1420 플래그 사용
        { 
            id: 'g_f1', name: '', type: 'foreign1', subName: '대학영어 1', 
            completed: false, credits: isEnglish1420 ? 2 : 3, // 기본 2학점(2020이전 가정)
            fixed: true, lockCredits: true, fixedName: true, lockDelete: true, 
            isEnglish1420: isEnglish1420, takenTime1420: 'before21' 
        },
        { 
            id: 'g_f2', name: '', type: 'foreign2', subName: '', 
            completed: false, credits: isEnglish1420 ? 2 : 3, 
            fixed: true, lockCredits: true, lockDelete: true, 
            isEnglish1420: isEnglish1420, takenTime1420: 'before21'
        },
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
    
    const core = [
        { id: 'g_c1', name: '', type: 'core', prefix: '언어와 문학', options: ["언어와 문학", "문화와 예술"], completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true, recommendedSupport: true, isRecommended: false },
        { id: 'g_c2', name: '', type: 'core', prefix: '역사와 철학', options: ["역사와 철학"], completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true, recommendedSupport: true, isRecommended: false },
        { id: 'g_c3', name: '', type: 'core', prefix: '정치와 경제', options: ["정치와 경제", "인간과 사회"], completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'g_c4', name: '', type: 'core', prefix: '자연과 기술', options: ["자연과 기술", "생명과 환경"], completed: false, credits: 3, fixed: true, lockCredits: true, lockDelete: true }
    ];
    
    const pe_common = [{ id: 'g_pe1', name: '', type: 'pe', prefix: '체육 1', completed: false, credits: 1, fixed: true, lockCredits: true, lockDelete: true }, { id: 'g_pe2', name: '', type: 'pe', prefix: '체육 2', completed: false, credits: 1, fixed: true, lockCredits: true, lockDelete: true }];
    const pe_25_later = [{ id: 'g_pe', name: '', type: 'pe', prefix: '체육', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }];

    if (y >= 14 && y <= 22) return [...common, ...science_21_22, ...core, ...pe_common];
    if (y === 23 || y === 24) return [...common, ...math2, ...science_23_24, ...computer_23_24, ...core, ...pe_common];
    if (y >= 25) return [...common, ...math2, ...science_25_26, ...keys_25_later, ...veritas_25_later, ...pe_25_later];
    return [];
};

// [신규] 물리교육과 주전공 데이터 생성 함수
window.getPhysicsDataByYear = (year) => {
    const y = year > 2000 ? year % 100 : year;
    
    const common = [
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
    ];

    let electives = [];

    if (y >= 14 && y <= 18) {
        electives = [
            { id: 'p_kwanon', name: '과학 논리 및 논술', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
            { id: 'p_sel1', name: '[교과교육 선택]', completed: false, credits: 0, fixed: true, lockCredits: true, selectable: true, lockDelete: true, limitedChoices: true }
        ];
    } else {
        electives = [
            { id: 'p_sel1', name: '[교과교육 선택 1]', completed: false, credits: 0, fixed: true, lockCredits: true, selectable: true, lockDelete: true },
            { id: 'p_sel2', name: '[교과교육 선택 2]', completed: false, credits: 0, fixed: true, lockCredits: true, selectable: true, lockDelete: true }
        ];
    }

    return [...common, ...electives];
};

window.getTeachingDataByYear = (year) => {
    // 4자리 연도 -> 2자리 변환
    const y = year > 2000 ? year % 100 : year;

    // [변경] 교직 과목 5개 입력 -> 선택박스 타입으로 변경
    const basicItems = [
        { id: 't1', name: '교육학개론', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 'ts1', name: '', type: 'teachingSelect', completed: false, credits: 2, lockCredits: true, lockDelete: true },
        { id: 'ts2', name: '', type: 'teachingSelect', completed: false, credits: 2, lockCredits: true, lockDelete: true },
        { id: 'ts3', name: '', type: 'teachingSelect', completed: false, credits: 2, lockCredits: true, lockDelete: true },
        { id: 'ts4', name: '', type: 'teachingSelect', completed: false, credits: 2, lockCredits: true, lockDelete: true },
        { id: 'ts5', name: '', type: 'teachingSelect', completed: false, credits: 2, lockCredits: true, lockDelete: true },
        { id: 't6', name: '교직실무', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 't7', name: '특수교육학개론', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 't8', name: '학교폭력예방 및 학생의 이해', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 't9', name: '학교현장실습', completed: false, credits: 2, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 't10', name: '교육봉사활동 1', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true },
        { id: 't11', name: '교육봉사활동 2', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true }
    ];
    if (y >= 24) {
        const newItems = [...basicItems];
        newItems.splice(9, 0, { id: 't_digi', name: '디지털 교육', completed: false, credits: 1, fixed: true, lockCredits: true, fixedName: true, lockDelete: true });
        return newItems;
    }
    return basicItems;
};

// 학번별 기타 졸업요건 생성 함수
window.getEtcGradDataByYear = (year) => {
    // 4자리 연도 -> 2자리 변환
    const y = year > 2000 ? year % 100 : year;

    const genderEduCount = (y >= 14 && y <= 20) ? 2 : 4;
    const genderEduChecks = Array(genderEduCount).fill(false);

    return [
        { id: 'ex1', name: `성인지 교육 (${genderEduCount}회)`, multi: true, checks: genderEduChecks, credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex2', name: '심폐소생술 교육 (2회)', multi: true, checks: [false, false], credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex3', name: '교직인적성 검사 (2회)', multi: true, checks: [false, false], credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex5', name: "무시험 검정 (졸업학기)", completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex4', name: "중독 검사 (졸업학기)", completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex6', name: "졸업 논문", completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true },
        { id: 'ex7', name: "전체 평점 기준 요건", completed: false, credits: 0, fixed: true, lockCredits: true, lockDelete: true }
    ];
};

// data.js 파일 하단 부분 수정

window.calculateStats = (data, config) => {
    const dynamicTargets = (() => {
        const { studentYear, majorPath } = config;
        const y = studentYear > 2000 ? studentYear % 100 : studentYear;
        
        let ge;
        if (y >= 14 && y <= 18) ge = 38;
        else if (y >= 19 && y <= 20) ge = 39;
        else if (y >= 21 && y <= 22) ge = 41;
        else if (y >= 23 && y <= 24) ge = 42;
        else if (y >= 25) ge = 40;
        else ge = 40;

        let tc = y <= 23 ? 22 : 23; 
        let pri = majorPath === 'single' ? 60 : 52;
        let sec = majorPath === 'double' ? 39 : (majorPath === 'minor' ? 21 : 0);
        return { general: ge, teaching: tc, physics: pri, indEng: sec, total: 130 };
    })();

    const res = {};
    let totalGradEarned = 0;

    // 제2전공 내 중복 인정 과목(isShared) 학점 합계 계산
    const oldSharedEarned = data.shared.items.filter(i => i.completed).reduce((a, c) => a + (Number(c.credits) || 0), 0);
    const indEngSharedEarned = data.indEng.items.filter(i => !i.hidden && i.completed && i.isShared).reduce((a, c) => a + (Number(c.credits) || 0), 0);
    const totalSharedEarnedForPhysics = oldSharedEarned + indEngSharedEarned;

    const electiveEarned = data.elective.items.filter(i => i.completed).reduce((a, c) => a + (Number(c.credits) || 0), 0);
    
    Object.keys(data).forEach(k => {
        if (k === 'planner') return; 

        const target = dynamicTargets[k] || 0;
        let earned = data[k].items.filter(i => !i.hidden && (i.completed || (i.multi && i.checks?.every(c => c)))).reduce((a, c) => a + (Number(c.credits) || 0), 0);
        
        // [수정] 필수 과목 미이수 여부 체크
        let missingMandatory = false;
        if (k === 'general' || k === 'physics') {
            missingMandatory = data[k].items.some(i => i.fixed && !i.completed && !i.hidden);
        } else if (k === 'indEng') {
             if (config.majorPath !== 'single') {
                 missingMandatory = !data.indEng.mandatoryCompleted;
             }
        }

        // [수정] 권장 과목 미이수 여부 체크
        // 1. 권장으로 체크된 과목이 미이수 상태인 경우
        // 2. 권장 지원 과목이 존재하는데, 아무것도 권장으로 체크하지 않은 경우 (신규: 사용자 요청 반영)
        let missingRecommended = false;
        if (k === 'general') {
             const recommendedCandidates = data[k].items.filter(i => i.recommendedSupport);
             if (recommendedCandidates.length > 0) {
                 const hasChecked = recommendedCandidates.some(i => i.isRecommended);
                 // 체크한 것 중 완료되지 않은 것이 있거나, 아예 체크를 안 했거나
                 missingRecommended = data[k].items.some(i => i.recommendedSupport && i.isRecommended && !i.completed) || !hasChecked;
             }
        }

        if (k === 'physics') earned += totalSharedEarnedForPhysics;
        
        // 전체 졸업 학점 계산
        if (['general', 'teaching'].includes(k)) {
            totalGradEarned += earned;
        } else if (k === 'physics') {
            totalGradEarned += data.physics.items.filter(i => !i.hidden && i.completed).reduce((a, c) => a + (Number(c.credits) || 0), 0);
        } else if (k === 'indEng') {
            totalGradEarned += data.indEng.items.filter(i => !i.hidden && i.completed).reduce((a, c) => a + (Number(c.credits) || 0), 0);
        }
        
        // [수정] 완료 조건: 학점 충족 AND 필수 미이수 없음 AND 권장 미이수 없음
        // UI 표시는 Dashboard에서 별도로 처리(학점 부족시 ING, 학점 충족시 미이수 경고)하지만, 데이터 상으로는 완료가 아님을 표시
        const isComplete = (earned >= target) && !missingMandatory && !missingRecommended;

        const isEtcComplete = k === 'etcGrad' ? (data[k].items.length > 0 && data[k].items.every(i => i.completed || (i.multi && i.checks?.every(c => c)))) : isComplete;

        res[k] = { 
            earned, 
            target, 
            isComplete: k === 'etcGrad' ? isEtcComplete : isComplete, 
            percent: target > 0 ? Math.min(100, Math.round((earned / target) * 100)) : (data[k].items.length > 0 ? Math.round((data[k].items.filter(i => i.completed || (i.multi && i.checks?.every(c => c))).length / data[k].items.length) * 100) : 0),
            missingMandatory, 
            missingRecommended 
        };
    });

    totalGradEarned += oldSharedEarned;
    totalGradEarned += electiveEarned;

    res.overall = { earned: totalGradEarned, target: 130, percent: Math.min(100, Math.round((totalGradEarned / 130) * 100)) };
    res.general.isRecommendedMissing = res.general.missingRecommended; 
    return res;
};

// ... (calculateRemaining, getInitialGuestData 함수는 기존과 동일) ...
window.calculateRemaining = (data, config) => {
    const list = Object.keys(data).flatMap(k => {
        if (k === 'planner') return [];

        return data[k].items.filter(i => !i.completed && !i.hidden).map(i => {
            let nameStr = i.name;
            if (i.subName) nameStr = `${i.name}: ${i.subName}`;
            if (i.type === 'core' || i.type === 'coreFixed' || i.type === 'pe' || i.type === 'computer' || i.type === 'veritas' || i.type === 'keys') nameStr = `${i.prefix}: ${i.name}`;
            
            if (i.type === 'majorElectiveTrigger') return null;

            return { 
                ...i, 
                displayName: nameStr, 
                catTitle: k === 'indEng' ? `${config.secondMajorTitle || '제2전공'} (${config.majorPath === 'double' ? '복수전공' : '부전공'})` : data[k].title, 
                catKey: k 
            };
        });
    }).filter(Boolean);

    return config.majorPath === 'single' ? list.filter(i => i.catKey !== 'indEng' && i.catKey !== 'shared') : list;
};

window.getInitialGuestData = (year) => {
    const initialData = JSON.parse(JSON.stringify(BASE_DATA));
    if (window.getGeneralDataByYear) {
        const genItems = window.getGeneralDataByYear(year);
        if (genItems.length > 0) initialData.general.items = genItems;
    }
    if (window.getTeachingDataByYear) {
        const teachItems = window.getTeachingDataByYear(year);
        if (teachItems.length > 0) initialData.teaching.items = teachItems;
    }
    if (window.getPhysicsDataByYear) {
        const phyItems = window.getPhysicsDataByYear(year);
        if (phyItems.length > 0) initialData.physics.items = phyItems;
    }
    if (window.getEtcGradDataByYear) {
        const etcItems = window.getEtcGradDataByYear(year);
        if (etcItems.length > 0) initialData.etcGrad.items = etcItems;
    }
    return initialData;
};