import React, { useState, useMemo } from 'react';
import {
  Building2,
  Users,
  Search,
  ShieldCheck,
  ChevronRight,
  UserPlus,
  Eye,
  EyeOff,
  Award,
  Network,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import {
  RoleTierProfile,
  BranchSummary,
  UnionMemberRecord,
  ModuleTabId,
  maskKoreanName,
} from '../data/bptuStore';

export interface Module1OrgAndHomeViewProps {
  activeRole: RoleTierProfile;
  branches: BranchSummary[];
  members: UnionMemberRecord[];
  privacyMasked: boolean;
  highContrastDark: boolean;
  onTogglePrivacyMask: () => void;
  onNavigateModule: (tab: ModuleTabId) => void;
  onAddMember: (newMember: UnionMemberRecord) => void;
}

// 7대 모듈 빠른 이동 정의
const MODULE_QUICK_NAV: Array<{
  id: ModuleTabId;
  code: string;
  title: string;
  badge: string;
  desc: string;
}> = [
  {
    id: 'org',
    code: '01',
    title: '조직·인사 명부',
    badge: '현재 화면',
    desc: '6단계 동적 트리 · 9,709명 전사 조직도 및 FIDO 단말 인증 명부',
  },
  {
    id: 'dispatch',
    code: '02',
    title: '스마트 출역·배차',
    badge: '실시간 선석',
    desc: '모선 선석 스케줄 연동 · Zero-Ghost 3중 GPS/FIDO 점호 시스템',
  },
  {
    id: 'governance',
    code: '03',
    title: '투명심사·전자투표',
    badge: '블록체인',
    desc: '정조합원 전환 4단계 블라인드 다면심사 · 대의원/임원 비밀 전자투표',
  },
  {
    id: 'payroll',
    code: '04',
    title: '노임·급여·복지',
    badge: '1초 명세서',
    desc: 'Toss형 1초 급여명세서 · 톤당 하역료 역산 계산기 · 무이자 학자금',
  },
  {
    id: 'research',
    code: '05',
    title: '자료조사·팩트북',
    badge: '2026 단협',
    desc: '임단협 선석별 생산성 팩트북 · 부산항 물가연동 노임 가이드라인',
  },
  {
    id: 'pr',
    code: '06',
    title: '홍보·항운노보',
    badge: '노보 784호',
    desc: '디지털 항운노보 · 카카오톡 1초 교대 브리핑 · 영상 홍보 아카이브',
  },
  {
    id: 'legal',
    code: '07',
    title: '법률·산재 119',
    badge: '작업중지권',
    desc: '위험 작업중지권 즉시발동 · 24시간 익명 신문고 · 부두 산재 원스톱 접수',
  },
];

// 중앙본부 6개 부서
const HQ_DEPARTMENTS = [
  { name: '총무부', head: '사무처 총괄', roles: '조직 인사, 재무 회계, 총무 자산 관리', staff: 14 },
  { name: '조직부', head: '조직국장', roles: '24개 지부 지도, 조합원 실태 조사, 조직 강화', staff: 12 },
  { name: '쟁의부', head: '쟁의국장', roles: '임단협 단체교섭, 쟁의대책, 현장 권익 수호', staff: 10 },
  { name: '노사대책부', head: '노사대책국장', roles: '부산항만공사(BPA)·터미널 하역사 협의 관제', staff: 11 },
  { name: '후생복지부', head: '복지국장', roles: '조합원 장학기금, 의료 공제, 휴양소 운영', staff: 9 },
  { name: '교육선전부', head: '선전국장', roles: '디지털 항운노보 발행, 신임 조합원 직무 교육', staff: 8 },
];

// 중앙본부 9개 상설위원회
const HQ_COMMITTEES = [
  { name: '인사·징계위원회', desc: '공정 인사 및 윤리 규정 심의' },
  { name: '중앙감사위원회', desc: '회계·재정 투명성 상시 감사' },
  { name: '선거관리위원회', desc: '임원·대의원 전자비밀투표 관장' },
  { name: '산업안전보건위원회', desc: '부두 중대재해 예방 및 작업중지권' },
  { name: '복지기금운용위원회', desc: '장학·의료·경조 복지 적립금 운용' },
  { name: '노사협의위원회', desc: '하역 요율 및 안전 인프라 개선 협의' },
  { name: '법률자문위원회', desc: '노동법·산재 전문 변호인단 상시 대응' },
  { name: '정책연구위원회', desc: '신항 자동화 대비 고용 안정 정책 수립' },
  { name: '청년선도위원회', desc: '청년·임시조합원 현장 애로 해소 및 멘토링' },
];

export function Module1OrgAndHomeView({
  activeRole,
  branches,
  members,
  privacyMasked,
  highContrastDark,
  onTogglePrivacyMask,
  onNavigateModule,
  onAddMember,
}: Module1OrgAndHomeViewProps) {
  // 지부 선택 및 드릴다운 상태
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || 'BR-03');
  const [selectedLiaison, setSelectedLiaison] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('전체');
  const [showHqDetails, setShowHqDetails] = useState<boolean>(false);

  // 조합원 명부 검색 및 필터 상태
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [memberTypeFilter, setMemberTypeFilter] = useState<'ALL' | '정조합원' | '임시조합원'>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // 신규 조합원 등록 폼 상태
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    birthYear: 1988,
    phone: '010-',
    memberType: '정조합원' as '정조합원' | '임시조합원',
    roleTitle: '조합원' as '조합원' | '작업조장' | '작업반장' | '연락소장' | '대의원',
    branchId: branches[0]?.id || 'BR-03',
    liaisonName: branches[0]?.liaisonOffices[0] || '한진신항만(HJNC) 연락소',
    gangName: '본선·라싱 1반',
    squadName: '주간 A조',
    certifications: '선박 라싱 1급, 항만 안전교육 이수',
    todayStatus: '출역 완료 (안벽투입)' as
      | '출역 완료 (안벽투입)'
      | '출역 대기 (주간조)'
      | '야간조 교대대기'
      | '공가/휴무',
  });

  // 현재 선택된 지부 데이터
  const currentBranch = useMemo(() => {
    return branches.find((b) => b.id === selectedBranchId) || branches[0];
  }, [branches, selectedBranchId]);

  // 지부 변경 시 첫 번째 연락소로 기본 선택
  const activeLiaisonName = useMemo(() => {
    if (selectedLiaison && currentBranch?.liaisonOffices.includes(selectedLiaison)) {
      return selectedLiaison;
    }
    return currentBranch?.liaisonOffices[0] || '한진신항만(HJNC) 연락소';
  }, [currentBranch, selectedLiaison]);

  // 권역 필터링된 지부 목록
  const filteredBranches = useMemo(() => {
    if (sectorFilter === '전체') return branches;
    return branches.filter((b) => b.sector === sectorFilter);
  }, [branches, sectorFilter]);

  // 검색 및 필터링된 조합원 목록
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (branchFilter !== 'ALL' && m.branchId !== branchFilter && m.branchName !== branchFilter) {
        return false;
      }
      if (memberTypeFilter !== 'ALL' && m.memberType !== memberTypeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = m.name.toLowerCase().includes(q);
        const matchNo = m.memberNo.toLowerCase().includes(q);
        const matchGang = m.gangName.toLowerCase().includes(q);
        const matchLiaison = m.liaisonName.toLowerCase().includes(q);
        const matchRole = m.roleTitle.toLowerCase().includes(q);
        const matchBranch = m.branchName.toLowerCase().includes(q);
        if (!matchName && !matchNo && !matchGang && !matchLiaison && !matchRole && !matchBranch) {
          return false;
        }
      }
      return true;
    });
  }, [members, branchFilter, memberTypeFilter, searchQuery]);

  // 정조합원/임시조합원 카운트 계산
  const totalRegularCount = useMemo(() => {
    return members.filter((m) => m.memberType === '정조합원').length;
  }, [members]);

  const totalTempCount = useMemo(() => {
    return members.filter((m) => m.memberType === '임시조합원').length;
  }, [members]);

  // 신규 조합원 등록 제출 처리
  const handleSubmitNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name.trim()) {
      alert('조합원 성명을 올바르게 입력해주세요.');
      return;
    }

    const b = branches.find((item) => item.id === newMemberForm.branchId);
    const branchName = b ? b.name : '제3항업지부';

    const certList = newMemberForm.certifications
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const newRecord: UnionMemberRecord = {
      id: `M-${Date.now()}`,
      memberNo: `BPTU-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newMemberForm.name.trim(),
      birthYear: Number(newMemberForm.birthYear) || 1988,
      phone: newMemberForm.phone.trim() || '010-0000-0000',
      memberType: newMemberForm.memberType,
      roleTitle: newMemberForm.roleTitle,
      branchId: newMemberForm.branchId,
      branchName,
      liaisonName: newMemberForm.liaisonName,
      gangName: newMemberForm.gangName,
      squadName: newMemberForm.squadName,
      joinDate: new Date().toISOString().slice(0, 10),
      attendanceRate: 100.0,
      safetyScore: 100,
      deviceBound: true,
      certifications: certList.length > 0 ? certList : ['항만 안전기초 교육이수'],
      todayStatus: newMemberForm.todayStatus,
    };

    onAddMember(newRecord);
    setShowAddModal(false);
    setNewMemberForm({
      name: '',
      birthYear: 1988,
      phone: '010-',
      memberType: '정조합원',
      roleTitle: '조합원',
      branchId: branches[0]?.id || 'BR-03',
      liaisonName: branches[0]?.liaisonOffices[0] || '한진신항만(HJNC) 연락소',
      gangName: '본선·라싱 1반',
      squadName: '주간 A조',
      certifications: '선박 라싱 1급, 항만 안전교육 이수',
      todayStatus: '출역 완료 (안벽투입)',
    });
  };

  // 배경 및 텍스트 토큰
  const themeCard = highContrastDark
    ? 'bg-[#0E1626] border-[#1F2C47] text-slate-100'
    : 'bg-white border-slate-200 text-slate-900 shadow-xs';
  const themeSub = highContrastDark ? 'text-slate-400' : 'text-slate-600';
  const themeBorder = highContrastDark ? 'border-[#1F2C47]' : 'border-slate-200';

  return (
    <div className="space-y-6">
      {/* ==================================================================== */}
      {/* 1. 상단 직책 맞춤형 지휘 브리핑 배너 (Role-Adaptive Command Banner)   */}
      {/* ==================================================================== */}
      <section
        className={`p-5 sm:p-6 rounded-2xl border transition-all ${
          highContrastDark
            ? 'bg-gradient-to-br from-[#0B1324] via-[#0E172A] to-[#121E36] border-blue-900/60 shadow-lg'
            : 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border-slate-800 shadow-md'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide bg-blue-500 text-white shadow-xs">
                {activeRole.levelBadge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                지휘 브리핑 사령탑
              </span>
              <span className="text-xs text-slate-300">
                접속 직책: <strong className="text-white font-bold">{activeRole.title}</strong> ({activeRole.holderName})
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-400 shrink-0" />
              <span>{activeRole.orgUnitName}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
              {activeRole.scopeSummary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onTogglePrivacyMask}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                privacyMasked
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30'
              }`}
            >
              {privacyMasked ? (
                <>
                  <EyeOff className="w-4 h-4 text-amber-300" />
                  <span>개인정보 마스킹 켜짐 (강*수)</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-emerald-300" />
                  <span>실명 표시 모드 (강민수)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>신규 조합원 등록</span>
            </button>
          </div>
        </div>

        {/* 현재 직책의 보유 권한 배지 */}
        <div className="pt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>현재 직책 인가 권한 범위 (Active RBAC Scope)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeRole.permissions.map((perm, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white/10 text-slate-200 border border-white/10 backdrop-blur-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                {perm}
              </span>
            ))}
          </div>
        </div>

        {/* 7대 모듈 빠른 이동 바로가기 그리드 */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300">
              부산항운노조 7대 핵심 모듈 빠른 지휘 이동 (Direct Module Jump)
            </span>
            <span className="text-[11px] text-slate-400">클릭 시 해당 업무 관제 모듈로 즉시 전환</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {MODULE_QUICK_NAV.map((mod) => {
              const isCurrent = mod.id === 'org';
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => onNavigateModule(mod.id)}
                  className={`text-left p-3 rounded-xl border transition-all relative group flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-blue-600/30 border-blue-400 text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-white/10 text-slate-200">
                      {mod.code}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        isCurrent
                          ? 'bg-blue-500 text-white font-bold'
                          : 'bg-slate-700/60 text-slate-300'
                      }`}
                    >
                      {mod.badge}
                    </span>
                  </div>
                  <div className="font-bold text-xs leading-snug flex items-center justify-between gap-1">
                    <span>{mod.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-1 font-normal">
                    {mod.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. 전사 6단계 계층 인터랙티브 조직도 트리 (6-Level Interactive Tree)  */}
      {/* ==================================================================== */}
      <section className={`p-5 sm:p-6 rounded-2xl border ${themeCard}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-inherit">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <Network className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                전사 6단계 동적 조직도 계층 트리 (Dynamic Org Hierarchy)
              </h2>
            </div>
            <p className={`text-xs sm:text-sm ${themeSub}`}>
              Lv.1 중앙본부(6개 부서·9개 위원회) → Lv.2 24개 산하 지부 → Lv.3 부두 연락소 → Lv.4 작업반 → Lv.5 교대조 → Lv.6 조합원
            </p>
          </div>

          {/* 중앙본부 직할 부서·위원회 열기 토글 */}
          <button
            type="button"
            onClick={() => setShowHqDetails((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              showHqDetails
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : highContrastDark
                ? 'bg-[#142038] hover:bg-[#1A2A4A] border-[#253556] text-blue-300'
                : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Lv.1 중앙본부 6개 부서·9개 위원회 직할구조 {showHqDetails ? '접기' : '펼치기'}</span>
          </button>
        </div>

        {/* Lv.1 중앙본부 세부 부서 및 위원회 구조 드릴다운 패널 */}
        {showHqDetails && (
          <div
            className={`my-4 p-4 rounded-xl border space-y-4 ${
              highContrastDark ? 'bg-[#0B1220] border-blue-900/40' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>중앙본부 6개 핵심 총괄 집행부서 (Headquarters Core Executive)</span>
                </h3>
                <span className={`text-[11px] ${themeSub}`}>부산 동구 초량동 중앙본부 총괄 집행</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {HQ_DEPARTMENTS.map((dept, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      highContrastDark
                        ? 'bg-[#111C32] border-[#223354]'
                        : 'bg-white border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-blue-500">{dept.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-500">
                        상근 {dept.staff}명
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-300 dark:text-slate-300">
                      책임: {dept.head}
                    </div>
                    <p className={`text-[11px] ${themeSub} line-clamp-1`}>{dept.roles}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-purple-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>중앙본부 9대 상설 의결·감독 위원회 (9 Standing Committees)</span>
                </h3>
                <span className={`text-[11px] ${themeSub}`}>독립 의결 및 규약 준수 감독</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {HQ_COMMITTEES.map((comm, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs ${
                      highContrastDark ? 'bg-[#111C32] border-[#223354]' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs truncate text-purple-400">{comm.name}</div>
                    <div className={`text-[10px] ${themeSub} line-clamp-1 mt-0.5`}>{comm.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lv.2 24개 지부 탐색 및 권역별 필터 */}
        <div className="pt-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold tracking-wide flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white">
                Lv.2
              </span>
              <span>24개 산하 지부 선택 (지부 카드를 클릭하여 하위 3~6단계 드릴다운)</span>
            </span>

            {/* 권역 필터 탭 */}
            <div className="flex flex-wrap gap-1">
              {['전체', '신항 남측', '신항 북측', '북항 권역', '감천·특수부두', '물류·냉동·기타'].map(
                (sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSectorFilter(sec)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      sectorFilter === sec
                        ? 'bg-blue-600 text-white shadow-xs'
                        : highContrastDark
                        ? 'bg-[#142038] hover:bg-[#1A2A4A] text-slate-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {sec}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 지부 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredBranches.map((br) => {
              const isSelected = br.id === selectedBranchId;
              const totalMembers = br.regularCount + br.tempCount;
              return (
                <div
                  key={br.id}
                  onClick={() => {
                    setSelectedBranchId(br.id);
                    if (br.liaisonOffices.length > 0) {
                      setSelectedLiaison(br.liaisonOffices[0]);
                    }
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? highContrastDark
                        ? 'bg-blue-950/40 border-blue-500 shadow-md ring-2 ring-blue-500/30'
                        : 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : highContrastDark
                      ? 'bg-[#111A2E] hover:bg-[#15223C] border-[#1E2E4E]'
                      : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 font-mono">
                        {br.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-500">
                        {br.sector}
                      </span>
                    </div>

                    <div className="font-bold text-sm sm:text-base leading-snug flex items-center justify-between">
                      <span>{br.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                    </div>

                    <p className={`text-xs ${themeSub} flex items-center gap-1`}>
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{br.chiefName}</span>
                    </p>
                  </div>

                  {/* 지부 메트릭 수치 */}
                  <div className="mt-3 pt-2.5 border-t border-inherit grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className={`text-[10px] block ${themeSub}`}>정조합원 / 임시</span>
                      <span className="font-bold font-mono">
                        {br.regularCount.toLocaleString()} / {br.tempCount.toLocaleString()}명
                      </span>
                    </div>
                    <div>
                      <span className={`text-[10px] block ${themeSub}`}>오늘 출역률</span>
                      <span className="font-bold font-mono text-emerald-500">
                        {br.todayAttendanceRate}%
                      </span>
                    </div>
                    <div>
                      <span className={`text-[10px] block ${themeSub}`}>가동 선석</span>
                      <span className="font-bold font-mono text-blue-400">
                        {br.activeVesselsCount}개 선석
                      </span>
                    </div>
                    <div>
                      <span className={`text-[10px] block ${themeSub}`}>미결재 건수</span>
                      <span
                        className={`font-bold font-mono ${
                          br.pendingApprovals > 0 ? 'text-amber-500' : 'text-slate-400'
                        }`}
                      >
                        {br.pendingApprovals}건
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================== */}
        {/* 선택된 지부의 하위 드릴다운 (Lv.3 연락소 -> Lv.4 작업반 -> Lv.5 교대조) */}
        {/* ================================================================== */}
        {currentBranch && (
          <div
            className={`mt-6 p-4 sm:p-5 rounded-xl border space-y-4 ${
              highContrastDark ? 'bg-[#0B1220] border-blue-900/50' : 'bg-slate-50 border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-inherit">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-500">
                  <span>Lv.2 {currentBranch.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="font-bold">산하 드릴다운 관제</span>
                </div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <span>{currentBranch.name} 상세 현장 지휘망</span>
                  <span className="text-xs font-normal text-slate-400">
                    (총원 {(currentBranch.regularCount + currentBranch.tempCount).toLocaleString()}명 ·{' '}
                    {currentBranch.liaisonOffices.length}개 연락소 · {currentBranch.workGangsCount}개 작업반)
                  </span>
                </h3>
              </div>

              {/* 해당 지부 명부 자동 필터 버튼 */}
              <button
                type="button"
                onClick={() => {
                  setBranchFilter(currentBranch.id);
                  const el = document.getElementById('bptu-member-roster-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all shrink-0"
              >
                <Users className="w-3.5 h-3.5" />
                <span>이 지부 소속 조합원 명부 보기 ({currentBranch.name})</span>
              </button>
            </div>

            {/* Lv.3 부두 연락소 선택 탭 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded-xs text-[10px] font-bold bg-blue-500/20 text-blue-400">
                    Lv.3
                  </span>
                  <span>관할 터미널/부두 연락소 선택:</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  총 {currentBranch.liaisonOffices.length}개 거점 운용중
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentBranch.liaisonOffices.map((liaison) => {
                  const isActive = liaison === activeLiaisonName;
                  return (
                    <button
                      key={liaison}
                      type="button"
                      onClick={() => setSelectedLiaison(liaison)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                        isActive
                          ? 'bg-blue-600 border-blue-500 text-white shadow-sm ring-1 ring-blue-400'
                          : highContrastDark
                          ? 'bg-[#121B2F] border-[#1F2C47] text-slate-300 hover:bg-[#18243E]'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                      <span>{liaison}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lv.4 작업반 & Lv.5 교대조 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Lv.4 전문 작업반 (Gangs) */}
              <div
                className={`p-3.5 rounded-xl border space-y-3 ${
                  highContrastDark ? 'bg-[#0E1626] border-[#1D2942]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-inherit pb-2">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-blue-500">
                    <span className="px-1.5 py-0.5 rounded-xs text-[10px] font-bold bg-blue-500 text-white">
                      Lv.4
                    </span>
                    <span>{activeLiaisonName} 소속 전문 작업반 (Gangs)</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">5개 전문 공정반</span>
                </div>

                <div className="space-y-2">
                  {[
                    { name: '본선·라싱 1반', foreman: '박성민 반장', headcount: 64, task: '컨테이너 양적하 및 고박' },
                    { name: '본선·라싱 2반', foreman: '최동욱 반장', headcount: 58, task: '초대형선 4단 장대 라싱' },
                    { name: '야드·크레인 1반', foreman: '이강호 반장', headcount: 42, task: 'ARMGC / YT 이적 관제' },
                    { name: '전문 신호수반', foreman: '김민석 반장', headcount: 36, task: '안벽 크레인 3D 수신호' },
                    { name: '특수·CFS반', foreman: '장도현 반장', headcount: 28, task: '위험물(IMDG) 및 보세적입' },
                  ].map((gang, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                        highContrastDark ? 'bg-[#131C30] border-[#22304D]' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{gang.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({gang.foreman})</span>
                        </div>
                        <div className={`text-[11px] ${themeSub} mt-0.5`}>{gang.task}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-blue-400">{gang.headcount}명</span>
                        <span className="block text-[10px] text-emerald-500">전원 출역완료</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lv.5 실근로 교대조 (Shifts & Squads) */}
              <div
                className={`p-3.5 rounded-xl border space-y-3 ${
                  highContrastDark ? 'bg-[#0E1626] border-[#1D2942]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-inherit pb-2">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-purple-500">
                    <span className="px-1.5 py-0.5 rounded-xs text-[10px] font-bold bg-purple-600 text-white">
                      Lv.5
                    </span>
                    <span>본선·라싱 1반 산하 실근로 교대작업조 (Squads)</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">4개 순환조 운용</span>
                </div>

                <div className="space-y-2">
                  {[
                    { name: '주간 A조', leader: '김태훈 조장', hours: '08:00 ~ 20:00', status: '현장 안벽 작업중', count: 16, badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
                    { name: '주간 B조', leader: '정우영 조장', hours: '08:00 ~ 20:00', status: '터미널 대기조', count: 16, badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
                    { name: '야간 A조', leader: '임준택 조장', hours: '20:00 ~ 08:00', status: '19:30 점호 대기', count: 16, badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
                    { name: '야간 B조', leader: '강현우 조장', hours: '20:00 ~ 08:00', status: '야간 집중조 배정', count: 16, badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
                  ].map((squad, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                        highContrastDark ? 'bg-[#131C30] border-[#22304D]' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{squad.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({squad.leader})</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">{squad.hours}</div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${squad.badgeColor}`}>
                          {squad.status}
                        </span>
                        <div className="font-bold font-mono text-slate-300">{squad.count}명 편성</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 3. 9,709명 조합원 명부 초고속 검색 & 신규 등록 (Member Roster Engine) */}
      {/* ==================================================================== */}
      <section id="bptu-member-roster-section" className={`p-5 sm:p-6 rounded-2xl border ${themeCard}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-inherit">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                9,709명 전사 조합원 통합 명부 (Unified Member Roster)
              </h2>
            </div>
            <p className={`text-xs sm:text-sm ${themeSub}`}>
              정조합원 {totalRegularCount.toLocaleString()}명 · 임시조합원 {totalTempCount.toLocaleString()}명 | 1인 1기기 FIDO 단말 바인딩 및 무사고 안전점수 실시간 연동
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onTogglePrivacyMask}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                privacyMasked
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-500 hover:bg-amber-500/25'
                  : highContrastDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              {privacyMasked ? (
                <>
                  <EyeOff className="w-4 h-4 text-amber-500" />
                  <span>개인정보 마스킹 (강*수)</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-emerald-500" />
                  <span>실명 노출 모드 (강민수)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>신규 임시/정조합원 등록</span>
            </button>
          </div>
        </div>

        {/* 검색 및 필터 툴바 */}
        <div className="pt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 검색어 입력창 */}
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="성명, 사번(BPTU-...), 작업반, 부두연락소 초고속 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-colors outline-hidden ${
                  highContrastDark
                    ? 'bg-[#111A2D] border-[#223354] text-white focus:border-blue-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                }`}
              />
            </div>

            {/* 지부 필터 드롭다운 */}
            <div>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors outline-hidden ${
                  highContrastDark
                    ? 'bg-[#111A2D] border-[#223354] text-slate-200'
                    : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                <option value="ALL">전체 24개 지부 통합</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 정조합원/임시조합원 신분 탭 필터 */}
            <div className="flex rounded-xl p-1 border border-inherit">
              {(['ALL', '정조합원', '임시조합원'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMemberTypeFilter(type)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    memberTypeFilter === type
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type === 'ALL' ? '전체 신분' : type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>
              검색 필터 결과: <strong className="text-blue-500 font-bold">{filteredMembers.length}</strong>명 표시중
            </span>
            {(searchQuery || branchFilter !== 'ALL' || memberTypeFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setBranchFilter('ALL');
                  setMemberTypeFilter('ALL');
                }}
                className="text-xs text-blue-500 hover:underline font-sans"
              >
                필터 초기화
              </button>
            )}
          </div>
        </div>

        {/* 조합원 명부 고밀도 테이블 / 카드 뷰 */}
        <div className="mt-4 overflow-x-auto border border-inherit rounded-xl">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b border-inherit font-bold text-slate-400 ${
                highContrastDark ? 'bg-[#0B1322]' : 'bg-slate-50'
              }`}
            >
              <tr>
                <th className="py-3 px-4">조합원 번호</th>
                <th className="py-3 px-4">성명 / 나이</th>
                <th className="py-3 px-4">신분 / 직책</th>
                <th className="py-3 px-4">소속 지부 · 연락소 · 작업반</th>
                <th className="py-3 px-4">1인 1기기 (FIDO)</th>
                <th className="py-3 px-4">출역률 / 안전점수</th>
                <th className="py-3 px-4">보유 자격증</th>
                <th className="py-3 px-4">오늘 출역 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold">조건에 일치하는 조합원이 없습니다.</p>
                    <p className="text-xs mt-1">검색어나 지부 필터를 확인해주세요.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr
                    key={m.id}
                    className={`transition-colors ${
                      highContrastDark ? 'hover:bg-[#131D33]' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* 사번 */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-400 shrink-0">
                      {m.memberNo}
                    </td>

                    {/* 성명 (마스킹 적용) */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-sm text-slate-100 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{maskKoreanName(m.name, privacyMasked)}</span>
                        {m.roleTitle === '대의원' && (
                          <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            대의원
                          </span>
                        )}
                      </div>
                      <div className={`text-[11px] ${themeSub}`}>
                        {2026 - m.birthYear}세 ({m.birthYear}년생) · {m.phone.slice(0, 9)}****
                      </div>
                    </td>

                    {/* 신분 & 직책 */}
                    <td className="py-3 px-4 space-y-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          m.memberType === '정조합원'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {m.memberType}
                      </span>
                      <div className="font-medium text-slate-300 text-[11px]">{m.roleTitle}</div>
                    </td>

                    {/* 소속 조직망 */}
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-semibold text-xs text-slate-200">
                        {m.branchName}
                      </div>
                      <div className={`text-[11px] ${themeSub}`}>
                        {m.liaisonName} &gt; {m.gangName} ({m.squadName})
                      </div>
                    </td>

                    {/* FIDO 1인 1기기 바인딩 */}
                    <td className="py-3 px-4">
                      {m.deviceBound ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>FIDO 등록 완료</span>
                        </div>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          미등록 (점호제한)
                        </span>
                      )}
                    </td>

                    {/* 출역률 / 안전점수 */}
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">{m.attendanceRate}%</span>
                        <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400"
                            style={{ width: `${Math.min(m.attendanceRate, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                        <ShieldCheck className="w-3 h-3 text-blue-400" />
                        <span>안전 {m.safetyScore}점</span>
                      </div>
                    </td>

                    {/* 보유 자격증 */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {m.certifications.map((cert, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50"
                          >
                            <Award className="w-3 h-3 text-amber-400" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* 오늘 출역 상태 */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          m.todayStatus === '출역 완료 (안벽투입)'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : m.todayStatus === '출역 대기 (주간조)'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : m.todayStatus === '야간조 교대대기'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                        }`}
                      >
                        {m.todayStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 신규 임시/정조합원 등록 모달 (Add Member Modal)                     */}
      {/* ==================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className={`w-full max-w-xl rounded-2xl border p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto ${
              highContrastDark ? 'bg-[#0E1626] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <UserPlus className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">신규 임시/정조합원 인사 등록</h3>
                  <p className="text-xs text-slate-400">
                    BPTU 6단계 계층 체계에 배속 및 1인 1기기 FIDO 가계정 생성
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10"
              >
                닫기
              </button>
            </div>

            <form onSubmit={handleSubmitNewMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 성명 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">조합원 성명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-hidden ${
                      highContrastDark
                        ? 'bg-[#121B2E] border-slate-700 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* 생년 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">출생연도 (4자리) *</label>
                  <input
                    type="number"
                    required
                    min={1950}
                    max={2008}
                    value={newMemberForm.birthYear}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, birthYear: Number(e.target.value) })
                    }
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-hidden ${
                      highContrastDark
                        ? 'bg-[#121B2E] border-slate-700 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* 연락처 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">휴대폰 번호 *</label>
                  <input
                    type="text"
                    required
                    placeholder="010-1234-5678"
                    value={newMemberForm.phone}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-hidden ${
                      highContrastDark
                        ? 'bg-[#121B2E] border-slate-700 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* 신분 구분 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">조합원 신분 *</label>
                  <select
                    value={newMemberForm.memberType}
                    onChange={(e) =>
                      setNewMemberForm({
                        ...newMemberForm,
                        memberType: e.target.value as '정조합원' | '임시조합원',
                      })
                    }
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border outline-hidden ${
                      highContrastDark
                        ? 'bg-[#121B2E] border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="정조합원">정조합원 (정규 대의원 선거권자)</option>
                    <option value="임시조합원">임시조합원 (수습/일일 전환 후보)</option>
                  </select>
                </div>

                {/* 직책 구분 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">직책 *</label>
                  <select
                    value={newMemberForm.roleTitle}
                    onChange={(e) =>
                      setNewMemberForm({
                        ...newMemberForm,
                        roleTitle: e.target.value as '조합원' | '작업조장' | '작업반장' | '연락소장' | '대의원',
                      })
                    }
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border outline-hidden ${
                      highContrastDark
                        ? 'bg-[#121B2E] border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="조합원">현장 조합원</option>
                    <option value="작업조장">작업조장 (Lv.5)</option>
                    <option value="작업반장">작업반장 (Lv.4)</option>
                    <option value="연락소장">연락소장 (Lv.3)</option>
                    <option value="대의원">선출직 대의원</option>
                  </select>
                </div>

                {/* 소속 지부 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">배속 지부 *</label>
                  <select
                    value={newMemberForm.branchId}
                    onChange={(e) => {
                      const br = branches.find((item) => item.id === e.target.value);
                      setNewMemberForm({
                        ...newMemberForm,
                        branchId: e.target.value,
                        liaisonName: br?.liaisonOffices[0] || '한진신항만(HJNC) 연락소',
                      });
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border outline-hidden ${
                      highContrastDark
                        ? 'bg-[#121B2E] border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 부두 연락소 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">부두 연락소 *</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.liaisonName}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, liaisonName: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-hidden ${
                      highContrastDark
                        ? 'bg-[#121B2E] border-slate-700 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* 작업반 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">소속 작업반 *</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.gangName}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, gangName: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-hidden ${
                      highContrastDark
                        ? 'bg-[#121B2E] border-slate-700 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* 교대조 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">소속 교대조 *</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.squadName}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, squadName: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-hidden ${
                      highContrastDark
                        ? 'bg-[#121B2E] border-slate-700 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* 오늘 출역 상태 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">오늘 출역 상태 *</label>
                  <select
                    value={newMemberForm.todayStatus}
                    onChange={(e) =>
                      setNewMemberForm({
                        ...newMemberForm,
                        todayStatus: e.target.value as any,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border outline-hidden ${
                      highContrastDark
                        ? 'bg-[#121B2E] border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="출역 완료 (안벽투입)">출역 완료 (안벽투입)</option>
                    <option value="출역 대기 (주간조)">출역 대기 (주간조)</option>
                    <option value="야간조 교대대기">야간조 교대대기</option>
                    <option value="공가/휴무">공가/휴무</option>
                  </select>
                </div>
              </div>

              {/* 자격증 목록 (쉼표 구분) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  보유 자격증 (쉼표로 구분하여 여러 개 입력 가능)
                </label>
                <input
                  type="text"
                  placeholder="선박 라싱 1급, 항만 안전교육 이수, 지게차 운전"
                  value={newMemberForm.certifications}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, certifications: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-hidden ${
                    highContrastDark
                      ? 'bg-[#121B2E] border-slate-700 text-white focus:border-blue-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="pt-3 border-t border-inherit flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all active:scale-95"
                >
                  인사 등록 및 명부 등재
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
