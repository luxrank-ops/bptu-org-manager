import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Receipt,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Percent,
  Sliders,
  Share2,
  Copy,
  Check,
  Plus,
  Award,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Printer,
  X,
  CreditCard,
  Building,
  Flame,
  HelpCircle,
  Vote,
  Sparkles,
  Camera,
  CheckCheck,
  Layers,
  ArrowUpRight,
  Landmark,
  BadgeAlert,
  BarChart3,
  Calendar,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import {
  WelfareApplicationItem,
  RoleTierProfile,
  TerminalPolicyFactRow,
} from '../data/bptuStore';

// ============================================================================
// MODULE 04: Toss 스타일 1초 모바일 급여명세서·노임 시뮬레이터 & 4단계 복지 라운지
// Lead: 김나연 핀테크·복지 수석 (welfare-payroll-fintech)
// ============================================================================

export interface Module4PayrollWelfareViewProps {
  activeRole: RoleTierProfile;
  welfareList: WelfareApplicationItem[];
  highContrastDark: boolean;
  onAdvanceWelfareStage: (id: string) => void;
  onCreateWelfareApp: (item: WelfareApplicationItem) => void;
}

export function Module4PayrollWelfareView({
  activeRole,
  welfareList,
  highContrastDark,
  onAdvanceWelfareStage,
  onCreateWelfareApp,
}: Module4PayrollWelfareViewProps) {
  // --------------------------------------------------------------------------
  // Section A: Toss 스타일 노임 계산기 상태
  // --------------------------------------------------------------------------
  const [vanCount, setVanCount] = useState<number>(340);
  const [shiftType, setShiftType] = useState<'DAY' | 'NIGHT' | 'HOLIDAY'>('DAY');
  const [allowanceLashing, setAllowanceLashing] = useState<boolean>(true); // 4단 라싱 위험수당
  const [allowanceImdg, setAllowanceImdg] = useState<boolean>(false); // 위험물 IMDG 할증
  const [allowanceCold, setAllowanceCold] = useState<boolean>(false); // 냉동창고 -20℃ 수당
  const [workingDays, setWorkingDays] = useState<number>(22); // 이번 달 근무 일수
  const [showTaxReceiptModal, setShowTaxReceiptModal] = useState<boolean>(false);
  const [receiptCopied, setReceiptCopied] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // Section B: 복지 신청 폼 & 모달 상태
  // --------------------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<
    | '경조사 지원금 (출산축하)'
    | '자녀 대학 학자금'
    | '항운신협 생활안정 저리대부'
    | '해운대 노조휴양소 예약'
  >('경조사 지원금 (출산축하)');
  const [welfareDetailInput, setWelfareDetailInput] = useState<string>('');
  const [ocrAttached, setOcrAttached] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [justSubmittedBanner, setJustSubmittedBanner] = useState<string | null>(null);
  const [welfareFilter, setWelfareFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [viewFirmBankingReceipt, setViewFirmBankingReceipt] = useState<WelfareApplicationItem | null>(null);

  // --------------------------------------------------------------------------
  // 노임 정산 계산식 (부산항운노조 단협 표준 하역 노임 엔진)
  // --------------------------------------------------------------------------
  const calculations = useMemo(() => {
    // 1) 기본급 (주간 8시간 기준 165,000원)
    const baseDailyRate = 165000;

    // 2) 컨테이너 하역 생산 물량 인센티브 (VAN당 조합원 1인 배분액 약 450원)
    const vanRate = 450;
    const productionPay = vanCount * vanRate;

    // 3) 교대근무 배율 (주간 1.0x, 야간 1.5x 가산, 휴일 1.5x 가산)
    const shiftMultiplier = shiftType === 'DAY' ? 1.0 : 1.5;
    const shiftBonus = shiftType === 'DAY' ? 0 : Math.round(baseDailyRate * 0.5);

    // 4) 특수 작업 위험 수당
    const lashingPay = allowanceLashing ? 48000 : 0; // 4단 라싱 위험수당
    const imdgPay = allowanceImdg ? 36000 : 0; // 위험물(IMDG) 특수작업 할증
    const coldPay = allowanceCold ? 32000 : 0; // -20℃ 리퍼 냉동창고 수당
    const totalAllowances = lashingPay + imdgPay + coldPay;

    // 오늘 하루 총 예상 일당 (세전)
    const todayGrossDaily = Math.round(
      (baseDailyRate + productionPay) * (shiftType === 'DAY' ? 1.0 : 1.25) +
        shiftBonus +
        totalAllowances
    );

    // 이번 달 누적 세전 예상 급여 (22일 기준 실적 추산)
    const monthlyGross = Math.round(todayGrossDaily * workingDays);

    // 공제 항목 (4대 보험 + 근로소득세 + 조합비 1.5%)
    const nationalPension = Math.min(Math.round(monthlyGross * 0.045), 265500); // 국민연금 4.5% (상한액 반영)
    const healthInsurance = Math.round(monthlyGross * 0.03545); // 건강보험 3.545%
    const longTermCare = Math.round(healthInsurance * 0.1295); // 장기요양보험 (건보의 12.95%)
    const employmentInsurance = Math.round(monthlyGross * 0.009); // 고용보험 0.9%
    const incomeTax = Math.round(monthlyGross * 0.048); // 근로소득세 및 지방소득세 간이세액 추산 약 4.8%

    // 부산항운노동조합 규약 제34조 정액/정률 1.5% 투명 공제
    const unionFee = Math.round(monthlyGross * 0.015);

    // 총 공제 합계
    const totalDeductions =
      nationalPension +
      healthInsurance +
      longTermCare +
      employmentInsurance +
      incomeTax +
      unionFee;

    // 최종 통장 실수령액 (Net Pay)
    const monthlyNetTakeHome = monthlyGross - totalDeductions;

    return {
      baseDailyRate,
      productionPay,
      shiftMultiplier,
      shiftBonus,
      totalAllowances,
      todayGrossDaily,
      monthlyGross,
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      incomeTax,
      unionFee,
      totalDeductions,
      monthlyNetTakeHome,
    };
  }, [vanCount, shiftType, allowanceLashing, allowanceImdg, allowanceCold, workingDays]);

  // 복지 카테고리별 기본 안내 문구
  const categoryDefaultDetails: Record<string, string> = {
    '경조사 지원금 (출산축하)': '1,000,000원 + 노조 프리미엄 출산 축하 선물세트 (출생증명서 제출)',
    '자녀 대학 학자금': '2,500,000원 (2026학년도 2학기 본인부담 등록금 실비 지원)',
    '항운신협 생활안정 저리대부': '15,000,000원 (조합원 특별 우대금리 연 2.5% · 3년 거치 원리금분할)',
    '해운대 노조휴양소 예약': '해운대 노조연수원 2박 3일 (2026-11-14 ~ 11-16, 조합원 무료 이용)',
  };

  // 원탭 복지 신청 접수 핸들러
  const handleWelfareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `WLF-2026-${Math.floor(200 + Math.random() * 800)}`;
      const finalDetail =
        welfareDetailInput.trim() ||
        categoryDefaultDetails[selectedCategory] ||
        '신청 상세 내용 접수 완료';

      const newApp: WelfareApplicationItem = {
        id: generatedId,
        applicantName: activeRole.holderName.replace(/\s*\(.*\)/, '').trim() || '조합원',
        memberNo: 'BPTU-30412',
        branchName: activeRole.orgUnitName.split(' ')[0] || '제3항업지부 (HJNC)',
        category: selectedCategory,
        amountOrDetail: ocrAttached
          ? `${finalDetail} [📸 스마트 영수증 OCR 자동검증 완료]`
          : finalDetail,
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        stage: 1,
        stageLabel: '1단계: 현장 조/반장 실물 출역 및 증빙 확인 진행중',
      };

      onCreateWelfareApp(newApp);
      setIsSubmitting(false);
      setWelfareDetailInput('');
      setOcrAttached(false);
      setJustSubmittedBanner(
        `✅ ${selectedCategory} 신청서가 성공적으로 접수되었습니다. (접수번호: ${generatedId})`
      );
      setTimeout(() => setJustSubmittedBanner(null), 5000);
    }, 400);
  };

  // 필터링된 복지 신청 목록
  const filteredWelfareList = useMemo(() => {
    if (welfareFilter === 'IN_PROGRESS') {
      return welfareList.filter((item) => item.stage < 4);
    }
    if (welfareFilter === 'COMPLETED') {
      return welfareList.filter((item) => item.stage === 4);
    }
    return welfareList;
  }, [welfareList, welfareFilter]);

  return (
    <div className="space-y-8 pb-16">
      {/* -------------------------------------------------------------------- */}
      {/* 모듈 헤더: 김나연 핀테크 수석 페르소나 배너 */}
      {/* -------------------------------------------------------------------- */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          highContrastDark
            ? 'bg-slate-900/95 border-slate-700 text-slate-100 shadow-xl'
            : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border-blue-950 shadow-lg'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center flex-wrap gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                모듈 04 · Toss형 급여·복지 핀테크
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                실시간 펌뱅킹 연동
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                조합비 1.5% 투명원장
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-blue-400" />
              1초 모바일 급여명세서 & 4단계 복지 결재 라운지
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              <strong>김나연 핀테크·복지 수석:</strong> &quot;항만 하역 노동자의 땀방울이 담긴 노임은
              단 1원의 불투명함도 없어야 합니다. 토스(Toss)처럼 1초 만에 확인하는 오늘 내 일당과
              배달앱 스타일 4단계 실시간 복지 결재 추적기를 경험하십시오.&quot;
            </p>
          </div>

          {/* 현재 로그인 계정 노임 관제 요약 배지 */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[240px]">
            <div className="text-xs text-blue-200 flex items-center justify-between font-medium">
              <span>접속 권한 프로필</span>
              <span className="px-2 py-0.5 rounded bg-blue-600/40 text-blue-200 text-[11px] font-bold">
                {activeRole.levelBadge}
              </span>
            </div>
            <div className="mt-2 text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{activeRole.holderName}</span>
            </div>
            <div className="text-xs text-slate-300 truncate mt-0.5">
              {activeRole.orgUnitName}
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300">신협 급여계좌 연동</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                정상 (펌뱅킹)
              </span>
            </div>
          </div>
        </div>
      </div>

      {justSubmittedBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-sm font-bold flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{justSubmittedBanner}</span>
          </div>
          <button
            onClick={() => setJustSubmittedBanner(null)}
            className="text-emerald-600 dark:text-emerald-400 hover:opacity-75 text-xs underline"
          >
            닫기
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 섹션 A: Toss 스타일 1초 모바일 급여명세서 & 하역 물량 노임 계산기 */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500 text-white font-extrabold text-xs">
                섹션 A
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Toss 스타일 1초 급여명세서 & 물량(VAN) 노임 시뮬레이터
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              오늘 선석 하역 물량과 근무 조, 위험수당을 조절하면 실시간으로 예상 일당과 이번 달 순수령액이 산출됩니다.
            </p>
          </div>

          <button
            onClick={() => setShowTaxReceiptModal(true)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all active:scale-95 shadow-sm ${
              highContrastDark
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 hover:shadow'
            }`}
          >
            <Receipt className="w-4 h-4 text-amber-600" />
            <span>[연말정산용 조합비 납부확인서 1초 발급]</span>
          </button>
        </div>

        {/* 2컬럼 레이아웃: 좌측 조절 패널 / 우측 Toss 스타일 대형 카드 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 좌측: 작업 조절 인터랙티브 컨트롤러 (5컬럼) */}
          <div
            className={`lg:col-span-5 p-6 rounded-3xl border space-y-6 transition-all shadow-sm ${
              highContrastDark
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <span className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                하역 공정 및 작업 조건 설정
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                단협 제42조 표준단가 연동
              </span>
            </div>

            {/* 1. 컨테이너 물동량 (VAN) 조절 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>작업반 컨테이너 하역량 (VAN)</span>
                </label>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    {vanCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">VAN</span>
                </div>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min="50"
                max="1000"
                step="10"
                value={vanCount}
                onChange={(e) => setVanCount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              {/* 프리셋 버튼 */}
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {[
                  { label: '200 (소형)', val: 200 },
                  { label: '340 (표준)', val: 340 },
                  { label: '500 (대형)', val: 500 },
                  { label: '800 (피크)', val: 800 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setVanCount(item.val)}
                    className={`py-1.5 px-1 rounded-lg font-semibold text-center border transition-all ${
                      vanCount === item.val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : highContrastDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                * 1 VAN당 성과급 약 450원 (반원 16명 균등 배분식 적용)
              </p>
            </div>

            {/* 2. 작업 구분 (주간 / 야간 / 휴일) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                작업 구분 (근무조 및 할증)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'DAY', label: '주간조', sub: '기본 1.0x', badge: '08:00~17:00' },
                  { id: 'NIGHT', label: '야간조', sub: '1.5배 가산', badge: '17:00~02:00' },
                  { id: 'HOLIDAY', label: '휴일특근', sub: '1.5배 가산', badge: '토·일·공휴일' },
                ].map((s) => {
                  const isSel = shiftType === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShiftType(s.id as 'DAY' | 'NIGHT' | 'HOLIDAY')}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSel
                          ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20'
                          : highContrastDark
                          ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {s.label}
                        </span>
                        {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <div className="mt-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                        {s.sub}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {s.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. 특수 작업 위험 수당 체크박스 */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>특수 수당 체크 (중복 적용 가능)</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  + {calculations.totalAllowances.toLocaleString()}원 합산
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 4단 라싱 */}
                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    allowanceLashing
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-900 dark:text-amber-200'
                      : highContrastDark
                      ? 'bg-slate-800/40 border-slate-700 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={allowanceLashing}
                      onChange={(e) => setAllowanceLashing(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold">4단 라싱 고박 위험수당</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        24,000 TEU 초대형선 안벽 4단 고박 작업
                      </div>
                    </div>
                  </div>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                    +48,000원
                  </span>
                </label>

                {/* 위험물 IMDG */}
                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    allowanceImdg
                      ? 'bg-rose-500/10 border-rose-500/50 text-rose-900 dark:text-rose-200'
                      : highContrastDark
                      ? 'bg-slate-800/40 border-slate-700 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={allowanceImdg}
                      onChange={(e) => setAllowanceImdg(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold">위험물(IMDG) 특수작업 할증</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        인화성·폭발성 화학 컨테이너 하역
                      </div>
                    </div>
                  </div>
                  <span className="font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
                    +36,000원
                  </span>
                </label>

                {/* 냉동창고 */}
                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    allowanceCold
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-900 dark:text-cyan-200'
                      : highContrastDark
                      ? 'bg-slate-800/40 border-slate-700 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={allowanceCold}
                      onChange={(e) => setAllowanceCold(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold">냉동창고 -20℃ 혹한수당</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        리퍼(Reefer) 컨테이너 모니터링 및 결빙작업
                      </div>
                    </div>
                  </div>
                  <span className="font-extrabold text-cyan-600 dark:text-cyan-400 tabular-nums">
                    +32,000원
                  </span>
                </label>
              </div>
            </div>

            {/* 당월 근무일수 조절 */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                이번 달 예상 출역일수
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWorkingDays((prev) => Math.max(10, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold hover:bg-slate-300 flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 w-8 text-center tabular-nums">
                  {workingDays}일
                </span>
                <button
                  type="button"
                  onClick={() => setWorkingDays((prev) => Math.min(28, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold hover:bg-slate-300 flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 우측: Toss 스타일 1초 급여명세서 카드 (7컬럼) */}
          <div className="lg:col-span-7 space-y-4">
            {/* 메인 Toss 카드: 오늘 일당 & 이번 달 실수령액 */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
                highContrastDark
                  ? 'bg-slate-900 border-slate-700 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* 상단 장식 그라디언트 링 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

              {/* Toss 스타일 카드 헤더 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Toss Paystyle 1초 급여명세서
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {activeRole.holderName} 님의 실시간 노임 정산서
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  당일 정산
                </span>
              </div>

              {/* 오늘 하루 예상 일당 (대형 폰트) */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-900/60">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">오늘 하루 예상 일당 (세전)</span>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {vanCount} VAN · {shiftType === 'DAY' ? '주간' : shiftType === 'NIGHT' ? '야간' : '휴일'}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-blue-600 dark:text-blue-400 tabular-nums">
                    {calculations.todayGrossDaily.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-300">원</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-2">
                  <span>기본급 {calculations.baseDailyRate.toLocaleString()}원</span>
                  <span>+ 물량급 {calculations.productionPay.toLocaleString()}원</span>
                  {calculations.shiftBonus > 0 && <span>+ 교대할증 {calculations.shiftBonus.toLocaleString()}원</span>}
                  {calculations.totalAllowances > 0 && (
                    <span>+ 수당 {calculations.totalAllowances.toLocaleString()}원</span>
                  )}
                </div>
              </div>

              {/* 이번 달 예상 실수령액 하이라이트 (가장 중요한 Toss 대형 금액) */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    이번 달 예상 실수령액 ({workingDays}일 출역 기준)
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    매월 25일 자동 입금
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                    {calculations.monthlyNetTakeHome.toLocaleString()}
                  </span>
                  <span className="text-xl font-extrabold text-slate-700 dark:text-slate-300">원</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  세전 총급여 {calculations.monthlyGross.toLocaleString()}원에서 법정 4대보험 및 조합비 1.5%를 투명 공제한 최종 입금액입니다.
                </p>
              </div>

              {/* 투명 공제 내역 상세 (토스형 아코디언 스타일) */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>투명 공제 원장 세부명세</span>
                  <span className="text-rose-600 dark:text-rose-400 tabular-nums font-bold">
                    - {calculations.totalDeductions.toLocaleString()}원
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">국민연금 (4.5%)</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 tabular-nums mt-0.5">
                      {calculations.nationalPension.toLocaleString()}원
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">건강+장기요양</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 tabular-nums mt-0.5">
                      {(calculations.healthInsurance + calculations.longTermCare).toLocaleString()}원
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">고용보험 (0.9%)</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 tabular-nums mt-0.5">
                      {calculations.employmentInsurance.toLocaleString()}원
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">소득세+지방세</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 tabular-nums mt-0.5">
                      {calculations.incomeTax.toLocaleString()}원
                    </div>
                  </div>

                  {/* 조합비 1.5% 하이라이트 박스 */}
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-700 col-span-2 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        노동조합비 (정관 제34조 1.5% 정률)
                      </span>
                      <span className="text-xs font-black text-blue-700 dark:text-blue-300 tabular-nums">
                        {calculations.unionFee.toLocaleString()}원
                      </span>
                    </div>
                    <div className="text-[10px] text-blue-600/80 dark:text-blue-400/80 mt-0.5">
                      전액 복지·공제기금 및 산재 119 구호기금 투명 분개 (연말정산 100% 소득공제)
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 안심 메시지 */}
              <div className="mt-5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>항운신협 펌뱅킹 지급보증 인증완료</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  부산항운노동조합 중앙회계
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 섹션 B: 노조 공제회·신협·경조사·장학금 원탭 신청 & 배달앱형 4단계 결재 트래커 */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-xs">
              섹션 B
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              노조 공제회·신협·경조사 원탭 신청 & 4단계 결재 트래커
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            증빙 사진 1장으로 1초 접수하고, 배달앱처럼 &lsquo;현장확인 → 지부검토 → 본부승인 → 펌뱅킹 즉시입금&rsquo; 전 과정을 실시간 추적합니다.
          </p>
        </div>

        {/* 1. 신규 복지 원탭 간편 신청 폼 */}
        <div
          className={`p-6 sm:p-7 rounded-3xl border shadow-sm space-y-5 transition-all ${
            highContrastDark
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
            <span className="text-sm font-bold flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              신규 복지 지원금 & 신협 대부 원탭 접수
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              신청자: {activeRole.holderName} (정조합원 #30412)
            </span>
          </div>

          <form onSubmit={handleWelfareSubmit} className="space-y-5">
            {/* 4대 주요 복지 카테고리 탭 선택기 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {[
                {
                  id: '경조사 지원금 (출산축하)',
                  label: '경조사 지원금',
                  desc: '출산·결혼 100만원',
                  icon: Sparkles,
                },
                {
                  id: '자녀 대학 학자금',
                  label: '자녀 대학 학자금',
                  desc: '학기당 최대 250만원',
                  icon: Award,
                },
                {
                  id: '항운신협 생활안정 저리대부',
                  label: '항운신협 저리대부',
                  desc: '우대금리 연 2.5%',
                  icon: Landmark,
                },
                {
                  id: '해운대 노조휴양소 예약',
                  label: '노조휴양소 예약',
                  desc: '해운대 연수원 2박3일',
                  icon: Building,
                },
              ].map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id as typeof selectedCategory);
                      setWelfareDetailInput(categoryDefaultDetails[cat.id]);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-500/20'
                        : highContrastDark
                        ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <IconComponent
                        className={`w-4 h-4 ${
                          isSelected ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="mt-2 font-bold text-xs text-slate-900 dark:text-white truncate">
                      {cat.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {cat.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 신청 상세 내용 입력 및 OCR 증빙 첨부 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  신청 사유 및 세부 요청 내역
                </label>
                <input
                  type="text"
                  value={welfareDetailInput}
                  onChange={(e) => setWelfareDetailInput(e.target.value)}
                  placeholder={categoryDefaultDetails[selectedCategory]}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                    highContrastDark
                      ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                  }`}
                />
              </div>

              {/* 모바일 카메라 1초 OCR 첨부 버튼 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  증빙서류 (카메라 OCR)
                </label>
                <button
                  type="button"
                  onClick={() => setOcrAttached(!ocrAttached)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    ocrAttached
                      ? 'bg-blue-600 text-white border-blue-600'
                      : highContrastDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>
                    {ocrAttached ? '✅ 영수증 OCR 인식완료' : '증빙서류 1초 카메라 촬영'}
                  </span>
                </button>
              </div>
            </div>

            {ocrAttached && (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2 animate-fade-in">
                <CheckCheck className="w-4 h-4 shrink-0 text-blue-600" />
                <span>
                  <strong>스마트 OCR 자동인식:</strong> 제출 서류(등록금 영수증/출생증명서)의 진위 여부 및 날인 확인이 100% 완료되었습니다.
                </span>
              </div>
            )}

            {/* 신청 버튼 */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>1초 접수 처리중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>[1탭 복지신청 즉시 접수]</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 2. 배달앱 스타일 4단계 실시간 전자결재 트래커 목록 */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                배달앱형 4단계 실시간 결재 트래커
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                총 {welfareList.length}건
              </span>
            </div>

            {/* 필터 탭 */}
            <div className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setWelfareFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  welfareFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                전체 ({welfareList.length})
              </button>
              <button
                onClick={() => setWelfareFilter('IN_PROGRESS')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  welfareFilter === 'IN_PROGRESS'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                진행중 ({welfareList.filter((w) => w.stage < 4).length})
              </button>
              <button
                onClick={() => setWelfareFilter('COMPLETED')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  welfareFilter === 'COMPLETED'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                입금완료 ({welfareList.filter((w) => w.stage === 4).length})
              </button>
            </div>
          </div>

          {/* 트래커 카드 목록 */}
          <div className="space-y-4">
            {filteredWelfareList.map((item) => {
              const isFinished = item.stage === 4;
              return (
                <div
                  key={item.id}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all shadow-sm space-y-5 ${
                    highContrastDark
                      ? 'bg-slate-900 border-slate-700 text-slate-100'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {/* 상단: 신청 메타정보 & 카테고리 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                        {item.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>신청자: <strong>{item.applicantName}</strong> ({item.memberNo})</span>
                      <span>·</span>
                      <span>{item.branchName}</span>
                      <span>·</span>
                      <span className="font-mono">{item.submittedAt}</span>
                    </div>
                  </div>

                  {/* 세부 지원 내역 문구 */}
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {item.amountOrDetail}
                  </div>

                  {/* 배달앱 스타일 4단계 수평 스텝 바 */}
                  <div className="pt-2">
                    <div className="grid grid-cols-4 gap-2 relative">
                      {[
                        { step: 1, name: '1단계 조장 확인', role: '현장 실물 대조' },
                        { step: 2, name: '2단계 지부 검토', role: '총무 자격 심사' },
                        { step: 3, name: '3단계 본부 승인', role: '복지후생부 최종' },
                        { step: 4, name: '4단계 펌뱅킹', role: '즉시 계좌 입금' },
                      ].map((st) => {
                        const isDone = item.stage >= st.step;
                        const isCurrent = item.stage === st.step;
                        return (
                          <div key={st.step} className="flex flex-col items-center text-center relative z-10">
                            {/* 원형 아이콘 */}
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                                isDone
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 animate-pulse'
                                  : highContrastDark
                                  ? 'bg-slate-800 text-slate-500 border border-slate-700'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200'
                              }`}
                            >
                              {isDone ? (
                                <Check className="w-5 h-5 stroke-[2.5]" />
                              ) : (
                                <span>{st.step}</span>
                              )}
                            </div>

                            {/* 단계 명칭 */}
                            <div
                              className={`mt-2 font-bold text-[11px] sm:text-xs ${
                                isDone
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : isCurrent
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-slate-400 dark:text-slate-600'
                              }`}
                            >
                              {st.name}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
                              {st.role}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 현재 상태 상세 메시지 박스 */}
                    <div
                      className={`mt-4 p-3.5 rounded-2xl text-xs flex items-center justify-between border ${
                        isFinished
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        {isFinished ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                        )}
                        <span>{item.stageLabel}</span>
                      </div>

                      {/* 다음 단계 승인 진행 버튼 (인터랙티브) */}
                      <div>
                        {!isFinished ? (
                          <button
                            type="button"
                            onClick={() => onAdvanceWelfareStage(item.id)}
                            className="px-3 py-1.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
                          >
                            <span>[다음 결재단계 승인 진행]</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setViewFirmBankingReceipt(item)}
                            className="px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 transition-all shadow-sm flex items-center gap-1"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>송금 영수증 조회</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 모달 1: 연말정산용 조합비 납부확인서 1초 발급 모달 */}
      {/* -------------------------------------------------------------------- */}
      {showTaxReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto ${
              highContrastDark
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                <h3 className="text-base sm:text-lg font-extrabold">
                  연말정산용 노동조합비 납부확인서
                </h3>
              </div>
              <button
                onClick={() => setShowTaxReceiptModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 영수증 서식 본문 (국세청 제출 규격 양식) */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-4">
              <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  소득세법 시행규칙 제58조 제1항 제3호
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  노 동 조 합 비 납 부 확 인 서
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  발급번호: BPTU-TAX-2026-98124
                </div>
              </div>

              {/* 조합원 및 납부 정보 표 */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 dark:text-slate-400">조합원 성명:</span>
                  <span className="col-span-2 font-bold text-slate-900 dark:text-white">
                    {activeRole.holderName} (정조합원 #30412)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 dark:text-slate-400">소속 부서/지부:</span>
                  <span className="col-span-2 font-bold text-slate-900 dark:text-white">
                    {activeRole.orgUnitName}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 dark:text-slate-400">귀속 연도:</span>
                  <span className="col-span-2 font-bold text-slate-900 dark:text-white">
                    2026년도 (1월 ~ 12월 정기 납부)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 dark:text-slate-400">공제 요율:</span>
                  <span className="col-span-2 font-bold text-slate-900 dark:text-white">
                    단협 규약 제34조 정률 1.5% (완납)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">납부 총액:</span>
                  <span className="col-span-2 text-base font-black text-blue-600 dark:text-blue-400 tabular-nums">
                    1,224,000 원
                  </span>
                </div>
              </div>

              {/* 직인 및 서명 */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 text-center space-y-1">
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  위 금액은 노동조합 및 노동관계조정법에 의한 조합비로 정당하게 납부되었음을 증명합니다.
                </div>
                <div className="text-xs font-mono text-slate-500">2026년 10월 21일</div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white pt-2 flex items-center justify-center gap-2">
                  <span>전국금융·항만운송 부산항운노동조합 위원장</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                    [직인생략]
                  </span>
                </div>
              </div>
            </div>

            {/* 모달 액션 버튼 */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setReceiptCopied(true);
                  setTimeout(() => setReceiptCopied(false), 3000);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  receiptCopied
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : highContrastDark
                    ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {receiptCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{receiptCopied ? '납부내역 복사완료' : '국세청 홈택스 등록코드 복사'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTaxReceiptModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 모달 2: 펌뱅킹 송금 전자영수증 모달 */}
      {/* -------------------------------------------------------------------- */}
      {viewFirmBankingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4 animate-scale-in ${
              highContrastDark
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold">항운신협 펌뱅킹 송금 영수증</h3>
              </div>
              <button
                onClick={() => setViewFirmBankingReceipt(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">결재 승인번호:</span>
                <span className="font-mono font-bold">{viewFirmBankingReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">수취인 (조합원):</span>
                <span className="font-bold">{viewFirmBankingReceipt.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">지원 항목:</span>
                <span className="font-bold">{viewFirmBankingReceipt.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">지급 금액 및 내용:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {viewFirmBankingReceipt.amountOrDetail}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">입금 계좌:</span>
                <span className="font-mono">부산항운신협 1002-391-****** (강민수)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">이체 처리시각:</span>
                <span className="font-mono">{viewFirmBankingReceipt.submittedAt}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-emerald-700 dark:text-emerald-300 text-center font-bold">
                ✔ 금융결제원 펌뱅킹 네트워크 실시간 자동 이체 완료
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setViewFirmBankingReceipt(null)}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-slate-800 text-white"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MODULE 05: 유재민 수석 연구위원의 임단협 교섭 팩트북 & 터미널 물동량 분석
// Lead: 유재민 노동경제학 수석 연구위원 (policy-research-intelligence)
// ============================================================================

export interface Module5ResearchFactbookViewProps {
  activeRole: RoleTierProfile;
  factbookRows: TerminalPolicyFactRow[];
  highContrastDark: boolean;
}

export function Module5ResearchFactbookView({
  activeRole,
  factbookRows,
  highContrastDark,
}: Module5ResearchFactbookViewProps) {
  // --------------------------------------------------------------------------
  // Section B: 임금인상률 시뮬레이터 파라미터 상태
  // --------------------------------------------------------------------------
  const [cpiRate, setCpiRate] = useState<number>(2.8); // 소비자물가상승률 %
  const [productivityGrowth, setProductivityGrowth] = useState<number>(4.2); // 항만 물동량 생산성 증가율 %
  const [marginWeight, setMarginWeight] = useState<number>(18.0); // 터미널사 가중 영업이익 지표 %
  const [copiedFactbookKakao, setCopiedFactbookKakao] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // Section C: 9,709명 조합원 모바일 90초 실태조사 상태
  // --------------------------------------------------------------------------
  const [surveyVotes, setSurveyVotes] = useState<Record<string, number>>({
    'opt-1': 3124, // 자동화부두 100% 고용안정 명문화
    'opt-2': 2340, // 4단 라싱·냉동 위험수당 인상
    'opt-3': 1185, // 야간 교대조 휴게시설·식단 개선
    'opt-4': 772, // 정조합원 전환 투명심사 확대
  });
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // 적정 임금인상률 산출 모델 (KMI & 노조 연구위원회 표준 교섭 공식)
  // 인상률 = CPI 실질임금 보전(100%) + 생산성 향상 기여분(50%) + 초과이익 분배
  // --------------------------------------------------------------------------
  const simulatedDemandRate = useMemo(() => {
    const raw = cpiRate * 1.0 + productivityGrowth * 0.5 + (marginWeight - 12.0) * 0.12;
    return Math.max(2.0, Math.min(9.5, Number(raw.toFixed(1))));
  }, [cpiRate, productivityGrowth, marginWeight]);

  // 총 설문 득표수 계산
  const totalSurveyVotes = useMemo(() => {
    return Object.values(surveyVotes).reduce((acc, curr) => acc + curr, 0);
  }, [surveyVotes]);

  // 1탭 설문 참여 핸들러
  const handleVoteSubmit = (optionId: string) => {
    if (hasVoted) return;
    setSurveyVotes((prev) => ({
      ...prev,
      [optionId]: (prev[optionId] || 0) + 1,
    }));
    setHasVoted(true);
    setSelectedOptionId(optionId);
  };

  // 팩트북 요약문 카카오톡 공유 복사 핸들러
  const handleCopyKakaoBriefing = () => {
    const summaryText = `[부산항운노동조합 2026 임단협 교섭 팩트북 핵심 요약]
발행: BPTU 정책연구위원회 (유재민 수석 연구위원)
보고일시: 2026년 10월 21일

■ 부산항 주요 터미널 실적 & 권고 인상률
1. PNC(신항2부두): 512만 TEU | 영업이익률 21.2% | 권고 5.6% (IMDG 할증 요구)
2. HJNC(신항3부두): 284만 TEU(+6.2%) | 영업이익률 18.4% | 권고 5.8% (4단라싱 수당 신설)
3. BNCT(신항5부두): 248만 TEU | 영업이익률 17.6% | 권고 5.5% (야간 휴게 보장)
4. DGT(신항7부두 서컨): 165만 TEU | 완전자동화 AGV | 권고 5.2% (100% 고용승계)
5. BPTC(북항통합): 390만 TEU | 영업이익률 12.8% | 권고 5.4% (전환배치 기금)

■ 임금인상 과학적 요구안:
- CPI 물가(2.8%) + 생산성 기여(4.2%) 연동 = ${simulatedDemandRate}% 요구
- 사측 최초제시(1.8%) 대비 협상 가이드라인 확보!`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(summaryText);
    }
    setCopiedFactbookKakao(true);
    setTimeout(() => setCopiedFactbookKakao(false), 4000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* -------------------------------------------------------------------- */}
      {/* 모듈 헤더: 유재민 수석 연구위원 페르소나 배너 */}
      {/* -------------------------------------------------------------------- */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          highContrastDark
            ? 'bg-slate-900/95 border-slate-700 text-slate-100 shadow-xl'
            : 'bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border-blue-950 shadow-lg'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center flex-wrap gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-300" />
                모듈 05 · 정책조사 & 교섭 인텔리전스
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                DART 전자공시 실시간 분석
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                조합원 9,709명 전수 데이터
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              임단협 교섭 팩트북 & 터미널 물동량 인텔리전스
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              <strong>유재민 수석 연구위원:</strong> &quot;임단협 교섭은 감(感)이 아니라 팩트와
              데이터에서 승패가 갈립니다. 사측의 회계적 위기론을 무력화하는 터미널별 물동량·영업이익률
              데이터와 조합원 90초 실태조사로 당당한 교섭 권리를 입증합니다.&quot;
            </p>
          </div>

          {/* 인텔리전스 레이더 상태 배지 */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[240px]">
            <div className="text-xs text-blue-200 flex items-center justify-between font-medium">
              <span>BPA 물동량 레이더</span>
              <span className="px-2 py-0.5 rounded bg-emerald-600/40 text-emerald-200 text-[11px] font-bold">
                2026 3Q 확정치
              </span>
            </div>
            <div className="mt-2 text-base font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-300 shrink-0" />
              <span>부산항 5대 컨 터미널</span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              총 물동량: <strong>1,599만 TEU</strong> (전년비 +4.8%)
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300">평균 영업이익률</span>
              <span className="text-amber-400 font-extrabold text-sm tabular-nums">
                16.8% (초과이익)
              </span>
            </div>
          </div>
        </div>
      </div>

      {copiedFactbookKakao && (
        <div className="p-4 rounded-2xl bg-blue-500/15 border border-blue-500/40 text-blue-800 dark:text-blue-200 text-sm font-bold flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <span>📋 [교섭단 팩트북 요약문]이 클립보드에 복사되었습니다! 카카오톡 단체방에 바로 붙여넣기 하십시오.</span>
          </div>
          <button
            onClick={() => setCopiedFactbookKakao(false)}
            className="text-blue-600 dark:text-blue-300 hover:opacity-75 text-xs underline"
          >
            닫기
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 섹션 A: 주요 터미널 물동량(TEU)·영업이익률·권고 인상률 비교 매트릭스 표 */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-extrabold text-xs">
                섹션 A
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                부산항 5대 컨테이너 터미널 교섭 팩트북 매트릭스
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              DART 공시 재무제표와 BPA 물동량을 실시간 대사하여 산출한 터미널별 초과이익 및 권고 인상률 표입니다.
            </p>
          </div>

          <button
            onClick={handleCopyKakaoBriefing}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all active:scale-95 shadow-sm ${
              copiedFactbookKakao
                ? 'bg-emerald-600 text-white border-emerald-600'
                : highContrastDark
                ? 'bg-slate-800 hover:bg-slate-700 text-blue-300 border-blue-500/40'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-300'
            }`}
          >
            {copiedFactbookKakao ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>[교섭단 팩트북 요약문 카톡 복사]</span>
          </button>
        </div>

        {/* 터미널 비교 테이블 (반응형 카드/테이블 복합) */}
        <div
          className={`rounded-3xl border overflow-hidden shadow-sm transition-all ${
            highContrastDark
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead
                className={`border-b text-xs font-extrabold uppercase ${
                  highContrastDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <tr>
                  <th className="py-3.5 px-4 font-bold">터미널사 (코드)</th>
                  <th className="py-3.5 px-3 font-bold">권역 / 선석</th>
                  <th className="py-3.5 px-3 font-bold">연간 물동량 (TEU)</th>
                  <th className="py-3.5 px-3 font-bold">영업이익률 (DART)</th>
                  <th className="py-3.5 px-3 font-bold">자동화 수준</th>
                  <th className="py-3.5 px-3 font-bold text-blue-600 dark:text-blue-400">
                    권고 인상률
                  </th>
                  <th className="py-3.5 px-4 font-bold">핵심 교섭 타깃 포인트</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {factbookRows.map((row) => (
                  <tr
                    key={row.terminalCode}
                    className={`transition-colors hover:bg-blue-50/40 dark:hover:bg-slate-800/50 ${
                      row.terminalCode === 'HJNC'
                        ? 'bg-blue-50/20 dark:bg-blue-950/20'
                        : ''
                    }`}
                  >
                    {/* 터미널사 명칭 */}
                    <td className="py-4 px-4 font-extrabold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <div>
                        <div className="text-slate-900 dark:text-white font-extrabold text-xs sm:text-sm">
                          {row.terminalName}
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {row.terminalCode}
                        </span>
                      </div>
                    </td>

                    {/* 권역 */}
                    <td className="py-4 px-3 text-xs text-slate-600 dark:text-slate-400">
                      {row.sector}
                    </td>

                    {/* 물동량 */}
                    <td className="py-4 px-3 font-bold tabular-nums text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {row.teuVolumeYoY}
                    </td>

                    {/* 영업이익률 프로그레스 바 */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-amber-600 dark:text-amber-400 tabular-nums text-xs sm:text-sm w-12">
                          {row.operatingMarginPct}%
                        </span>
                        <div className="w-16 sm:w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, row.operatingMarginPct * 4)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* 자동화 수준 */}
                    <td className="py-4 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          row.automationLevel.includes('완전자동화')
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {row.automationLevel}
                      </span>
                    </td>

                    {/* 권고 인상률 (강조) */}
                    <td className="py-4 px-3">
                      <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-black text-xs sm:text-sm tabular-nums shadow-sm">
                        +{row.recommendedWageHikePct}%
                      </span>
                    </td>

                    {/* 핵심 교섭 타깃 */}
                    <td className="py-4 px-4 text-xs text-slate-700 dark:text-slate-300 leading-snug max-w-xs">
                      {row.keyBargainingPoint}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={`p-4 border-t text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
              highContrastDark
                ? 'bg-slate-800/40 border-slate-700 text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <span>* 산출 기준: 금융감독원 전자공시시스템(DART) 2025-2026 사업보고서 및 부산항만공사(BPA) 공인 통계</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              분석 책임: 유재민 수석 연구위원
            </span>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 섹션 B: 물가상승률(CPI) + 물동량 생산성 연동 적정 임금인상률 시뮬레이터 */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-extrabold text-xs">
              섹션 B
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              물가상승률(CPI) + 물동량 생산성 연동 적정 인상률 시뮬레이터
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            소비자물가상승률(실질임금 보전)과 항만 생산성 지수를 실시간 결합하여 사측의 저임금 요구를 무력화하는 과학적 협상안을 도출합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 슬라이더 컨트롤러 (6컬럼) */}
          <div
            className={`lg:col-span-6 p-6 rounded-3xl border space-y-6 transition-all shadow-sm ${
              highContrastDark
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <span className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                거시경제 & 항만 생산성 시뮬레이션 지수
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                KMI 산정모델
              </span>
            </div>

            {/* 1. 소비자물가상승률 (CPI) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  소비자물가상승률 (CPI 실질임금 보전)
                </label>
                <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {cpiRate.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.1"
                value={cpiRate}
                onChange={(e) => setCpiRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1.0% (저물가)</span>
                <span>2.8% (한국은행 기준치)</span>
                <span>6.0% (고물가 충격)</span>
              </div>
            </div>

            {/* 2. 부산항 물동량 생산성 증가율 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  부산항 하역 물동량 생산성 기여율 (BPA 통계)
                </label>
                <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                  {productivityGrowth.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="8.0"
                step="0.1"
                value={productivityGrowth}
                onChange={(e) => setProductivityGrowth(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.0% (정체)</span>
                <span>4.2% (2026 상반기 실적치)</span>
                <span>8.0% (초호황)</span>
              </div>
            </div>

            {/* 3. 터미널사 가중 영업이익 지표 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  터미널 운영사 지불능력 지수 (평균 영업이익률)
                </label>
                <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                  {marginWeight.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="10.0"
                max="25.0"
                step="0.5"
                value={marginWeight}
                onChange={(e) => setMarginWeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10.0% (기본선)</span>
                <span>18.0% (현재 평균치)</span>
                <span>25.0% (고배당 이익)</span>
              </div>
            </div>

            {/* 유재민 연구위원의 분석 코멘트 */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1.5">
              <div className="font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                유재민 연구위원의 교섭 논리 가이드라인:
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                &quot;터미널 운영사 평균 영업이익률이 <strong>{marginWeight.toFixed(1)}%</strong>에 달하는
                상황에서 사측의 1.8% 인상안은 <strong>실질임금 삭감</strong>에 해당합니다. 물가상승분
                {cpiRate.toFixed(1)}%와 생산성 기여도를 반영한 <strong>{simulatedDemandRate}%</strong>는
                재무제표상으로 완벽하게 지불 가능합니다.&quot;
              </p>
            </div>
          </div>

          {/* 타 항만 비교 및 인상률 바 차트 (6컬럼) */}
          <div
            className={`lg:col-span-6 p-6 rounded-3xl border space-y-6 transition-all shadow-sm ${
              highContrastDark
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <span className="text-sm font-bold flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-600" />
                노조 과학적 요구안 vs 타 항만 타결률 비교
              </span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                사측안 1.8% 무력화
              </span>
            </div>

            {/* BPTU 과학적 요구안 대형 배지 */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md flex items-center justify-between">
              <div>
                <div className="text-xs text-blue-100 font-semibold">
                  부산항운노동조합 과학적 교섭 요구율
                </div>
                <div className="text-3xl sm:text-4xl font-black tabular-nums tracking-tight mt-1">
                  +{simulatedDemandRate}%
                </div>
                <div className="text-[11px] text-blue-200 mt-0.5">
                  CPI {cpiRate.toFixed(1)}% 실질임금 보전 + 생산성 기여분 반영
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white border border-white/30">
                  교섭 타깃
                </span>
                <div className="text-xs text-blue-200 mt-2">
                  마지노선: <strong>4.8%</strong>
                </div>
              </div>
            </div>

            {/* 비교 막대 그래프 */}
            <div className="space-y-3.5 text-xs">
              {/* BPTU 요구안 */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-blue-600 dark:text-blue-400">
                    BPTU 부산항운노조 시뮬레이션 요구안
                  </span>
                  <span className="tabular-nums font-black text-blue-600 dark:text-blue-400">
                    +{simulatedDemandRate}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (simulatedDemandRate / 8.0) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* 평택당진 */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                  <span>평택당진항운노동조합 (2026 타결안)</span>
                  <span className="tabular-nums font-bold">+4.1%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full rounded-full"
                    style={{ width: `${(4.1 / 8.0) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 울산 */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                  <span>울산항운노동조합 (2026 타결안)</span>
                  <span className="tabular-nums font-bold">+3.9%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full rounded-full"
                    style={{ width: `${(3.9 / 8.0) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 인천 */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                  <span>인천항운노동조합 (2026 타결안)</span>
                  <span className="tabular-nums font-bold">+3.8%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full rounded-full"
                    style={{ width: `${(3.8 / 8.0) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 광양 */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                  <span>광양항운노동조합 (2026 타결안)</span>
                  <span className="tabular-nums font-bold">+3.5%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full rounded-full"
                    style={{ width: `${(3.5 / 8.0) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 사측 최초 제시안 */}
              <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold">
                  <span>사측 (한국항만물류협회) 최초 제시안</span>
                  <span className="tabular-nums font-black">+1.8% (물가미달)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${(1.8 / 8.0) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 섹션 C: 9,709명 조합원 90초 모바일 실태조사 */}
      {/* -------------------------------------------------------------------- */}
      <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-white font-extrabold text-xs">
              섹션 C
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Vote className="w-6 h-6 text-amber-500" />
              9,709명 조합원 90초 모바일 실태조사
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            2026년 단체협약 체결을 위한 최우선 현장 개선 과제에 1탭으로 참여하십시오. 실시간 득표율 그래프가 즉시 갱신됩니다.
          </p>
        </div>

        {/* 설문 참여 컨테이너 카드 */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 transition-all ${
            highContrastDark
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* 설문 헤더: 질문 문구 & 총 투표 수 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                실시간 단체협약 아젠다 투표
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Q. 이번 임단협 교섭에서 노조가 가장 우선적으로 쟁취해야 할 과제는?
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">현재 누적 참여:</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400 tabular-nums">
                {totalSurveyVotes.toLocaleString()}
              </span>
              <span className="text-slate-500">명 (전체 조합원의 76.4%)</span>
            </div>
          </div>

          {/* 4대 선택지 리스트 (인터랙티브 1탭 투표) */}
          <div className="space-y-3">
            {[
              {
                id: 'opt-1',
                title: '1. 자동화부두 100% 고용안정 명문화',
                desc: '동원 서컨(DGT) 등 완전자동화 AGV 도입 시 인위적 감원 금지 및 최소 정원 명시',
                badge: '🔥 최우선 교섭 과제',
              },
              {
                id: 'opt-2',
                title: '2. 4단 라싱·냉동 위험수당 인상',
                desc: '24,000 TEU 초대형선 안벽 4단 고박 위험 및 혹한기 리퍼 컨테이너 할증 대폭 현실화',
                badge: '안전·위험수당',
              },
              {
                id: 'opt-3',
                title: '3. 야간 교대조 휴게시설·식단 개선',
                desc: '부두 안벽 냉난방 이동식 쉼터 보급 및 야간 12시간 교대 시 고영양 식사 보장',
                badge: '근로환경 복지',
              },
              {
                id: 'opt-4',
                title: '4. 정조합원 전환 투명심사 확대',
                desc: '임시조합원 실무 경력점수제 투명 공개 및 본부 공채 전환 심사 분기별 정례화',
                badge: '인사·조직 공정성',
              },
            ].map((opt) => {
              const count = surveyVotes[opt.id] || 0;
              const pct = totalSurveyVotes > 0 ? ((count / totalSurveyVotes) * 100).toFixed(1) : '0';
              const isSelected = selectedOptionId === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleVoteSubmit(opt.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 ring-2 ring-blue-500/30'
                      : highContrastDark
                      ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100'
                  }`}
                >
                  {/* 게이지 바 배경 */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-blue-500/10 dark:bg-blue-400/10 transition-all duration-500 pointer-events-none"
                    style={{ width: `${pct}%` }}
                  ></div>

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                          {opt.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          {opt.badge}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white flex items-center gap-1">
                            <Check className="w-3 h-3" /> 내 투표
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                        {opt.desc}
                      </p>
                    </div>

                    {/* 실시간 득표율 & 표수 */}
                    <div className="flex items-center gap-3 shrink-0 sm:text-right">
                      <div>
                        <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                          {pct}%
                        </div>
                        <div className="text-[11px] text-slate-400 tabular-nums">
                          {count.toLocaleString()} 표
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 투표 참여 확인 알림 배너 */}
          {hasVoted ? (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-fade-in font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>
                  {activeRole.holderName} 님의 1탭 투표가 블록체인 타임스탬프 원장에 기록되었습니다. (조사 참여 완료)
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                #BPTU-SURVEY-2026-9709
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>* 원하는 과제를 탭(클릭)하면 즉시 투표가 집계됩니다. (1인 1표)</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">익명성 100% 보장</span>
            </div>
          )}

          {/* 지부별 참여율 통계 바 */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>권역별 조합원 참여율 실시간 집계</span>
              <span className="text-[11px] text-slate-500 font-normal">신항 남측 / 북측 / 북항 권역</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-[11px] text-slate-500">제3항업지부 (신항남)</div>
                <div className="font-extrabold text-blue-600 dark:text-blue-400 tabular-nums mt-0.5">
                  84.2% 참여
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-[11px] text-slate-500">제2항업지부 (신항북)</div>
                <div className="font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums mt-0.5">
                  81.5% 참여
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-[11px] text-slate-500">제1항업지부 (북항)</div>
                <div className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
                  78.9% 참여
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
