# 🔄 BPTU 1+9 완전체(BPTU-OMEGA-SQUAD) 에이전트 협업 및 핸드오프 프로토콜 (COOPERATION_AND_HANDOFF.md)

---

## 1. 개요 및 협업 원칙

본 문서는 부산항운노동조합(BPTU) 전사 조직·노무·거버넌스 통합 관리 플랫폼 개발 및 운영에 참여하는 **총괄 사령관(`bptu-supreme-orchestrator`)과 9대 도메인 서브에이전트(`BPTU-OMEGA-SQUAD`)** 간의 유기적 협력 체계, 단계별 핸드오프 기준, '자료조사-법률-홍보' 삼각 공조 프로토콜, 표준 데이터 계약(Interface Contracts), 그리고 충돌 중재 매트릭스를 규정한다.

### 핵심 4대 운영 원칙
1. **무결점 핸드오프 (Zero-Defect Handoff)**: 선행 단계의 계약(Contract) 산출물이 100% 검증되지 않으면 후행 단계로 작업을 이관할 수 없다.
2. **명시적 인터페이스 계약 (Strict Typing & Schema First)**: 모든 에이전트 간 데이터 교환은 엄격한 TypeScript 타입 및 JSON 스키마를 준수한다.
3. **법률·인텔리전스 삼각 공조 (Policy-Legal-Comms Tri-Coordination)**: 모든 대외 공표, 임단협 협약안, 산재 대응은 [자료조사(07) ➔ 법률검토(09) ➔ 대외홍보/대내소통(08)] 파이프라인을 필수 통과한다.
4. **중재 매트릭스 절대 복종 (Strict Conflict Hierarchy)**: 에이전트 간 요구사항 충돌 시 사전에 정의된 우선순위 매트릭스 및 총괄 사령관의 판결에 즉각 따른다.

---

## 2. 4단계 엔드투엔드 파이프라인 (The 4-Phase Pipeline)

전체 개발 및 기능 추가 주기는 다음 4단계 파이프라인을 엄격히 통과해야 한다.

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: 스키마 및 RBAC 거버넌스 고정 (Schema & RBAC Lock)            │
│ 주관: hierarchy-rbac-architect + infra-mcp-devops-lead                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ [Handoff Gate 1 통과]
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 2: 도메인 비즈니스 엔진 병렬 구현 (Core Domain Engines)         │
│ 주관: port-dispatch-scheduler + governance-audit-guardian +            │
│       welfare-payroll-fintech                                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ [Handoff Gate 2 통과]
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 3: 계층 맞춤형 멀티티어 UI 조립 (Role-Adaptive UI Assembly)      │
│ 주관: enterprise-ux-director                                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ [Handoff Gate 3 통과]
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 4: 감사·보안 검증 및 무중단 배포 (Audit, Security & Release)     │
│ 주관: infra-mcp-devops-lead + governance-audit-guardian +              │
│       bptu-supreme-orchestrator                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: 스키마 및 RBAC 거버넌스 고정 (Schema & RBAC Governance Lock)
- **주관 에이전트**: `hierarchy-rbac-architect` (리드) + `infra-mcp-devops-lead` (보안/인덱싱 검증)
- **협력 에이전트**: 전 서브에이전트 (요구사항 전달)
- **핵심 목표**:
  - 6단계 계층 구조(Lv.1 중앙본부 ~ Lv.6 조합원) 엔티티 모델링 고정.
  - 정조합원(7,280명) 및 임시·상용조합원(2,429명) 구분 및 6단계 권한 매트릭스 확정.
  - 위변조 방지 감사 로그 엔티티 및 기본 인덱싱 전략 수립.
- **핸드오프 통과 조건**:
  - 공통 인터페이스 파일(`types/schema.ts`) 컴파일 에러 0건.
  - 총괄 사령관(`bptu-supreme-orchestrator`)의 Gate 1, Gate 2 승인 서명.

### Phase 2: 도메인 비즈니스 엔진 병렬 구현 (Core Domain Engines Parallel Execution)
- **주관 에이전트**:
  - `port-dispatch-scheduler`: 선박 스케줄 연동 배차 엔진, 1-Device-1-Member QR/GPS 출역 판정 로직.
  - `governance-audit-guardian`: 투명 채용·승급 심사, 비밀 전자투표, SHA-256 감사 체인 엔진.
  - `welfare-payroll-fintech`: 톤수·무브 수·할증률 기반 노임 정산기, 조합비 및 공제회 금융 연계 모듈.
  - `policy-research-intelligence`: 부산항 물동량 빅데이터 수집기, 타 항만 노임 비교 분석 패킷 산출 엔진.
  - `labor-legal-counsel`: 직업안정법/중대재해법 법률 적법성 평가 엔진 및 산재 입증 템플릿 검증기.
  - `union-pr-communications`: 옴니채널 브로드캐스트 엔진, 15분 위기 반박문 템플릿 파이프라인.
