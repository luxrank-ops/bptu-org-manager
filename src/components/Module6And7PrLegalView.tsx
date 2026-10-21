import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Newspaper,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Send,
  RefreshCw,
  Clock,
  Users,
  PhoneCall,
  FileCheck,
  AlertOctagon,
  Share2,
  Search,
  Building2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  BookmarkCheck,
  Gavel,
  FileSearch,
  Layers,
  Flame,
  Check,
  X,
  Radio,
  Info,
  FileWarning,
  Printer,
  Smartphone,
  MessageSquare,
  Activity,
  HeartPulse,
  Eye,
  ArrowRight,
  FileSpreadsheet,
} from 'lucide-react';
import {
  PrBroadcastItem,
  RoleTierProfile,
  LegalComplianceItem,
} from '../data/bptuStore';

// ============================================================================
// MODULE 06: 박소연 디렉터의 모바일 '항운노보' 카드뉴스 스튜디오 & 24개 지부 열람률 관제
// Lead: 교육홍보부 박소연 디렉터 (union-pr-communications)
// ============================================================================

export interface Module6PrBroadcastViewProps {
  activeRole: RoleTierProfile;
  broadcasts: PrBroadcastItem[];
  highContrastDark: boolean;
  onCreateBroadcast: (item: PrBroadcastItem) => void;
  onRemindUnread: (id: string) => void;
}

interface TemplatePreset {
  id: string;
  badge: string;
  category: PrBroadcastItem['category'];
  title: string;
  kakaoSummary: string;
  dept: string;
  legalBadge: string;
  slides: {
    tag: string;
    headline: string;
    highlight: string;
    body: string;
  }[];
  pressReleaseText: string;
}

const PR_TEMPLATES: TemplatePreset[] = [
  {
    id: 'T-01',
    badge: '임단협 속보',
    category: '임단협 속보',
    title: '[제8호 항운노보] 2026 임단협 잠정합의안 도출 — 기본단가 5.4% 인상 및 스마트 자동화 100% 고용보장 명문화',
    dept: '교육홍보부 박소연 디렉터 (자료: 정책연구실 유재민 위원)',
    legalBadge: '법률고문실 정태영 변호사 적법성 필 (#LGL-2026-88)',
    kakaoSummary:
      '📢 [부산항운노조 긴급 브리핑]\n1. 2026 임단협 잠정합의: 기본 하역단가 5.4% 인상 + 4단 라싱 특수위험수당 월 28만원 신설\n2. 스마트 자동화부두(AGV/무인크레인) 도입 시 전 조합원 100% 정년 고용보장 확약\n3. 모바일 무기명 비밀투표: 10/22(목) 09:00~18:00 본 앱에서 1초 투표 참여 바랍니다!',
    slides: [
      {
        tag: '2026 임단협 잠정합의 속보',
        headline: '기본단가 5.4% 인상\n4단 라싱 위험수당 신설',
        highlight: '월 280,000원 신설',
        body: '중앙본부 교섭대표단은 3개월간의 마라톤 협상 끝에 물가상승률을 상회하는 기본 하역단가 5.4% 인상안을 쟁취하였습니다.',
      },
      {
        tag: '핵심 쟁점 100% 타결',
        headline: '스마트 자동화 부두 개장\n조합원 100% 고용 승계',
        highlight: '단 1명의 해고 없는 전환배치',
        body: '신항 2-5, 2-6단계 완전 무인화에 대응하여 노·사 공동 직무전환재교육 위원회를 설치하고 전원 정규 보직을 보장합니다.',
      },
      {
        tag: '안전보건 및 복지 혁신',
        headline: '라싱 안전 가이드라인\n풍속 15m/s 시 자동 셧다운',
        highlight: '산안법 제52조 즉각 발동',
        body: '돌풍 발생 시 현장 반·조장의 작업중지권을 명문화하고, 대학생 자녀 학자금 실비 전액 지원을 임시조합원까지 확대합니다.',
      },
      {
        tag: '조합원 행동 지침',
        headline: '내 손으로 결정하는 잠정합의\n모바일 1초 비밀 전자투표',
        highlight: '10월 22일(목) 09:00 ~ 18:00',
        body: '부산항운노조 공식 앱 [모듈 03 거버넌스]에서 블록체인 영지식 증명 기반 1인 1표 비밀투표에 반드시 참여하십시오.',
      },
    ],
    pressReleaseText: `[공식 보도자료] 부산항운노동조합, 2026년도 항만하역 임금협약 잠정합의 도출
- 기본 하역단가 5.4% 인상 및 컨테이너 4단 고박(Lashing) 고위험 수당 신설
- 스마트 자동화 항만 도입에 따른 9,709명 전 조합원 100% 고용유지 협약 체결
- 헌법 제33조 및 노조법 제33조에 따른 합법적 단체교섭 결과물로 10월 22일 조합원 총투표 회부`,
  },
  {
    id: 'T-02',
    badge: '안전 긴급경보',
    category: '안전 긴급경보',
    title: '[안전 긴급경보 제24호] 남해안 순간풍속 16.8m/s 돌풍 발령 — 산안법 제52조 전 부두 안벽 크레인 및 4단 라싱 즉각 작업중단',
    dept: '산업안전보건국 · 교육홍보부 합동 긴급상황실',
    legalBadge: '법률고문실 정태영 변호사 법적보호 필 (#LGL-2026-92)',
    kakaoSummary:
      '🚨 [신항·북항 전 부두 긴급 안전경보]\n1. 기상청 특보: 부산 신항/북항 안벽 순간최대풍속 16.8m/s 강풍 발효\n2. 산업안전보건법 제52조에 의거 안벽 크레인 붐다운 및 4단 라싱 즉각 중단\n3. 사측 강제작업 강요 시 본 앱 [산재 119] 작업중지 선언문 즉시 발동 및 신고',
    slides: [
      {
        tag: '급박한 위험 긴급경보',
        headline: '순간풍속 16.8m/s 강풍\n전 부두 작업 즉시 중지!',
        highlight: '산안법 제52조 발동',
        body: '기상청 돌풍 특보가 발령되었습니다. 순간풍속 15m/s 초과 시 안벽 크레인 작업 중단 및 본선 컨테이너 고박 작업을 전면 중지하십시오.',
      },
      {
        tag: '법적 보호 권리 확인',
        headline: '작업중지권 행사는 법적 권리\n사측 불이익 처우 시 형사처벌',
        highlight: '산안법 제52조 제4항 명시',
        body: '사업주는 대피한 근로자에게 해고, 임금삭감, 징계 등 불리한 처우를 할 수 없으며 위반 시 1년 이하 징역에 처해집니다.',
      },
      {
        tag: '현장 반·조장 행동요령',
        headline: '조원 전원 안전지대 대피\n운영사 안전관리실 통보',
        highlight: '대기실 즉시 집결',
        body: '반장과 조장은 조원들을 안벽 크레인 하부 및 컨테이너 적치 사각지대에서 즉시 대피시키고 대기실에서 대기하십시오.',
      },
      {
        tag: '노조 긴급상황실',
        headline: '강제작업 강요 신고 핫라인\n정태영 고문변호사 즉시 대응',
        highlight: '24시간 직통: 051-463-XXXX',
        body: '터미널 운영사의 부당한 작업 재개 압박이 있을 경우 1초 만에 법률센터로 직통 신고하십시오.',
      },
    ],
    pressReleaseText: `[긴급 안전성명] 부산항운노조, 기상악화(순간풍속 16.8m/s)에 따른 전 부두 작업중지권 발동 선언
- 산업안전보건법 제52조 제1항에 의거, 부산 신항 및 북항 전 안벽 하역작업 일시 중지
- 선박 입출항 지연을 이유로 한 위험 작업 강요 행위 엄단 경고
- 조합원의 생명과 안전이 항만 물동량보다 우선함을 천명함`,
  },
  {
    id: 'T-03',
    badge: '복지·공제 안내',
    category: '복지·공제 안내',
    title: '[복지공제국 공지] 2026년도 하반기 조합원 자녀 학자금(최대 350만원) 및 긴급 의료비 공제 원클릭 신청 개시',
    dept: '복지공제국 · 교육홍보부 공동',
    legalBadge: '정태영 변호사 규정준수 검수 (#LGL-2026-79)',
    kakaoSummary:
      '💙 [조합원 복지공제 알림]\n1. 2026 하반기 대학생 자녀 학자금(학기당 최대 350만원 실비) 접수 개시\n2. 정조합원 및 근속 1년 이상 등록 임시조합원 전원 대상 동일 지원\n3. 신청: 본 앱 [모듈 04 급여복지]에서 영수증 사진 1장으로 10초 완료',
    slides: [
      {
        tag: '조합원 복지 확대',
        headline: '하반기 자녀 학자금 지원\n학기당 최대 350만원',
        highlight: '등록금 실비 100% 지원',
        body: '조합원들의 교육비 부담을 덜어드리기 위해 국내외 전문대 및 4년제 대학 재학 자녀 전원에게 학자금을 지급합니다.',
      },
      {
        tag: '공정 복지 원칙',
        headline: '임시조합원 차별 폐지\n근속 1년 이상 전원 수혜',
        highlight: '임시조합원 2,429명 포함',
        body: '비정규/임시 조합원에 대한 복지 격차를 전면 해소하여 항만 노동의 존엄성을 함께 지켜나갑니다.',
      },
      {
        tag: '간편 신청 절차',
        headline: '서류 제출 번거로움 제로\n모바일 사진 1장 10초 신청',
        highlight: '재학증명서 + 등록금 고지서',
        body: '스마트폰 카메라로 서류를 촬영해 앱에 업로드하면 인공지능 OCR이 자동으로 계좌로 지급 승인합니다.',
      },
      {
        tag: '접수 일정 안내',
        headline: '10월 21일 ~ 11월 10일까지\n신청 즉시 3일 이내 입금',
        highlight: '모바일 1탭 접수 개시',
        body: '문의: 중앙본부 복지공제국 (051-463-XXXX) 또는 관할 24개 지부 복지간사',
      },
    ],
    pressReleaseText: `[보도자료] 부산항운노조, 임시조합원까지 전면 확대한 2026 하반기 자녀 학자금·의료공제 지원 개시
- 9,709명 전 조합원 균등 복지 실현… 정조합원·임시조합원 차별 없는 상생 복지망 구축
- 연간 총 48억 원 규모의 항운노조 자체 공제기금 투입으로 조합원 생활안정 도모`,
  },
  {
    id: 'T-04',
    badge: '대외 공식성명서',
    category: '대외 공식성명서',
    title: '[공식 성명] 부산항 스마트 자동화 부두 개장에 부쳐 — "기술 혁신은 노동 배제가 아닌 안전과 총고용 상생이어야 한다"',
    dept: '중앙본부 대변인실 · 교육홍보부',
    legalBadge: '정태영 수석변호사 언론배포 승인 (#LGL-2026-85)',
    kakaoSummary:
      '📢 [부산항운노동조합 대외 성명서 요약]\n1. 스마트 항만 도입 찬성하나 일방적 외주화 및 인력감축 시도는 단호히 배격\n2. 직업안정법 제33조 항만 노무공급권 수호 및 노사정 공동 전환배치 기금 조성 촉구\n3. 인간 중심의 항만 안전 모델 정립을 위해 대정부·부산항만공사 5대 요구안 발표',
    slides: [
      {
        tag: '대외 공식 성명',
        headline: '스마트 항만의 완성은\n현장 노동자의 존중이다',
        highlight: '100% 총고용 보장 촉구',
        body: '자동화 크레인과 AGV 도입은 항만 경쟁력 제고의 수단일 뿐 노동자를 배제하는 명분이 될 수 없습니다.',
      },
      {
        tag: '법적 정당성 천명',
        headline: '직업안정법 제33조 수호\n항만 노무공급권 흔들림 없다',
        highlight: '합법적 근로자공급사업',
        body: '1947년 이래 부산항 하역 현장의 혈맥을 이어온 항운노조의 노무공급권은 법률과 역사가 증명한 공익적 지위입니다.',
      },
      {
        tag: '노사정 상생 대안',
        headline: '노사정 공동 전환기금 신설\n스마트 장비 운용사 전원 재교육',
        highlight: '직무전환 100% 흡수',
        body: '기존 라싱·신호수 조합원을 원격제어 크레인 기사 및 스마트 관제사로 재교육하여 양질의 일자리를 창출하겠습니다.',
      },
      {
        tag: '대국민 약속',
        headline: '세계 2위 환적항만 부산\n안전과 평화로 지켜내겠습니다',
        highlight: '투명하고 청렴한 노동조합',
        body: '투명한 인사 시스템과 청렴 신문고를 통해 국민과 함께 호흡하는 모범적인 대한민국 노동운동을 선도하겠습니다.',
      },
    ],
    pressReleaseText: `[공식 성명서] 부산항 완전 자동화 항만 개장에 대한 부산항운노동조합의 공식 입장
- 신기술 도입에 따른 생산성 향상을 환영하며, 그 과실은 항만 종사자의 안전과 고용안정으로 이어져야 함
- 직업안정법 제33조에 입각한 근로자공급사업 지위를 확고히 견지하며 외주화 시도에 엄중 대처할 것
- 정부·부산시·BPA에 노사정 협의체 상설화 및 항만고용안정기금 조례 제정 요구`,
  },
];

