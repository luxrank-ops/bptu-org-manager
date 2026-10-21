export type RoleTierId =
  | 'LV1_HQ'
  | 'LV2_BRANCH'
  | 'LV3_LIAISON'
  | 'LV4_GANG'
  | 'LV5_SQUAD'
  | 'LV6_MEMBER';

export type ModuleTabId =
  | 'org'
  | 'dispatch'
  | 'governance'
  | 'payroll'
  | 'research'
  | 'pr'
  | 'legal';

export interface RoleTierProfile {
  id: RoleTierId;
  levelBadge: string;
  title: string;
  holderName: string;
  orgUnitName: string;
  scopeSummary: string;
  defaultModule: ModuleTabId;
  permissions: string[];
}

export const ROLE_TIER_PROFILES: RoleTierProfile[] = [
  {
    id: 'LV1_HQ',
    levelBadge: 'Lv.1 중앙본부',
    title: '위원장 (중앙본부 총괄)',
    holderName: '이춘학 위원장',
    orgUnitName: '부산항운노동조합 중앙본부 (초량동 · 6개 부서 · 9개 위원회)',
    scopeSummary: '전사 24개 지부 · 9대 연락소 · 9,709명(정 7,280 / 임시 2,429) 통합 관제 및 최종 승인',
    defaultModule: 'org',
    permissions: ['전사 조직도·인사 최종승인', '임단협 팩트북·전자투표 발의', '클린 신문고 직할조사', '전사 긴급공지 브로드캐스트'],
  },
  {
    id: 'LV2_BRANCH',
    levelBadge: 'Lv.2 산하지부',
    title: '지부장 (항업/권역 지부)',
    holderName: '박진우 제3항업지부장',
    orgUnitName: '제3항업지부 (부산신항 남측 · HJNC/BNCT/DGT/BCT 관할)',
    scopeSummary: '관할 지부 1,840명 인력 수급 조정 · 투명 승진/채용 심사 · 지부 복지 결재',
    defaultModule: 'org',
    permissions: ['지부 산하 연락소·반 인력조정', '정조합원 전환 다면심사', '지부 회계·복지 2차 결재', '하역사 단협안 검토요청'],
  },
  {
    id: 'LV3_LIAISON',
    levelBadge: 'Lv.3 부두연락소',
    title: '연락소장 (터미널 현장소장)',
    holderName: '최동훈 한진(HJNC) 연락소장',
    orgUnitName: '한진부산컨테이너터미널(HJNC) 연락소 (신항 3부두)',
    scopeSummary: '실시간 접안 모선 선석 스케줄 연동 일일 배차 편성 및 부두 안전 관제',
    defaultModule: 'dispatch',
    permissions: ['모선 선석별 작업반 배차 편성', '터미널 하역물량(VAN) 대조', '부두 안전점검 및 작업중지권 발동 보고'],
  },
  {
    id: 'LV4_GANG',
    levelBadge: 'Lv.4 작업반',
    title: '작업반장 (본선·라싱·야드)',
    holderName: '박성민 본선·라싱 1반장',
    orgUnitName: 'HJNC 연락소 본선·라싱 1반 (정원 64명)',
    scopeSummary: '작업반원 대면 출역 점호 · 결원 시 공정순번 호출 · 3-Tap 작업일보 제출',
    defaultModule: 'dispatch',
    permissions: ['반원 BLE/QR 대면 실물점호', '결원 발생 시 대기조 1탭 호출', '일일 하역 작업일보 전자서명'],
  },
  {
    id: 'LV5_SQUAD',
    levelBadge: 'Lv.5 교대작업조',
    title: '작업조장 (주·야간 교대조)',
    holderName: '김태훈 주간 A조장',
    orgUnitName: 'HJNC 라싱 1반 주간 A조 (조원 16명)',
    scopeSummary: '안벽 현장 조원 안전·장구 점검, 카톡 1초 교대 브리핑, 복지 1차 현장확인',
    defaultModule: 'dispatch',
    permissions: ['교대 인수인계 카톡 1초 브리핑', '조원 안전장구·피로도 체크', '경조사·휴가 신청 1차 확인'],
  },
  {
    id: 'LV6_MEMBER',
    levelBadge: 'Lv.6 현장조합원',
    title: '조합원 (정조합원 / 임시조합원)',
    holderName: '강민수 조합원 (정조합원 #30412)',
    orgUnitName: '제3항업지부 > HJNC 연락소 > 본선·라싱 1반 > 주간 A조',
    scopeSummary: '1초 QR/GPS 출역 인증, 오늘 내 배차·선석, 1초 급여명세서, 비밀투표, 산재 119',
    defaultModule: 'payroll',
    permissions: ['1인 1기기 GPS/QR 출역 체크인', 'Toss형 1초 급여·조합비 조회', '경조사·공제 원탭 신청', '비밀 전자투표 및 익명 신문고'],
  },
];