- **협력 에이전트**: `infra-mcp-devops-lead` (성능 프로파일링 및 암호화 지원)
- **핵심 목표**:
  - 각 도메인 엔진의 순수 비즈니스 로직 단위 테스트 및 상태 전이 검증.
  - 비정상 출역 탐지, 노임 1원 단위 정밀 계산, 투표 비밀 서명, 법률/정책 팩트북 패킷 완성.
- **핸드오프 통과 조건**:
  - 각 도메인 엔진 테스트 커버리지 달성 및 예외 케이스 처리 완료.
  - 강태산 총괄 사령관의 비즈니스 정합성 중간 심사 통과.

### Phase 3: 계층 맞춤형 멀티티어 UI 및 옴니채널 조립 (Role-Adaptive UI & Comms Assembly)
- **주관 에이전트**: `enterprise-ux-director` (리드) + `union-pr-communications` (소통 채널 결합)
- **협력 에이전트**: `port-dispatch-scheduler` (현장 흐름 피드백), `hierarchy-rbac-architect` (뷰포트 인가), `labor-legal-counsel` (법률 고지 UI)
- **핵심 목표**:
  - Lv.1~Lv.2 본부/지부 관리자용 초고밀도 데스크톱 사령탑(Linear/Rippling 스타일) 구축.
  - Lv.3~Lv.6 현장 조합원용 48px+ 터치 타깃 및 야간 고대비 모바일 PWA(Shiftee/Toss 스타일) 구축.
  - 3-Tap 이내 출역 및 작업 보고 완료 UX 적용.
  - 전사/지부 긴급 비상 공지 및 위기 반박문 1초 팝업 브로드캐스트 모듈 결합.
- **핸드오프 통과 조건**:
  - 현장 3-Tap 조작성 테스트 통과 (Gate 3).
  - 모바일 반응형 뷰포트 및 데스크톱 고밀도 뷰포트 렌더링 검증 완료.

### Phase 4: 감사·법률·보안 검증 및 무중단 배포 (Audit, Legal, Security & Release)
- **주관 에이전트**: `infra-mcp-devops-lead` (리드) + `governance-audit-guardian` (감사) + `labor-legal-counsel` (법률 심사)
- **최종 승인자**: `bptu-supreme-orchestrator` (강태산 총괄 사령관)
- **핵심 목표**:
  - 9,709명 대용량 데이터 로딩 및 인덱싱 응답속도(50ms 이내) 검증.
  - 개인정보 AES-256 마스킹 및 SHA-256 감사 체인 무결성 전수 조사.
  - 노동관계법령 위반 소지 0건 법률 적법성 최종 인증.
  - Aside CLI MCP live monitoring 활성화 및 GitHub Actions CI/CD 무결점 빌드.
  - 무중단 배포 및 롤백 전략 확립.
- **핸드오프 통과 조건**:
  - 5대 품질 게이트 전 항목 'PASS' 판정.
  - 빌드/타입 에러 0건, 법률 위반 0건, Aside CLI MCP 헬스체크 정상.

---

## 2.5 '자료조사 ➔ 법률검토 ➔ 대외홍보/대내소통' 삼각 공조 프로토콜 (The Tri-Coordination Protocol)

부산항운노동조합의 정책 수립, 단체교섭, 언론 보도 대응, 그리고 항만 중대재해 발생 시 아래의 **[07 자료조사 ➔ 09 법률검토 ➔ 08 홍보/소통] 삼각 공조 파이프라인**을 강제 가동한다.

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Step 1: 자료조사 및 정책 인텔리전스]                                   │
│ policy-research-intelligence (유재민 수석)                              │
│ • 해수부·BPA·KMI 통계, 물동량, 전국 항만 노임, 자동화 영향 분석       │
│ ➔ 산출물: PolicyFactbookPacket                                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [Step 2: 법률·노무·산재 적법성 검토]                                   │
│ labor-legal-counsel (정태영 수석 변호사·노무사)                         │
│ • 직업안정법 제33조 공급권 수호, 노동조합법 적법성, 중대재해법 대응    │
│ ➔ 산출물: LegalComplianceReview / IndustrialAccidentLegalKit          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [Step 3: 대외 언론 및 9,709명 대내 소통 브로드캐스트]                 │
│ union-pr-communications (박소연 수석 디렉터)                           │
│ • 15분 이내 왜곡 보도 반박문, 대언론 공식 브리핑, 48px 모바일 PWA 푸시 │
│ ➔ 산출물: OmnichannelPrBroadcast                                       │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.5.1 연동 메커니즘 1: 연간 임단협 및 노임 정산 삼각 연동
1. **인텔리전스 패킷 공급**:
   `policy-research-intelligence`(유재민 수석)는 부산항 터미널별 물동량 처리 실적(TEU), 타 항만(인천·울산) 하역 노임 격차, 소비자물가지수를 집계하여 `PolicyFactbookPacket`을 발행한다.
