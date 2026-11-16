# Learner Twin upgrade: implementation and review

Baseline: `SajadZare11/ENDOORA`, commit `f4a48bde1f1efc96d04f82dc74abfab5086311d6`.
Working branch: `codex/neuro-bayesian-learner-twin`.

## Review scope

The repository contains 2,409 tracked files. The accompanying inventory records 1,966 readable code, data, configuration, and Markdown files, totaling 1,012,298 lines. This is a repository-wide inventory, not a claim that every line has received a manual semantic review. Detailed review covered the existing Twin page, DKT engine and its callers, CDM item resolution and IELTS diagnosis, LinUCB feedback, gaze telemetry, BERT writing evaluation, pronunciation assessment, Sherlock scoring, learner session boundaries, the IELTS exam room, and the supplied upgrade code. The complete TypeScript workspace was typechecked and the Next application was built. The Python backend was not exhaustively audited or tested in this change.

No contents of `PRIVATE_DO_NOT_COPY_TO_GIT` were used or packaged.

## Findings from the existing implementation and supplied code

| Finding | Evidence / consequence | Resolution in this change |
|---|---|---|
| The existing Twin page presents fixed evidence counts and fixed calibration history. Its reset button only changes a notice. | Baseline `apps/web/app/(learner)/twin/page.tsx`: `TWIN_SKILLS`, static history array, `handleResetEvidence`. | Replace those displays with actual recorded observations, an empty state, JSON export, and a persistent local reset. |
| The existing application lives under `apps/web`, not `src`. | Root workspace configuration and `PROJECT.md`; the route is `/twin`. | Integrate at the actual paths and retain the route and learner shell. |
| Existing neural engines do not constitute evidence of near-zero prediction error. | `lib/dkt-engine/weights.ts` initializes weights with a seeded PRNG and structural priors. Other workers include fallback paths. | Do not advertise trained AKT weights, 97.6% accuracy, or ±0.20-band error without validation. Treat engine outputs as noisy educational measurements. |
| Missing skill IDs in the supplied predictor leave the mastery product at 1. | Unknown skills can receive near-perfect predicted success and artificially low uncertainty. | Unknown prediction IDs use an uncertain prior; observations targeting unknown nodes are rejected. |
| The supplied EKF Jacobian omits the conjunctive product and shared innovation variance. | Updating multiple required skills independently can count one answer several times. | Compute a joint innovation denominator and the product derivatives. Deduplicate skill IDs. Use the applied, bounded gain in a Joseph-form diagonal covariance update. |
| Distracted errors in the supplied implementation can still speed forgetting and damage prerequisites. | Noise gating affects the mean but not all secondary learning. | Gate decay adaptation and prerequisite penalties on reliability. Adjust each shared prerequisite once. |
| The supplied calibration multiplies squared/absolute errors by reliability but omits a weighted denominator. | This makes reported errors look smaller even if predictions are wrong. | Record full pre-action residuals. Weight the learning step separately. Label 100−MAE as an error-derived score rather than validated accuracy. |
| Grammar and generic MCQs are assigned to listening by the supplied modality default. | Grammar practice can inflate a listening band. | Grammar updates grammar nodes only. IELTS requires an explicit section. BERT, GOP, and Sherlock have explicit routing. |
| The supplied counterfactual function contains no random sampling. Zero minutes still avoids forgetting in its study branch. | It is not Monte Carlo, and its no-study comparison is inconsistent. | Run 500 seeded paired sampled trajectories in a dedicated worker. At zero minutes the two branches match exactly. Include 7/14/30/90-day endpoints and align day zero. |
| Supplied intervals are capped heuristics and can omit the rounded estimate. | Narrow intervals are presented without empirical calibration. | Intervals contain their estimates, remain bounded, and are labeled model intervals. Use sampled future quantiles and conservative correlated section uncertainty. |
| Original band mapping starts at band 4 and cannot represent A1. | It cannot support the stated A1–C2 range. | Use a provisional 1–9 mapping with A1–C2 display; explicitly disclose that this is not an empirically calibrated IELTS conversion. |
| The CDM matrix contains only 60 exact IELTS mappings across 4,000 listening/reading questions. | Existing CDM fallback/fuzzy resolution can synthesize A1 diagnoses for unmapped questions. | The new Twin uses exact mappings only. All other questions visibly use a section prior; it does not invent a prerequisite deficit. Existing CDM diagnosis behavior outside this feature is unchanged. |
| Existing engine storage keys are shared across the browser. | Importing historical aggregate arm totals into a new learner would mix profiles. | Scope the new Twin to the authenticated learner ID. Use the current answer’s trap signal, not legacy arm totals. Do not silently migrate the unscoped legacy state. Other engines retain their existing storage behavior. |
| Sherlock currently grades keyword/synonym matches. | It is not a BERT semantic evaluator. | Label its observations as Sherlock deduction evidence; do not relabel keyword scores as BERT output. |
| Browser storage may be unavailable, malformed, or full. | A direct JSON cast can break learning or poison a snapshot. | Validate snapshots atomically, clone caller data, bound history and learned parameters, and continue in memory when storage is denied. |