export interface BranchSummary {
  id: string;
  name: string;
  sector: '신항 남측' | '신항 북측' | '북항 권역' | '감천·특수부두' | '물류·냉동·기타';
  chiefName: string;
  regularCount: number;
  tempCount: number;
  liaisonOffices: string[];
  workGangsCount: number;
  todayAttendanceRate: number;
  activeVesselsCount: number;
  pendingApprovals: number;
  unreadNoticeRate: number;
}

export const BPTU_BRANCHES: BranchSummary[] = [
  {
    id: 'BR-03',
    name: '제3항업지부 (신항 남측)',
    sector: '신항 남측',
    chiefName: '박진우 지부장',
    regularCount: 1420,
    tempCount: 420,
    liaisonOffices: ['한진신항만(HJNC) 연락소', '고려신항만(BNCT) 연락소', '동원글로벌(DGT) 연락소', '부산컨테이너(BCT) 연락소'],
    workGangsCount: 28,
    todayAttendanceRate: 97.4,
    activeVesselsCount: 14,
    pendingApprovals: 3,
    unreadNoticeRate: 4.2,
  },
  {
    id: 'BR-02',
    name: '제2항업지부 (신항 북측)',
    sector: '신항 북측',
    chiefName: '이정호 지부장',
    regularCount: 1380,
    tempCount: 390,
    liaisonOffices: ['부산신항만(PNC) 연락소', '부산신항국제(PNIT) 연락소', 'HMM신항만(HPNT) 연락소'],
    workGangsCount: 26,
    todayAttendanceRate: 96.8,
    activeVesselsCount: 12,
    pendingApprovals: 2,
    unreadNoticeRate: 5.8,
  },
  {
    id: 'BR-01',
    name: '제1항업지부 (북항 통합)',
    sector: '북항 권역',
    chiefName: '한승우 지부장',
    regularCount: 1150,
    tempCount: 310,
    liaisonOffices: ['북항통합(BPTC) 신선대 연락소', '북항 감만 연락소', '한국허치슨(HBCT) 연락소'],
    workGangsCount: 22,
    todayAttendanceRate: 95.9,
    activeVesselsCount: 9,
    pendingApprovals: 4,
    unreadNoticeRate: 6.1,
  },
  {
    id: 'BR-04',
    name: '냉동화물지부',
    sector: '물류·냉동·기타',
    chiefName: '정우성 지부장',
    regularCount: 640,
    tempCount: 280,
    liaisonOffices: ['감천 냉동1연락소', '감천 냉동2연락소', '남항 냉동연락소'],
    workGangsCount: 14,
    todayAttendanceRate: 94.5,
    activeVesselsCount: 6,
    pendingApprovals: 1,
    unreadNoticeRate: 7.4,
  },
  {
    id: 'BR-05',
    name: '감천항지부',
    sector: '감천·특수부두',
    chiefName: '김동현 지부장',
    regularCount: 580,
    tempCount: 240,
    liaisonOffices: ['감천 서부두 연락소', '감천 중앙부두 연락소', '수산부두 연락소'],
    workGangsCount: 12,
    todayAttendanceRate: 95.2,
    activeVesselsCount: 7,
    pendingApprovals: 2,
    unreadNoticeRate: 8.0,
  },
  {
    id: 'BR-06',
    name: '항만물류·CFS지부',
    sector: '물류·냉동·기타',
    chiefName: '윤재현 지부장',
    regularCount: 520,
    tempCount: 210,
    liaisonOffices: ['신항 배후단지 물류연락소', '북항 CFS 연락소'],
    workGangsCount: 11,
    todayAttendanceRate: 96.1,
    activeVesselsCount: 5,
    pendingApprovals: 0,
    unreadNoticeRate: 3.5,
  },
  {
    id: 'BR-07',
    name: '양곡·벌크·특수하역지부 (외 17개 지부 통합)',
    sector: '감천·특수부두',
    chiefName: '오세훈 지부장 외 17인',
    regularCount: 1590,
    tempCount: 579,
    liaisonOffices: ['양곡부두 연락소', '고철부두 연락소', '국제여객 연락소', '청과·수산 연락소'],
    workGangsCount: 34,
    todayAttendanceRate: 95.0,
    activeVesselsCount: 11,
    pendingApprovals: 5,
    unreadNoticeRate: 6.9,
  },
];