2. **법률 적법성 사전 심사**:
   `labor-legal-counsel`(정태영 수석)은 노조의 임금 인상 요구안 및 단체협약 개정 조항이 직업안정법, 노동조합법, 근로기준법을 준수하는지 심사하여 `LegalComplianceReview`를 발행한다. 위법 소지 조항은 즉시 수정 요구 조치가 발동된다.
3. **노임 계산 엔진 시뮬레이션 및 정산 반영**:
   `welfare-payroll-fintech`(김나연 수석)는 승인된 `PolicyFactbookPacket`과 `LegalComplianceReview`를 노임 정산기에 주입하여 톤수·무브 수·작업별 차등 단가를 1원 단위로 정밀 시뮬레이션하고 조합비 및 공제회비를 확정한다.
4. **전사 및 대외 공표**:
   교섭 타결 즉시 `union-pr-communications`(박소연 디렉터)가 조합원용 모바일 카드뉴스 및 대언론 공식 보도자료를 포함한 `OmnichannelPrBroadcast`를 발령한다.

### 2.5.2 연동 메커니즘 2: 항만 현장안전 및 중대재해·산재 긴급 구제 연동
1. **현장 사고 긴급 감지**:
   항만 선석 또는 본선/야드 작업 중 안전사고 발생 시, `port-dispatch-scheduler`(박성민 수석)는 3-Tap 현장 비상 신호를 수신하고 즉시 해당 선석 작업반 배차를 일시 동결(Freeze)한 후 사고 정보를 전송한다.
2. **산재 법률 키트 30분 내 가동**:
   `labor-legal-counsel`(정태영 수석)은 30분 이내에 현장 CCTV 영상 확보, 조장/목격자 진술서 템플릿, 고용노동부 보고 서식, 근로복지공단 요양급여 신청 패키지가 포함된 `IndustrialAccidentLegalKit`을 즉시 발급하여 현장 연락소에 전송한다.
3. **왜곡 보도 방어 및 전사 안전 경보 브로드캐스트**:
   `union-pr-communications`(박소연 디렉터)는 작업자 과실로 몰아가는 선사/운영사의 왜곡 여론전을 원천 차단하기 위해 15분 이내 팩트 반박 성명서를 배포하고, 전사 9,709명 조합원 모바일 PWA에 긴급 안전 지침을 `OmnichannelPrBroadcast`로 즉시 팝업한다.

---

## 3. 에이전트 간 인터페이스 계약 (Interface Contracts - TypeScript / JSON)

모든 서브에이전트는 아래 정의된 표준 인터페이스 계약에 맞춰 데이터를 생산하고 소비해야 한다.

### 3.1 조직 및 조합원 데이터 계약 (`MemberProfile`)
`hierarchy-rbac-architect`가 발행하고 전 에이전트가 참조한다.

```typescript
export type OrgLevel = 'LV1_HQ' | 'LV2_BRANCH' | 'LV3_TERMINAL' | 'LV4_GANG' | 'LV5_SHIFT' | 'LV6_MEMBER';

export type MemberStatus = 'REGULAR' | 'TEMPORARY' | 'COMMERCIAL' | 'RETIRED' | 'SUSPENDED';

export interface MemberProfile {
  memberCode: string;          // 고유 식별자 (예: BPTU-2024-07280)
  name: string;                // 성명
  maskedResidentId: string;    // 주민등록번호 마스킹 (예: 800101-1******)
  phone: string;               // 연락처
  level: OrgLevel;             // 소속 계층
  branchId: string;            // Lv.2 산하 지부 ID (예: BR-02-NEWPORT-N)
  branchName: string;          // 지부명 (예: 제2항업지부)
  terminalId?: string;         // Lv.3 터미널 연락소 ID (예: TERM-HJNC)
  gangId?: string;             // Lv.4 작업반 ID (예: GANG-LASHING-01)
  shiftSquadId?: string;       // Lv.5 작업조 ID (예: SQUAD-NIGHT-A)
  status: MemberStatus;        // 조합원 신분
  roles: string[];             // RBAC 권한 목록 (예: ['ROLE_SHIFT_LEADER', 'ROLE_VOTER'])
  deviceId?: string;           // 1-Device-1-Member 바인딩 디바이스 UUID
  joinedAt: string;            // 가입일자 (ISO-8601)
}
```

