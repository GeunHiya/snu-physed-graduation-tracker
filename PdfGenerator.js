window.PDFTemplate = ({ data, config, stats, id }) => {
    // React 객체 가져오기
    const { React } = window;

    // A4 가로 (297mm x 210mm) 스타일 정의
    const style = {
        width: '297mm',
        minHeight: '210mm',
        padding: '10mm',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
        position: 'absolute',  
        top: 0,
        left: 0,
        zIndex: -9999,
        visibility: 'hidden',
        boxSizing: 'border-box',
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased', 
        letterSpacing: '0px' 
    };

    // 항목 이름 표시 헬퍼 함수
    const getDisplayName = (item) => {
        if (item.type === 'foreign1' || item.type === 'foreign2') {
            return `${item.subName || ''} ${item.name ? `(${item.name})` : ''}`.trim() || item.type;
        }
        if (item.type === 'msSet' && item.subName) {
            return `${item.subName} (${item.name || '실험'})`;
        }
        if (['core', 'pe', 'veritas', 'keys', 'computer'].includes(item.type)) {
            return `${item.prefix || ''}: ${item.name || ''}`;
        }
        if (item.placeholder && !item.name) return '(미입력)';
        return item.name;
    };

    // 체크박스 컴포넌트
    const CheckMark = ({ checked }) => (
        <span className="inline-flex justify-center items-center w-3 h-3 border border-black mr-1.5 text-[10px] font-bold shrink-0 leading-none" style={{ verticalAlign: 'middle' }}>
            <span style={{ position: 'relative', top: '-4px' }}>{checked ? 'V' : ''}</span>
        </span>
    );

    // 섹션 렌더링 컴포넌트
    const PDFSection = ({ title, sectionKey, items, target, earned }) => {
        const validItems = items.filter(i => !i.hidden);
        
        return (
            <div className="border border-black mb-2 text-[9px]" style={{ boxSizing: 'border-box' }}>
                {/* [수정] 박스 제목(검은 바) 텍스트 위로 올리기 (top: -3px) */}
                <div className="bg-black text-white px-2 py-1 font-bold flex justify-between items-center border-b border-black" style={{ height: '20px' }}>
                    <span style={{ position: 'relative', top: '-3px' }}>{title}</span>
                    <span className="text-[8px]" style={{ position: 'relative', top: '-3px' }}>{earned} / {target} pt</span>
                </div>
                <div className="p-1 grid grid-cols-1 gap-x-2">
                    {validItems.map((item, idx) => {
                        const isDone = item.completed || (item.multi && item.checks?.every(c => c));
                        return (
                            <div key={idx} className="flex justify-between items-center py-0.5 border-b border-dotted border-gray-400 last:border-0" style={{ minHeight: '22px' }}>
                                <div className="flex items-center truncate pr-1 w-full">
                                    {item.multi ? (
                                        <div className="flex gap-0.5 mr-1 items-center">
                                            {item.checks.map((c, ci) => <CheckMark key={ci} checked={c} />)}
                                        </div>
                                    ) : (
                                        <CheckMark checked={isDone} />
                                    )}
                                    <span 
                                        className={`truncate ${isDone ? 'text-gray-500' : ''}`} 
                                        style={{ 
                                            position: 'relative',
                                            top: '-4px', // 리스트 텍스트 위치 유지
                                            lineHeight: '1.5', 
                                            display: 'inline-block',
                                            paddingBottom: '2px'
                                        }}
                                    >
                                        {getDisplayName(item)}
                                    </span>
                                </div>
                                {item.credits > 0 && <span className="shrink-0 font-bold" style={{ position: 'relative', top: '-4px', lineHeight: '1.5', display: 'inline-block' }}>{item.credits}</span>}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div id={id} style={style}>
            {/* 헤더 */}
            <div className="border-b-2 border-black pb-2 mb-4 flex justify-between items-end">
                <div>
                    {/* 메인 타이틀은 폰트가 커서 굳이 안 올려도 괜찮거나, 살짝만 보정 */}
                    <h1 className="text-2xl font-black mb-1" style={{ lineHeight: 1.2 }}>서울대학교 물리교육과 졸업 이수 현황표</h1>
                    <div className="text-xs font-bold space-x-4 mt-2">
                        <span>학번: {config.studentId || '학번 없음'}</span>
                        <span>성명: {config.userName || '이름 없음'}</span>
                        <span>전공: 물리교육 ({config.majorPath === 'single' ? '단일전공' : (config.majorPath === 'double' ? `복수전공: ${config.secondMajorTitle}` : `부전공: ${config.secondMajorTitle}`)})</span>
                    </div>
                </div>
                <div className="text-right">
                    {/* [수정] 출력일 위로 올리기 */}
                    <div className="text-xs mb-1" style={{ position: 'relative', top: '-5px' }}>출력일: {dateStr}</div>
                    {/* [수정] 총 이수 학점 위로 올리기 */}
                    <div className="text-xl font-black border border-black px-3 py-1 inline-block">
                        <span style={{ position: 'relative', top: '-10px' }}>총 이수: {stats.overall.earned} / 130 학점</span>
                    </div>
                </div>
            </div>

            {/* 그리드 레이아웃 (요청하신 순서대로 재배치) */}
            <div className="grid grid-cols-4 gap-3 items-start h-full" style={{ boxSizing: 'border-box' }}>
                
                {/* 1열: 교양 */}
                <div className="flex flex-col gap-2">
                    <PDFSection title="교양" sectionKey="general" items={data.general.items} target={stats.general.target} earned={stats.general.earned} />
                </div>

                {/* 2열: 물리교육 + 중복 인정 */}
                <div className="flex flex-col gap-2">
                    <PDFSection title="물리교육 (주전공)" sectionKey="physics" items={data.physics.items} target={stats.physics.target} earned={stats.physics.earned} />
                    {/* 중복 인정 과목이 2열 하단으로 이동 */}
                    {config.majorPath !== 'single' && (
                        <PDFSection title="중복 인정 과목" sectionKey="shared" items={data.shared.items} target={0} earned={data.shared.items.filter(i=>i.completed).reduce((a,c)=>a+c.credits,0)} />
                    )}
                </div>

                {/* 3열: 제2전공 + 일반 선택 */}
                <div className="flex flex-col gap-2">
                    {/* 제2전공 */}
                    {config.majorPath !== 'single' && (
                        <PDFSection title={`${config.secondMajorTitle || '제2전공'} (${config.majorPath === 'double' ? '복수' : '부'})`} sectionKey="indEng" items={data.indEng.items} target={stats.indEng.target} earned={stats.indEng.earned} />
                    )}
                    {/* 일반 선택이 3열로 이동 */}
                    <PDFSection title="일반 선택" sectionKey="elective" items={data.elective.items} target={0} earned={data.elective.items.filter(i=>i.completed).reduce((a,c)=>a+c.credits,0)} />
                </div>

                {/* 4열: 교직 + 기타 졸업 요건 */}
                <div className="flex flex-col gap-2">
                    {/* 교직이 4열 상단으로 이동 */}
                    <PDFSection title="교직" sectionKey="teaching" items={data.teaching.items} target={stats.teaching.target} earned={stats.teaching.earned} />
                    {/* 기타 졸업 요건 */}
                    <PDFSection title="기타 졸업 요건" sectionKey="etcGrad" items={data.etcGrad.items} target={0} earned={0} />
                </div>

            </div>
            
            <div className="mt-4 text-[8px] text-center border-t border-black pt-1">
                위 내용은 본인이 입력한 데이터를 바탕으로 생성되었으며, 실제 졸업 사정 결과와 다를 수 있습니다. 정확한 내용은 학과 사무실에 문의하시기 바랍니다.
            </div>
        </div>
    );
};

// PDF 저장 로직 (이전과 동일)
window.downloadPDF = async (elementId, fileName) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const originalScrollX = window.scrollX;
    const originalScrollY = window.scrollY;

    // 1. 화면 최상단 이동 및 요소 표시
    window.scrollTo(0, 0);
    element.style.visibility = 'visible';
    element.style.zIndex = '99999';
    element.style.backgroundColor = 'white';
    
    // 2. 폰트 렌더링 대기
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const canvas = await html2canvas(element, {
            scale: 2, 
            useCORS: true,
            logging: false,
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0,
            width: element.scrollWidth,
            height: element.scrollHeight,
            windowWidth: 2000, 
            onclone: (clonedDoc) => {
                const clonedEl = clonedDoc.getElementById(elementId);
                if(clonedEl) {
                    clonedEl.style.fontFamily = '"Noto Sans KR", sans-serif';
                }
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = 297;
        const pdfHeight = 210;
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        pdf.save(fileName);

    } catch (err) {
        console.error("PDF 생성 실패:", err);
        alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
        element.style.visibility = 'hidden';
        element.style.zIndex = '-9999';
        window.scrollTo(originalScrollX, originalScrollY);
    }
};