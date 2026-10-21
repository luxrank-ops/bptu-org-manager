import React, { useState, useEffect } from 'react';
import {
  Building2,
  Ship,
  ShieldCheck,
  Wallet,
  BarChart3,
  Megaphone,
  Scale,
  Search,
  Moon,
  Sun,
  Type,
  MessageSquareShare,
  Check,
  Users,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  ROLE_TIER_PROFILES,
  BPTU_BRANCHES,
  INITIAL_UNION_MEMBERS,
  INITIAL_VESSEL_DISPATCHES,
  INITIAL_PROMOTION_CANDIDATES,
  INITIAL_BALLOTS,
  INITIAL_WELFARE_APPLICATIONS,
  TERMINAL_POLICY_FACTBOOK,
  INITIAL_PR_BROADCASTS,
  LEGAL_COMPLIANCE_GUARDRAILS,
  RoleTierId,
  ModuleTabId,
  UnionMemberRecord,
  VesselGangDispatch,
  PromotionReviewCandidate,
  ElectronicBallot,
  WelfareApplicationItem,
  PrBroadcastItem,
} from './data/bptuStore';
import { Module1OrgAndHomeView } from './components/Module1OrgAndHomeView';
import {
  Module2DispatchView,
  Module3GovernanceView,
} from './components/Module2And3DispatchGovernanceView';
import {
  Module4PayrollWelfareView,
  Module5ResearchFactbookView,
} from './components/Module4And5PayrollResearchView';
import {
  Module6PrBroadcastView,
  Module7LegalSafety119View,
} from './components/Module6And7PrLegalView';

const STORAGE_KEYS = {
  ROLE: 'bptu_active_role_v1',
  MEMBERS: 'bptu_members_v1',
  DISPATCHES: 'bptu_dispatches_v1',
  CANDIDATES: 'bptu_candidates_v1',
  BALLOTS: 'bptu_ballots_v1',
  WELFARE: 'bptu_welfare_v1',
  BROADCASTS: 'bptu_broadcasts_v1',
  DARK_MODE: 'bptu_high_contrast_dark_v1',
  SENIOR_MODE: 'bptu_senior_big_text_v1',
};