### 3.2 선석 배차 및 출역 데이터 계약 (`DispatchAssignment` & `AttendanceRecord`)
`port-dispatch-scheduler`가 생성하고 `welfare-payroll-fintech` 및 `governance-audit-guardian`이 소비한다.

```typescript
export interface DispatchAssignment {
  assignmentId: string;        // 배차 식별자
  vesselName: string;          // 본선 선명 (예: HMM GDANSK)
  voyageNumber: string;        // 항차 번호 (예: 24003E)
  terminalId: string;          // 부두 터미널 코드 (HJNC, PNC 등)
  berthNo: string;             // 선석 번호 (예: Berth 03)
  gangType: 'ON_BOARD' | 'LASHING' | 'YARD' | 'SIGNAL' | 'CFS' | 'REEFER';
  shiftType: 'DAY_A' | 'DAY_B' | 'NIGHT_A' | 'NIGHT_B' | 'STANDBY';
  assignedDate: string;        // 배정 일자 (YYYY-MM-DD)
  allocatedMembers: {
    memberCode: string;
    roleInGang: 'CHIEF' | 'OPERATOR' | 'CREW';
  }[];
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface AttendanceRecord {
  recordId: string;            // 출역 기록 식별자
  memberCode: string;          // 조합원 코드
  assignmentId: string;        // 연계 배차 ID
  checkInTime: string;         // 출역 태그 시각 (ISO-8601)
  checkOutTime?: string;       // 퇴근 태그 시각 (ISO-8601)
  authMethod: 'QR_SCAN' | 'GEOPROXIMITY_GPS' | 'MANUAL_FOREMAN';
  foremanMemberCode?: string;  // 대리/일괄 출역 시 승인 조장 코드
  deviceUuid: string;          // 출역 태그 단말기 식별자
  latitude: number;            // GPS 위도 (부두 지오펜스 검증용)
  longitude: number;           // GPS 경도
  verificationStatus: 'VERIFIED' | 'FLAGGED_DUPLICATE_DEVICE' | 'OUT_OF_BOUNDS' | 'AUDITED';
  workingHours: number;        // 인정 근로 시간
  nightHours: number;          // 심야 할증 근로 시간
}
```

### 3.3 노임 정산 및 공제 계약 (`WageSettlement`)
`welfare-payroll-fintech`가 산출하고 `enterprise-ux-director` 및 감사 모듈이 소비한다.

```typescript
export interface WageSettlement {
  settlementId: string;        // 정산 고유 번호
  memberCode: string;          // 조합원 코드
  targetMonth: string;         // 대상월 (YYYY-MM)
  baseWage: number;            // 기본 작업 노임
  tonnageBonus: number;        // 톤수 및 물동량 수당
  overtimeWage: number;        // 연장/야간 할증 수당
  hazardBonus: number;         // 위험물/냉동/악천후 수당
  grossPay: number;            // 총 지급액 (세전)
  deductions: {
    incomeTax: number;         // 소득세 및 지방소득세
    socialInsurance: number;   // 4대 보험 공제액
    unionDues: number;         // 노조 조합비 (규약 기준 공제)
    mutualAidFee: number;      // 노조 공제회비
    creditUnionLoanRepay: number; // 노조 신협 대출 원리금 상환액
  };
  netPay: number;              // 실 수령액
  isApproved: boolean;         // 지부 총무 및 본부 승인 여부
  settledAt: string;           // 정산 일시
}
```

### 3.4 불변 감사 로그 계약 (`TamperProofAuditEntry`)
`governance-audit-guardian`이 기록 및 관리하며, 모든 도메인 트랜잭션 시 자동 생성된다.