export interface UnionMemberRecord {
  id: string;
  memberNo: string;
  name: string;
  birthYear: number;
  phone: string;
  memberType: '정조합원' | '임시조합원';
  roleTitle: '조합원' | '작업조장' | '작업반장' | '연락소장' | '지부장' | '대의원';
  branchId: string;
  branchName: string;
  liaisonName: string;
  gangName: string;
  squadName: string;
  joinDate: string;
  attendanceRate: number;
  safetyScore: number;
  deviceBound: boolean;
  certifications: string[];
  todayStatus: '출역 완료 (안벽투입)' | '출역 대기 (주간조)' | '야간조 교대대기' | '공가/휴무';
}

export const INITIAL_UNION_MEMBERS: UnionMemberRecord[] = [
  {
    id: 'M-01',
    memberNo: 'BPTU-30412',
    name: '강민수',
    birthYear: 1978,
    phone: '010-2846-8906',
    memberType: '정조합원',
    roleTitle: '조합원',
    branchId: 'BR-03',
    branchName: '제3항업지부',
    liaisonName: '한진신항만(HJNC) 연락소',
    gangName: '본선·라싱 1반',
    squadName: '주간 A조',
    joinDate: '2014-03-15',
    attendanceRate: 98.4,
    safetyScore: 100,
    deviceBound: true,
    certifications: ['선박 라싱 1급', '신호수 자격', '유해위험작업 특별교육'],
    todayStatus: '출역 완료 (안벽투입)',
  },
  {
    id: 'M-02',
    memberNo: 'BPTU-21088',
    name: '김태훈',
    birthYear: 1973,
    phone: '010-5412-3391',
    memberType: '정조합원',
    roleTitle: '작업조장',
    branchId: 'BR-03',
    branchName: '제3항업지부',
    liaisonName: '한진신항만(HJNC) 연락소',
    gangName: '본선·라싱 1반',
    squadName: '주간 A조',
    joinDate: '2008-07-01',
    attendanceRate: 99.1,
    safetyScore: 100,
    deviceBound: true,
    certifications: ['작업조장 안전관리자', '중량물 줄걸이 특급', '선박 신호수'],
    todayStatus: '출역 완료 (안벽투입)',
  },
  {
    id: 'M-03',
    memberNo: 'BPTU-10495',
    name: '박성민',
    birthYear: 1968,
    phone: '010-8821-7740',
    memberType: '정조합원',
    roleTitle: '작업반장',
    branchId: 'BR-03',
    branchName: '제3항업지부',
    liaisonName: '한진신항만(HJNC) 연락소',
    gangName: '본선·라싱 1반',
    squadName: '반 총괄',
    joinDate: '2001-05-10',
    attendanceRate: 99.6,
    safetyScore: 100,
    deviceBound: true,
    certifications: ['항만하역 안전관리 총괄', '대의원 겸임', '응급처치 강사'],
    todayStatus: '출역 완료 (안벽투입)',
  },
  {
    id: 'M-04',
    memberNo: 'BPTU-88410',
    name: '이준호',
    birthYear: 1991,
    phone: '010-3910-4821',
    memberType: '임시조합원',
    roleTitle: '조합원',
    branchId: 'BR-03',
    branchName: '제3항업지부',
    liaisonName: '한진신항만(HJNC) 연락소',
    gangName: '본선·라싱 1반',
    squadName: '주간 A조',
    joinDate: '2023-11-01',
    attendanceRate: 96.8,
    safetyScore: 98,
    deviceBound: true,
    certifications: ['신규 항만안전 기초이수', '선박 라싱 자격'],
    todayStatus: '출역 완료 (안벽투입)',
  },
  {
    id: 'M-05',
    memberNo: 'BPTU-30921',
    name: '조규성',
    birthYear: 1984,
    phone: '010-6210-9912',
    memberType: '정조합원',
    roleTitle: '조합원',
    branchId: 'BR-03',
    branchName: '제3항업지부',
    liaisonName: '동원글로벌(DGT) 연락소',
    gangName: '야드·신호수 2반',
    squadName: '주간 B조',
    joinDate: '2016-09-12',
    attendanceRate: 97.2,
    safetyScore: 99,
    deviceBound: true,
    certifications: ['YT 트랙터 1종', '무인크레인 신호수'],
    todayStatus: '출역 완료 (안벽투입)',
  },
  {
    id: 'M-06',
    memberNo: 'BPTU-28400',
    name: '손흥민',
    birthYear: 1981,
    phone: '010-7712-0019',
    memberType: '정조합원',
    roleTitle: '대의원',
    branchId: 'BR-02',
    branchName: '제2항업지부',
    liaisonName: '부산신항만(PNC) 연락소',
    gangName: '본선하역 1반',
    squadName: '야간 A조',
    joinDate: '2012-04-20',
    attendanceRate: 98.9,
    safetyScore: 100,
    deviceBound: true,
    certifications: ['지부 선출 대의원', '위험물(IMDG) 취급 1급'],
    todayStatus: '야간조 교대대기',
  },
  {
    id: 'M-07',
    memberNo: 'BPTU-89104',
    name: '황희찬',
    birthYear: 1993,
    phone: '010-4491-2810',
    memberType: '임시조합원',
    roleTitle: '조합원',
    branchId: 'BR-01',
    branchName: '제1항업지부',
    liaisonName: '북항통합(BPTC) 신선대 연락소',
    gangName: '라싱·고박 3반',
    squadName: '주간 A조',
    joinDate: '2024-02-01',
    attendanceRate: 95.5,
    safetyScore: 97,
    deviceBound: true,
    certifications: ['라싱 안전교육 이수', '지게차 운전기능사'],
    todayStatus: '출역 대기 (주간조)',
  },
  {
    id: 'M-08',
    memberNo: 'BPTU-19022',
    name: '설영우',
    birthYear: 1966,
    phone: '010-9102-3318',
    memberType: '정조합원',
    roleTitle: '작업반장',
    branchId: 'BR-04',
    branchName: '냉동화물지부',
    liaisonName: '감천 냉동1연락소',
    gangName: '냉동창고 하역 1반',
    squadName: '반 총괄',
    joinDate: '1999-08-15',
    attendanceRate: 99.2,
    safetyScore: 100,
    deviceBound: true,
    certifications: ['저온(-20℃) 안전작업 지휘자', '보세화물 관리사'],
    todayStatus: '출역 완료 (안벽투입)',
  },
];