export function Module6PrBroadcastView({
  activeRole,
  broadcasts,
  highContrastDark,
  onCreateBroadcast,
  onRemindUnread,
}: Module6PrBroadcastViewProps) {
  // 스튜디오 탭: kakao(카톡 3초), card(카드뉴스 슬라이드), press(언론 보도자료)
  const [activeStudioTab, setActiveStudioTab] = useState<'kakao' | 'card' | 'press'>('kakao');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // 폼 입력 상태
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('T-01');
  const [inputCategory, setInputCategory] = useState<PrBroadcastItem['category']>('임단협 속보');
  const [inputTitle, setInputTitle] = useState<string>(PR_TEMPLATES[0].title);
  const [inputKakaoSummary, setInputKakaoSummary] = useState<string>(PR_TEMPLATES[0].kakaoSummary);
  const [inputDept, setInputDept] = useState<string>('교육홍보부 박소연 디렉터 (자료: 정책연구실 유재민 위원)');
  const [legalClearanceBadge, setLegalClearanceBadge] = useState<string>('법률고문실 정태영 변호사 적법성 필 (#LGL-2026-88)');

  // 카드 슬라이드 커스텀 데이터
  const [customSlides, setCustomSlides] = useState(PR_TEMPLATES[0].slides);
  const [customPressRelease, setCustomPressRelease] = useState<string>(PR_TEMPLATES[0].pressReleaseText);

  // 피드백 알림 & 재발송 로딩 상태
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [remindingBroadcastId, setRemindingBroadcastId] = useState<string | null>(null);
  const [expandedBranchMap, setExpandedBranchMap] = useState<Record<string, boolean>>({});

  // 필터 및 검색
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 템플릿 선택 핸들러
  const handleSelectTemplate = (template: TemplatePreset) => {
    setSelectedTemplateId(template.id);
    setInputCategory(template.category);
    setInputTitle(template.title);
    setInputKakaoSummary(template.kakaoSummary);
    setInputDept(template.dept);
    setLegalClearanceBadge(template.legalBadge);
    setCustomSlides(template.slides);
    setCustomPressRelease(template.pressReleaseText);
    setCurrentSlideIndex(0);
    triggerToast(`템플릿 적용 완료: [${template.badge}] 포맷으로 자동 변환되었습니다.`);
  };

  // OSMU 브로드캐스트 발행 핸들러
  const handlePublish = () => {
    if (!inputTitle.trim()) {
      triggerToast('공지 제목을 입력해주세요.');
      return;
    }
    if (!inputKakaoSummary.trim()) {
      triggerToast('카카오톡 요약 및 본문 내용을 입력해주세요.');
      return;
    }

    const newId = `PR-2026-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newItem: PrBroadcastItem = {
      id: newId,
      category: inputCategory,
      title: inputTitle.trim(),
      publishedAt: nowStr,
      authorDept: inputDept,
      legalClearedBy: legalClearanceBadge,
      kakaoShortSummary: inputKakaoSummary.trim(),
      totalTarget: 9709,
      readCount: 0,
      branchReadRates: [
        { branchName: '제3항업지부 (신항 남측)', ratePct: 0.0 },
        { branchName: '제2항업지부 (신항 북측)', ratePct: 0.0 },
        { branchName: '제1항업지부 (북항 통합)', ratePct: 0.0 },
        { branchName: '냉동화물지부', ratePct: 0.0 },
        { branchName: '감천항지부', ratePct: 0.0 },
        { branchName: '양곡·유류특수지부', ratePct: 0.0 },
      ],
    };

    onCreateBroadcast(newItem);
    triggerToast(`🎉 [OSMU 발행 성공] 전사 24개 지부 9,709명에게 즉시 브로드캐스트되었습니다! (${newId})`);
  };

  // 클립보드 복사 헬퍼
  const handleCopyToClipboard = (text: string, label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      triggerToast(`✓ [${label}] 클립보드에 복사되었습니다! 카톡 단톡방이나 언론사에 즉시 붙여넣기 하세요.`);
    } catch {
      triggerToast('클립보드 복사에 실패했습니다.');
    }
  };

  // 미열람자 리마인드 핸들러
  const handleRemindClick = (item: PrBroadcastItem) => {
    setRemindingBroadcastId(item.id);
    setTimeout(() => {
      onRemindUnread(item.id);
      setRemindingBroadcastId(null);
      const unreadCount = item.totalTarget - item.readCount;
      const sentCount = Math.min(unreadCount, 310);
      triggerToast(
        `📢 [1탭 일괄 재발송 완료] 미열람 조합원 ${sentCount}명에게 카카오 알림톡 및 긴급 SMS 전송 완료! 실시간 열람률 상승 반영.`
      );
    }, 1000);
  };

  // 지부 상세 토글
  const toggleBranchExpand = (id: string) => {
    setExpandedBranchMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 필터링된 공지 목록
  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((item) => {
      const matchCat = filterCategory === 'ALL' || item.category === filterCategory;
      const matchKw =
        !searchKeyword.trim() ||
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.kakaoShortSummary.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchCat && matchKw;
    });
  }, [broadcasts, filterCategory, searchKeyword]);

  // 전사 종합 통계
  const totalTargetAll = broadcasts.reduce((acc, b) => acc + b.totalTarget, 0);
  const totalReadCountAll = broadcasts.reduce((acc, b) => acc + b.readCount, 0);
  const overallAvgRate =
    totalTargetAll > 0 ? ((totalReadCountAll / totalTargetAll) * 100).toFixed(1) : '94.6';

  const canPublish =
    activeRole.id === 'LV1_HQ' ||
    activeRole.id === 'LV2_BRANCH' ||
    activeRole.title.includes('위원장') ||
    activeRole.title.includes('디렉터') ||
    activeRole.title.includes('지부장');

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner: Module 06 Title & Scope */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-sm relative overflow-hidden transition-all ${
          highContrastDark
            ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-blue-900 text-slate-100'
            : 'bg-gradient-to-br from-blue-900 via-indigo-900 to-[#0C1E4A] border-blue-800 text-white'
        }`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <Megaphone className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
              <span>모듈 06 · 박소연 교육홍보부 디렉터 직할 관제실</span>
              <span className="opacity-40">|</span>
              <span>OSMU 3초 카톡 & 모바일 항운노보</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              모바일 '항운노보' 카드뉴스 스튜디오 & 24개 지부 9,709명 열람률 관제
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 max-w-3xl leading-relaxed">
              단 한 번의 텍스트 입력으로 <strong>① 카카오톡 단톡방용 3초 브리핑</strong>,{' '}
              <strong>② 모바일 4슬라이드 카드뉴스</strong>,{' '}
              <strong>③ 정태영 변호사 사전 법률검수 필 공식 보도자료</strong>를 1초 만에 동시 생성·발행하고 전사
              도달률을 실시간 관제합니다.
            </p>
          </div>

          {/* Quick Authority Badge */}
          <div
            className={`p-4 rounded-2xl border backdrop-blur-md shrink-0 flex flex-col justify-between ${
              highContrastDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                : 'bg-white/10 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">현재 접속 권한</span>
            </div>
            <div className="text-base font-extrabold flex items-center gap-2">
              <span>{activeRole.holderName}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-600/60 font-medium">
                {activeRole.levelBadge}
              </span>
            </div>
            <p className="text-xs text-blue-200/80 mt-1 max-w-[220px]">
              {canPublish
                ? '✓ 전사 9,709명 즉시 브로드캐스트 발행 권한 보유'
                : '※ 현재 일반 조합원 모드 (열람 및 카톡 브리핑 복사 가능)'}
            </p>
          </div>
        </div>

        {/* 4 Stats Radar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-blue-200">전사 발행 대상 인원</div>
            <div className="text-xl sm:text-2xl font-black mt-1 text-white">9,709명</div>
            <div className="text-[11px] text-blue-300">정 7,280 / 임시 2,429</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-blue-200">전사 평균 열람 도달률</div>
            <div className="text-xl sm:text-2xl font-black mt-1 text-emerald-300">
              {overallAvgRate}%
            </div>
            <div className="text-[11px] text-emerald-200">최근 3개 공보 집계</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-blue-200">누적 발행 공보</div>
            <div className="text-xl sm:text-2xl font-black mt-1 text-white">
              {broadcasts.length}건
            </div>
            <div className="text-[11px] text-blue-300">임단협·안전·복지·성명</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-blue-200">사전 법률 리스크</div>
            <div className="text-xl sm:text-2xl font-black mt-1 text-cyan-300">0건 (클린)</div>
            <div className="text-[11px] text-cyan-200">형법 307조/노조법 적법 필</div>
          </div>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* SECTION A: OSMU 3초 카톡 카드뉴스 & 모바일 항운노보 발행 스튜디오         */}
      {/* ====================================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-blue-600 inline-block" />
              <h2
                className={`text-xl sm:text-2xl font-black ${
                  highContrastDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                섹션 A — OSMU 3초 카톡 카드뉴스 & 모바일 항운노보 발행 스튜디오
              </h2>
            </div>
            <p className={`text-xs sm:text-sm mt-1 ${highContrastDark ? 'text-slate-400' : 'text-slate-600'}`}>
              원소스 멀티유즈: 교대 대기실 스마트폰 터치 한 번으로 3가지 대내외 포맷을 실시간 인쇄·전송합니다.
            </p>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-xs font-bold ${highContrastDark ? 'text-slate-400' : 'text-slate-500'}`}>
              신속 템플릿:
            </span>
            {PR_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleSelectTemplate(tmpl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                  selectedTemplateId === tmpl.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow'
                    : highContrastDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {tmpl.badge}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Studio: Left Generator Form / Right 3-Way Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form (5 cols) */}
          <div
            className={`lg:col-span-5 p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 ${
              highContrastDark
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base">공보 작성 및 법률검수 승인</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                100% 암호화 전송
              </span>
            </div>

            {/* Category Dropdown */}
            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  highContrastDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                발행 카테고리
              </label>
              <select
                value={inputCategory}
                onChange={(e) => setInputCategory(e.target.value as PrBroadcastItem['category'])}
                className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold ${
                  highContrastDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="임단협 속보">임단협 속보 (임금·단협·투표)</option>
                <option value="안전 긴급경보">안전 긴급경보 (태풍·강풍·작업중지)</option>
                <option value="복지·공제 안내">복지·공제 안내 (학자금·의료·경조)</option>
                <option value="대외 공식성명서">대외 공식성명서 (언론·사측 반박)</option>
              </select>
            </div>

            {/* Title Input */}
            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  highContrastDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                공지 헤드라인 (제목)
              </label>
              <input
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="공보 제목을 입력하세요"
                className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold ${
                  highContrastDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Kakao 3-Second Summary (Textarea) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className={`text-xs font-bold ${
                    highContrastDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  카카오톡 3초 브리핑 & 핵심 본문
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {inputKakaoSummary.length}자
                </span>
              </div>
              <textarea
                rows={5}
                value={inputKakaoSummary}
                onChange={(e) => setInputKakaoSummary(e.target.value)}
                placeholder="조합원이 3초 만에 읽을 수 있도록 1, 2, 3 번호로 요약 작성하세요."
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans ${
                  highContrastDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Department & Legal Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label
                  className={`block text-[11px] font-bold mb-1 ${
                    highContrastDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  작성 부서
                </label>
                <input
                  type="text"
                  value={inputDept}
                  onChange={(e) => setInputDept(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none font-medium ${
                    highContrastDark
                      ? 'bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-[11px] font-bold mb-1 ${
                    highContrastDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  정태영 변호사 법률검수
                </label>
                <input
                  type="text"
                  value={legalClearanceBadge}
                  onChange={(e) => setLegalClearanceBadge(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none font-medium ${
                    highContrastDark
                      ? 'bg-slate-800 border-slate-700 text-emerald-400'
                      : 'bg-slate-50 border-slate-300 text-emerald-700'
                  }`}
                />
              </div>
            </div>

            {/* Legal Safety Notice */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                highContrastDark
                  ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              <Scale className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>형법 제307조(명예훼손) & 노조법 제33조 정당성 자동 검수:</strong> 본 공보는
                법률고문실 정태영 변호사의 공익성 및 진실성 사전 검토를 완료하였으며 위법성 조각사유를
                충족합니다.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handlePublish}
                disabled={!canPublish}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  canPublish
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white hover:brightness-110 active:scale-[0.98]'
                    : 'bg-slate-400 text-slate-200 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>전사 9,709명 즉시 브로드캐스트 발행</span>
              </button>
              {!canPublish && (
                <p className="text-[11px] text-center text-amber-500 font-medium">
                  ※ 발행은 지부장(Lv.2) 이상 또는 교육홍보부 담당자만 최종 승인할 수 있습니다.
                </p>
              )}
            </div>
          </div>

          {/* Right Live Previewer (7 cols) */}
          <div
            className={`lg:col-span-7 rounded-3xl border shadow-sm overflow-hidden flex flex-col ${
              highContrastDark
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* 3-Way Tab Selector */}
            <div className="p-3 border-b flex items-center justify-between border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveStudioTab('kakao')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeStudioTab === 'kakao'
                      ? 'bg-[#FEE500] text-[#3C1E1E] shadow font-extrabold'
                      : highContrastDark
                      ? 'text-slate-300 hover:bg-slate-700'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>① 카톡 3초 브리핑</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStudioTab('card')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeStudioTab === 'card'
                      ? 'bg-blue-600 text-white shadow font-extrabold'
                      : highContrastDark
                      ? 'text-slate-300 hover:bg-slate-700'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>② 모바일 카드뉴스 (4장)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStudioTab('press')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeStudioTab === 'press'
                      ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow font-extrabold'
                      : highContrastDark
                      ? 'text-slate-300 hover:bg-slate-700'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>③ 법률검수 보도자료</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-400">실시간 연동 미리보기</span>
            </div>

            {/* Tab 1: KakaoTalk Mobile Bubble Preview */}
            {activeStudioTab === 'kakao' && (
              <div className="p-6 bg-[#A8B8C8] dark:bg-slate-950 flex flex-col items-center min-h-[460px] justify-center relative">
                <div className="w-full max-w-md space-y-3">
                  <div className="text-center">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black/20 text-white">
                      부산항운노동조합 전체 단톡방 공지
                    </span>
                  </div>

                  {/* Bubble Container */}
                  <div className="bg-[#FEE500] text-[#3C1E1E] p-5 rounded-2xl rounded-tl-none shadow-md space-y-3 border border-yellow-400/40 relative">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-black/10 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Megaphone className="w-4 h-4 text-[#3C1E1E]" />
                        <span className="text-xs font-black tracking-tight">
                          [부산항운노동조합 3초 브리핑]
                        </span>
                      </div>
                      <span className="text-[10px] font-medium opacity-70">
                        {inputCategory}
                      </span>
                    </div>

                    {/* Headline */}
                    <div className="font-extrabold text-sm sm:text-base leading-snug">
                      {inputTitle}
                    </div>

                    {/* Body Summary */}
                    <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed font-sans bg-black/5 p-3 rounded-xl border border-black/5 font-medium">
                      {inputKakaoSummary}
                    </div>

                    {/* Footer Info */}
                    <div className="pt-1 flex items-center justify-between text-[11px] opacity-75 border-t border-black/10">
                      <span>{inputDept}</span>
                      <span className="font-mono text-[10px]">
                        {new Date().toISOString().substring(11, 16)} 읽음
                      </span>
                    </div>

                    {/* App Link Button in Kakao */}
                    <div className="pt-1">
                      <div className="w-full py-2 bg-[#3C1E1E] text-yellow-300 rounded-xl text-center text-xs font-bold shadow-sm flex items-center justify-center gap-1.5">
                        <span>👉 공식 앱에서 1초 투표·상세보기</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Copy Action */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyToClipboard(
                          `📢 [부산항운노동조합 3초 브리핑 - ${inputCategory}]\n\n${inputTitle}\n\n${inputKakaoSummary}\n\n👉 공식 앱 바로가기: https://bptu.union.app`,
                          '카톡 단톡방용 브리핑 문구'
                        )
                      }
                      className="px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                      <Copy className="w-3.5 h-3.5 text-yellow-400" />
                      <span>카톡 3초 브리핑 텍스트 복사</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Mobile 4-Slide Card News Preview */}
            {activeStudioTab === 'card' && (
              <div className="p-6 bg-slate-100 dark:bg-slate-950 flex flex-col items-center min-h-[460px] justify-between">
                {/* Smartphone Card Frame */}
                <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700 bg-gradient-to-br from-[#0C1E4A] via-indigo-950 to-blue-900 text-white flex flex-col justify-between p-6 min-h-[360px] relative">
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500 text-white uppercase tracking-wider">
                        {customSlides[currentSlideIndex]?.tag || inputCategory}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-blue-200">
                      {currentSlideIndex + 1} / {customSlides.length}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="py-4 space-y-3">
                    <h4 className="text-lg sm:text-xl font-black leading-snug whitespace-pre-line tracking-tight text-white drop-shadow">
                      {customSlides[currentSlideIndex]?.headline}
                    </h4>

                    {/* Big Callout */}
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                      <div className="text-xs text-blue-200 font-bold">주요 골자 / 성과</div>
                      <div className="text-base sm:text-lg font-black text-amber-300 mt-0.5">
                        {customSlides[currentSlideIndex]?.highlight}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                      {customSlides[currentSlideIndex]?.body}
                    </p>
                  </div>

                  {/* Bottom Footer of Card */}
                  <div className="border-t border-white/20 pt-3 flex items-center justify-between text-[11px] text-blue-200">
                    <span className="font-bold">부산항운노동조합 모바일 항운노보</span>
                    <span className="font-mono text-[10px]">BPTU NEWS</span>
                  </div>
                </div>

                {/* Slider Controls */}
                <div className="w-full max-w-sm flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentSlideIndex === 0}
                    className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-50 text-slate-800 dark:text-slate-100 transition-all font-bold text-xs flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>이전</span>
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex items-center gap-1.5">
                    {customSlides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-2.5 rounded-full transition-all ${
                          idx === currentSlideIndex
                            ? 'w-6 bg-blue-600'
                            : 'w-2.5 bg-slate-300 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSlideIndex((prev) => Math.min(customSlides.length - 1, prev + 1))
                    }
                    disabled={currentSlideIndex === customSlides.length - 1}
                    className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-50 text-slate-800 dark:text-slate-100 transition-all font-bold text-xs flex items-center gap-1"
                  >
                    <span>다음</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Legal-Cleared Official Press Release */}
            {activeStudioTab === 'press' && (
              <div className="p-6 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between min-h-[460px] space-y-4">
                {/* Official Paper Document View */}
                <div
                  className={`p-6 rounded-2xl border shadow-sm font-sans space-y-4 relative ${
                    highContrastDark
                      ? 'bg-slate-900 border-slate-800 text-slate-100'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {/* Top Seal & Badge */}
                  <div className="flex items-start justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="text-[11px] font-bold text-blue-600 tracking-wider">
                        PRESS RELEASE · 즉시 보도 가능
                      </div>
                      <h4 className="text-lg font-black mt-1">{inputTitle}</h4>
                      <div className="text-xs text-slate-500 mt-1">
                        발행일: {new Date().toISOString().substring(0, 10)} | 배포처: 해운항만기자단 42개사
                      </div>
                    </div>

                    {/* Official Stamp Simulation */}
                    <div className="w-16 h-16 rounded-full border-2 border-red-600 text-red-600 font-serif font-black flex flex-col items-center justify-center text-[10px] leading-tight rotate-6 select-none shrink-0">
                      <span>부산항운</span>
                      <span>노동조합</span>
                      <span className="text-[8px] font-sans">검인</span>
                    </div>
                  </div>

                  {/* Legal Clearance Notice Box */}
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                        {legalClearanceBadge}
                      </div>
                      <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
                        본 성명은 형법 제307조(명예훼손) 제2항의 허위사실에 해당하지 아니하며,
                        노동조합 및 노동관계조정법 제33조에 근거한 정당한 조합 활동으로 법률검수를
                        완료하였습니다.
                      </p>
                    </div>
                  </div>

                  {/* Press Content */}
                  <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed border p-3 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 font-serif">
                    {customPressRelease}
                  </div>

                  {/* Inquiries Footer */}
                  <div className="text-[11px] text-slate-500 border-t pt-3 flex items-center justify-between">
                    <span>문의: 교육홍보부 박소연 디렉터 / 법률고문실 정태영 변호사</span>
                    <span>TEL: 051-463-XXXX</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyToClipboard(
                        `[보도자료] ${inputTitle}\n\n${customPressRelease}\n\n${legalClearanceBadge}\n문의: ${inputDept}`,
                        '대외 공식 보도자료'
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow hover:bg-blue-700 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>보도자료 전문 복사</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* SECTION B: 전사 9,709명 실시간 열람률 레이더 & 미열람자 1탭 재발송 관제   */}
      {/* ====================================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t pt-8 border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-emerald-600 inline-block" />
              <h2
                className={`text-xl sm:text-2xl font-black ${
                  highContrastDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                섹션 B — 전사 9,709명 실시간 열람률 레이더 & 미열람자 1탭 재발송 관제
              </h2>
            </div>
            <p className={`text-xs sm:text-sm mt-1 ${highContrastDark ? 'text-slate-400' : 'text-slate-600'}`}>
              각 공지별 24개 지부 실시간 도달률을 모니터링하고, 미열람 조합원에게 카톡·SMS 알림을 1탭으로 즉시 재전송합니다.
            </p>
          </div>

          {/* Filter Tabs & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="공지 검색..."
                className={`pl-9 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  highContrastDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border focus:outline-none ${
                highContrastDark
                  ? 'bg-slate-800 border-slate-700 text-slate-100'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="ALL">전체 카테고리</option>
              <option value="임단협 속보">임단협 속보</option>
              <option value="안전 긴급경보">안전 긴급경보</option>
              <option value="복지·공제 안내">복지·공제 안내</option>
              <option value="대외 공식성명서">대외 공식성명서</option>
            </select>
          </div>
        </div>

        {/* Broadcasts List Cards */}
        <div className="space-y-5">
          {filteredBroadcasts.map((item) => {
            const readPct =
              item.totalTarget > 0
                ? Number(((item.readCount / item.totalTarget) * 100).toFixed(1))
                : 0;
            const unreadCount = item.totalTarget - item.readCount;
            const isReminding = remindingBroadcastId === item.id;
            const isExpanded = !!expandedBranchMap[item.id];

            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border transition-all shadow-sm space-y-5 ${
                  highContrastDark
                    ? 'bg-slate-900 border-slate-800 text-slate-100 hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-900 hover:shadow-md'
                }`}
              >
                {/* Header: Badges & Title */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.category === '임단협 속보'
                            ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                            : item.category === '안전 긴급경보'
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                            : item.category === '복지·공제 안내'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {item.id} · {item.publishedAt}
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{item.legalClearedBy}</span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black leading-snug">
                      {item.title}
                    </h3>

                    <div className="text-xs text-slate-500 font-medium">
                      발행처: {item.authorDept}
                    </div>
                  </div>

                  {/* High Contrast Read Rate Gauge */}
                  <div
                    className={`p-4 rounded-2xl border text-center shrink-0 min-w-[170px] ${
                      highContrastDark
                        ? 'bg-slate-800/80 border-slate-700'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-slate-400">전사 실시간 열람률</div>
                    <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
                      {readPct}%
                    </div>
                    <div className="text-xs font-mono text-slate-500 mt-1">
                      <strong>{item.readCount.toLocaleString()}</strong> /{' '}
                      {item.totalTarget.toLocaleString()}명
                    </div>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Activity className="w-3.5 h-3.5 text-blue-500" />
                      전사 9,709명 도달 진행도
                    </span>
                    <span className={unreadCount > 0 ? 'text-amber-500' : 'text-emerald-500'}>
                      {unreadCount > 0
                        ? `미열람 ${unreadCount.toLocaleString()}명 독려 대상`
                        : '전원 열람 완료 (100%)'}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"
                      style={{ width: `${readPct}%` }}
                    />
                  </div>
                </div>

                {/* Branch Read Rates Breakdown */}
                <div
                  className={`p-4 rounded-2xl border ${
                    highContrastDark
                      ? 'bg-slate-800/40 border-slate-800'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      주요 관할 지부별 열람 도달률
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleBranchExpand(item.id)}
                      className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? '간략히 접기' : '24개 전체 지부 펼치기'}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Branches Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(isExpanded
                      ? [
                          ...item.branchReadRates,
                          { branchName: '제4항업지부 (신항 서측)', ratePct: Math.max(88, readPct - 3) },
                          { branchName: '양곡하역지부 (북항)', ratePct: Math.max(85, readPct - 4) },
                          { branchName: '유류화물지부', ratePct: Math.max(90, readPct - 2) },
                          { branchName: '연안여객선지부', ratePct: Math.max(91, readPct - 1) },
                          { branchName: '특수하역화물지부', ratePct: Math.max(89, readPct - 3) },
                        ]
                      : item.branchReadRates
                    ).map((br, bIdx) => (
                      <div
                        key={bIdx}
                        className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                          highContrastDark
                            ? 'bg-slate-800 border-slate-700'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold truncate text-slate-800 dark:text-slate-200">
                            {br.branchName}
                          </span>
                          <span
                            className={`font-mono font-extrabold ${
                              br.ratePct >= 95
                                ? 'text-emerald-500'
                                : br.ratePct >= 90
                                ? 'text-blue-500'
                                : 'text-amber-500'
                            }`}
                          >
                            {br.ratePct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              br.ratePct >= 95
                                ? 'bg-emerald-500'
                                : br.ratePct >= 90
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${br.ratePct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2 Big Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>발행 10분 내 평균 도달률 73.2% · 푸시 알림 정상 작동중</span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    {/* Copy Kakao Summary */}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyToClipboard(
                          `📢 [부산항운노동조합 긴급 알림]\n${item.title}\n\n${item.kakaoShortSummary}\n\n👉 공식 앱 바로가기: https://bptu.union.app`,
                          '카톡 3초 브리핑'
                        )
                      }
                      className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs border flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                        highContrastDark
                          ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700'
                          : 'bg-yellow-50 border-yellow-300 text-yellow-900 hover:bg-yellow-100'
                      }`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>카톡 3초 브리핑 복사</span>
                    </button>

                    {/* 1-Tap Remind Unread Members */}
                    <button
                      type="button"
                      onClick={() => handleRemindClick(item)}
                      disabled={isReminding || unreadCount <= 0}
                      className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95 ${
                        unreadCount <= 0
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                          : isReminding
                          ? 'bg-blue-500 text-white animate-pulse'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isReminding ? 'animate-spin' : ''}`} />
                      <span>
                        {isReminding
                          ? '카톡·SMS 재전송중...'
                          : `미열람 조합원 (${unreadCount.toLocaleString()}명) 1탭 일괄 재발송`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// MODULE 07: 정태영 수석 변호사·노무사의 부두 산재 119 원스톱 구조 & 작업중지권
// Lead: 법률고문실 정태영 수석 변호사·공인노무사 (labor-legal-counsel)
// ============================================================================

export interface Module7LegalSafety119ViewProps {
  activeRole: RoleTierProfile;
  complianceItems: LegalComplianceItem[];
  highContrastDark: boolean;
}

interface RiskFactorOption {
  id: string;
  label: string;
  legalBasis: string;
  dangerDesc: string;
}

const RISK_FACTOR_OPTIONS: RiskFactorOption[] = [
  {
    id: 'wind',
    label: '1. 순간풍속 15m/s 이상 강풍/폭우',
    legalBasis: '산업안전보건기준에 관한 규칙 제37조(악천후 및 강풍 시 작업중지)',
    dangerDesc: '안벽 갠트리 크레인 흔들림, 컨테이너 전도 및 고소 라싱 작업자 추락 급박 위험',
  },
  {
    id: 'defect',
    label: '2. 라싱바·트위스트락·크레인 와이어 결함',
    legalBasis: '산안법 제38조(안전조치) 및 제52조(근로자의 작업중지)',
    dangerDesc: '4단 라싱바 피로파괴, 불량 콘(Cone) 결속 탈락, 크레인 와이어 소선 파단으로 인한 낙하 위험',
  },
  {
    id: 'gas',
    label: '3. 냉동창고/밀폐공간 가스·산소농도 이상',
    legalBasis: '산업안전보건기준에 관한 규칙 제619조(밀폐공간 보건작업 프로그램)',
    dangerDesc: '산소농도 18% 미만 결핍 질식 위험 및 암모니아/프레온 냉매 가스 누출 위험',
  },
  {
    id: 'signal',
    label: '4. 신호수 미배치 사각지대 작업 강요',
    legalBasis: '산안법 제38조 및 항만하역 안전작업 표준지침',
    dangerDesc: '야드 트랙터(YT)·스트래들캐리어(SC) 후진 시 유도신호수 부재로 인한 협착·충돌 위험',
  },
];

export function Module7LegalSafety119View({
  activeRole,
  complianceItems,
  highContrastDark,
}: Module7LegalSafety119ViewProps) {
  // 섹션 A 상태: 위험 요인 선택 및 작업중지권 발동
  const [selectedRiskIds, setSelectedRiskIds] = useState<string[]>(['wind', 'defect']);
  const [stopWorkLocation, setStopWorkLocation] = useState<string>(
    '부산항 신항 3부두(HJNC) 4A 선석 컨테이너 본선 12베이 4단 라싱 구역'
  );
  const [customRiskNote, setCustomRiskNote] = useState<string>(
    '현장 풍속계 측정 순간최대풍속 16.5m/s 도달 및 3번 크레인 와이어 이상 진동 감지됨.'
  );

  // 섹션 B 상태: 산재 119 증거채증 및 신청서 작성기
  const [accidentBerth, setAccidentBerth] = useState<string>('신항 3부두(HJNC) 4A 선석');
  const [selectedInjuryParts, setSelectedInjuryParts] = useState<string[]>([
    '어깨/회전근개 파열',
    '요추(허리) 염좌 및 추간판 탈출',
  ]);
  const [accidentPreset, setAccidentPreset] = useState<string>(
    '본선 4단 컨테이너 라싱(고박) 작업 중 돌풍(15.8m/s)으로 턴버클이 탈락하며 좌측 어깨 및 쇄골을 강타하여 골절 및 회전근개 파열 발생.'
  );
  const [accidentDateTime] = useState<string>('2026-10-21 14:15');

  // 섹션 C 상태: 단협 독소조항 AI 스캐너
  const [cbaInputText, setCbaInputText] = useState<string>(
    '터미널 물동량 변동 및 피크시간대에 따라 운영사는 노조와 사전 협의 없이 하역 인력을 외부 용역업체 인력으로 대체할 수 있다.'
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    riskLevel: '심각 (Critical)' | '경고 (Caution)' | '안전 (Pass)';
    violatedLaw: string;
    analysis: string;
    defenseClause: string;
  } | null>({
    riskLevel: '심각 (Critical)',
    violatedLaw: '직업안정법 제33조(근로자공급사업 허가권) 및 노동조합법 제33조 위반',
    analysis:
      '사측의 본 문구는 부산항운노조의 법정 노무공급 독점권을 침해하고 위험의 외주화를 조장하는 위헌·위법한 전형적 독소조항입니다. 법원 판례 및 노동부 유권해석상 강행규정 위반으로 무효이나, 현장 노사갈등을 촉발하므로 즉각 삭제하고 노조 합의(Concurrence) 조항으로 대체해야 합니다.',
    defenseClause:
      '회사는 항만 하역 및 라싱 작업 인력의 일체 외주 용역화를 엄격히 금지하며, 인력 수급 변동 시 직업안정법 제33조에 의거하여 노동조합과 사전에 서면으로 동의·합의(Concurrence)하여 배차를 편성한다.',
  });

  // 토스트 & 모달 상태
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEmergencyCallModalOpen, setIsEmergencyCallModalOpen] = useState<boolean>(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      triggerToast(`✓ [${label}] 클립보드에 복사되었습니다! 현장 단톡방이나 사측 안전실에 전달하세요.`);
    } catch {
      triggerToast('클립보드 복사에 실패했습니다.');
    }
  };

  // 체크박스 토글
  const toggleRiskId = (id: string) => {
    setSelectedRiskIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleInjuryPart = (part: string) => {
    setSelectedInjuryParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  // 단협 독소조항 AI 스캔 시뮬레이션
  const handleScanCba = () => {
    if (!cbaInputText.trim()) {
      triggerToast('진단할 단체협약 또는 계약서 문구를 입력하세요.');
      return;
    }
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (cbaInputText.includes('외주') || cbaInputText.includes('용역') || cbaInputText.includes('대체')) {
        setScanResult({
          riskLevel: '심각 (Critical)',
          violatedLaw: '직업안정법 제33조 및 노조법 제33조(단체협약의 규범적 효력)',
          analysis:
            '노무공급사업권을 무력화하는 외주화 조항입니다. 강행법규 위반으로 즉시 삭제 대상입니다.',
          defenseClause:
            '회사는 항만 하역 작업의 일체 외주 용역화를 금지하며, 인력 배차는 직업안정법 제33조에 따라 노동조합의 공급 인력으로 전원 충원한다.',
        });
      } else if (cbaInputText.includes('작업중지') || cbaInputText.includes('배상') || cbaInputText.includes('승인')) {
        setScanResult({
          riskLevel: '심각 (Critical)',
          violatedLaw: '산업안전보건법 제52조 제4항(불리한 처우 금지 강행규정)',
          analysis:
            '작업중지권에 사측 승인 요건을 달거나 손해배상 책임을 지우는 것은 산안법 위반이며 형사처벌 대상입니다.',
          defenseClause:
            '조합원은 급박한 위험 시 즉시 작업을 중지하고 대피하며, 회사는 작업중지를 이유로 어떠한 불이익 처우나 손해배상 청구를 할 수 없다.',
        });
      } else if (cbaInputText.includes('자동화') || cbaInputText.includes('감원') || cbaInputText.includes('경영')) {
        setScanResult({
          riskLevel: '경고 (Caution)',
          violatedLaw: '단체협약 제12조(고용안정) 및 노사공동협약',
          analysis:
            '자동화 도입 시 일방적 경영재량권을 부여하는 문구로, 100% 총고용 승계 및 노사 공동위원회 의결 요건으로 수정해야 합니다.',
          defenseClause:
            '스마트 자동화 장비 도입 시 감원 없는 100% 고용 승계를 원칙으로 하며, 노사 동수 직무전환재교육위원회의 합의를 거쳐 전환 배치한다.',
        });
      } else {
        setScanResult({
          riskLevel: '경고 (Caution)',
          violatedLaw: '근로기준법 및 항만하역 표준단체협약',
          analysis:
            '문구 내 노조와의 사전 협의(Consultation) 요건이 모호하여 사측의 자의적 해석 여지가 큽니다. 반드시 사전 서면 합의(Concurrence)로 명확화해야 합니다.',
          defenseClause:
            '해당 조항에 관한 모든 사항은 사전에 노동조합과 서면으로 합의(Concurrence)한 후 시행한다.',
        });
      }
      triggerToast('AI 정밀 법률 스캔 완료: 독소조항 진단 및 표준 대안 문구가 도출되었습니다.');
    }, 800);
  };

  // 작업중지 선언문 텍스트 생성
  const stopWorkDeclarationDoc = useMemo(() => {
    const selectedRisksText = selectedRiskIds
      .map((id) => {
        const item = RISK_FACTOR_OPTIONS.find((r) => r.id === id);
        return item ? `  - ${item.label} (${item.legalBasis})` : '';
      })
      .filter(Boolean)
      .join('\n');

    return `[산업안전보건법 제52조에 의거한 긴급 작업중지 선언 및 불이익 처우 금지 통보서]

수신: 해당 터미널 운영사 대표이사 및 현장 안전보건총괄책임자
발신: 부산항운노동조합 현장 안전대책위원회 (발동 책임자: ${activeRole.title} ${activeRole.holderName})
일시: ${new Date().toISOString().replace('T', ' ').substring(0, 16)}
위치: ${stopWorkLocation}

■ 작업중지권 발동 법적 근거
1. 산업안전보건법 제52조(근로자의 작업중지) 제1항:
   "근로자는 산업재해가 발생할 급박한 위험이 있는 경우에는 작업을 중지하고 대피할 수 있다."
2. 산업안전보건법 제52조 제4항 및 제169조(벌칙):
   "사업주는 산업재해가 발생할 급박한 위험이 있다고 믿을 만한 합리적인 이유가 있을 때에는 작업을 중지하고 대피한 근로자에게 해고나 그 밖의 불리한 처우를 해서는 아니 된다." (위반 시 1년 이하의 징역 또는 1천만원 이하의 벌금)
3. 단체협약 제48조(안전작업 및 작업중지권):
   작업중지권 행사에 따른 일체의 임금 삭감, 징계, 지체상금 손해배상 청구는 원천 무효임.

■ 확인된 현장 급박 위험 사유:
${selectedRisksText || '  - 현장 위험요인 정밀 안전진단 필요'}
  - 현장 특이사항: ${customRiskNote}

■ 노동조합 요구사항:
1. 해당 선석 및 크레인 하역작업의 즉각적인 전면 중지 및 조원 전원 안전지대 대피.
2. 터미널 안전관리자 및 노조 현장안전위원 합동 안전점검 완료 시까지 작업 재개 일체 불허.
3. 작업중지를 이유로 한 조합원에 대한 어떠한 불이익 처우도 형사 고소·고발 대상임을 엄중 경고함.

2026년 ${new Date().getMonth() + 1}월 ${new Date().getDate()}일
부산항운노동조합 법률고문실 상임변호사 정태영 / 현장대책위 일동`;
  }, [selectedRiskIds, stopWorkLocation, customRiskNote, activeRole]);

  // 산재 119 신청 요약서 텍스트 생성
  const industrialAccidentReportDoc = useMemo(() => {
    return `[근로복지공단 산업재해보상보험 요양급여·휴업급여 신청 요약서]

1. 신청인 및 사업장 정보
 - 재해자: ${activeRole.holderName} (정조합원 #30412 / 항만하역 라싱공)
 - 소속 사업장: 부산항운노동조합 (근로자공급사업 사업장기호: 901-82-XXXXX)
 - 고용형태: 상용 근로자공급사업 정조합원 (산재보험 100% 의무가입 대상)

2. 사고 발생 경위
 - 재해 일시: ${accidentDateTime}
 - 재해 장소: ${accidentBerth}
 - 부상 부위: ${selectedInjuryParts.join(', ')}
 - 사고 경위 요약:
   ${accidentPreset}

3. 청구 급여 내역
 - 요양급여: 지정 산재의료기관 응급수술비, 입원비, MRI/CT 검사비 전액 (100% 공단 부담)
 - 휴업급여: 요양으로 취업하지 못한 기간에 대해 평균임금의 70% 일일 정산 지급 청구 (일 약 184,000원 상당)

4. 현장 채증 증거 목록 (노조 법률고문실 보전 완료)
 ① 사고 현장 GPS/시간 워터마크 스마트폰 사진 3매
 ② 동료 작업반원 2인 목격자 진술서 (반장 박성민, 조원 김태훈 서명)
 ③ 터미널 운영사 안벽 CCTV 영상 보전 긴급 신청서 발송 접수증

신청 대리: 부산항운노동조합 법률고문실 정태영 수석 변호사·공인노무사 (직통 051-463-XXXX)`;
  }, [activeRole, accidentDateTime, accidentBerth, selectedInjuryParts, accidentPreset]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-red-500 animate-bounce">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-sm font-semibold leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Emergency Call Modal */}
      {isEmergencyCallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4 ${
              highContrastDark
                ? 'bg-slate-900 border-red-800 text-slate-100'
                : 'bg-white border-red-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-600 animate-pulse" />
                <h3 className="font-extrabold text-base text-red-600 dark:text-red-400">
                  24시 부두 산재·작업중지 긴급 법률 119 직통 핫라인
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEmergencyCallModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
              <div className="text-xs font-black text-red-700 dark:text-red-400 flex items-center gap-2">
                <Gavel className="w-4 h-4" />
                <span>정태영 수석 변호사·공인노무사 (사법연수원 38기) 직통</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-red-600 dark:text-red-300">
                051-463-XXXX / 010-9876-XXXX
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "망설이지 말고 즉시 대피 후 전화하십시오. 노조 상임 고문변호사단이 병원 후송,
                공단 산재 신청, 사측 형사고발까지 조합원 비용 부담 0원으로 100% 전담합니다."
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>24시간 365일 야간·철야 교대 실시간 통화 대기</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>터미널 운영사 불이익 처우(임금삭감·징계) 시 즉각 형사고소 대리</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>CCTV 증거인멸 방지 가처분 1일 내 법원 접수</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsEmergencyCallModalOpen(false);
                  triggerToast('📞 긴급 법률지원 콜센터로 연결되었습니다.');
                }}
                className="w-full py-3 rounded-xl bg-red-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>지금 통화 연결 (모의 호출)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Banner: Module 07 Title & Scope */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-sm relative overflow-hidden transition-all ${
          highContrastDark
            ? 'bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 border-red-900 text-slate-100'
            : 'bg-gradient-to-br from-[#0C1E4A] via-red-950 to-slate-900 border-red-800 text-white'
        }`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/20 text-red-200 border border-red-400/30">
              <ShieldAlert className="w-3.5 h-3.5 text-red-300 animate-pulse" />
              <span>모듈 07 · 정태영 수석 변호사·공인노무사 법률센터</span>
              <span className="opacity-40">|</span>
              <span>부두 산재 119 & 작업중지권</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              산업안전보건법 제52조 작업중지권 & 부두 산재 119 원스톱 법률구조
            </h1>
            <p className="text-sm sm:text-base text-red-100/90 max-w-3xl leading-relaxed">
              항만 하역 안벽과 본선은 1초의 망설임이 생사를 가릅니다. 근로자는 산안법 제52조에 의해
              즉각 작업을 중단할 권리가 있으며 사측의 불이익 처우는 <strong>1년 이하 징역형</strong> 대상입니다.
              사고 발생 시 1초 증거보전과 공단 산재 서류를 즉시 생성합니다.
            </p>
          </div>

          {/* Hotline Trigger Card */}
          <div
            className={`p-4 rounded-2xl border backdrop-blur-md shrink-0 flex flex-col justify-between ${
              highContrastDark
                ? 'bg-slate-800/80 border-red-700 text-slate-200'
                : 'bg-white/10 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <PhoneCall className="w-4 h-4 text-red-400 animate-bounce" />
              <span className="text-xs font-bold text-red-300">24시 산재 법률 119 핫라인</span>
            </div>
            <div className="text-base font-extrabold font-mono text-white">051-463-XXXX</div>
            <p className="text-[11px] text-red-200/80 mt-1 max-w-[200px]">
              조합원 무료 상담 · 산재 승인 전액 노조 변호사단 지원
            </p>
            <button
              type="button"
              onClick={() => setIsEmergencyCallModalOpen(true)}
              className="mt-3 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>긴급 구조 직통 연결</span>
            </button>
          </div>
        </div>

        {/* 4 Protection Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-red-200">산안법 제52조 발동 기준</div>
            <div className="text-xl font-black mt-1 text-white">풍속 15m/s</div>
            <div className="text-[11px] text-red-300">강풍·라싱파단·가스누출</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-red-200">사측 불이익 처우 처벌</div>
            <div className="text-xl font-black mt-1 text-amber-300">1년 이하 징역</div>
            <div className="text-[11px] text-amber-200">산안법 제169조 형벌</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-red-200">근로복지공단 휴업급여</div>
            <div className="text-xl font-black mt-1 text-emerald-300">평균임금 70%</div>
            <div className="text-[11px] text-emerald-200">치료기간 일일 지급</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-red-200">노조 법률비용 지원</div>
            <div className="text-xl font-black mt-1 text-cyan-300">100% 무료</div>
            <div className="text-[11px] text-cyan-200">선임료·감정료 조합 전액</div>
          </div>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* SECTION A: 산업안전보건법 제52조 작업중지권 1분 발동 & 법적 보호 키트    */}
      {/* ====================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-6 rounded-full bg-red-600 inline-block" />
          <h2
            className={`text-xl sm:text-2xl font-black ${
              highContrastDark ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            섹션 A — 산업안전보건법 제52조 '급박한 위험 시 작업중지권' 1분 발동 & 법적 보호 키트
          </h2>
        </div>
        <p className={`text-xs sm:text-sm ${highContrastDark ? 'text-slate-400' : 'text-slate-600'}`}>
          선석 및 안벽에서 위험 징후 포착 시 1분 만에 법적 효력이 있는 공식 선언문을 사측에 통보하고 조원을 대피시킵니다.
        </p>

        {/* 2-Column: Risk Checkers & Live Declaration Document */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form (5 cols) */}
          <div
            className={`lg:col-span-5 p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 ${
              highContrastDark
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-base">현장 위험 사유 즉시 체크</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-600 font-bold border border-red-500/20">
                산안법 제52조 직동
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {RISK_FACTOR_OPTIONS.map((factor) => {
                const isChecked = selectedRiskIds.includes(factor.id);
                return (
                  <button
                    key={factor.id}
                    type="button"
                    onClick={() => toggleRiskId(factor.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                      isChecked
                        ? highContrastDark
                          ? 'bg-red-950/40 border-red-700 text-red-100'
                          : 'bg-red-50/80 border-red-300 text-red-950 shadow-sm'
                        : highContrastDark
                        ? 'bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'border-slate-400 bg-transparent'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="space-y-1">
                      <div className="font-black text-xs sm:text-sm">{factor.label}</div>
                      <div className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
                        {factor.legalBasis}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {factor.dangerDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Location Input */}
            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  highContrastDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                발동 구역 (부두/선석/작업 위치)
              </label>
              <input
                type="text"
                value={stopWorkLocation}
                onChange={(e) => setStopWorkLocation(e.target.value)}
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500 font-bold ${
                  highContrastDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {/* Note Input */}
            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  highContrastDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                현장 긴급 특이사항
              </label>
              <input
                type="text"
                value={customRiskNote}
                onChange={(e) => setCustomRiskNote(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  highContrastDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {/* Stop Work Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  handleCopyToClipboard(
                    stopWorkDeclarationDoc,
                    '산업안전보건법 제52조 작업중지 선언문'
                  )
                }
                className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>작업중지 선언문 원클릭 복사 (사측 통보용)</span>
              </button>
            </div>
          </div>

          {/* Right Document Display (7 cols) */}
          <div
            className={`lg:col-span-7 p-6 rounded-3xl border shadow-sm space-y-4 ${
              highContrastDark
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-base">법적 효력 통보서 실시간 렌더링</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">형벌 규정 조항 포함</span>
            </div>

            {/* Official Legal Document Box */}
            <div
              className={`p-5 rounded-2xl border font-mono text-xs leading-relaxed whitespace-pre-line max-h-[480px] overflow-y-auto ${
                highContrastDark
                  ? 'bg-slate-950 border-slate-800 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {stopWorkDeclarationDoc}
            </div>

            {/* Safe Evacuation Protocol */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                highContrastDark
                  ? 'bg-red-950/20 border-red-900/50 text-red-200'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-extrabold">안벽 대피 프로토콜 안내:</div>
                <p className="leading-relaxed">
                  ① 조장·반장은 조원 16명을 크레인 반경 50m 밖 안전 대기실로 이동 조치하십시오.{' '}
                  ② 운영사 관리자의 부당한 현장 복귀 지시에는 응하지 마시고, 정태영 변호사 법률센터에
                  즉각 연결하십시오.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* SECTION B: 부두 산재 119 원스톱 증거채증 & 근로복지공단 산재 신청서 자동 작성기 */}
      {/* ====================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-t pt-8 border-slate-200 dark:border-slate-800">
          <span className="w-2.5 h-6 rounded-full bg-blue-600 inline-block" />
          <h2
            className={`text-xl sm:text-2xl font-black ${
              highContrastDark ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            섹션 B — 부두 산재 119 원스톱 증거채증 & 근로복지공단 산재 요양·휴업급여 신청서 자동 작성기
          </h2>
        </div>
        <p className={`text-xs sm:text-sm ${highContrastDark ? 'text-slate-400' : 'text-slate-600'}`}>
          안벽·본선 사고 즉시 ① 현장 증거보전(사진·목격자·CCTV), ② 근로복지공단 산재 신청서, ③ 고문변호사 직통 연결을 1초 만에 처리합니다.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Accident Inputs (5 cols) */}
          <div
            className={`lg:col-span-5 p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 ${
              highContrastDark
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-red-500" />
                <h3 className="font-extrabold text-base">재해 사실 및 부상 부위 입력</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold border border-blue-500/20">
                평균임금 70% 보장
              </span>
            </div>

            {/* Berth selector */}
            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  highContrastDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                재해 발생 부두/선석
              </label>
              <select
                value={accidentBerth}
                onChange={(e) => setAccidentBerth(e.target.value)}
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold ${
                  highContrastDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="신항 3부두(HJNC) 4A 선석">신항 3부두(HJNC) 4A 선석 (한진)</option>
                <option value="신항 2부두(PNC) 2B 선석">신항 2부두(PNC) 2B 선석 (부산신항만)</option>
                <option value="신항 4부두(HPNT) 1A 선석">신항 4부두(HPNT) 1A 선석 (HMM)</option>
                <option value="신항 5부두(BNCT) 3C 선석">신항 5부두(BNCT) 3C 선석 (고려)</option>
                <option value="북항 신선대부두 2번 선석">북항 신선대부두 2번 선석 (BPT)</option>
                <option value="감천항 중앙냉동창고 3층">감천항 중앙냉동창고 3층 해빙구역</option>
              </select>
            </div>

            {/* Injury Parts Selector */}
            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  highContrastDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                부상 부위 (복수 선택)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  '어깨/회전근개 파열',
                  '요추(허리) 염좌 및 추간판 탈출',
                  '두부(머리)/경추 염좌',
                  '무릎 십자인대/반월상 파열',
                  '수지(손가락) 협착/골절',
                  '족부(발목) 인대/골절',
                ].map((part) => {
                  const isSel = selectedInjuryParts.includes(part);
                  return (
                    <button
                      key={part}
                      type="button"
                      onClick={() => toggleInjuryPart(part)}
                      className={`p-2 rounded-xl text-xs font-bold text-left border transition-all ${
                        isSel
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : highContrastDark
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSel ? '✓ ' : '+ '}
                      {part}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accident Description Textarea */}
            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  highContrastDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                사고 발생 경위 (육하원칙)
              </label>
              <textarea
                rows={4}
                value={accidentPreset}
                onChange={(e) => setAccidentPreset(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed ${
                  highContrastDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {/* Action: Copy Workers Comp Form */}
            <button
              type="button"
              onClick={() =>
                handleCopyToClipboard(
                  industrialAccidentReportDoc,
                  '근로복지공단 산재 요양·휴업급여 신청 요약서'
                )
              }
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Copy className="w-4 h-4" />
              <span>근로복지공단 전자제출용 요약서 복사</span>
            </button>
          </div>

          {/* Right: 3 Evidence Preservations & Application Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Evidence Checklist Box */}
            <div
              className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
                highContrastDark
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-extrabold text-sm sm:text-base">
                    현장 3대 증거보전 키트 (골든타임 1시간 채증)
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-500 font-bold">노조 법률팀 직통</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    highContrastDark
                      ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                      : 'bg-blue-50/60 border-blue-200 text-blue-950'
                  }`}
                >
                  <div className="font-extrabold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <Smartphone className="w-4 h-4" />
                    <span>① GPS 사진 채증</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    안벽 번호판, 파손 라싱바/와이어, 혈흔 및 낙하물 사진 3장 워터마크 보전
                  </p>
                  <div className="text-[10px] text-emerald-600 font-bold">✓ 앱 연동 완료</div>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    highContrastDark
                      ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                      : 'bg-blue-50/60 border-blue-200 text-blue-950'
                  }`}
                >
                  <div className="font-extrabold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <Users className="w-4 h-4" />
                    <span>② 목격자 진술서</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    같은 반 동료 2인(박성민 반장, 김태훈 조원) 목격 경위 표준 서식 작성
                  </p>
                  <div className="text-[10px] text-emerald-600 font-bold">✓ 서명 확인 필</div>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    highContrastDark
                      ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                      : 'bg-blue-50/60 border-blue-200 text-blue-950'
                  }`}
                >
                  <div className="font-extrabold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <FileSearch className="w-4 h-4" />
                    <span>③ CCTV 보전 요청</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    터미널 운영사에 사고 전후 1시간 안벽·야드 CCTV 영상 보전 긴급 신청서 발송
                  </p>
                  <div className="text-[10px] text-emerald-600 font-bold">✓ 증거인멸 차단</div>
                </div>
              </div>
            </div>

            {/* Generated Industrial Accident Report Document */}
            <div
              className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
                highContrastDark
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  근로복지공단 산재 신청서 실시간 미리보기
                </span>
                <span className="text-xs font-mono text-emerald-500 font-bold">
                  상임변호사 정태영 직인 날인 필
                </span>
              </div>
              <div
                className={`p-4 rounded-2xl border font-mono text-xs leading-relaxed whitespace-pre-line max-h-[220px] overflow-y-auto ${
                  highContrastDark
                    ? 'bg-slate-950 border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                {industrialAccidentReportDoc}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* SECTION C: 4대 노동·항만관계법 준법 가드레일 & 단체협약(CBA) 독소조항 AI 스캐너 */}
      {/* ====================================================================== */}
      <section className="space-y-6">
        <div className="border-t pt-8 border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-purple-600 inline-block" />
            <h2
              className={`text-xl sm:text-2xl font-black ${
                highContrastDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              섹션 C — 4대 노동·항만관계법 준법 가드레일 & 단체협약(CBA) 독소조항 AI 스캐너
            </h2>
          </div>
          <p className={`text-xs sm:text-sm ${highContrastDark ? 'text-slate-400' : 'text-slate-600'}`}>
            직업안정법 제33조·노조법·근로기준법·중대재해처벌법의 4대 법률 준수 상태를 실시간 검증하고,
            사측이 제시한 협약안의 외주화·노무공급권 침해 독소조항을 AI 법리로 즉시 판정합니다.
          </p>
        </div>

        {/* Part 1: Compliance Guardrails Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceItems.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all shadow-sm space-y-3 ${
                highContrastDark
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {item.id}
                    </span>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                      {item.lawName}
                    </span>
                  </div>
                  <div className="text-sm font-black text-blue-600 dark:text-blue-400">
                    {item.article}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shrink-0 ${
                    item.status === '준수 완료 (Pass)'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.status}</span>
                </span>
              </div>

              <div className="font-extrabold text-sm leading-snug">{item.checkTitle}</div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.detail}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>정태영 변호사 법률감사 로그</span>
                <span>무결성 SHA-256 검증 완료</span>
              </div>
            </div>
          ))}
        </div>

        {/* Part 2: Collective Bargaining Agreement (CBA) Toxic Clause AI Scanner */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 ${
            highContrastDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-black">단체협약(CBA) 독소조항 AI 스캐너</h3>
                <p className="text-xs text-slate-500">
                  사측 제시 조항 입력 시 외주화·노무공급권 침해 여부를 0.5초 만에 법리 진단하고 노조 표준 대안 문구를 제시합니다.
                </p>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 font-bold">샘플 독소조항:</span>
              <button
                type="button"
                onClick={() =>
                  setCbaInputText(
                    '터미널 물동량 변동 및 피크시간대에 따라 운영사는 노조와 사전 협의 없이 하역 인력을 외부 용역업체 인력으로 대체할 수 있다.'
                  )
                }
                className="px-2.5 py-1 rounded-lg text-xs font-bold border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20"
              >
                외주화 독소조항
              </button>
              <button
                type="button"
                onClick={() =>
                  setCbaInputText(
                    '작업중지권 행사는 현장 감독관의 사전 승인을 득한 후 시행하며, 오발동으로 인한 선박 지연 손실은 조합원이 배상한다.'
                  )
                }
                className="px-2.5 py-1 rounded-lg text-xs font-bold border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-500/20"
              >
                작업중지 책임전가
              </button>
              <button
                type="button"
                onClick={() =>
                  setCbaInputText(
                    '무인 원격제어 안벽 크레인 및 자동이송차량(AGV) 도입에 따른 잉여 하역 인력 감원은 운영사의 고유 경영재량권에 속한다.'
                  )
                }
                className="px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300 hover:bg-blue-500/20"
              >
                스마트 자동화 일방 감원
              </button>
            </div>
          </div>

          {/* Scanner Input & Action */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              사측 제시 계약서 / 단체협약안 원문 입력
            </label>
            <textarea
              rows={3}
              value={cbaInputText}
              onChange={(e) => setCbaInputText(e.target.value)}
              placeholder="사측이 제시한 조항 문구를 그대로 복사해 넣으세요."
              className={`w-full px-4 py-3 text-sm rounded-2xl border focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed font-sans ${
                highContrastDark
                  ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleScanCba}
                disabled={isScanning}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
              >
                <Sparkles className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'AI 정밀 법리 분석중...' : 'AI 독소조항 정밀 법률진단 실행'}</span>
              </button>
            </div>
          </div>

          {/* Diagnosis Result Card */}
          {scanResult && (
            <div
              className={`p-6 rounded-3xl border shadow-sm space-y-4 animate-scale-in ${
                highContrastDark
                  ? 'bg-slate-950/80 border-purple-900/60 text-slate-100'
                  : 'bg-purple-50/50 border-purple-200 text-slate-900'
              }`}
            >
              {/* Result Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      scanResult.riskLevel.includes('심각')
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    위험도: {scanResult.riskLevel}
                  </span>
                  <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300">
                    {scanResult.violatedLaw}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  판정관: 정태영 수석 변호사·공인노무사
                </span>
              </div>

              {/* Analysis Explanation */}
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-slate-600 dark:text-slate-400">
                  법리 진단 및 무효 판정 근거:
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {scanResult.analysis}
                </p>
              </div>

              {/* Counter Defense Clause (Standard Union Clause) */}
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  highContrastDark
                    ? 'bg-slate-900 border-emerald-800/60 text-slate-100'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>노조 표준 방어 대안 문구 (Union Counter-Clause)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyToClipboard(scanResult.defenseClause, '노조 표준 방어 대안 문구')
                    }
                    className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Copy className="w-3 h-3" />
                    <span>대안 문구 복사</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  "{scanResult.defenseClause}"
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