```typescript
export interface TamperProofAuditEntry {
  logSequence: number;         // 순차 로그 인덱스 (1, 2, 3...)
  timestamp: string;           // 발생 일시 (ISO-8601 UTC)
  actionType: 'MEMBER_UPDATE' | 'DISPATCH_OVERRIDE' | 'ATTENDANCE_CORRECTION' | 'WAGE_PAYOUT' | 'VOTE_CAST';
  actorMemberCode: string;     // 행위자 조합원 코드
  targetEntityId: string;      // 대상 엔티티 식별자
  previousHash: string;        // 직전 감사 로그의 SHA-256 블록 해시
  currentPayloadHash: string;  // 현 변경 페이로드의 SHA-256 해시
  currentHash: string;         // SHA256(previousHash + timestamp + payload)
  signature: string;           // 시스템 전자서명
}
```

### 3.5 전사 비상 브로드캐스트 계약 (`EmergencyBroadcast`)
`enterprise-ux-director`와 중앙본부 권한 에이전트가 가동한다.

```typescript
export interface EmergencyBroadcast {
  broadcastId: string;         // 방송 ID
  issuerMemberCode: string;    // 발령자 (위원장 또는 지부장)
  severity: 'INFO' | 'WARNING' | 'CRITICAL_DISASTER' | 'STRIKE_ORDER';
  targetLevel: OrgLevel;       // 전파 대상 계층 (LV1 전사 ~ LV6 개별)
  targetBranchIds?: string[];  // 특정 지부 대상 한정 시
  title: string;               // 공지 제목
  message: string;             // 비상 공지 내용
  requireAcknowledge: boolean; // 화면 락 강제 수신확인 필요 여부
  issuedAt: string;            // 발령 일시
  acknowledgedCount: number;   // 실시간 수신 확인 완료 인원수
}
```

### 3.6 정책인텔리전스 팩트북 데이터 계약 (`PolicyFactbookPacket`)
`policy-research-intelligence`가 생성하고 `labor-legal-counsel`, `welfare-payroll-fintech`, `union-pr-communications`가 소비한다.

```typescript
export interface PolicyFactbookPacket {
  packetId: string;              // 팩트북 식별자 (예: FACT-2024-WAGE-Q3)
  publishedAt: string;           // 발행 일시 (ISO-8601 UTC)
  authorMemberCode: string;      // 작성 연구위원 (유재민 수석)
  category: 'WAGE_BENCHMARK' | 'PORT_TRAFFIC' | 'AUTOMATION_IMPACT' | 'POLICY_REGULATION';
  datasetScope: {
    targetTerminals: string[];   // 대상 터미널 목록 (HJNC, PNC, BNCT 등)
    periodStart: string;         // 조사 기간 시작 (YYYY-MM-DD)
    periodEnd: string;           // 조사 기간 종료 (YYYY-MM-DD)
    comparativePorts: string[];  // 비교 대상 타 항만 (인천항, 울산항, 상하이항 등)
  };
  economicIndicators: {
    consumerPriceIndexChange: number; // 물가상승률 (%)
    portThroughputTeu: number;         // 부산항 처리 물동량 (TEU)
    throughputGrowthRate: number;      // 물동량 전년비 증감률 (%)
    stevedoringCostPerTeu: number;     // TEU당 평균 하역 단가 (KRW)
  };
  automationMetrics?: {
    berthId: string;
    agvDeploymentCount: number;        // AGV 투입 대수
    workGangImpactEstimate: number;    // 작업반 필요 인원 증감 예측치
  };
  keyFindings: string[];         // 핵심 연구 결론 요약
  verificationSources: string[]; // 공공 통계 출처 (해수부, BPA, KMI, 관세청 등)
  status: 'DRAFT' | 'VERIFIED' | 'LOCKED_FOR_NEGOTIATION';
}
```

### 3.7 법률·노무 적법성 검토서 데이터 계약 (`LegalComplianceReview`)
`labor-legal-counsel`이 생성하고 `welfare-payroll-fintech`, `union-pr-communications`, 중앙본부 교섭단이 소비한다.

```typescript
export interface LegalComplianceReview {
  reviewId: string;              // 법률 검토 식별자 (예: LEGAL-REV-2024-082)
  targetDocumentType: 'COLLECTIVE_AGREEMENT' | 'WAGE_PROPOSAL' | 'STRIKE_RESOLUTION' | 'BYLAW_AMENDMENT';
  targetEntityId: string;        // 검토 대상 문서/안건 식별자
  leadCounselMemberCode: string; // 담당 수석 변호사·노무사 (정태영 수석)
  reviewedAt: string;            // 검토 완료 일시 (ISO-8601 UTC)
  statutoryCheckpoints: {
    actName: 'TRADE_UNION_ACT' | 'JOB_SECURITY_ACT' | 'SERIOUS_DISASTER_ACT' | 'LABOR_STANDARDS_ACT';
    articleNumber: string;       // 관련 조항 (예: 직업안정법 제33조)
    isCompliant: boolean;        // 적법 여부
    riskSeverity: 'NONE' | 'LOW' | 'MEDIUM' | 'CRITICAL_LEGAL_BREACH';
    legalOpinion: string;        // 법률 의견 및 리스크 분석
  }[];
  overallVerdict: 'APPROVED_AS_IS' | 'CONDITIONAL_APPROVAL' | 'REVISE_REQUIRED' | 'STRICT_VETO';
  mandatoryAmendments: string[]; // 필수 수정/삭제 요구 조항
  disputeRiskLevel: 'SAFE' | 'POTENTIAL_INJUNCTION' | 'UNLAWFUL_ACTION_RISK';
  signature: string;             // 변호사·노무사 전자서명
}
```