export function maskKoreanName(name: string, maskEnabled: boolean): string {
  if (!maskEnabled || !name || name.length < 2) return name;
  if (name.length === 2) return `${name[0]}*`;
  return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`;
}

export interface VesselGangDispatch {
  id: string;
  terminalCode: string;
  liaisonName: string;
  berthNo: string;
  vesselName: string;
  shippingLine: string;
  etb: string;
  etd: string;
  workloadTeuOrTon: string;
  assignedGang: string;
  assignedSquad: string;
  requiredHeadcount: number;
  checkedInHeadcount: number;
  ghostBlockedCount: number;
  windSpeedMs: number;
  status: '본선 작업중' | '출역 점호중' | '교대 인수인계' | '작업완료 정산대기';
}

export const INITIAL_VESSEL_DISPATCHES: VesselGangDispatch[] = [
  {
    id: 'DSP-HJNC-01',
    terminalCode: 'HJNC',
    liaisonName: '한진신항만(HJNC) 연락소',
    berthNo: '3B 선석',
    vesselName: 'ONE TRUTH',
    shippingLine: 'ONE',
    etb: '10/21 06:00',
    etd: '10/21 22:00',
    workloadTeuOrTon: '2,480 VAN (라싱·언라싱)',
    assignedGang: '본선·라싱 1반 (박성민 반장)',
    assignedSquad: '주간 A조 (김태훈 조장)',
    requiredHeadcount: 16,
    checkedInHeadcount: 16,
    ghostBlockedCount: 0,
    windSpeedMs: 6.4,
    status: '본선 작업중',
  },
  {
    id: 'DSP-HJNC-02',
    terminalCode: 'HJNC',
    liaisonName: '한진신항만(HJNC) 연락소',
    berthNo: '2B 선석',
    vesselName: 'HMM ALGECIRAS',
    shippingLine: 'HMM',
    etb: '10/21 08:00',
    etd: '10/22 05:00',
    workloadTeuOrTon: '3,120 VAN (초대형 모선 · 4단 장대 필수)',
    assignedGang: '본선·라싱 2반 (최동욱 반장)',
    assignedSquad: '주간 B조 (정우영 조장)',
    requiredHeadcount: 18,
    checkedInHeadcount: 17,
    ghostBlockedCount: 1,
    windSpeedMs: 7.1,
    status: '출역 점호중',
  },
  {
    id: 'DSP-PNC-01',
    terminalCode: 'PNC',
    liaisonName: '부산신항만(PNC) 연락소',
    berthNo: '1B 선석',
    vesselName: 'MSC GULSUN',
    shippingLine: 'MSC',
    etb: '10/21 07:30',
    etd: '10/21 23:30',
    workloadTeuOrTon: '2,890 VAN (위험물 IMDG 42 VAN 포함)',
    assignedGang: 'PNC 본선 1반',
    assignedSquad: '주간 A조',
    requiredHeadcount: 16,
    checkedInHeadcount: 16,
    ghostBlockedCount: 0,
    windSpeedMs: 5.8,
    status: '본선 작업중',
  },
  {
    id: 'DSP-DGT-01',
    terminalCode: 'DGT',
    liaisonName: '동원글로벌(DGT) 연락소',
    berthNo: '7A 선석 (스마트부두)',
    vesselName: 'CMA CGM MARCO POLO',
    shippingLine: 'CMA CGM',
    etb: '10/21 09:00',
    etd: '10/22 04:00',
    workloadTeuOrTon: '1,950 VAN (원격 크레인·신호수 협업)',
    assignedGang: '야드·신호수 2반',
    assignedSquad: '주간 B조',
    requiredHeadcount: 14,
    checkedInHeadcount: 14,
    ghostBlockedCount: 0,
    windSpeedMs: 6.9,
    status: '본선 작업중',
  },
];

export interface PromotionReviewCandidate {
  id: string;
  candidateName: string;
  memberNo: string;
  branchName: string;
  reviewType: '임시→정조합원 전환 심사' | '작업조장 민주선출·자격심사' | '작업반장 공개경쟁 심사';
  tenureYears: number;
  attendanceScore: number; // max 35
  safetyNoAccidentScore: number; // max 25
  certScore: number; // max 10
  tripartitePanelScore: number; // max 30 (노조 감사위 + 사측 + 외부 공익위원)
  totalScore: number;
  rank: number;
  status: '공개심사 통과 (승인대기)' | '노사정 다면평가 진행중' | '자격검증 완료';
  auditHash: string;
}

export const INITIAL_PROMOTION_CANDIDATES: PromotionReviewCandidate[] = [
  {
    id: 'PRM-01',
    candidateName: '이준호',
    memberNo: 'BPTU-88410',
    branchName: '제3항업지부 (HJNC 연락소)',
    reviewType: '임시→정조합원 전환 심사',
    tenureYears: 2.9,
    attendanceScore: 34.2,
    safetyNoAccidentScore: 25.0,
    certScore: 9.5,
    tripartitePanelScore: 28.4,
    totalScore: 97.1,
    rank: 1,
    status: '공개심사 통과 (승인대기)',
    auditHash: '0x9f84c2a1...e71b',
  },
  {
    id: 'PRM-02',
    candidateName: '황희찬',
    memberNo: 'BPTU-89104',
    branchName: '제1항업지부 (BPTC 신선대)',
    reviewType: '임시→정조합원 전환 심사',
    tenureYears: 2.7,
    attendanceScore: 33.5,
    safetyNoAccidentScore: 24.5,
    certScore: 9.0,
    tripartitePanelScore: 27.2,
    totalScore: 94.2,
    rank: 2,
    status: '공개심사 통과 (승인대기)',
    auditHash: '0x4a19d0b8...c302',
  },
  {
    id: 'PRM-03',
    candidateName: '조규성',
    memberNo: 'BPTU-30921',
    branchName: '제3항업지부 (DGT 연락소)',
    reviewType: '작업조장 민주선출·자격심사',
    tenureYears: 10.1,
    attendanceScore: 34.8,
    safetyNoAccidentScore: 25.0,
    certScore: 10.0,
    tripartitePanelScore: 28.9,
    totalScore: 98.7,
    rank: 1,
    status: '자격검증 완료',
    auditHash: '0x7e21f890...a114',
  },
];

export interface ElectronicBallot {
  id: string;
  title: string;
  scope: string;
  legalBasis: string;
  eligibleVoters: number;
  castVotes: number;
  deadline: string;
  status: '투표 진행중' | '정족수 달성 · 개표대기';
  options: { id: string; label: string; votes: number }[];
  userVotedOptionId?: string;
  userReceiptHash?: string;
}

export const INITIAL_BALLOTS: ElectronicBallot[] = [
  {
    id: 'VOTE-2026-10-01',
    title: '2026년도 부산항운노조 임금·단체협약 잠정합의안 찬반투표',
    scope: '전 지부 정조합원 (7,280명)',
    legalBasis: '노동조합법 제16조 · 제29조 (직접·비밀·무기명 전자투표)',
    eligibleVoters: 7280,
    castVotes: 6412,
    deadline: '2026-10-22 18:00 마감',
    status: '투표 진행중',
    options: [
      { id: 'YES', label: '찬성 (기본단가 5.4% 인상 및 자동화 부두 고용보장 명문화)', votes: 5380 },
      { id: 'NO', label: '반대 (재교섭 요구)', votes: 1032 },
    ],
  },
  {
    id: 'VOTE-2026-10-02',
    title: '제3항업지부 한진(HJNC) 연락소 작업반장 민주적 신임·선출 투표',
    scope: '제3항업지부 HJNC 연락소 소속 조합원 (412명)',
    legalBasis: '부산항운노조 인사제도 개선 협약 (지부장 단독추천 폐지 · 조합원 직접선출)',
    eligibleVoters: 412,
    castVotes: 389,
    deadline: '2026-10-21 20:00 마감',
    status: '정족수 달성 · 개표대기',
    options: [
      { id: 'CAND-1', label: '기호 1번 박성민 (무사고 25년 · 현 라싱1반장)', votes: 318 },
      { id: 'CAND-2', label: '기호 2번 김진수 (본선 신호수 18년)', votes: 71 },
    ],
  },
];

export interface WelfareApplicationItem {
  id: string;
  applicantName: string;
  memberNo: string;
  branchName: string;
  category: '경조사 지원금 (출산축하)' | '자녀 대학 학자금' | '항운신협 생활안정 저리대부' | '해운대 노조휴양소 예약';
  amountOrDetail: string;
  submittedAt: string;
  stage: 1 | 2 | 3 | 4; // 1: 조/반장 현장확인, 2: 지부 총무검토, 3: 본부 복지후생부 승인, 4: 펌뱅킹 지급완료
  stageLabel: string;
}

export const INITIAL_WELFARE_APPLICATIONS: WelfareApplicationItem[] = [
  {
    id: 'WLF-2026-108',
    applicantName: '강민수',
    memberNo: 'BPTU-30412',
    branchName: '제3항업지부 (HJNC)',
    category: '자녀 대학 학자금',
    amountOrDetail: '2,200,000원 (2026년 2학기 등록금 영수증 OCR 검증완료)',
    submittedAt: '2026-10-19 14:20',
    stage: 3,
    stageLabel: '3단계: 본부 복지후생부 최종승인 완료 (10/22 이체예정)',
  },
  {
    id: 'WLF-2026-109',
    applicantName: '이준호',
    memberNo: 'BPTU-88410',
    branchName: '제3항업지부 (HJNC)',
    category: '경조사 지원금 (출산축하)',
    amountOrDetail: '1,000,000원 + 출산용품 세트 (출생증명서 사진 1장 접수)',
    submittedAt: '2026-10-21 09:15',
    stage: 2,
    stageLabel: '2단계: 제3항업지부 총무 검토중 (김태훈 조장 1차 확인완료)',
  },
  {
    id: 'WLF-2026-110',
    applicantName: '조규성',
    memberNo: 'BPTU-30921',
    branchName: '제3항업지부 (DGT)',
    category: '항운신협 생활안정 저리대부',
    amountOrDetail: '20,000,000원 (조합원 우대 금리 연 2.5% · 퇴직공제금 담보)',
    submittedAt: '2026-10-17 11:05',
    stage: 4,
    stageLabel: '4단계: 항운신협 계좌 펌뱅킹 즉시 입금 완료',
  },
];

export interface TerminalPolicyFactRow {
  terminalCode: string;
  terminalName: string;
  sector: string;
  teuVolumeYoY: string;
  operatingMarginPct: number;
  automationLevel: string;
  recommendedWageHikePct: number;
  keyBargainingPoint: string;
}

export const TERMINAL_POLICY_FACTBOOK: TerminalPolicyFactRow[] = [
  {
    terminalCode: 'HJNC',
    terminalName: '한진부산컨테이너터미널',
    sector: '신항 3부두',
    teuVolumeYoY: '284만 TEU (+6.2%)',
    operatingMarginPct: 18.4,
    automationLevel: '반자동 (야드 자동화 · 안벽 수동/라싱)',
    recommendedWageHikePct: 5.8,
    keyBargainingPoint: '초대형선(24,000 TEU급) 4단 장대 고강도 라싱 위험수당 신설 근거 확보',
  },
  {
    terminalCode: 'PNC',
    terminalName: '부산신항만주식회사',
    sector: '신항 2부두',
    teuVolumeYoY: '512만 TEU (+4.9%)',
    operatingMarginPct: 21.2,
    automationLevel: '반자동 (6개 선석 풀가동)',
    recommendedWageHikePct: 5.6,
    keyBargainingPoint: '위험물(IMDG) 컨테이너 처리 비중 증가에 따른 특수작업 할증 15% 인상 요구',
  },
  {
    terminalCode: 'DGT',
    terminalName: '동원글로벌터미널부산',
    sector: '신항 7부두 (서컨)',
    teuVolumeYoY: '165만 TEU (신규 개장 안정화)',
    operatingMarginPct: 14.1,
    automationLevel: '완전자동화 (원격 QC + 무인 AGV)',
    recommendedWageHikePct: 5.2,
    keyBargainingPoint: '자동화 부두 도입 시 기존 인력 100% 고용승계 및 신호수·고박 안전인력 최소정원 협약화',
  },
  {
    terminalCode: 'BNCT',
    terminalName: '부산신항컨테이너터미널',
    sector: '신항 5부두',
    teuVolumeYoY: '248만 TEU (+5.1%)',
    operatingMarginPct: 17.6,
    automationLevel: '수직배열 자동화 야드',
    recommendedWageHikePct: 5.5,
    keyBargainingPoint: '야간 교대조 휴게시간 보장 및 혹서기/혹한기 유급 안전휴식 명문화',
  },
  {
    terminalCode: 'BPTC',
    terminalName: '부산항터미널 (북항 통합)',
    sector: '북항 신선대·감만',
    teuVolumeYoY: '390만 TEU (+2.1%)',
    operatingMarginPct: 12.8,
    automationLevel: '전통 안벽·야드 통합운영',
    recommendedWageHikePct: 5.4,
    keyBargainingPoint: '북항 재개발 및 신항 물량 이전에 따른 조합원 지부 간 공정 전환배치 기금 조성',
  },
];

export interface PrBroadcastItem {
  id: string;
  category: '임단협 속보' | '안전 긴급경보' | '복지·공제 안내' | '대외 공식성명서';
  title: string;
  publishedAt: string;
  authorDept: string;
  legalClearedBy: string;
  kakaoShortSummary: string;
  totalTarget: number;
  readCount: number;
  branchReadRates: { branchName: string; ratePct: number }[];
}

export const INITIAL_PR_BROADCASTS: PrBroadcastItem[] = [
  {
    id: 'PR-2026-101',
    category: '임단협 속보',
    title: '[제8호 항운노보] 2026 임단협 잠정합의안 도출 — 기본단가 5.4% 인상 및 자동화부두 100% 고용보장 명문화',
    publishedAt: '2026-10-21 10:30',
    authorDept: '교육홍보부 박소연 디렉터 (자료: 정책연구실 유재민 위원)',
    legalClearedBy: '법률고문실 정태영 변호사 적법성 필 (#LGL-2026-88)',
    kakaoShortSummary:
      '📢 [부산항운노조 긴급 브리핑]\n1. 2026 임단협 잠정합의: 기본 하역단가 5.4% 인상 + 4단 라싱 위험수당 신설\n2. 스마트 자동화부두 도입 시 전 조합원 100% 고용보장 확약\n3. 모바일 비밀투표: 10/22(목) 18시까지 앱에서 1초 투표 참여 바랍니다!',
    totalTarget: 9709,
    readCount: 9184,
    branchReadRates: [
      { branchName: '제3항업지부 (신항 남측)', ratePct: 96.8 },
      { branchName: '제2항업지부 (신항 북측)', ratePct: 95.1 },
      { branchName: '제1항업지부 (북항 통합)', ratePct: 93.9 },
      { branchName: '냉동화물지부', ratePct: 92.4 },
      { branchName: '감천항지부', ratePct: 91.8 },
    ],
  },
  {
    id: 'PR-2026-102',
    category: '대외 공식성명서',
    title: '[공식 보도자료] 부산항운노조, AI 기반 4단계 투명 채용·승진 심사 및 1인 1기기 실출역 인증 전면 가동',
    publishedAt: '2026-10-20 14:00',
    authorDept: '중앙본부 총무기획부 · 교육홍보부 합동',
    legalClearedBy: '법률고문실 정태영 변호사 언론배포 승인 (#LGL-2026-85)',
    kakaoShortSummary:
      '📢 [대외 성명서 요약]\n부산항운노동조합은 과거의 불투명한 인사 추천 관행을 완전히 철폐하고, 근속·출역률·무사고 점수(70점)와 노사정 공익위원 다면평가(30점) 및 SHA-256 위변조 방지 감사 로그를 통한 100% 투명 인사 시스템을 전면 시행합니다.',
    totalTarget: 9709,
    readCount: 9540,
    branchReadRates: [
      { branchName: '제3항업지부 (신항 남측)', ratePct: 99.1 },
      { branchName: '제2항업지부 (신항 북측)', ratePct: 98.4 },
      { branchName: '제1항업지부 (북항 통합)', ratePct: 97.9 },
    ],
  },
];

export interface LegalComplianceItem {
  id: string;
  lawName: string;
  article: string;
  checkTitle: string;
  status: '준수 완료 (Pass)' | '집행부 주의 필요';
  detail: string;
}

export const LEGAL_COMPLIANCE_GUARDRAILS: LegalComplianceItem[] = [
  {
    id: 'LGL-01',
    lawName: '직업안정법',
    article: '제33조 (국내근로자공급사업 허가 및 적격 관리)',
    checkTitle: '비조합원·미등록 인력 배차 차단 및 1인 1기기 실출역 검증',
    status: '준수 완료 (Pass)',
    detail: '9,709명 전 조합원 명부 및 기기 바인딩 일치율 100% · 유령/대리 출역 시스템 원천 차단 가동중',
  },
  {
    id: 'LGL-02',
    lawName: '노동조합 및 노동관계조정법',
    article: '제16조 · 제29조 (총회/대의원대회 의결 및 비밀투표)',
    checkTitle: '소집 공고일(7일 전) 준수 및 무기명 영지식 블라인드 전자투표 적용',
    status: '준수 완료 (Pass)',
    detail: '2026 임단협 찬반투표 및 반장 선출 투표 모두 법정 공고기간 및 과반수 정족수 요건 충족',
  },
  {
    id: 'LGL-03',
    lawName: '산업안전보건법 & 중대재해처벌법',
    article: '산안법 제52조 (급박한 위험 시 작업중지권)',
    checkTitle: '풍속 15m/s 이상 또는 고박 장비 결함 시 현장 반·조장 즉시 작업중지 법적 보호',
    status: '준수 완료 (Pass)',
    detail: '작업중지 행사 시 사측의 불이익 처우 금지 조항 단체협약 제48조에 명문화 완료',
  },
  {
    id: 'LGL-04',
    lawName: '근로기준법 & 항만하역 표준단협',
    article: '제53조 · 제54조 · 제56조 (휴게시간 및 야간·휴일 가산수당)',
    checkTitle: '주·야간 교대 시 최소 12시간 연속 휴식 보장 및 야간(22~06시) 1.5배 가산 자동 정산',
    status: '준수 완료 (Pass)',
    detail: '연속 철야(야간 2연속) 배차 시 스케줄러에서 자동 차단 및 대체 인력 추천 작동중',
  },
];
