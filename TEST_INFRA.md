# Test Infrastructure: Endoora Proprietary Adaptive Placement Testing System (CAT)

## 1. Overview & Architecture

The testing infrastructure for the Endoora Computer-Adaptive Placement Testing (CAT) System implements an opaque-box, multi-tier verification model built natively on Node.js 24 ESM. It provides mathematical psychometric validation, state machine progression testing, boundary stress testing, and static/dynamic codebase scanning without external test runner bloat.

- **Primary Test Runner**: `tests/e2e/placement/run-all.mjs`
- **Execution Command**: `node tests/e2e/placement/run-all.mjs`
- **Execution Speed**: ~1.2 seconds for full 215-check verification suite
- **Runtime Environment**: Node.js v24.18.0 (Native ESM with zero dependencies)
- **Exit Code Convention**: Code `0` on clean pass; Code `1` with itemized diagnostics when implementation defects are detected; `--soft-fail` flag available for milestone baseline tracking.

---

## 2. 4-Tier Test Matrix

```
+-----------------------------------------------------------------------------------+
|               Endoora Adaptive Placement System 4-Tier Test Suite                 |
+-----------------------------------------------------------------------------------+
| Tier 1: Feature Coverage (95 checks | 5 per feature across F1–F19)                |
|  - F1–F3: 300+ Calibrated pool, continuous parameters, spoken audio engine        |
|  - F4–F6: Rasch IRT scoring, 0–100 Endoora Index, dynamic CAT sampling            |
|  - F7–F8: Session section timers, completed_at field, backend EF SET purge        |
|  - F9–F10: 50-item progression matrix, independent countdown timers (15/12/10m)  |
|  - F11–F13: Distraction-free HUD, media widgets enforcement, runner EF SET purge  |
|  - F14–F17: Deferred Learner Twin, 6-axis SVG radar, diagnostic report, rebrand   |
|  - F18–F19: E2E test harness execution, adversarial input hardening               |
+-----------------------------------------------------------------------------------+
| Tier 2: Boundary & Corner Cases (95 checks | 5 per feature across F1–F19)         |
|  - Extreme theta boundaries (theta = -3.0 and +3.0 clamping)                     |
|  - All-correct (50/50 -> C2) vs All-incorrect (0/50 -> A1) asymptotic ceilings   |
|  - Exact CEFR cutoff boundaries (-1.8, -0.8, +0.2, +1.2, +2.2)                   |
|  - Timer exhaustion at 00:00 vs 00:01 warning threshold                          |
|  - Audio 2-play limit exhaustion & debounce protection                            |
|  - Writing word count boundaries (minWords - 1 disabled submit)                  |
|  - Decibel meter silence & maximum amplitude tolerance                           |
+-----------------------------------------------------------------------------------+
| Tier 3: Pairwise Cross-Feature Combinations (20 scenarios)                        |
|  - Section timeout x unsaved intermediate answer persistence                     |
|  - Adaptive ability jump x section boundary item seeding                         |
|  - Audio network error x Web Speech API synthesis fallback activation             |
|  - Audio play limit exhaustion x timer approaching warning threshold             |
|  - Retake session non-repetition x ability trajectory equivalence                |
|  - 6-axis radar polygonal geometry x asymmetric skill profiles                    |
|  - Idempotent double final submission x report immutability                      |
+-----------------------------------------------------------------------------------+
| Tier 4: Real-World Application Scenarios (5 full 50-item simulated sessions)      |
|  - Scenario 1: True Beginner (Candidate Profile: A1 Starter, theta ~ -2.4)       |
|  - Scenario 2: Elementary Learner (Candidate Profile: A2, theta ~ -1.3)           |
|  - Scenario 3: Intermediate Independent Learner (Candidate Profile: B1, ~ -0.3)  |
|  - Scenario 4: Upper-Intermediate Vantage (Candidate Profile: B2, ~ +0.7)        |
|  - Scenario 5: Proficient Near-Native Scholar (Candidate Profile: C2, ~ +2.6)    |
+-----------------------------------------------------------------------------------+
```

---

## 3. Directory Layout & Test Modules

```
tests/e2e/placement/
├── run-all.mjs                         # Master test runner with formatting & CLI flags
├── tier1-feature-coverage.test.mjs     # 95 feature coverage test cases (F1–F19)
├── tier2-boundary-corner-cases.test.mjs# 95 boundary & corner test cases (F1–F19)
├── tier3-pairwise-combinations.test.mjs# 20 pairwise cross-feature interaction tests
├── tier4-real-world-scenarios.test.mjs # 5 full 50-item simulated candidate sessions
└── helpers/
    ├── assertions.mjs                  # Standalone assertion library & test registry
    ├── irt-oracle.mjs                  # Psychometric IRT/Rasch 1-PL mathematical oracle
    ├── cat-simulation.mjs              # 50-item CAT session simulator & pool generator
    └── codebase-scanner.mjs            # Static/dynamic scanner for items, backend, & UI
```

---

## 4. Psychometric IRT / Rasch Mathematical Oracle

The reference oracle (`helpers/irt-oracle.mjs`) implements the exact psychometric specifications outlined in R6:

### 1-PL Rasch / Logistic Model
$$P(\theta, b_i, a_i) = \frac{1}{1 + \exp(-a_i (\theta - b_i))}$$

### Bayesian MAP / Newton-Raphson Estimation
Maximizes the log-posterior under a standard normal prior $\theta \sim \mathcal{N}(0, 1)$:
$$\frac{\partial \ln L}{\partial \theta} = -\theta + \sum_{i=1}^N a_i (u_i - P_i(\theta))$$
$$\frac{\partial^2 \ln L}{\partial \theta^2} = -1 - \sum_{i=1}^N a_i^2 P_i(\theta)(1 - P_i(\theta))$$
Standard Error: $SE(\theta) = \frac{1}{\sqrt{-\frac{\partial^2 \ln L}{\partial \theta^2}}}$.

### Piecewise Concordance to Endoora Index (0–100) & CEFR Bands
- **A1**: $\theta < -1.8 \implies \text{Index } [0, 29]$
- **A2**: $-1.8 \le \theta < -0.8 \implies \text{Index } [30, 44]$
- **B1**: $-0.8 \le \theta < +0.2 \implies \text{Index } [45, 64]$
- **B2**: $+0.2 \le \theta < +1.2 \implies \text{Index } [65, 79]$
- **C1**: $+1.2 \le \theta < +2.2 \implies \text{Index } [80, 91]$
- **C2**: $\theta \ge +2.2 \implies \text{Index } [92, 100]$

---

## 5. Execution Commands & Options

```bash
# Execute complete 4-tier E2E test suite:
node tests/e2e/placement/run-all.mjs

# Execute with soft-fail (exit 0 while tracking milestone progress):
node tests/e2e/placement/run-all.mjs --soft-fail

# Execute specific tier only:
node tests/e2e/placement/run-all.mjs --tier=1
node tests/e2e/placement/run-all.mjs --tier=4

# Execute specific feature only:
node tests/e2e/placement/run-all.mjs --feature=F1

# Output structured JSON report:
node tests/e2e/placement/run-all.mjs --json
```