### 3.8 옴니채널 대외홍보·대내소통 브로드캐스트 계약 (`OmnichannelPrBroadcast`)
`union-pr-communications`가 생성하고 `enterprise-ux-director`, 전사 모바일 PWA 푸시 엔진, 대외 언론 배포망이 소비한다.

```typescript
export interface OmnichannelPrBroadcast {
  broadcastId: string;           // 브로드캐스트 ID (예: PR-CAST-2024-0012)
  originType: 'CRISIS_STATEMENT' | 'PRESS_RELEASE' | 'UNION_DIRECTIVE' | 'NEWSLETTER_CARDNEWS';
  channelTargets: ('MOBILE_PWA_POPUP' | 'SMS_EMERGENCY' | 'PRESS_DISTRIBUTION' | 'UNION_HOMEPAGE' | 'SNS_YOUTUBE')[];
  audienceSegment: 'ALL_9709_MEMBERS' | 'REGULAR_ONLY' | 'EXTERNAL_PRESS' | 'TERMINAL_OPERATORS';
  title: string;                 // 성명서/공지 제목
  officialStatement: string;     // 대언론 공식 성명 또는 공지 본문
  factVerificationPacketRef?: string; // 참조 PolicyFactbookPacket ID
  legalReviewRef: string;        // 승인된 LegalComplianceReview ID (필수)
  pressOfficerMemberCode: string;// 홍보 디렉터 (박소연 수석)
  isCrisisLockdown: boolean;     // 15분 이내 긴급 반박 화면 락 브로드캐스트 여부
  publishedAt: string;           // 발행 시각 (ISO-8601 UTC)
  deliveryStats: {
    totalSent: number;
    deliveredCount: number;
    acknowledgedCount: number;
    openRatePercentage: number;
  };
}
```

### 3.9 항만 중대재해·산재 법률 대응 키트 계약 (`IndustrialAccidentLegalKit`)
`labor-legal-counsel`이 생성하고 `port-dispatch-scheduler`, `union-pr-communications`, 현장 지부/연락소 안전위원이 소비한다.

```typescript
export interface IndustrialAccidentLegalKit {
  kitId: string;                 // 산재 키트 고유 ID (예: ACCIDENT-KIT-2024-03)
  incidentRecordId: string;      // 현장 사고 발생 ID
  victimMemberCode: string;      // 재해 조합원 코드
  terminalId: string;            // 부두/터미널 코드 (HJNC 등)
  berthNo: string;               // 발생 선석
  gangId: string;                // 소속 작업반
  incidentType: 'STRUCK_BY_OBJECT' | 'FALL' | 'CRUSH' | 'HAZARDOUS_EXPOSURE' | 'EQUIPMENT_FAILURE';
  occurredAt: string;            // 사고 발생 시각 (ISO-8601)
  kitGeneratedAt: string;        // 키트 발급 시각 (30분 이내 발급 강제)
  evidenceChecklist: {
    cctvSecured: boolean;        // 현장 CCTV 영상 확보 여부
    vesselForemanReport: boolean;// 본선 조장 사실확인서 확보 여부
    witnessStatementsCount: number; // 목격 조합원 진술서 수
    terminalSafetyLogSecured: boolean; // 터미널 안전일지 사본 확보 여부
  };
  legalActionPlan: {
    seriousDisasterActApplies: boolean; // 중대재해처벌법 적용 대상 여부
    moelReportDrafted: boolean;  // 고용노동부 산업재해조사표 초안 완성 여부
    comwelClaimPrepared: boolean;// 근로복지공단 요양급여 신청 패키지 준비 여부
    terminalOperatorLiabilityClause: string[]; // 터미널 운영사 원청 책임 법리 조항
  };
  assignedLawyerMemberCode: string; // 배정 변호사 (정태영 수석 또는 지명 변호사)
  status: 'EVIDENCE_PRESERVATION' | 'CLAIM_SUBMITTED' | 'NEGOTIATION_IN_PROGRESS' | 'SETTLED';
}
```