export default function App() {
  const [activeRoleId, setActiveRoleId] = useState<RoleTierId>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.ROLE) as RoleTierId) || 'LV1_HQ';
    } catch {
      return 'LV1_HQ';
    }
  });

  const [activeModule, setActiveModule] = useState<ModuleTabId>('org');
  const [privacyMasked, setPrivacyMasked] = useState<boolean>(false);
  const [highContrastDark, setHighContrastDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
    } catch {
      return false;
    }
  });
  const [seniorBigText, setSeniorBigText] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SENIOR_MODE) === 'true';
    } catch {
      return false;
    }
  });

  const [members, setMembers] = useState<UnionMemberRecord[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return s ? JSON.parse(s) : INITIAL_UNION_MEMBERS;
    } catch {
      return INITIAL_UNION_MEMBERS;
    }
  });

  const [dispatches, setDispatches] = useState<VesselGangDispatch[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.DISPATCHES);
      return s ? JSON.parse(s) : INITIAL_VESSEL_DISPATCHES;
    } catch {
      return INITIAL_VESSEL_DISPATCHES;
    }
  });

  const [candidates, setCandidates] = useState<PromotionReviewCandidate[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      return s ? JSON.parse(s) : INITIAL_PROMOTION_CANDIDATES;
    } catch {
      return INITIAL_PROMOTION_CANDIDATES;
    }
  });

  const [ballots, setBallots] = useState<ElectronicBallot[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.BALLOTS);
      return s ? JSON.parse(s) : INITIAL_BALLOTS;
    } catch {
      return INITIAL_BALLOTS;
    }
  });

  const [welfareList, setWelfareList] = useState<WelfareApplicationItem[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.WELFARE);
      return s ? JSON.parse(s) : INITIAL_WELFARE_APPLICATIONS;
    } catch {
      return INITIAL_WELFARE_APPLICATIONS;
    }
  });

  const [broadcasts, setBroadcasts] = useState<PrBroadcastItem[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.BROADCASTS);
      return s ? JSON.parse(s) : INITIAL_PR_BROADCASTS;
    } catch {
      return INITIAL_PR_BROADCASTS;
    }
  });

  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [globalQuery, setGlobalQuery] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (seniorBigText) {
      root.classList.add('senior-mode');
    } else {
      root.classList.remove('senior-mode');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.SENIOR_MODE, seniorBigText ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [seniorBigText]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, highContrastDark ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [highContrastDark]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, activeRoleId);
    } catch {
      // ignore
    }
  }, [activeRoleId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch {
      // ignore
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DISPATCHES, JSON.stringify(dispatches));
    } catch {
      // ignore
    }
  }, [dispatches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    } catch {
      // ignore
    }
  }, [candidates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify(ballots));
    } catch {
      // ignore
    }
  }, [ballots]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WELFARE, JSON.stringify(welfareList));
    } catch {
      // ignore
    }
  }, [welfareList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BROADCASTS, JSON.stringify(broadcasts));
    } catch {
      // ignore
    }
  }, [broadcasts]);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const activeRole =
    ROLE_TIER_PROFILES.find((r) => r.id === activeRoleId) || ROLE_TIER_PROFILES[0];

  const handleCopyDailyExecutiveBriefing = async () => {
    const text = `📢 [부산항운노동조합 전사 일일 종합 브리핑]
• 기준일시: 2026-10-21 (수) | 발신: ${activeRole.holderName} (${activeRole.levelBadge})
• 전체 조합원: 총 9,709명 (정조합원 7,280명 / 임시·상용 2,429명)
• 24개 지부 평균 출역률: 96.2% (실시간 가동 선석 64개 모선)
• 유령/대리 출역 적발: 0건 (1인 1기기 FIDO + GPS/QR 3중 인증 가동중)
• 진행중 전자투표: 2026 임단협 잠정합의안 찬반투표 (참여율 88.1%)
• 최신 항운노보: 기본단가 5.4% 인상 및 자동화부두 100% 고용보장 확약 (열람률 94.6%)`;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
    }
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleResetAll = () => {
    setMembers(INITIAL_UNION_MEMBERS);
    setDispatches(INITIAL_VESSEL_DISPATCHES);
    setCandidates(INITIAL_PROMOTION_CANDIDATES);
    setBallots(INITIAL_BALLOTS);
    setWelfareList(INITIAL_WELFARE_APPLICATIONS);
    setBroadcasts(INITIAL_PR_BROADCASTS);
  };

  const moduleNavItems: Array<{
    id: ModuleTabId;
    num: string;
    label: string;
    shortLabel: string;
    owner: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'org',
      num: '01',
      label: '조직·인사 (6단계 트리)',
      shortLabel: '조직·명부',
      owner: '오현석 수석',
      icon: Building2,
    },
    {
      id: 'dispatch',
      num: '02',
      label: '스마트 출역·배차',
      shortLabel: '출역·배차',
      owner: '박성민·정하준',
      icon: Ship,
    },
    {
      id: 'governance',
      num: '03',
      label: '투명심사·전자투표',
      shortLabel: '심사·투표',
      owner: '서지훈 감사관',
      icon: ShieldCheck,
    },
    {
      id: 'payroll',
      num: '04',
      label: '노임·급여·복지',
      shortLabel: '급여·복지',
      owner: '김나연 수석',
      icon: Wallet,
    },
    {
      id: 'research',
      num: '05',
      label: '자료조사·팩트북',
      shortLabel: '자료조사',
      owner: '유재민 위원',
      icon: BarChart3,
    },
    {
      id: 'pr',
      num: '06',
      label: '홍보·항운노보',
      shortLabel: '홍보·소통',
      owner: '박소연 디렉터',
      icon: Megaphone,
    },
    {
      id: 'legal',
      num: '07',
      label: '법률·산재 119',
      shortLabel: '법률·산재',
      owner: '정태영 변호사',
      icon: Scale,
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col pb-24 lg:pb-8 transition-colors ${
        highContrastDark
          ? 'bg-[#070B14] text-slate-100'
          : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* Top Executive & Multi-Tier Command Header */}
      <header className="no-print sticky top-0 z-40 bg-[#0C1E4A] text-white border-b border-blue-900/80 shadow-lg">
        {copiedToast && (
          <div className="bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm py-2 px-4 text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>전사 일일 종합 브리핑이 클립보드에 복사되었습니다! (카카오톡 단톡방에 바로 붙여넣기 가능)</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-col gap-3">
          {/* Row 1: Brand Title + Quick Accessibility & Briefing Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm tracking-tighter shadow-sm">
                BPTU
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-lg font-extrabold tracking-tight text-white">
                    부산항운노동조합 통합 조직관리 플랫폼
                  </h1>
                  <span className="hidden md:inline-block px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-blue-800/90 text-blue-200 border border-blue-600/50">
                    Lv.1 본부 ~ Lv.6 조합원 (9,709명)
                  </span>
                </div>
                <p className="text-[11px] text-blue-200/80 hidden sm:block">
                  1+10 BPTU-OMEGA-SQUAD 구축 · Google Stitch DESIGN.md 표준 적용 · 24개 지부 실시간 연동
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold bg-blue-950/90 hover:bg-blue-900 text-blue-100 border border-blue-700/70 transition-colors"
                title="전사 조합원·지부·선석·기능 통합 검색 (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">통합검색</span>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-900 text-blue-200">
                  Ctrl+K
                </kbd>
              </button>

              <button
                type="button"
                onClick={handleCopyDailyExecutiveBriefing}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-extrabold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-sm"
              >
                <MessageSquareShare className="w-3.5 h-3.5" />
                <span>카톡 전사브리핑 1초 복사</span>
              </button>

              <button
                type="button"
                onClick={() => setSeniorBigText((prev) => !prev)}
                className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold border transition-colors ${
                  seniorBigText
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                    : 'bg-blue-950/80 text-blue-100 border-blue-700/70 hover:bg-blue-900'
                }`}
                title="50~60대 베테랑 조합원을 위한 큰글씨(효도) 모드 (1.18배 확대)"
              >
                <Type className="w-3.5 h-3.5" />
                <span>{seniorBigText ? '큰글씨 ON' : '큰글씨 효도모드'}</span>
              </button>

              <button
                type="button"
                onClick={() => setHighContrastDark((prev) => !prev)}
                className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold border transition-colors ${
                  highContrastDark
                    ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                    : 'bg-blue-950/80 text-blue-100 border-blue-700/70 hover:bg-blue-900'
                }`}
                title="야간 안벽 작업용 WCAG AAA 고대비 다크모드 전환"
              >
                {highContrastDark ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-yellow-300" />
                )}
                <span className="hidden sm:inline">
                  {highContrastDark ? '주간 관제모드' : '야간 안벽고대비'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleResetAll}
                className="p-2 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-800"
                title="초기 시연 데이터로 복원"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Row 2: 6-Tier Role-Adaptive Chameleon Switcher (Lv.1 Central HQ -> Lv.6 Union Member) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-blue-800/70 pt-2">
            <span className="text-[11px] font-bold text-amber-300 shrink-0 mr-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>6단계 직책 뷰 전환:</span>
            </span>
            {ROLE_TIER_PROFILES.map((role) => {
              const isSelected = role.id === activeRoleId;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setActiveRoleId(role.id);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-[#0C1E4A] shadow-sm ring-2 ring-amber-400'
                      : 'bg-blue-900/50 text-blue-100 hover:bg-blue-800/70 border border-blue-700/50'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-[#0C1E4A] text-amber-300'
                        : 'bg-blue-950 text-blue-300'
                    }`}
                  >
                    {role.levelBadge}
                  </span>
                  <span>{role.holderName}</span>
                </button>
              );
            })}
          </div>

          {/* Row 3: Desktop 7-Module Navigation Tabs */}
          <nav
            aria-label="7대 핵심 기능 모듈 내비게이션"
            className="hidden lg:grid grid-cols-7 gap-1.5 pt-1"
          >
            {moduleNavItems.map((m) => {
              const IconComp = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setActiveModule(m.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-2.5 rounded-t-xl text-left transition-all flex items-center gap-2 border-b-2 ${
                    isActive
                      ? 'bg-white text-[#0C1E4A] border-amber-400 font-extrabold shadow-sm'
                      : 'bg-blue-950/60 text-blue-100 border-transparent hover:bg-blue-900/70'
                  }`}
                >
                  <IconComp
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-blue-700' : 'text-amber-300'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono opacity-75 leading-none">
                      모듈 {m.num} · {m.owner}
                    </div>
                    <div className="text-xs truncate mt-0.5">{m.label}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Module Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {activeModule === 'org' && (
          <Module1OrgAndHomeView
            activeRole={activeRole}
            branches={BPTU_BRANCHES}
            members={members}
            privacyMasked={privacyMasked}
            highContrastDark={highContrastDark}
            onTogglePrivacyMask={() => setPrivacyMasked((p) => !p)}
            onNavigateModule={(tab) => {
              setActiveModule(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddMember={(newM) => setMembers((prev) => [newM, ...prev])}
          />
        )}

        {activeModule === 'dispatch' && (
          <Module2DispatchView
            activeRole={activeRole}
            dispatches={dispatches}
            highContrastDark={highContrastDark}
            onUpdateDispatch={(upd) =>
              setDispatches((prev) =>
                prev.map((d) => (d.id === upd.id ? upd : d))
              )
            }
            onAddDispatch={(newD) => setDispatches((prev) => [newD, ...prev])}
          />
        )}

        {activeModule === 'governance' && (
          <Module3GovernanceView
            activeRole={activeRole}
            candidates={candidates}
            ballots={ballots}
            highContrastDark={highContrastDark}
            onApproveCandidate={(id) =>
              setCandidates((prev) =>
                prev.map((c) =>
                  c.id === id ? { ...c, status: '자격검증 완료' } : c
                )
              )
            }
            onCastVote={(ballotId, optionId) => {
              const receipt = `0x${Math.random().toString(16).slice(2, 10)}${Date.now().toString(16).slice(-6)}`;
              setBallots((prev) =>
                prev.map((b) => {
                  if (b.id !== ballotId) return b;
                  return {
                    ...b,
                    castVotes: b.userVotedOptionId ? b.castVotes : b.castVotes + 1,
                    userVotedOptionId: optionId,
                    userReceiptHash: receipt,
                    options: b.options.map((o) =>
                      o.id === optionId ? { ...o, votes: o.votes + 1 } : o
                    ),
                  };
                })
              );
            }}
          />
        )}

        {activeModule === 'payroll' && (
          <Module4PayrollWelfareView
            activeRole={activeRole}
            welfareList={welfareList}
            highContrastDark={highContrastDark}
            onAdvanceWelfareStage={(id) =>
              setWelfareList((prev) =>
                prev.map((w) => {
                  if (w.id !== id) return w;
                  const nextStage = Math.min(4, w.stage + 1) as 1 | 2 | 3 | 4;
                  const labels: Record<number, string> = {
                    1: '1단계: 조/반장 현장 확인완료',
                    2: '2단계: 지부 총무 검토중',
                    3: '3단계: 본부 복지후생부 최종승인 완료',
                    4: '4단계: 항운신협/공제회 펌뱅킹 입금 완료',
                  };
                  return {
                    ...w,
                    stage: nextStage,
                    stageLabel: labels[nextStage],
                  };
                })
              )
            }
            onCreateWelfareApp={(item) =>
              setWelfareList((prev) => [item, ...prev])
            }
          />
        )}

        {activeModule === 'research' && (
          <Module5ResearchFactbookView
            activeRole={activeRole}
            factbookRows={TERMINAL_POLICY_FACTBOOK}
            highContrastDark={highContrastDark}
          />
        )}

        {activeModule === 'pr' && (
          <Module6PrBroadcastView
            activeRole={activeRole}
            broadcasts={broadcasts}
            highContrastDark={highContrastDark}
            onCreateBroadcast={(item) =>
              setBroadcasts((prev) => [item, ...prev])
            }
            onRemindUnread={(id) =>
              setBroadcasts((prev) =>
                prev.map((b) =>
                  b.id === id
                    ? {
                        ...b,
                        readCount: Math.min(b.totalTarget, b.readCount + 310),
                        branchReadRates: b.branchReadRates.map((br) => ({
                          ...br,
                          ratePct: Math.min(99.8, Number((br.ratePct + 2.4).toFixed(1))),
                        })),
                      }
                    : b
                )
              )
            }
          />
        )}

        {activeModule === 'legal' && (
          <Module7LegalSafety119View
            activeRole={activeRole}
            complianceItems={LEGAL_COMPLIANCE_GUARDRAILS}
            highContrastDark={highContrastDark}
          />
        )}
      </main>

      {/* Mobile Gloved-Hand Bottom Navigation Bar */}
      <nav
        aria-label="모바일 하단 7대 모듈 내비게이션"
        className="no-print lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0C1E4A] text-white border-t border-blue-800 grid grid-cols-7 pb-[env(safe-area-inset-bottom)] shadow-2xl"
      >
        {moduleNavItems.map((m) => {
          const IconComp = m.icon;
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setActiveModule(m.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`min-h-[54px] py-1.5 px-0.5 flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-extrabold'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <IconComp className="w-4 h-4 shrink-0" />
              <span className="text-[10px] leading-none tracking-tighter whitespace-nowrap">
                {m.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Global Ctrl+K Omnibar Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
          <div className="w-full max-w-xl bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 flex items-center gap-2.5">
              <Search className="w-5 h-5 text-blue-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                placeholder="조합원명, 조합원번호, 지부(제3항업 등), 연락소(HJNC), 모선명 검색..."
                className="w-full text-sm font-medium outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto space-y-2 text-xs">
              <div className="font-bold text-slate-400 px-2">7대 핵심 모듈 바로가기</div>
              <div className="grid grid-cols-2 gap-1.5">
                {moduleNavItems.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setActiveModule(m.id);
                      setSearchModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-left font-bold text-slate-800 flex items-center justify-between border border-slate-200"
                  >
                    <span>
                      [{m.num}] {m.label}
                    </span>
                    <span className="text-[10px] text-blue-600">{m.owner}</span>
                  </button>
                ))}
              </div>
              {globalQuery.trim() && (
                <div className="pt-2 space-y-1">
                  <div className="font-bold text-slate-400 px-2">조합원 검색 결과</div>
                  {members
                    .filter(
                      (m) =>
                        m.name.includes(globalQuery) ||
                        m.memberNo.toLowerCase().includes(globalQuery.toLowerCase()) ||
                        m.branchName.includes(globalQuery) ||
                        m.liaisonName.includes(globalQuery)
                    )
                    .map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setActiveModule('org');
                          setSearchModalOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-blue-50 text-left flex items-center justify-between border border-slate-100"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{m.name}</span>{' '}
                          <span className="text-slate-500 font-mono">({m.memberNo})</span>
                          <div className="text-[11px] text-slate-500">
                            {m.branchName} · {m.liaisonName} · {m.gangName}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                          {m.memberType}
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