## Requirement traceability

| Requested capability | Implementation |
|---|---|
| Gaussian skill beliefs, forgetting, prerequisites | `apps/web/lib/ai/learner-twin-core.ts`, `learner-twin-types.ts`, generated `learner-twin-catalog.json` |
| Precision-weighted EKF noise shield | `assimilateMultiModalObservation`: latency, distraction, cognitive load, guessing, discrimination, process uncertainty, joint Jacobian, bounded update, covariance update |
| Pre-action prediction | `predictOutcomeBeforeInteraction`; captured tickets in adaptive questions, static Hex nodes, writing, pronunciation, Sherlock, and mock sessions |
| Residual learning | 6-input / 4-hidden-unit tanh network, 33 Float32 parameters, recurrent residual, monotonic temporal attention over 64 relevant interactions, bounded Huber gradient, per-item bias (128-item limit) |
| DKT integration | `lib/dkt-engine/dkt-engine.ts` records once before DKT changes its own state; gaze passes original response latency |
| Six-engine input bridge | BERT writing evaluator; DKT/Hex; CNN/GOP lab; CDM prerequisite metadata and exact mock Q mappings; gaze worker telemetry; LinUCB current-answer error vector |
| Zero new fusion server compute | Estimator executes in browser modules; future simulation executes in `workers/learner-twin.worker.ts`; no inference API or server simulation route added |
| No new external neural weights | Pure TypeScript estimator; deterministic small residual initialization; no additional runtime dependencies |
| Persistence and account isolation | `learner-twin-store.ts`, authenticated learner scope, per-account storage key, stale-ticket rejection, cross-tab refresh, actual reset |
| Live calibration badge | `/twin` overview: observed MAE-derived score, Brier-style residual error, interaction count, attenuated-observation count |
| AEF prerequisite constellation | `TwinConstellation.tsx`: 60 nodes, 78 existing prerequisite edges, mastery color, uncertainty halo, keyboard selection, ancestor highlighting, exact existing AEF references |
| Time travel controls | `TwinFuture.tsx`: 7/14/30/90 days; 0–45 min/day; paired 500-trajectory forecasts; model intervals; no-study band/retention; conditional band-7.5 date; accessible data table |
| Worker resilience | Debounced requests, request IDs, stale-result rejection, cleanup, timeout/error display, unsupported-worker state; no main-thread simulation fallback |
| Mock autoplay | `TwinMock.tsx`: 50 selectable exams × 2 sections; actual 40 question IDs per section; success probabilities, risk flags, mapping coverage, measured local latency |
| Five-minute targeted warm-up | `TwinWarmup.tsx`: loads real AEF curriculum drills on demand, shows targeted references, grades answers, records them through DKT/Twin, runs a five-minute timer before the separate exam entry action |
| Actual mock results feed the Twin | IELTS exam room captures pre-exam predictions and first-response latencies, then records real grading results on submission; no model mutation while just simulating |
| Interactive four-stage architecture | `TwinPipeline.tsx`: three isolated scenarios, previous/next stage controls, all six input engines, actual prediction/residual/noise/gain/posterior/variance values, worker future output, reduced-motion support |
| English and Persian | Existing locale, RTL logical styling, English/Persian copy, Tehran dates, responsive controls and SVG/table alternatives |
| Transparent learner controls | Real latest-64-observation history, source item IDs, exported versioned snapshot, confirm-and-reset UI |

## Mathematical and product boundaries

This is a small, attention-inspired online residual model, not a pretrained AKT Transformer. The Kalman filter keeps diagonal skill covariance; it does not claim to infer the full joint posterior over all prerequisite nodes. Future rollouts use shared learner factors, section-correlated process noise, pooled grammar retention uncertainty, and an assumed practice response. These are explicit modeling assumptions and should be fitted against longitudinal learner data.

Current skill probabilities, continuous writing/speaking rubric scores, and true IELTS bands are different targets. The displayed rolling squared residual is a Brier score for binary questions and a squared prediction error for continuous scores. The four section bands, CEFR mapping, model intervals, and target dates are provisional estimates. No held-out learner/exam dataset was supplied, so mastery RMSE below 2.5%, ±0.20 IELTS-band error, 95% empirical interval coverage, and universal 10 ms simulation latency have NOT been established.