---

## 4. 충돌 발생 시 우선순위 중재 매트릭스 (Conflict Resolution Priority Matrix)

에이전트 간 이해관계가 충돌하거나 설계상 상충 요소가 발생할 경우 아래의 우선순위 판정 기준을 절대 원칙으로 적용한다.

### 4.1 기본 원칙 (Order of Precedence)
```
[1순위: 데이터 보안, 법적 적법성 및 감사 무결성] (Security, Legal & Audit Trail)
       ▲
       │
[2순위: 항만 현장 안전, 산재 증거보전 및 실시간 배차] (Field Safety & Live Dispatch)
       ▲
       │
[3순위: 객관적 정책 팩트 및 데이터 단일성] (Policy Evidence & SSOT)
       ▲
       │
[4순위: 옴니채널 위기 대응 및 대내외 소통 신속성] (Crisis Comms & Broadcast)
       ▲
       │
[5순위: 사용자 편의성 및 반응형 UX] (UX Convenience & Speed)
       ▲
       │
[6순위: 사후 행정 보고서 및 결재 절차] (Post Administrative Approval)
```

### 4.2 갈등 시나리오별 중재 규정표

| 갈등 상황 | 충돌 에이전트 | 상충 내용 | 판정 및 강제 실행 조치 | 최종 승인 |
| :--- | :--- | :--- | :--- | :--- |
| **현장 간편 출역 vs 대리출역 방지** | `enterprise-ux-director`<br>vs<br>`governance-audit-guardian` | 작업자가 터치 1회로 간편 출역을 원하나, 감사 에이전트는 기기 UUID 및 GPS 검증을 요구 | **감사 우선**: 백그라운드에서 기기 UUID와 GPS 지오펜싱을 자동 검증하되, 조장의 3-Tap UI는 유지함. 이상 징후 시에만 추가 인증 요구. | 서지훈 수석 |
| **긴급 선석 변경 vs 사전 행정 결재** | `port-dispatch-scheduler`<br>vs<br>`hierarchy-rbac-architect` | 조기 접안으로 10분 내 작업반 긴급 투입 필요, 그러나 지부장 사전 결재가 미완료됨 | **현장 배차 우선**: '선배차-사후보고' 패스트트랙 발동. 출역은 즉시 승인하고 지부장에게는 30분 이내 사후 승인 알림 큐 전송. | 박성민 수석 |
| **노임 계산 로직 vs UI 렌더링 성능** | `welfare-payroll-fintech`<br>vs<br>`enterprise-ux-director` | 9,709명 전원의 실시간 톤수 정산 재계산으로 인해 모바일 대시보드 로딩 지연 발생 | **데이터 정밀도 & 비동기 우선**: 노임 계산 엔진을 Web Worker/백그라운드 큐로 분리하고, UI에는 직전 확정 캐시 데이터를 우선 노출. | 강태산 총괄 |
| **임시조합원 데이터 권한 범위** | `hierarchy-rbac-architect`<br>vs<br>`governance-audit-guardian` | 임시조합원의 투표 권한 및 타 지부 출역 이력 열람 허용 여부 | **RBAC 규약 엄격 준수**: 정조합원 전용 기능(투표권, 전사 대의원 명부)은 철저히 차단. 본인 출역 및 노임 명세만 인가. | 오현석 수석 |
| **임금 인상 요구율 산정 충돌** | `policy-research-intelligence`<br>vs<br>`welfare-payroll-fintech` | 교섭단 기대 인상률(8%)과 정책 통계상 적정선(물가상승률+물동량 4.5%)의 괴리 | **정책 팩트 우선**: 유재민 수석의 `PolicyFactbookPacket` 객관 지표를 우선 채택하되, 잔여 격차는 비임금 복지(공제회 지원금) 수식으로 김나연 수석이 우회 설계. | 유재민 수석 |
| **대외 긴급 성명 vs 법률 리스크 검토** | `union-pr-communications`<br>vs<br>`labor-legal-counsel` | 언론 왜곡 보도에 15분 내 즉시 반박 성명 배포 필요, 그러나 법률 검토 대기 시간 발생 | **법률 검증 필수(Conditional Pass)**: 정태영 수석의 `LegalComplianceReview`에서 'STRICT_VETO'가 아닌 한, 핵심 팩트 반박문만 선배포하고 심층 법적 대응은 후속 브리핑 진행. | 정태영 수석 |
| **선석 조기 복구 vs 중대재해 현장 보존** | `port-dispatch-scheduler`<br>vs<br>`labor-legal-counsel` | 선사/터미널의 하역 재개 압박과 산재 입증을 위한 작업 중지 및 현장 보존 충돌 | **현장 안전 및 법률 절대 우선**: 안전사고 및 중대재해 발생 선석은 `IndustrialAccidentLegalKit` 증거 확보 및 노동청 명령 해제 전까지 배차 락(Lock) 유지. | 강태산 총괄 |

