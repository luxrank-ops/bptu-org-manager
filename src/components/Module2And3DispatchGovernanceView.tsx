import React, { useState, useEffect, useMemo } from 'react';
import {
  Ship,
  Anchor,
  Clock,
  Users,
  Check,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Smartphone,
  ShieldCheck,
  Share2,
  Copy,
  Plus,
  Award,
  Vote,
  Send,
  RefreshCw,
  Eye,
  Wind,
  Radio,
  MapPin,
  Sparkles,
  Fingerprint,
  Layers,
  ArrowRight,
  X,
  FileCheck2,
  Hash,
  KeyRound,
  ShieldAlert,
  Building,
} from 'lucide-react';
import {
  VesselGangDispatch,
  RoleTierProfile,
  PromotionReviewCandidate,
  ElectronicBallot,
} from '../data/bptuStore';

// ============================================================================
// MODULE 02: 실시간 선석 연동 스마트 배차 & Zero-Ghost 3중 출역 점호
// Lead: 박성민 현장총괄 & 정하준 스케줄링 수석 (port-dispatch-scheduler)
// ============================================================================

export interface Module2DispatchViewProps {
  activeRole: RoleTierProfile;
  dispatches: VesselGangDispatch[];
  highContrastDark: boolean;
  onUpdateDispatch: (updated: VesselGangDispatch) => void;
  onAddDispatch: (newDispatch: VesselGangDispatch) => void;
}