The local Twin adds no inference requests. Existing authentication/content requests and pre-existing pronunciation backend synchronization remain part of the application. This is a zero-additional-server-compute estimator, not a claim that the whole existing application has no server traffic.

The existing DKT network’s forecasts can drift toward its prior when its hidden state decays; the existing test output includes some seven-day recall increases without study. This change does not retrain that network. The new Twin’s own no-reinforcement decay cannot increase a below-floor mastery value.

New Twin snapshots are per authenticated account and can be exported. The original DKT/CDM/GOP/bandit histories still use their original keys; this change does not relabel those old histories as account-scoped evidence.

## Reproduction

Use Node 24 and npm as specified by the repository.

```sh
npm ci
npm run generate:twin
npm run test:twin
npm run test:dkt
npm run test:bandit
npm run test:cdm
npm run test:gaze
npm run typecheck
npm run build
```

The asset generator uses the existing 60-concept curriculum and existing exact CDM mappings. It writes answer-free mock metadata under `apps/web/public/twin/`; it does not duplicate exam answer keys into these new assets.

For the optional browser suite, install Playwright in a test environment, run the application, and set `TWIN_TEST_URL` if it is not on port 3000. `CHROMIUM_PATH`, `PLAYWRIGHT_MODULE_PATH`, and `TWIN_ARTIFACT_DIR` can point to a system Chromium, an external Playwright installation, and a scratch output directory. The suite mocks learner-home/auth responses, blocks service workers so API interception remains deterministic, and exercises the actual bundled browser code and real Web Workers. It does not require Django or use a real learner account.

The execution environment needed a local `--ignore-scripts` install because the pre-existing ONNX postinstall download was refused, and a local no-save Linux SWC package because the repository lockfile lacked that platform binary. These were test-environment repairs; package versions, application dependency declarations, and the lockfile were not changed.

## Verification results

See the delivered verification report for final command outcomes, browser observations, measured bundle size, and timing limits. Browser timings were measured with mocked authentication on a local connection and do not establish performance on real networks or low-end devices.

## Line-level implementation review index

Line numbers refer to the delivered source, not the baseline. This indexes the detailed Twin review; it is not an exhaustive manual audit of the rest of the repository.

| Location | Review focus |
|---|---|
| `apps/web/lib/ai/learner-twin-core.ts:45` | Initialization, SSR-safe storage access, cloned catalog priors. |
| `apps/web/lib/ai/learner-twin-core.ts:85` | Finite and bounded node validation. |
| `apps/web/lib/ai/learner-twin-core.ts:108` | Atomic restore; learned-parameter and history validation. |
| `apps/web/lib/ai/learner-twin-core.ts:193` | Deep, portable snapshots; no writable references escape. |
| `apps/web/lib/ai/learner-twin-core.ts:215` | Forgetting with a floor that cannot raise weak mastery. |
| `apps/web/lib/ai/learner-twin-core.ts:236` | Prerequisite bottleneck evaluation. |
| `apps/web/lib/ai/learner-twin-core.ts:247` | Monotonic temporal weighting of related evidence. |
| `apps/web/lib/ai/learner-twin-core.ts:268` | Small typed-array residual network forward pass. |
| `apps/web/lib/ai/learner-twin-core.ts:277` | Pre-answer probability, uncertainty, frozen training context. |
| `apps/web/lib/ai/learner-twin-core.ts:351` | Validation, noisy observation fusion, causal gating, online residual learning, history and persistence. |
| `apps/web/lib/ai/learner-twin-core.ts:604` | Section and overall bands, bounded model intervals, provisional CEFR mapping. |
| `apps/web/lib/ai/learner-twin-core.ts:660` | Read-only real-question risk predictions and weak-skill warm-up selection. |
| `apps/web/lib/ai/learner-twin-future.ts:9` | 500 paired sampled trajectories, shared section innovations, daily practice/decay, quantile intervals. |
| `apps/web/workers/learner-twin.worker.ts:12` | Validated disposable worker snapshot, timing and error protocol. |
| `apps/web/lib/ai/learner-twin-store.ts:59` | Authenticated account boundary; reset ephemeral telemetry. |
| `apps/web/lib/ai/learner-twin-store.ts:92` | Single model update and reactive browser event. |
| `apps/web/lib/ai/learner-twin-store.ts:128` | Capture before a writing/speech/deduction response. |
| `apps/web/lib/ai/learner-twin-store.ts:156` | Reject another account’s delayed result. |
| `apps/web/lib/ai/learner-twin-store.ts:175` | Actually clear the local model and persist the reset. |
| `apps/web/lib/dkt-engine/dkt-engine.ts:100` | One shared Twin observation before the independent GRU update. |
| `apps/web/components/twin/TwinWarmup.tsx:87` | Freeze prediction and latency before lazy engine import; grade real AEF options once. |