### 4.3 총괄 사령관 최종 거부권 (Veto Power)
- 상기 중재 매트릭스로도 해소되지 않는 이견이나 새로운 도메인 정책 충돌이 발생할 경우, **`bptu-supreme-orchestrator`(강태산 총괄 사령관)**이 단독 청문회를 소집하고 1시간 이내에 최종 결정을 내린다.
- 강태산 총괄 사령관의 결정은 즉시 프로토콜 문서에 반영되며 번복할 수 없다.

---

## 5. 핸드오프 검증 체크리스트 및 런타임 보고 규정

### 5.1 단계별 핸드오프 체크리스트

#### Phase 1 -> Phase 2 핸드오프 체크리스트
- [ ] 6단계 조직 계층(Lv.1~Lv.6) 엔티티 인터페이스가 `types/schema.ts`에 정의되었는가?
- [ ] 정조합원 7,280명 및 임시·상용조합원 2,429명의 신분 코드가 분리되었는가?
- [ ] 6단계 계층별 데이터 CRUD 권한 매트릭스가 수립되었는가?
- [ ] TypeScript 타입 검사에서 에러 0건을 기록하였는가?

#### Phase 2 -> Phase 3 핸드오프 체크리스트
- [ ] 터미널 선박 스케줄 연동 및 배차 할당 로직이 완성되었는가?
- [ ] 1-Device-1-Member QR/GPS 출역 판정 및 유령 조합원 탐지 알고리즘이 구현되었는가?
- [ ] 톤수·무브 수·작업종별 노임 자동 계산 공식이 1원 단위로 검증되었는가?
- [ ] SHA-256 감사 체인 해시 생성 및 검증 루틴이 무결한가?
- [ ] `PolicyFactbookPacket` 산출 및 KMI/해수부 공공 데이터 연동이 검증되었는가?
- [ ] `LegalComplianceReview`의 직업안정법 제33조 및 노동조합법 적법성 체크포인트가 정의되었는가?
- [ ] 현장 사고 발생 시 30분 이내 `IndustrialAccidentLegalKit` 자동 발급 체계가 준비되었는가?

#### Phase 3 -> Phase 4 핸드오프 체크리스트
- [ ] 현장 3-Tap 출역 및 작업 보고 플로우가 실제 뷰포트에서 확인되었는가?
- [ ] 모바일 터치 타깃이 전 영역 48px 이상 확보되었는가 (장갑 모드)?
- [ ] 데스크톱 관리자 대시보드에서 전사 6계층 트리가 직관적으로 탐색되는가?
- [ ] 비상 공지 및 `OmnichannelPrBroadcast` 발령 시 1초 이내 전면 팝업 락이 정상 작동하는가?
- [ ] 15분 이내 긴급 대외 언론 반박문 및 모바일 카드뉴스 배포 파이프라인이 검증되었는가?

#### Phase 4 최종 릴리스 체크리스트
- [ ] 9,709명 대용량 데이터 로딩 및 인덱싱 응답속도가 50ms 이내인가?
- [ ] 개인정보 AES-256 암호화 및 법적 마스킹 처리가 완료되었는가?
- [ ] 노동관계법령 위반 조항 0건 및 법률자문 승인이 완료되었는가?
- [ ] Aside CLI MCP 런타임 모니터링 상 이상 징후나 메모리 누수가 없는가?
- [ ] GitHub Actions CI/CD 빌드가 실패 없이 완료되었는가?

### 5.2 Aside CLI MCP 실시간 모니터링 규정
- 모든 에이전트는 백그라운드 작업 수행 시 Aside CLI MCP 세션에 작업 진행률과 에러 상태를 실시간 기록해야 한다.
- 예기치 못한 크래시나 무한 루프 발생 시 Aside CLI MCP는 즉시 총괄 사령관에게 인터럽트 시그널을 발송하여 작업을 안전 정지(Safe-State Freeze)시킨다.