export function Module2DispatchView({
  activeRole,
  dispatches,
  highContrastDark,
  onUpdateDispatch,
  onAddDispatch,
}: Module2DispatchViewProps) {
  // 15초 롤링 보안 QR 타이머 상태
  const [qrTimer, setQrTimer] = useState<number>(15);
  const [qrRollingHash, setQrRollingHash] = useState<string>('FIDO-9B42-7A1C');
  
  // 조합원 원탭 체크인 상태 피드백
  const [checkInNotice, setCheckInNotice] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 터미널 필터
  const [terminalFilter, setTerminalFilter] = useState<string>('ALL');

  // 모달 상태
  const [isNewDispatchModalOpen, setIsNewDispatchModalOpen] = useState<boolean>(false);
  const [callingSubstituteVessel, setCallingSubstituteVessel] = useState<VesselGangDispatch | null>(null);

  // 새 배차 폼 데이터
  const [newForm, setNewForm] = useState({
    terminalCode: 'HJNC',
    liaisonName: '한진신항만(HJNC) 연락소',
    berthNo: '4A 선석',
    vesselName: '',
    shippingLine: 'HMM',
    etb: '10/22 07:00',
    etd: '10/22 23:00',
    workloadTeuOrTon: '2,600 VAN (라싱·본선)',
    assignedGang: '본선·라싱 3반 (이영호 반장)',
    assignedSquad: '주간 C조',
    requiredHeadcount: 16,
    windSpeedMs: 5.5,
  });

  // 15초 롤링 QR 카운트다운 에뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setQrTimer((prev) => {
        if (prev <= 1) {
          const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
          const randomHex2 = Math.random().toString(36).substring(2, 6).toUpperCase();
          setQrRollingHash(`FIDO-${randomHex}-${randomHex2}`);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 토스트 타이머
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // 필터링된 배차 목록
  const filteredDispatches = useMemo(() => {
    if (terminalFilter === 'ALL') return dispatches;
    return dispatches.filter((d) => d.terminalCode === terminalFilter);
  }, [dispatches, terminalFilter]);

  // 통계 계산
  const totalRequired = dispatches.reduce((acc, d) => acc + d.requiredHeadcount, 0);
  const totalCheckedIn = dispatches.reduce((acc, d) => acc + d.checkedInHeadcount, 0);
  const totalBlocked = dispatches.reduce((acc, d) => acc + d.ghostBlockedCount, 0);
  const attendancePct = totalRequired > 0 ? ((totalCheckedIn / totalRequired) * 100).toFixed(1) : '100.0';

  // 1) 조합원 원탭 GPS/QR 체크인 핸들러
  const handleMemberCheckIn = () => {
    // 현재 점호 중이거나 인원이 덜 찬 첫 번째 선석에 자동 체크인 반영
    const target = dispatches.find((d) => d.checkedInHeadcount < d.requiredHeadcount) || dispatches[0];
    if (target) {
      const nextChecked = Math.min(target.requiredHeadcount, target.checkedInHeadcount + 1);
      const isComplete = nextChecked === target.requiredHeadcount;
      const updated: VesselGangDispatch = {
        ...target,
        checkedInHeadcount: nextChecked,
        status: isComplete ? '본선 작업중' : target.status,
      };
      onUpdateDispatch(updated);
      setCheckInNotice(
        `✓ [${activeRole.holderName}] FIDO2 지문 + 신항 안벽 32m GPS + 15초 QR 인증 성공! (${target.vesselName} 선석 배차 출역 확정)`
      );
      triggerToast(`출역 인증 완료: ${target.vesselName} (${nextChecked}/${target.requiredHeadcount}명)`);
      setTimeout(() => setCheckInNotice(null), 5000);
    } else {
      triggerToast('모든 선석의 배차 정원이 이미 100% 충원되어 있습니다.');
    }
  };

  // 2) 반장 3-Tap: 전원 대면점호 완료
  const handleCompleteAllRollCall = (dispatch: VesselGangDispatch) => {
    const updated: VesselGangDispatch = {
      ...dispatch,
      checkedInHeadcount: dispatch.requiredHeadcount,
      status: '본선 작업중',
    };
    onUpdateDispatch(updated);
    triggerToast(`[${dispatch.vesselName}] 전원 실물점호 완료! 본선 작업 개시 확정 승인`);
  };

  // 3) 반장 3-Tap: 결원 대기조 공정 호출
  const handleOpenSubstituteModal = (dispatch: VesselGangDispatch) => {
    setCallingSubstituteVessel(dispatch);
  };

  const handleConfirmSubstitute = () => {
    if (!callingSubstituteVessel) return;
    const nextCount = Math.min(
      callingSubstituteVessel.requiredHeadcount,
      callingSubstituteVessel.checkedInHeadcount + 1
    );
    const updated: VesselGangDispatch = {
      ...callingSubstituteVessel,
      checkedInHeadcount: nextCount,
      status: nextCount === callingSubstituteVessel.requiredHeadcount ? '본선 작업중' : callingSubstituteVessel.status,
    };
    onUpdateDispatch(updated);
    triggerToast(
      `대기 1순위 최민우 조합원(BPTU-90214)이 [${callingSubstituteVessel.vesselName}] 공정 결원 대체로 즉시 호출되었습니다.`
    );
    setCallingSubstituteVessel(null);
  };

  // 4) 반장 3-Tap: 카톡 배차·교대 브리핑 1초 복사
  const handleCopyKakaoBriefing = async (dispatch: VesselGangDispatch) => {
    const briefingText = `📢 [부산항운노조 ${dispatch.liaisonName} 배차·교대 브리핑]
━━━━━━━━━━━━━━━━━━━━
• 모선명: ${dispatch.vesselName} (${dispatch.shippingLine})
• 선석: ${dispatch.berthNo}
• 작업일정: ${dispatch.etb} ~ ${dispatch.etd}
• 하역물량: ${dispatch.workloadTeuOrTon}
• 배정조직: ${dispatch.assignedGang} / ${dispatch.assignedSquad}
• 출역현황: ${dispatch.checkedInHeadcount}/${dispatch.requiredHeadcount}명 (출역률 ${Math.round((dispatch.checkedInHeadcount / dispatch.requiredHeadcount) * 100)}%)
• 현장기상: 풍속 ${dispatch.windSpeedMs}m/s (안전 기준 충족)
• 출역보안: 1인 1기기 FIDO + 50m 지오펜싱 3중 점호 완료
• 작업상태: [${dispatch.status}]
━━━━━━━━━━━━━━━━━━━━
※ 안전모 턱끈 필수 체결 및 4단 장대 작업 시 2인 1조 절대 준수!`;

    try {
      await navigator.clipboard.writeText(briefingText);
      triggerToast(`카톡 배차 브리핑이 클립보드에 복사되었습니다! (${dispatch.vesselName})`);
    } catch {
      triggerToast('클립보드 복사 권한이 없어 수동 복사를 이용해주세요.');
    }
  };

  // 새 배차 등록 핸들러
  const handleCreateNewDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.vesselName.trim()) {
      alert('모선명을 입력해주세요.');
      return;
    }

    const newDispatch: VesselGangDispatch = {
      id: `DSP-${newForm.terminalCode}-${Date.now().toString().slice(-4)}`,
      terminalCode: newForm.terminalCode,
      liaisonName: newForm.liaisonName,
      berthNo: newForm.berthNo,
      vesselName: newForm.vesselName.toUpperCase(),
      shippingLine: newForm.shippingLine,
      etb: newForm.etb,
      etd: newForm.etd,
      workloadTeuOrTon: newForm.workloadTeuOrTon,
      assignedGang: newForm.assignedGang,
      assignedSquad: newForm.assignedSquad,
      requiredHeadcount: Number(newForm.requiredHeadcount),
      checkedInHeadcount: 0,
      ghostBlockedCount: 0,
      windSpeedMs: Number(newForm.windSpeedMs),
      status: '출역 점호중',
    };

    onAddDispatch(newDispatch);
    setIsNewDispatchModalOpen(false);
    setNewForm({
      terminalCode: 'HJNC',
      liaisonName: '한진신항만(HJNC) 연락소',
      berthNo: '4A 선석',
      vesselName: '',
      shippingLine: 'HMM',
      etb: '10/22 07:00',
      etd: '10/22 23:00',
      workloadTeuOrTon: '2,600 VAN (라싱·본선)',
      assignedGang: '본선·라싱 3반 (이영호 반장)',
      assignedSquad: '주간 C조',
      requiredHeadcount: 16,
      windSpeedMs: 5.5,
    });
    triggerToast(`새 배차 모선 [${newDispatch.vesselName}] 등록이 완료되었습니다.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce border-2 border-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner: Module 02 Title & Architecture Scope */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          highContrastDark
            ? 'bg-slate-900/90 border-slate-700 text-slate-100'
            : 'bg-gradient-to-r from-[#0C1E4A] to-blue-900 text-white border-blue-950 shadow-md'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-400/20 text-amber-300 rounded-xl border border-amber-400/30 shrink-0">
              <Ship className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-[#0C1E4A] tracking-wider uppercase">
                  MODULE 02
                </span>
                <span className="text-xs text-blue-200">
                  수석 아키텍트: 박성민 총괄반장 (현장 25년) & 정하준 수석 (스케줄링)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                실시간 모선 선석 연동 스마트 배차 & Zero-Ghost 3중 출역 점호
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-3xl">
                부산항 터미널(TOS) 1분 연동 선석 스케줄 기반 표준 갱단(Gang) 자동 편성 및{' '}
                <strong className="text-amber-300 font-bold">1인 1기기 FIDO + 부두 50m 지오펜싱 + 15초 롤링 QR</strong>{' '}
                원천 유령출역 차단 체계입니다.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 sm:gap-3 bg-black/25 p-3 rounded-xl border border-white/10 shrink-0">
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-[11px] text-blue-200">가동 선석</div>
              <div className="text-lg font-black text-amber-300">{dispatches.length}척</div>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-[11px] text-blue-200">출역 인원</div>
              <div className="text-lg font-black text-emerald-400">
                {totalCheckedIn} / {totalRequired}명
              </div>
            </div>
            <div className="text-center px-3">
              <div className="text-[11px] text-blue-200">유령 차단</div>
              <div className="text-lg font-black text-rose-400">{totalBlocked}건 봉쇄</div>
            </div>
          </div>
        </div>
      </div>

      {/* Zero-Ghost 3-Tier Verification Engine Active Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          highContrastDark
            ? 'bg-slate-900 border-emerald-500/40'
            : 'bg-emerald-50/90 border-emerald-300 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                ZERO-GHOST 3중 무결성 보안 가동중
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                가공·대리 출역 100% 원천 차단
              </span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap gap-y-1 gap-x-4 pt-1">
              <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
                <Fingerprint className="w-3.5 h-3.5" /> 1) FIDO2 단말기 암호 바인딩 완료
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
                <MapPin className="w-3.5 h-3.5" /> 2) 부두 안벽 50m 초정밀 GPS 지오펜싱 정상
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <QrCode className="w-3.5 h-3.5" /> 3) 15초 롤링 보안 QR:
                <span className="font-mono bg-amber-500/20 px-1 rounded text-amber-700 dark:text-amber-300">
                  {qrRollingHash} ({qrTimer}s)
                </span>
              </span>
            </div>
          </div>

          {/* Member 1-Tap Check-In CTA Button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={handleMemberCheckIn}
              className="px-5 py-3 rounded-xl font-black text-sm tracking-wide bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2.5 transform active:scale-95 transition-all border border-emerald-400"
            >
              <Smartphone className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>조합원 원탭 GPS/QR 출역 체크인</span>
            </button>
            <button
              type="button"
              onClick={() => setIsNewDispatchModalOpen(true)}
              className={`px-3.5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                highContrastDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm'
              }`}
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>새 배차 편성</span>
            </button>
          </div>
        </div>

        {/* Check-In Success Alert Toast inline */}
        {checkInNotice && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{checkInNotice}</span>
          </div>
        )}
      </div>

      {/* Filter Tabs & Terminal Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2 shrink-0">
            터미널 필터:
          </span>
          {[
            { id: 'ALL', label: '전체 부두 선석' },
            { id: 'HJNC', label: '한진(HJNC) 신항3부두' },
            { id: 'PNC', label: '신항만(PNC) 신항2부두' },
            { id: 'DGT', label: '동원(DGT) 서컨스마트' },
          ].map((tab) => {
            const isSelected = terminalFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTerminalFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#0C1E4A] text-white shadow'
                    : highContrastDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>부산항만공사(BPA) 종합물류정보망 1분 연동 주기 가동</span>
        </div>
      </div>

      {/* Vessel Gang Dispatch Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filteredDispatches.map((dispatch) => {
          const isComplete = dispatch.checkedInHeadcount >= dispatch.requiredHeadcount;
          const pct = Math.round((dispatch.checkedInHeadcount / dispatch.requiredHeadcount) * 100);
          const isWindSafe = dispatch.windSpeedMs < 10.0;
          const isWindAlert = dispatch.windSpeedMs >= 15.0;

          return (
            <div
              key={dispatch.id}
              className={`rounded-2xl border p-5 transition-all shadow-sm flex flex-col justify-between ${
                highContrastDark
                  ? 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-100'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md text-slate-900'
              }`}
            >
              {/* Card Header: Berth & Vessel */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-extrabold bg-[#0C1E4A] text-amber-300">
                        {dispatch.berthNo}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {dispatch.liaisonName}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <h3 className="text-xl font-black tracking-tight">{dispatch.vesselName}</h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {dispatch.shippingLine} 선사
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                      dispatch.status === '본선 작업중'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dispatch.status === '본선 작업중' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    {dispatch.status}
                  </span>
                </div>

                {/* Vessel Workload & Time Details */}
                <div
                  className={`mt-4 p-3.5 rounded-xl border text-xs grid grid-cols-2 gap-2.5 ${
                    highContrastDark
                      ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-[11px] text-slate-400 block">하역 물량 (양·적하)</span>
                    <strong className="text-slate-900 dark:text-white font-bold">
                      {dispatch.workloadTeuOrTon}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">접안 및 출항 예정</span>
                    <span className="font-mono text-slate-900 dark:text-white font-semibold">
                      {dispatch.etb} ~ {dispatch.etd}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">투입 작업반 / 교대조</span>
                      <strong className="text-blue-700 dark:text-blue-300 font-bold">
                        {dispatch.assignedGang} · {dispatch.assignedSquad}
                      </strong>
                    </div>
                    {/* Wind Speed Alert */}
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">부두 안벽 풍속</span>
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          isWindAlert
                            ? 'text-rose-600 dark:text-rose-400 animate-bounce'
                            : isWindSafe
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        <Wind className="w-3.5 h-3.5" />
                        {dispatch.windSpeedMs} m/s ({isWindAlert ? '작업중지 경보' : isWindSafe ? '안전 정상' : '주의 관찰'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Headcount Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      실시간 대면 점호 현황
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm">
                        <span className={isComplete ? 'text-emerald-600' : 'text-amber-600'}>
                          {dispatch.checkedInHeadcount}
                        </span>{' '}
                        / {dispatch.requiredHeadcount} 명
                      </span>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {pct}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                    <span>
                      결원: {Math.max(0, dispatch.requiredHeadcount - dispatch.checkedInHeadcount)}명
                    </span>
                    <span className="text-rose-500 dark:text-rose-400 font-semibold">
                      유령출역 의심 차단: {dispatch.ghostBlockedCount}건
                    </span>
                  </div>
                </div>
              </div>

              {/* 3-Tap Actions for Gang Foremen */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span>반장님 현장 3-Tap 즉시 실행 액션</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Tap 1: Complete Roll Call */}
                  <button
                    type="button"
                    onClick={() => handleCompleteAllRollCall(dispatch)}
                    className="px-2.5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>1) 전원 대면점호</span>
                  </button>

                  {/* Tap 2: Call Substitute Squad */}
                  <button
                    type="button"
                    onClick={() => handleOpenSubstituteModal(dispatch)}
                    className="px-2.5 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-900 flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>2) 결원 공정호출</span>
                  </button>

                  {/* Tap 3: 1-Sec Kakao Briefing Copy */}
                  <button
                    type="button"
                    onClick={() => handleCopyKakaoBriefing(dispatch)}
                    className={`px-2.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all active:scale-95 ${
                      highContrastDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600'
                        : 'bg-amber-100 hover:bg-amber-200 text-[#0C1E4A] border-amber-300'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>3) 카톡 브리핑 복사</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Substitute Gang Call Modal */}
      {callingSubstituteVessel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl space-y-4 animate-scale-in ${
              highContrastDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold">
                  결원 발생 대기조 공정 순번 호출 시스템
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCallingSubstituteVessel(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl text-amber-900 dark:text-amber-200">
                <strong>대상 모선:</strong> {callingSubstituteVessel.vesselName} ({callingSubstituteVessel.berthNo})
                <br />
                <strong>현재 출역 인원:</strong> {callingSubstituteVessel.checkedInHeadcount} /{' '}
                {callingSubstituteVessel.requiredHeadcount}명 (결원{' '}
                {callingSubstituteVessel.requiredHeadcount - callingSubstituteVessel.checkedInHeadcount}명)
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-200">
                  항운노조 공정배차 알고리즘 추천 순번 1위 조합원:
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700">
                  <div>
                    <div className="font-extrabold text-sm text-blue-700 dark:text-blue-300">
                      최민우 조합원 (BPTU-90214)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      제3항업지부 대기 1조 · 최근 3일 휴무 · 무사고 8년
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded">
                    즉시 호출 가능
                  </span>
                </div>
              </div>
              <p className="text-slate-500 text-[11px]">
                ※ 지부장이나 반장의 사적 지정이 불가하며, 누적 대기시간 및 공정순번 지수 1위 조합원에게 즉시 카톡 알림톡 및 PUSH가 발송됩니다.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCallingSubstituteVessel(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmSubstitute}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow"
              >
                <Check className="w-4 h-4" />
                <span>대기순번 1위 즉시 투입 확정</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Dispatch Modal */}
      {isNewDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto ${
              highContrastDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Ship className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold">새 접안 모선 배차 등록</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewDispatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDispatch} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block mb-1">모선명 (Vessel Name)</label>
                <input
                  type="text"
                  required
                  placeholder="예: EVER GIVEN, HYUNDAI DRIVE"
                  value={newForm.vesselName}
                  onChange={(e) => setNewForm({ ...newForm, vesselName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">터미널 관할</label>
                  <select
                    value={newForm.terminalCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      const liaisonMap: Record<string, string> = {
                        HJNC: '한진신항만(HJNC) 연락소',
                        PNC: '부산신항만(PNC) 연락소',
                        DGT: '동원글로벌(DGT) 연락소',
                        BNCT: '고려신항만(BNCT) 연락소',
                      };
                      setNewForm({
                        ...newForm,
                        terminalCode: val,
                        liaisonName: liaisonMap[val] || `${val} 연락소`,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                  >
                    <option value="HJNC" className="text-slate-900">한진(HJNC) 신항3부두</option>
                    <option value="PNC" className="text-slate-900">신항만(PNC) 신항2부두</option>
                    <option value="DGT" className="text-slate-900">동원(DGT) 서컨스마트</option>
                    <option value="BNCT" className="text-slate-900">고려(BNCT) 신항5부두</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">선석 번호</label>
                  <input
                    type="text"
                    required
                    value={newForm.berthNo}
                    onChange={(e) => setNewForm({ ...newForm, berthNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">선사 (Shipping Line)</label>
                  <input
                    type="text"
                    required
                    value={newForm.shippingLine}
                    onChange={(e) => setNewForm({ ...newForm, shippingLine: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">하역 소요 정원 (명)</label>
                  <input
                    type="number"
                    min={4}
                    max={36}
                    required
                    value={newForm.requiredHeadcount}
                    onChange={(e) => setNewForm({ ...newForm, requiredHeadcount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">배정 작업반 / 조</label>
                <input
                  type="text"
                  required
                  value={newForm.assignedGang}
                  onChange={(e) => setNewForm({ ...newForm, assignedGang: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">하역 물량 (VAN / 작업유형)</label>
                <input
                  type="text"
                  required
                  value={newForm.workloadTeuOrTon}
                  onChange={(e) => setNewForm({ ...newForm, workloadTeuOrTon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewDispatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-[#0C1E4A] hover:bg-blue-900 text-white flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>배차 스케줄 등록 완료</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MODULE 03: 4단계 투명 채용·승진 심사 & 무기명 비밀 전자투표 & 익명 클린 신문고
// Lead: 서지훈 감사관 (governance-audit-guardian)
// ============================================================================

export interface Module3GovernanceViewProps {
  activeRole: RoleTierProfile;
  candidates: PromotionReviewCandidate[];
  ballots: ElectronicBallot[];
  highContrastDark: boolean;
  onApproveCandidate: (id: string) => void;
  onCastVote: (ballotId: string, optionId: string) => void;
}

export function Module3GovernanceView({
  activeRole,
  candidates,
  ballots,
  highContrastDark,
  onApproveCandidate,
  onCastVote,
}: Module3GovernanceViewProps) {
  // 섹션 탭 (채용·승진 심사 / 모바일 비밀 전자투표 / 익명 클린 신문고)
  const [govTab, setGovTab] = useState<'PROMOTION' | 'VOTE' | 'WHISTLE'>('PROMOTION');

  // 투표 섹션 선택지 상태
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [justVotedReceipt, setJustVotedReceipt] = useState<{
    ballotTitle: string;
    receiptHash: string;
    optionLabel: string;
  } | null>(null);

  // 익명 신문고 폼 상태
  const [whistleForm, setWhistleForm] = useState({
    category: '인사·채용 청탁 비리 고발',
    terminal: '한진신항만(HJNC)',
    title: '',
    content: '',
  });
  const [issuedWhistleToken, setIssuedWhistleToken] = useState<string | null>(null);

  // 복사 피드백 토스트
  const [copiedHashText, setCopiedHashText] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHashText(`${label} 복사 완료: ${text}`);
      setTimeout(() => setCopiedHashText(null), 3000);
    } catch {
      // fallback
    }
  };

  // 투표 제출 핸들러
  const handleVoteSubmit = (ballot: ElectronicBallot) => {
    const chosenOptionId = selectedOptions[ballot.id];
    if (!chosenOptionId) {
      alert('투표하실 항목을 먼저 선택해주세요.');
      return;
    }
    const chosenOption = ballot.options.find((o) => o.id === chosenOptionId);
    onCastVote(ballot.id, chosenOptionId);

    const generatedReceipt = `0x${Math.random().toString(16).slice(2, 10)}${Date.now().toString(16).slice(-6)}`;
    setJustVotedReceipt({
      ballotTitle: ballot.title,
      receiptHash: generatedReceipt,
      optionLabel: chosenOption ? chosenOption.label : chosenOptionId,
    });
  };

  // 익명 신문고 제출 핸들러
  const handleWhistleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whistleForm.title.trim() || !whistleForm.content.trim()) {
      alert('신문고 제목과 제보 내용을 입력해주세요.');
      return;
    }

    const randomToken = `TOKEN-BPTU-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setIssuedWhistleToken(randomToken);
    setWhistleForm({
      category: '인사·채용 청탁 비리 고발',
      terminal: '한진신항만(HJNC)',
      title: '',
      content: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {copiedHashText && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-amber-400 animate-bounce">
          <Copy className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-mono font-bold">{copiedHashText}</span>
        </div>
      )}

      {/* Header Banner */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          highContrastDark
            ? 'bg-slate-900/90 border-slate-700 text-slate-100'
            : 'bg-gradient-to-r from-[#0C1E4A] to-slate-900 text-white border-blue-950 shadow-md'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-400/20 text-amber-300 rounded-xl border border-amber-400/30 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-[#0C1E4A] tracking-wider uppercase">
                  MODULE 03
                </span>
                <span className="text-xs text-blue-200">
                  수석 아키텍트: 서지훈 감사관 (준법감사·노사정 거버넌스 20년)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                4단계 투명 채용·승진 심사 & 무기명 비밀 전자투표 & 익명 클린 신문고
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-3xl">
                지부장·반장 사적 청탁과 밀실 단독추천을 전면 폐지하고,{' '}
                <strong className="text-amber-300 font-bold">
                  정량점수(70%) + 노사정 다면평가(30%) + SHA-256 불변 감사로그
                </strong>
                로 모든 인사·의결 과정을 투명하게 공개합니다.
              </p>
            </div>
          </div>

          {/* Quick Sub-navigation */}
          <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setGovTab('PROMOTION')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                govTab === 'PROMOTION'
                  ? 'bg-amber-400 text-[#0C1E4A] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              1. 채용·승진 심사
            </button>
            <button
              type="button"
              onClick={() => setGovTab('VOTE')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                govTab === 'VOTE'
                  ? 'bg-amber-400 text-[#0C1E4A] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              2. 무기명 전자투표
            </button>
            <button
              type="button"
              onClick={() => setGovTab('WHISTLE')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                govTab === 'WHISTLE'
                  ? 'bg-amber-400 text-[#0C1E4A] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              3. 익명 클린 신문고
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION A: 지부장·반장 단독추천 폐지! 4단계 투명 채용·승진 공개 심사 보드
          ========================================================================= */}
      {govTab === 'PROMOTION' && (
        <div className="space-y-5 animate-fade-in">
          {/* Anti-Corruption Declaration & 4-Stage Pipeline Banner */}
          <div
            className={`p-5 rounded-2xl border ${
              highContrastDark
                ? 'bg-slate-900 border-amber-500/30 text-slate-200'
                : 'bg-amber-50/70 border-amber-300 text-slate-800'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded bg-amber-500 text-slate-900">
                    노사정 인사혁신 협약 이행
                  </span>
                  <span className="text-sm font-black">
                    지부장·반장 단독추천 전면 폐지! 4단계 투명 심사 기준
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  출역률(35) + 무사고(25) + 자격면허(10)의 정량 70점과 노사정 공익위원 다면평가 30점의 합산 총점(100점)으로 자동 랭킹화됩니다.
                </p>
              </div>

              {/* 4-Step Visual Track */}
              <div className="flex items-center gap-1 sm:gap-2 text-[10px] font-bold">
                <span className="px-2 py-1 rounded bg-blue-600 text-white">1단계 정량검증</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="px-2 py-1 rounded bg-blue-600 text-white">2단계 필기평가</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="px-2 py-1 rounded bg-blue-600 text-white">3단계 노사정다면</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="px-2 py-1 rounded bg-emerald-600 text-white">4단계 공개승인</span>
              </div>
            </div>
          </div>

          {/* Candidates Evaluation Board */}
          <div className="grid grid-cols-1 gap-4">
            {candidates.map((cand) => {
              const isApproved = cand.status === '자격검증 완료';
              return (
                <div
                  key={cand.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    highContrastDark
                      ? 'bg-slate-900 border-slate-700 text-slate-100 hover:border-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-xs font-black bg-[#0C1E4A] text-amber-300">
                          종합 {cand.rank}위
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {cand.branchName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-semibold">
                          {cand.reviewType}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-3">
                        <h4 className="text-xl font-black tracking-tight">
                          {cand.candidateName}{' '}
                          <span className="text-xs font-normal text-slate-500 font-mono">
                            ({cand.memberNo})
                          </span>
                        </h4>
                        <span className="text-xs text-slate-500">
                          항만 근속: <strong>{cand.tenureYears}년</strong>
                        </span>
                      </div>

                      {/* Score Breakdown Pills */}
                      <div className="flex flex-wrap gap-2 pt-1 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          출역률(35): <strong className="text-blue-600">{cand.attendanceScore}점</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          무사고안전(25): <strong className="text-emerald-600">{cand.safetyNoAccidentScore}점</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          자격면허(10): <strong className="text-indigo-600">{cand.certScore}점</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          노사정공익(30): <strong className="text-amber-600">{cand.tripartitePanelScore}점</strong>
                        </span>
                      </div>
                    </div>

                    {/* Right: Total Score & Action */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200 dark:border-slate-800">
                      {/* Total Score Display */}
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-slate-400 block font-semibold">
                          종합 합산 총점 (100점 만점)
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-400 font-mono">
                          {cand.totalScore.toFixed(1)}{' '}
                          <span className="text-sm text-slate-500 font-normal">점</span>
                        </div>
                      </div>

                      {/* Approval CTA */}
                      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                        <button
                          type="button"
                          disabled={isApproved}
                          onClick={() => {
                            onApproveCandidate(cand.id);
                            setCopiedHashText(`[${cand.candidateName}] 공개심사 승인 완료 및 감사로그 봉인!`);
                          }}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all ${
                            isApproved
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
                          }`}
                        >
                          {isApproved ? (
                            <>
                              <FileCheck2 className="w-4 h-4" />
                              <span>공개심사 최종 승인완료</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>[공개심사 최종 승인] 원탭 결재</span>
                            </>
                          )}
                        </button>

                        {/* SHA-256 Audit Hash */}
                        <button
                          type="button"
                          onClick={() => copyToClipboard(cand.auditHash, `${cand.candidateName} 감사 해시`)}
                          className="text-[11px] font-mono text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 justify-center sm:justify-end"
                        >
                          <Hash className="w-3 h-3 text-slate-400" />
                          <span>SHA-256: {cand.auditHash}</span>
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION B: 노동조합법 제16조·제29조 무기명 비밀 모바일 전자투표 센터
          ========================================================================= */}
      {govTab === 'VOTE' && (
        <div className="space-y-5 animate-fade-in">
          {/* Legal Compliance Banner */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border ${
              highContrastDark
                ? 'bg-slate-900 border-blue-500/30 text-slate-200'
                : 'bg-blue-50/70 border-blue-300 text-slate-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <Vote className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-700 text-white">
                    노동조합법 제16조 · 제29조 준수
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    직접 · 비밀 · 무기명 투표 100% 보장 시스템
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  투표자의 신원과 선택지는 시스템 관리자도 복호화할 수 없도록 영구 분리되며, 조합원 개개인에게는 사후 검증용{' '}
                  <strong className="text-blue-700 dark:text-blue-300">암호화 영수증 해시(Receipt Hash)</strong>가 즉시 발급됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Ballots List */}
          <div className="space-y-5">
            {ballots.map((ballot) => {
              const turnoutPct = ((ballot.castVotes / ballot.eligibleVoters) * 100).toFixed(1);
              const isQuorumMet = Number(turnoutPct) >= 50.0;
              const hasVoted = Boolean(ballot.userVotedOptionId);
              const selectedOptionId = selectedOptions[ballot.id] || ballot.userVotedOptionId || '';

              return (
                <div
                  key={ballot.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                    highContrastDark
                      ? 'bg-slate-900 border-slate-700 text-slate-100'
                      : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                >
                  {/* Top Bar: Title & Scope */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0C1E4A] text-amber-300">
                          {ballot.status}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          대상: {ballot.scope}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black mt-1.5 tracking-tight">
                        {ballot.title}
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5 font-mono">
                        마감 기한: {ballot.deadline}
                      </div>
                    </div>

                    {/* Turnout Metric */}
                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-[11px] text-slate-400">실시간 투표 참여율</div>
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                        {turnoutPct}%{' '}
                        <span className="text-xs text-slate-500 font-normal">
                          ({ballot.castVotes.toLocaleString()} / {ballot.eligibleVoters.toLocaleString()}명)
                        </span>
                      </div>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                          isQuorumMet
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isQuorumMet ? '✓ 법정 의결정족수(과반수) 달성' : '정족수 집계중'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden my-4">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Number(turnoutPct))}%` }}
                    />
                  </div>

                  {/* Voting Options */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
                      투표 항목 선택 ({hasVoted ? '이미 투표를 완료하셨습니다' : '1개 항목 선택 후 하단 서명 클릭'}):
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {ballot.options.map((opt) => {
                        const isSelected = selectedOptionId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={hasVoted}
                            onClick={() =>
                              setSelectedOptions({
                                ...selectedOptions,
                                [ballot.id]: opt.id,
                              })
                            }
                            className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20'
                                : highContrastDark
                                ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            } ${hasVoted ? 'cursor-default opacity-85' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-slate-400 bg-transparent'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {opt.label}
                              </span>
                            </div>

                            {/* Live Vote Share */}
                            <div className="text-xs text-right font-mono text-slate-500 shrink-0">
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                {opt.votes.toLocaleString()}표
                              </span>
                              <span className="text-[11px] text-slate-400 block">
                                ({ballot.castVotes > 0 ? ((opt.votes / ballot.castVotes) * 100).toFixed(1) : '0'}%)
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Action / Receipt */}
                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {hasVoted || ballot.userReceiptHash ? (
                      <div className="w-full p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div className="text-xs text-emerald-900 dark:text-emerald-200">
                            <strong>비밀투표 행사 완료:</strong> 귀하의 표가 암호화 블록체인에 안전하게 집계되었습니다.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              ballot.userReceiptHash || '0x8f3a91c4d92a01',
                              '개인 암호화 영수증 해시'
                            )
                          }
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-emerald-400 text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5 hover:bg-emerald-100"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>영수증 해시: {ballot.userReceiptHash || '0x8f3a91c4d92a01'}</span>
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-amber-500" />
                          <span>본인 1회 투표 후에는 수정이 절대 불가능합니다.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleVoteSubmit(ballot)}
                          className="px-5 py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          <Vote className="w-4 h-4" />
                          <span>[비밀투표 행사 및 영수증 해시 발급]</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Just Voted Receipt Modal */}
          {justVotedReceipt && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div
                className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 animate-scale-in ${
                  highContrastDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-base font-extrabold">전자투표 암호화 영수증 발급</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setJustVotedReceipt(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl space-y-1">
                    <span className="text-slate-400">투표 안건:</span>
                    <div className="font-bold">{justVotedReceipt.ballotTitle}</div>
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-xl space-y-1.5">
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold block">
                      개인 검증용 블록체인 영수증 해시 (Receipt Hash)
                    </span>
                    <div className="font-mono text-sm font-black bg-white dark:bg-slate-900 p-2 rounded border border-emerald-400 break-all select-all text-emerald-700 dark:text-emerald-400">
                      {justVotedReceipt.receiptHash}
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1">
                      이 영수증 해시를 보관하시면 개표 완료 후 본인의 무기명 표가 누락 없이 집계에 반영되었는지 단독으로 암호학적 검증이 가능합니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(justVotedReceipt.receiptHash, '투표 영수증 해시');
                      setJustVotedReceipt(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0C1E4A] text-white flex items-center gap-1.5 shadow"
                  >
                    <Copy className="w-4 h-4" />
                    <span>영수증 복사 후 닫기</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION C: 익명 보장 클린 신문고 & 부당관행/안전 고충 직보 센터
          ========================================================================= */}
      {govTab === 'WHISTLE' && (
        <div className="space-y-5 animate-fade-in">
          {/* Whistleblower Protection Shield Banner */}
          <div
            className={`p-5 rounded-2xl border ${
              highContrastDark
                ? 'bg-slate-900 border-indigo-500/40 text-slate-200'
                : 'bg-indigo-50/80 border-indigo-300 text-slate-800'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-indigo-700 text-white">
                    E2EE 종단간 암호화 & IP 영구 파기
                  </span>
                  <span className="text-sm font-black">
                    완전 익명 보장 클린 신문고 & 현장 안전 핫라인
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  접속자의 IP, 단말기 식별자, 쿠키 등 일체의 디지털 핑거프린트가 서버에 도달하기 전 완전히 파기됩니다.{' '}
                  <strong>인사 청탁, 금품 수수, 배차 불공정, 안전수칙 위반</strong> 등을 중간 간부의 보복 우려 없이 본부 윤리감사위원회 및 외부 공익위원에게 직보할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Whistle Form */}
          <div
            className={`p-6 rounded-2xl border ${
              highContrastDark
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}
          >
            <form onSubmit={handleWhistleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1">제보 비위 유형</label>
                  <select
                    value={whistleForm.category}
                    onChange={(e) => setWhistleForm({ ...whistleForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                  >
                    <option value="인사·채용 청탁 비리 고발" className="text-slate-900">
                      인사·채용 청탁 및 금품수수 고발
                    </option>
                    <option value="부두 위험작업 및 안전수칙 위반" className="text-slate-900">
                      부두 안벽 위험작업 및 안전수칙 위반 직보
                    </option>
                    <option value="배차 불공정 및 부당지시" className="text-slate-900">
                      배차 순번 조작 및 중간 간부 부당지시
                    </option>
                    <option value="노조비/복지기금 회계부정" className="text-slate-900">
                      노조비 / 복지공제기금 회계 부정 의혹
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">발생 부두 / 연락소</label>
                  <select
                    value={whistleForm.terminal}
                    onChange={(e) => setWhistleForm({ ...whistleForm, terminal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                  >
                    <option value="한진신항만(HJNC)" className="text-slate-900">한진신항만(HJNC) 신항 3부두</option>
                    <option value="부산신항만(PNC)" className="text-slate-900">부산신항만(PNC) 신항 2부두</option>
                    <option value="동원글로벌(DGT)" className="text-slate-900">동원글로벌(DGT) 서컨스마트</option>
                    <option value="북항통합(BPTC)" className="text-slate-900">북항통합(BPTC) 신선대/감만</option>
                    <option value="감천항/기타부두" className="text-slate-900">감천항 및 냉동/특수부두</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">제보 제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 3선석 야간 라싱 작업 중 신호수 미배치 위험작업 강요"
                  value={whistleForm.title}
                  onChange={(e) => setWhistleForm({ ...whistleForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">상세 제보 내용 (E2EE 암호화 전송)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="일시, 장소, 구체적 비위 사실, 관련 대상자 등을 사실에 근거하여 기재해주세요. 본문 내 본인을 식별할 수 있는 개인정보는 기재하지 마십시오."
                  value={whistleForm.content}
                  onChange={(e) => setWhistleForm({ ...whistleForm, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-emerald-600" />
                  <span>제출 즉시 본인만 열람 가능한 일회용 난수 비밀 토큰이 발급됩니다.</span>
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl font-black text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>[E2EE 암호화 익명 제보 제출 & 토큰 발급]</span>
                </button>
              </div>
            </form>
          </div>

          {/* Issued Whistle Token Dialog */}
          {issuedWhistleToken && (
            <div
              className={`p-5 rounded-2xl border border-emerald-400 animate-scale-in ${
                highContrastDark ? 'bg-slate-900 text-slate-100' : 'bg-emerald-50 text-emerald-950'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-base font-extrabold text-emerald-800 dark:text-emerald-300">
                      익명 제보 접수 완료 및 일회용 비밀 조회 토큰 발급
                    </h4>
                    <span className="text-xs text-slate-500">
                      본부 윤리감사위원회 직통 채널로 암호화 격리 전송되었습니다.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIssuedWhistleToken(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3 p-3.5 bg-white dark:bg-slate-950 rounded-xl border border-emerald-300 dark:border-emerald-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">
                    일회용 비밀 조회 토큰 (분실 시 재발급 불가):
                  </span>
                  <div className="font-mono text-base font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
                    {issuedWhistleToken}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(issuedWhistleToken, '신문고 조회 토큰')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>토큰 복사</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2">
                ※ 이 토큰은 서버에 원문이 저장되지 않고 단방향 해시로만 매핑되어, 토큰을 소지한 본인 외에는 작성자가 누구인지 노조 간부나 서버 엔지니어도 절대로 알 수 없습니다.
              </p>
            </div>
          )}

          {/* Sample Whistleblower Transparency Timeline */}
          <div
            className={`p-5 rounded-2xl border text-xs space-y-3 ${
              highContrastDark
                ? 'bg-slate-900 border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>최근 익명 신문고 공익조사 및 조치 결과 공개 현황</span>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    신항 2부두 안벽 강풍(16m/s) 작업강요 고발 건
                  </span>
                  <div className="text-[11px] text-slate-500">
                    접수 후 30분 만에 본부 안전관리팀 현장 출동 · 즉시 작업중지권 발동 및 크레인 결박 조치 완료
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold shrink-0">
                  조치 완료
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    북항 특정 반 승진 청탁 소문 제보 건
                  </span>
                  <div className="text-[11px] text-slate-500">
                    외부 노사정 공익위원 긴급 감사 개시 · 전 과정 블록체인 점수 전수대조 이상 없음 확인
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-[10px] font-extrabold shrink-0">
                  감사 종결
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
