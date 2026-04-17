## Ticket Backlog – On‑Device Home Assistant

Conventions:
- **Type**: `feature`, `task`, `subtask`
- **ID format**: `F#`, `F#.T#`, `F#.T#.S#`
- Features group related tasks; tasks are independently shippable chunks; subtasks are the smallest units of work.
- **✓** on a subtask = design/spec captured (often in Plan or inline notes). **Code status** for this workspace is summarized below and in *Progress* notes where work has started.

### Current progress (snapshot: 2026-04-10)

| Area | Status | What exists / what is next |
| ---- | ------ | -------------------------- |
| **Repos & CI** (GettingStarted Phase 0–3) | **Done** | `cube`, `app`, `contracts`, `backend`, `scripts`, `listener` on disk; GitHub Actions **Lint/Test** (and scripts checks) per repo. |
| **GettingStarted Phase 1–2** | **Done** | **Phase 1:** Cube scaffold + JaCoCo/Checkstyle, core service interfaces + behaviour log types, **`HttpServerGateway`** aligned with OpenAPI (incl. device PATCH, chat, internet-activity stub, `global_offline`), **`Cube.main`** with **`--port` / `CUBE_PORT`**. **Phase 2:** App scaffold, Jest + Storybook + category threshold on `cubeApi.ts`, **`mockCubeApi`** / **`createHttpCubeApi`**, base screens/stacks, shared UI components, encrypted backup, cube settings + transparency + Chat stub. |
| **Contracts** (cube ↔ app) | **Done** (v0.1+ maintained) | OpenAPI `openapi/cube-app.yaml`: status, config, devices (list + PATCH), chat, internet-activity, routines, profiles, logs, backup, restore; CI validates/bundles spec (Redocly). Extend as features land; keep app `cubeApi.types` in sync. |
| **Cube (Java)** | **Phase 1 complete** | As above; no OS/supervisor/voice (Phase 5+). |
| **App (React Native)** | **Phase 2 complete** | As above; **no** production Bluetooth/Wi‑Fi pairing (Phase 10) yet—placeholders only. |
| **Backend (optional)** | **Scaffold only** | Java `pom.xml`; no remote backup API implementation yet. |
| **F1–F7, F10–F11 (most tasks)** | **Not started** or **spec only** | Many subtasks have ✓ spec in this file or Plan; no firmware, voice pipeline, smart home, or production profiles in code yet. |

---

## F1 – Hardware Platform & Low‑Level System
**Type**: feature  
**Goal**: Define and implement the physical cube platform and secure, recoverable base system.

- **F1.T1 – Define hardware specification**
  - **Type**: task
  - **Subtasks:**
    - **F1.T1.S1 – Define CPU / NPU / GPU requirements**
    - **F1.T1.S2 – Define RAM and storage requirements (LLM, STT, logs, backups)**
    - **F1.T1.S3 – Specify microphone array (count, pattern, SNR)**
    - **F1.T1.S4 – Specify speaker, amplifier, and acoustic targets**
    - **F1.T1.S5 – Specify connectivity (Bluetooth, Wi‑Fi, optional Ethernet)**
    - **F1.T1.S6 – Specify physical controls (LEDs, mic mute button, recovery button combo)**

- **F1.T2 – Power, thermal, and always‑on audio design**
  - **Type**: task
  - **Subtasks:**
    - **F1.T2.S1 – Estimate worst‑case power draw for all processing pipelines**
    - **F1.T2.S2 – Design passive cooling solution and thermal budget**
    - **F1.T2.S3 – Define low‑power modes and wake‑word standby consumption targets**
    - **F1.T2.S4 – Define safe thermal throttling and shutdown behavior**

- **F1.T3 – Bootloader and secure boot chain**
  - **Type**: task
  - **Subtasks:**
    - **F1.T3.S1 – Choose bootloader and secure boot approach**
    - **F1.T3.S2 – Implement firmware signature verification**
    - **F1.T3.S3 – Implement A/B firmware partitions (active + fallback)**
    - **F1.T3.S4 – Document boot sequence and failure modes**

- **F1.T4 – Factory reset and recovery mode**
  - **Type**: task
  - **Subtasks:**
    - **F1.T4.S1 – Define physical interaction for factory reset and recovery (button combo, LED feedback)**
    - **F1.T4.S2 – Implement factory reset that wipes user data but preserves base firmware**
    - **F1.T4.S3 – Implement recovery mode UI/UX for pairing with mobile app**
    - **F1.T4.S4 – Document reset/recovery behavior for manuals and support**

---

## F2 – OS, Core Services & Firmware Updates
**Type**: feature  
**Goal**: Provide a minimal, secure OS with core services, update system, and corruption recovery.

- **F2.T1 – Select base OS and partitioning scheme**
  - **Type**: task
  - **Subtasks:**
    - **F2.T1.S1 – Adopt Buildroot as the headless embedded OS (no GUI) and define requirements**
    - **F2.T1.S2 – Design partition layout (rootfs A/B, data, logs, recovery)**
    - **F2.T1.S3 – Implement Buildroot configuration and initial image build pipeline**

- **F2.T2 – Core service architecture**
  - **Type**: task
  - *Progress (2026-04): **GettingStarted Phase 1 done** — S1: Java interfaces for STT, TTS, LLM, automation engine, API gateway; **`HttpServerGateway`** implements OpenAPI v0.1+ (status, config PATCH, devices list/PATCH, chat, internet-activity stub, routines, profiles, logs, backup, restore); **`Cube.main`** starts gateway with **`--port` / `CUBE_PORT`**. S2 (supervisor) not started. S3: behaviour log types/interfaces (`BehaviourLogSchema`, `BehaviourLogWriter`); not wired through voice services yet.*
  - **Subtasks:**
    - **F2.T2.S1 – Define processes and IPC between STT, TTS, LLM, automation engine, API gateway**
    - **F2.T2.S2 – Implement service supervisor (restart policies, health checks)**
    - **F2.T2.S3 – Define logging interfaces for all core services**

- **F2.T3 – Firmware update system (A/B)**
  - **Type**: task
  - **Subtasks:**
    - **F2.T3.S1 – Design OTA update protocol between app and cube**
    - **F2.T3.S2 – Implement update application to write new firmware to inactive partition**
    - **F2.T3.S3 – Implement boot‑success detection and automatic rollback**
    - **F2.T3.S4 – Expose update status and changelog hooks to app**

- **F2.T4 – Firmware corruption detection and recovery**
  - **Type**: task
  - **Subtasks:**
    - **F2.T4.S1 – Detect failed boots and mark partition as bad**
    - **F2.T4.S2 – Automatically boot fallback partition when corruption detected**
    - **F2.T4.S3 – Implement recovery mode to restore from mobile backup**
    - **F2.T4.S4 – Implement factory reset flow from recovery mode**

- **F2.T5 – Time synchronization service**
  - **Type**: task
  - **Subtasks:**
    - **F2.T5.S1 – Implement time sync from mobile app (Bluetooth/Wi‑Fi)**
    - **F2.T5.S2 – Implement optional NTP sync when internet is allowed**
    - **F2.T5.S3 – Implement time correction from internet responses containing timestamps**
    - **F2.T5.S4 – Handle clock drift and invalid time edge cases**

---

## F3 – Audio Pipeline, Wake Word, STT & TTS
**Type**: feature  
**Goal**: Reliable always‑on voice interaction with no audio retention.

- **F3.T1 – Audio capture and output pipeline**
  - **Type**: task
  - **Subtasks:**
    - **F3.T1.S1 – Implement microphone audio capture and buffering**
    - **F3.T1.S2 – Integrate beamforming / noise reduction (if supported by hardware)**
    - **F3.T1.S3 – Implement echo cancellation for TTS playback**
    - **F3.T1.S4 – Implement audio output path to speaker with volume control**

- **F3.T2 – Wake word engine integration**
  - **Type**: task
  - **Subtasks:**
    - **F3.T2.S1 – Select wake word engine and configure target phrase**
    - **F3.T2.S2 – Integrate wake word with low‑power continuous listening loop**
    - **F3.T2.S3 – Tune sensitivity and thresholds to reduce false positives/negatives**
    - **F3.T2.S4 – Implement visual/audible indicators on wake word detection**

- **F3.T3 – On‑device STT implementation**
  - **Type**: task
  - **Subtasks:**
    - **F3.T3.S1 – Select STT model/runtime and language set**
    - **F3.T3.S2 – Integrate streaming STT from wake to end‑of‑utterance**
    - **F3.T3.S3 – Implement VAD (voice activity detection) for utterance boundaries**
    - **F3.T3.S4 – Plumb STT transcripts into intent engine**

- **F3.T4 – On‑device TTS implementation**
  - **Type**: task
  - **Subtasks:**
    - **F3.T4.S1 – Adopt Piper as primary on‑device TTS engine and choose voice model(s)**
    - **F3.T4.S2 – Implement TTS synthesis API used by assistant, backed by Piper**
    - **F3.T4.S3 – Optimize Piper configuration for latency and naturalness on target hardware**
    - **F3.T4.S4 – Implement fallback behaviors on TTS failure (e.g., switch to simpler TTS or text‑only responses)**

- **F3.T5 – Voice data non‑retention enforcement**
  - **Type**: task
  - **Subtasks:**
    - **F3.T5.S1 – Audit audio pipeline to identify any persisted audio**
    - **F3.T5.S2 – Ensure audio buffers are in‑memory only and promptly zeroed**
    - **F3.T5.S3 – Add tests to verify no raw audio is written to disk or sent off‑device**
    - **F3.T5.S4 – Implement configuration/telemetry to prove “no audio retention” behavior**

---

## F4 – On‑Device LLM, Intent Engine & Dialogue
**Type**: feature  
**Goal**: Single on‑device “brain” with intent handling, memory, and confirmation logic.

- **F4.T1 – On‑device LLM/SLM model integration**
  - **Type**: task
  - **Subtasks:**
    - **F4.T1.S1 – Select model (size, architecture, quantization)**
    - **F4.T1.S2 – Integrate model runtime (GPU/CPU/NPU where available)**
    - **F4.T1.S3 – Implement prompt building for home control and Q&A**
    - **F4.T1.S4 – Benchmark latency and tune parameters**

- **F4.T2 – Intent and NLU layer**
  - **Type**: task
  - **Subtasks:**
    - **F4.T2.S1 – Define intent schema (devices, scenes, routines, profiles, settings)**
    - **F4.T2.S2 – Implement intent classifier / extractor**
    - **F4.T2.S3 – Implement entity resolution (device names, rooms, profiles)**
    - **F4.T2.S4 – Implement ambiguity detection logic**

- **F4.T3 – Dialogue management and confirmations**
  - **Type**: task
  - **Subtasks:**
    - **F4.T3.S1 – Define dialogue states and transitions (Idle, Listening, Interpreting, Clarifying, Executing, Error) with a 5s listen timeout**
    - **F4.T3.S2 – Implement single “did you mean X or Y?” clarification attempt, then suggest resolving in the mobile app if unresolved**
    - **F4.T3.S3 – Implement confirmation prompt framework (off by default) for future sensitive actions (e.g., locks, gates, doors, windows)**
    - **F4.T3.S4 – Implement graceful fallback responses on model uncertainty and device failures (announce failure, log error, return to Idle)**
    - **F4.T3.S5 – Implement short‑term context chaining (track last device and its state metadata where each follow‑up arrives within <1 minute of the previous request, with ability to clear chain and log only structured metadata for optional cloud context)**

- **F4.T4 – On‑device memory store**
  - **Type**: task
  - **Subtasks:**
    - **F4.T4.S1 – Design schema for per‑profile device memories (last_state + named presets) and future routines**
    - **F4.T4.S2 – Implement storage layer (encrypted where necessary)**
    - **F4.T4.S3 – Implement APIs for “remember this”, “forget this”, “forget today”**
    - **F4.T4.S4 – Implement export of memories per profile**

---

## F5 – Cloud LLM & Internet Permission Framework
**Type**: feature  
**Goal**: Optional use of Claude (or similar) and external data, strictly opt‑in and transparent.

- **F5.T1 – Cloud LLM (Claude) integration**
  - **Type**: task
  - **Subtasks:**
    - **F5.T1.S1 – Implement Claude API client with retries and timeouts**
    - **F5.T1.S2 – Define prompt formats for complex reasoning and web requests (no room/profile data, minimal or no device metadata, short neutral answers with optional \"Would you like more detail?\" follow‑up, and a standard failure message: \"I couldn't reach the online service right now, there are more details in the app\")**
    - **F5.T1.S3 – Implement streaming or chunked responses into TTS**
    - **F5.T1.S4 – Handle API errors and fall back to on‑device responses**

- **F5.T2 – Internet permission model**
  - **Type**: task
  - **Subtasks:**
    - **F5.T2.S1 – Implement per‑request consent flow (voice & app)**
    - **F5.T2.S2 – Implement optional session‑level consent with timeout**
    - **F5.T2.S3 – Implement per‑profile settings for internet usage rules**
    - **F5.T2.S4 – Implement global “offline mode” toggle enforcement**

- **F5.T3 – Internet activity logging**
  - **Type**: task
  - **Subtasks:**
    - **F5.T3.S1 – Define log schema for each external call including: monotonically increasing call ID, non‑identifying profile ID (with separate preferred display name), timestamp, device ID, short non‑PII request summary, service category, exact endpoint/domain, result status, error code/message (on failure), and chain UUID**
    - **F5.T3.S2 – Implement logging in all network‑using modules using this schema**
    - **F5.T3.S3 – Implement log rotation, 7‑day on‑device retention, and storage quotas**
    - **F5.T3.S4 – Expose logs to app API for both normal (simplified) and advanced (detailed) transparency views**

---

## F6 – Smart Home Integrations & Automation Engine
**Type**: feature  
**Goal**: Local control of smart devices, robust routines, and clear error handling.

- **F6.T1 – Smart home integration layer**
  - **Type**: task
  - **Subtasks:**
    - **F6.T1.S1 – Integrate with Home Assistant via local API**
    - **F6.T1.S2 – Integrate with Matter/Thread/Zigbee/Z‑Wave controllers**
    - **F6.T1.S3 – Integrate common Wi‑Fi smart devices (lights, plugs, blinds)**
    - **F6.T1.S4 – Define uniform device abstraction layer for lights including capabilities (`on_off`, `dimmable`, `color_temp`, `color_rgb`), normalised state representation (fractions/decimals for brightness and colour), stable internal IDs, display names, and user‑defined groups/tags for flexible selection**

- **F6.T2 – Device discovery and naming wizard**
  - **Type**: task
  - **Subtasks:**
    - **F6.T2.S1 – Implement discovery scanning for supported protocols**
    - **F6.T2.S2 – Implement voice‑driven naming flow (“this is a light in the living room…”)**
    - **F6.T2.S3 – Implement app‑based naming and room assignment UI hooks**
    - **F6.T2.S4 – Persist device metadata and keep it in sync with integrations**

- **F6.T3 – Device reachability and error reporting**
  - **Type**: task
  - **Subtasks:**
    - **F6.T3.S1 – Implement periodic health checks for devices**
    - **F6.T3.S2 – Implement structured error responses when devices are unreachable**
    - **F6.T3.S3 – Map errors to user‑friendly voice responses (“I couldn’t reach…”)**
    - **F6.T3.S4 – Surface device status and errors in the app UI**

- **F6.T4 – Routine engine (triggers, conditions, actions)**
  - **Type**: task
  - **Subtasks:**
    - **F6.T4.S1 – Design routine data model with: named routines (routine_id + name), owner_profile_id and permissions, triggers (time, sun events, device events, voice phrase, presence), optional conditions (time windows, presence, device state), and actions (multi‑device state changes, delays, notifications)**
    - **F6.T4.S2 – Implement scheduler and event listeners (time, sensors, presence)**
    - **F6.T4.S3 – Implement execution graph with partial failure handling**
    - **F6.T4.S4 – Implement routine execution logging for inspection**

- **F6.T5 – Routine inspection and editing support**
  - **Type**: task
  - *Progress (2026-04-17): **S1** `GET /routines/history`. **S2** Routine runs screen. **S3** `PATCH` display name + detail save. **S4** Jest + cube HTTP tests; Detox E2E deferred.*
  - **Subtasks:**
    - **F6.T5.S1 – Implement API to fetch routine history and failed steps** *(done)*
    - **F6.T5.S2 – Link routine executions to app inspection views** *(done)*
    - **F6.T5.S3 – Allow editing routines from app and syncing back to cube** *(display name only)*
    - **F6.T5.S4 – Implement tests for end‑to‑end routine execution flows** *(partial)*

---

## F7 – Roles, Security, GDPR & COPPA
**Type**: feature  
**Goal**: Per‑profile control, strong security, and regulatory compliance.

- **F7.T1 – Profile and authentication system**
  - **Type**: task
  - *Progress (2026-04-17): App **`patchProfile`** + profile detail save; cube/contracts **`PATCH /profiles/{id}`** (display name only). Voice/PIN/S4 not done.*
  - **Subtasks:**
    - **F7.T1.S1 – Design profile model (adult, guest, child) including: stable profile_id, preferred_name, role, basic settings (language, voice_verbosity, internet_policy), per-role permissions (adults full control, guests limited devices, children restricted devices), routine ownership rules (creator-owned routines unless shared with household; guest/child routines always household-editable), and linked adults with full visibility into child activity**
    - **F7.T1.S2 – Implement profile selection via voice and PIN**
      - Run **speaker recognition on each voice command** until the user is determined for the current chain; once determined, no re-check until the next chain. Use **free or lowest-cost** on-device speaker recognition (no cloud). **Unidentified speaker → guest mode** (user continues with guest permissions, not blocked). PIN (or explicit "I'm [name]" / app selection) overrides or supplements when needed. See Plan §5 User profiles and Guest mode.
    - **F7.T1.S3 – Implement permissions matrix per profile (devices, routines, settings)**
    - **F7.T1.S4 – Implement profile switching safeguards (esp. for children)**

- **F7.T2 – Guest and child profiles**
  - **Type**: task
  - **Subtasks:**
    - **F7.T2.S1 – Implement guest profile with restricted device and data access**
    - **F7.T2.S2 – Implement child profiles with internet disabled by default**
    - **F7.T2.S3 – Implement parental approval flow for child internet access**
    - **F7.T2.S4 – Implement parental view of child activity**

- **F7.T3 – Local API security and encryption**
  - **Type**: task
  - **Subtasks:**
    - **F7.T3.S1 – Implement secure pairing and key exchange with mobile app (Bluetooth & Wi‑Fi)**
    - **F7.T3.S2 – Implement mutual authentication for app–cube API calls**
    - **F7.T3.S3 – Encrypt sensitive data in transit and at rest**
    - **F7.T3.S4 – Implement token rotation and revocation mechanisms**

- **F7.T4 – GDPR compliance implementation**
  - **Type**: task
  - **Subtasks:**
    - **F7.T4.S1 – Implement per‑profile “export my data” flows (app + device)**
    - **F7.T4.S2 – Implement per‑profile “delete my data” with confirmation**
    - **F7.T4.S3 – Implement data portability formats (JSON/CSV)**
    - **F7.T4.S4 – Implement consent recording and management for internet and remote storage**

- **F7.T5 – COPPA safeguards**
  - **Type**: task
  - **Subtasks:**
    - **F7.T5.S1 – Implement flagging of child profiles and stricter defaults**
    - **F7.T5.S2 – Minimize stored data for child profiles**
    - **F7.T5.S3 – Implement parental consent UX for any additional data processing**
    - **F7.T5.S4 – Document COPPA‑related behavior and parental tools**

---

## F8 – Transparency, Logging & Explainability
**Type**: feature  
**Goal**: Make actions, decisions, and internet usage fully inspectable.

- **F8.T1 – Behaviour log service**
  - **Type**: task
  - *Progress (2026-04): S1 — Plan + Java `BehaviourLogSchema` records in cube. S2 — write-path interface only (`BehaviourLogWriter`); no storage, rotation, or query API implementation yet.*
  - **Subtasks:**
    - **F8.T1.S1 – Define log schema for intents (utterance + parsed intent with intent_index), actions (before/after state, result, action_index, link to intent_index), and internet calls (metadata, call_index), all grouped by chain_id (UUID)** ✓
      - **Schema**: Chain summary row per `chain_id` (device_id, chain_start_ts, chain_end_ts, initial_profile_id; **identified_at_ts** + **identified_profile_id** when user is first identified in the chain; **privacy_mode_changes** array: each switch paranoid↔normal with at_ts, from_mode, to_mode, trigger voice|app|permission_grant). Intents: chain_id, intent_index, **ts**, utterance, type/targets/parameters, profile_id. Actions: chain_id, action_index, intent_index, **ts**, before/after state, result, error. Internet calls: chain_id, call_index, ts, device_id, profile_id, metadata, service_category, endpoint, result, error. One timestamp per intent and per action for debugging. See Plan §4 "Behaviour log schema".
    - **F8.T1.S2 – Implement write‑path from all core services into log store using this schema**
    - **F8.T1.S3 – Implement log rotation and retention policies (7 days on device)**
    - **F8.T1.S4 – Implement query API for app (time filters, profile filters, device filters, chain view)**

- **F8.T2 – “Why did you do that?” explanation engine**
  - **Type**: task
  - **Subtasks:**
    - **F8.T2.S1 – Implement mapping from actions to triggering rules/routines/commands**
    - **F8.T2.S2 – Implement explanation templates for common scenarios**
    - **F8.T2.S3 – Integrate explanation engine with voice interface**
    - **F8.T2.S4 – Integrate explanation engine with app UI (action details view)**

- **F8.T3 – Privacy modes (normal vs paranoid)**
  - **Type**: task
  - **Description**: Implement switching between paranoid and normal privacy modes via voice and app, with adult-only controls, per-conversation chain behavior, and clear explanations of how context and cloud access work.
  - **Subtasks:**
    - **F8.T3.S1 – Define logging behavior per mode**
    - **F8.T3.S2 – Implement mode switching via voice and app**
      - Cube maintains a **global default privacy mode** (`default_privacy_mode`, set in the app) and a **per-chain mode** (`chain_privacy_mode`, initialised from the default at chain start).
      - **Only adult profiles (not guests or children)** can switch from paranoid → normal for the remainder of the current chain via voice, and can change the global default mode in the app.
      - While in paranoid mode, no cloud LLM access is used unless an adult explicitly grants permission (e.g. after the assistant asks "This question needs the internet, is that okay?") during the current chain. If permission is granted, `chain_privacy_mode` becomes normal for the rest of that chain.
      - When paranoid mode is disabled (via voice or app) for the current chain, **all previous messages in that chain can and probably will be used as context for the LLM**; the assistant should say something like: "Paranoid mode is off for this conversation. I may use your earlier messages in this chat as context."
      - When paranoid mode is enabled again, all **later** messages in that chain are not sent to the cloud LLM and are treated as private; past messages may already have been processed.
      - Users can ask at any time which privacy mode is active (e.g. "Which privacy mode are you in?") and receive a clear answer based on the current `chain_privacy_mode`.
    - **F8.T3.S3 – Enforce minimal metadata in paranoid mode**
    - **F8.T3.S4 – Surface current mode clearly in app and device indicators**

---

## F9 – Mobile App (iOS/Android)
**Type**: feature  
**Goal**: Provide configuration, transparency, backup, and remote client functionality.

- **F9.T1 – App architecture and navigation**
  - **Type**: task
  - *Progress (2026-04): **GettingStarted Phase 2 done.** S1 — RN, bottom tabs + per-tab stacks (+ **Chat** tab stub). S2 — screens wired to **`CubeApi`**: Dashboard, Devices (rooms + light controls), Routines, Profiles, Logs, Settings (URL, mock, backup/restore, cube settings, internet activity, pairing/Wi‑Fi placeholders), Chat (stub). S3 — `ListItem`, `Toggle`, `PlaceholderScreen`, **`ConfirmDialog`**, **`RetryLoadDialog`** + Storybook/tests.*
  - **Subtasks:**
    - **F9.T1.S1 – Choose tech stack and navigation pattern** ✓
      - **Mobile app**: TypeScript + React (React Native) for iOS/Android; single codebase.
      - **Navigation**: Bottom tab bar with per‑tab stacks (each section has its own stack for list → detail).
      - **Cube (on‑device speaker)**: Java only; strict OOP, repeatable code.
      - **Backend**: Java for any cloud/sync or remote services.
    - **F9.T1.S2 – Implement base screens (dashboard, devices, routines, profiles, settings, logs)** — *GettingStarted **Phase 2 done**: lists/status wired to contract v0.1+; list→detail; device grouping + light controls (stub); logs chains + JSON detail; Chat tab (stub); cube settings / internet activity / pairing+Wi‑Fi placeholders*
    - **F9.T1.S3 – Implement shared UI components (lists, toggles, dialogs)** — *`ConfirmDialog`, `RetryLoadDialog`, `ListItem`, `Toggle`, Storybook/tests; retry on load errors across main list screens*

- **F9.T2 – Bluetooth pairing and secure channel**
  - **Type**: task
  - **Subtasks:**
    - **F9.T2.S1 – Implement device discovery and pairing flow**
    - **F9.T2.S2 – Implement key exchange and session establishment**
    - **F9.T2.S3 – Implement reconnection and multi‑device handling**
    - **F9.T2.S4 – Implement error handling and user guidance for pairing failures**

- **F9.T3 – Wi‑Fi configuration from app**
  - **Type**: task
  - **Subtasks:**
    - **F9.T3.S1 – Implement UI to enter Wi‑Fi credentials and network selection**
    - **F9.T3.S2 – Implement secure credential transfer to cube**
    - **F9.T3.S3 – Implement connection status feedback and troubleshooting flows**
    - **F9.T3.S4 – Align flows with instructions in hardware manual**

- **F9.T4 – Device dashboard and control UI**
  - **Type**: task
  - **Subtasks:**
    - **F9.T4.S1 – Implement room‑based device view**
    - **F9.T4.S2 – Implement device control panels (lights, blinds, thermostats, etc.)**
    - **F9.T4.S3 – Implement scene buttons (Good morning, Movie time, Away)**
    - **F9.T4.S4 – Integrate with cube APIs for real‑time state updates**

- **F9.T5 – Routine builder/editor UI**
  - **Type**: task
  - **Subtasks:**
    - **F9.T5.S1 – Implement triggers/conditions/actions editor**
    - **F9.T5.S2 – Implement routine list and detail screens**
    - **F9.T5.S3 – Implement routine test/simulate capability**
    - **F9.T5.S4 – Connect routine edits to cube routine engine**

- **F9.T6 – Profiles, permissions and parental controls UI**
  - **Type**: task
  - **Subtasks:**
    - **F9.T6.S1 – Implement profile list and detail screens**
    - **F9.T6.S2 – Implement controls for device access, routines, and internet rules**
    - **F9.T6.S3 – Implement child profile parental controls and approvals**
    - **F9.T6.S4 – Implement guest profile quick‑create and expiry**

- **F9.T7 – Internet transparency & activity UI**
  - **Type**: task
  - **Subtasks:**
    - **F9.T7.S1 – Implement timeline view for internet requests**
    - **F9.T7.S2 – Implement filters (time, profile, service, device)**
    - **F9.T7.S3 – Implement per‑conversation detail view**
    - **F9.T7.S4 – Implement global and per‑service toggle controls**

- **F9.T8 – Privacy, history, and memory controls UI**
  - **Type**: task
  - **Subtasks:**
    - **F9.T8.S1 – Implement conversation history browser (intents/commands only)**
    - **F9.T8.S2 – Implement delete‑range and delete‑all actions**
    - **F9.T8.S3 – Implement memory view and “forget” actions**
    - **F9.T8.S4 – Implement export‑my‑data flows**

- **F9.T9 – Backup and restore flows**
  - **Type**: task
  - *Progress (2026-04): **S1** — **Settings** triggers **`createBackup`**; payload held in app session for the same run. **S3** — **restore last backup** via **`restoreBackup`** with **`ConfirmDialog`**. **S2** (encrypted at-rest storage on device) and **S4** (remote opt-in UI) not started.*
  - **Subtasks:**
    - **F9.T9.S1 – Implement UI to trigger backup from cube to mobile** — *app: Settings → create backup (session-held payload)*
    - **F9.T9.S2 – Implement secure encrypted storage of backups on mobile** — *app: keystore key + secretbox ciphertext in AsyncStorage; Settings save/clear + hydrate restore buffer on launch*
    - **F9.T9.S3 – Implement restore‑from‑backup flow to cube** — *app: restore last in-session backup to cube*
    - **F9.T9.S4 – Implement optional remote backup opt‑in/opt‑out UI**

- **F9.T10 – App–cube voice/text client**
  - **Type**: task
  - **Subtasks:**
    - **F9.T10.S1 – Implement text chat interface to local brain**
    - **F9.T10.S2 – Implement option to use phone mic/speaker as satellite client**
    - **F9.T10.S3 – Ensure same internet permission rules apply via app**
    - **F9.T10.S4 – Implement visual indicators for on‑device vs online answers**

---

## F10 – Backup, Restore & Remote Storage Service
**Type**: feature  
**Goal**: Robust local backup to mobile and optional remote data storage (with explicit consent).

- **F10.T1 – Backup data model and format**
  - **Type**: task
  - **Subtasks:**
    - **F10.T1.S1 – Define what data is included in backups (profiles, routines, settings, memories)** ✓
      - **Included**: (1) **Profiles** — full model: profile_id, preferred_name, role, voice_signatures (optional), hashed pin, language, voice_verbosity, internet_policy; per‑profile device/room permissions and routine ownership/sharing; linked adults for child profiles. (2) **Routines** — routine_id, name, owner_profile_id, permissions, triggers, conditions, actions (references by stable IDs). (3) **Settings** — default_privacy_mode, global offline toggle, timezone/locale, cube display/audio defaults; Wi‑Fi credentials either encrypted in backup or omitted (user re‑enters on restore). (4) **Memories** — per‑profile device last_state and named presets; household/freeform preferences and quirks. (5) **Device/room catalog** — device_id, display name, room, groups/tags, capabilities (no runtime state). (6) **Behaviour logs** — intent/action/internet logs within retention (e.g. up to 28 days on mobile). **Excluded**: voice audio; raw PINs/secrets (only hashed). See Plan §8 "Backup data scope" for full detail.
    - **F10.T1.S2 – Design versioned backup format** ✓
      - **Format**: JSON only; one file per domain. Container holds: `manifest.json` (schema version, backup timestamp, cube_id, backup_id, backup_type `"full"`, checksum); `profiles.json`, `routines.json`, `settings.json`, `memories.json`, `devices.json`; logs in **separate sections** — `logs_intents.json`, `logs_actions.json`, `logs_internet_calls.json`. See Plan §8 "Versioned backup format".
      - **Versioning**: Routines and device catalog versioned and retrievable on both app and device; on restore user chooses which set to keep (cube vs app backup). V1 restore: **factory reset** (full wipe) or **reset with device/routine recovery** (core software via Wi‑Fi download; then restore routines + device data from chosen source).
      - **Encryption**: Not encrypted at rest (cube/app); encrypted in transit when sending to cloud. Remote backup: user-held key — client encrypts before upload, server stores only ciphertext (key–value); server never has key. Secure and viable; key recovery is user responsibility.
    - **F10.T1.S3 – Implement schema migration strategy for future versions**

- **F10.T2 – Backup to mobile implementation (cube side)**
  - **Type**: task
  - **Subtasks:**
    - **F10.T2.S1 – Implement backup generation on cube**
    - **F10.T2.S2 – Implement transfer of backup to mobile app (encrypted in transit if over network; backup itself not encrypted at rest)**
    - **F10.T2.S3 – Implement integrity checksums and verification**
    - **F10.T2.S4 – Enforce log retention of up to 28 days on mobile backups and cleanup of older log entries**

- **F10.T3 – Restore from mobile implementation (cube side)**
  - **Type**: task
  - **Subtasks:**
    - **F10.T3.S1 – Implement restore process with validation and dry‑run checks (V1: factory reset or reset with device/routine recovery; user chooses source — cube vs app backup)**
    - **F10.T3.S2 – Implement conflict resolution (e.g., different device IDs) and UI for “which set to keep” (cube vs app)**
    - **F10.T3.S3 – Handle restore across firmware versions safely**
    - **F10.T3.S4 – Implement user feedback on restore success/failure**

- **F10.T4 – Optional remote backup service**
  - **Type**: task
  - **Subtasks:**
    - **F10.T4.S1 – Design remote storage API; encryption scheme: user-held key, client encrypts before upload, server stores only ciphertext (key–value), TLS in transit** ✓
      - **API**: REST over TLS. Auth by account token; all operations scoped to that account. **List** `GET /v1/backups` (metadata only: backup_id, created_at, size_bytes, optional cube_id). **Upload** `PUT /v1/backups/{backup_id}` body = encrypted blob (+ optional metadata). **Download** `GET /v1/backups/{backup_id}` → encrypted blob. **Delete** `DELETE /v1/backups/{backup_id}`; optional bulk delete for revoke-all. See Plan §8 "Remote backup: API and encryption design".
      - **Encryption**: Client derives key (e.g. Argon2id/PBKDF2 from passphrase + salt); encrypts backup payload with AES-256-GCM; uploads blob (optionally salt in plaintext prefix). Server stores opaque ciphertext only; no keys, no decryption.
    - **F10.T4.S2 – Implement upload/download of backups (encrypted in transit; client-side encryption so server never sees plaintext)**
    - **F10.T4.S3 – Implement consent and revocation handling (including remote deletion)**
    - **F10.T4.S4 – Document privacy and retention behavior for remote backups**

---

## F11 – UX, Manuals, Legal & Launch Readiness
**Type**: feature  
**Goal**: Cohesive user experience, documentation, and compliance.

- **F11.T1 – Voice UX script design**
  - **Type**: task
  - **Subtasks:**
    - **F11.T1.S1 – Define standard prompts for confirmations and clarifications** ✓
      - **Post‑action**: Single device ("The [device] is now [state]."), multiple ("Done. I've [action] the [devices]."), routine ("Done. [Routine name] is running."); short form "Done." / "Okay." when verbosity low.
      - **Clarifications** (one follow‑up): Multiple devices → "Which [type] did you mean? [A] or [B]?"; no match → "I don't see a [type] with that name…"; unclear intent → "I'm not sure what you'd like me to do…"; still unresolved → "I still couldn't tell which one… You can pick in the app or say the room name."
      - **Optional confirmations** (sensitive domains only; off for v1 bulbs): "Do you want me to [action]? Say yes or no." / "Okay, I won't."
      - **Recognition failures**: "I didn't catch that. Could you say it again?" / "I didn't understand. Try a command like… or ask in the app." See Plan §2 "Standard prompts: confirmations and clarifications".
    - **F11.T1.S2 – Define error messages for device failures and network issues** ✓
      - **Device**: Single unreachable → "I couldn't reach the [device name]. It may be offline or out of range."; timeout → "The [device name] didn't respond in time…"; partial success → "I've [action] [success list], but I couldn't reach [failed device]…"; all failed → "I couldn't reach any of those [devices]… Check the app."; capability not supported → "The [device name] doesn't support that."; routine partial/full failure → "[Routine name] ran, but one step didn't work…" / "I couldn't run [routine name]…"
      - **Network**: Cloud unreachable → "I couldn't reach the online service right now, there are more details in the app."; no internet → "I'm not connected to the internet… Connect to Wi‑Fi or check your network."; hub unreachable → "I couldn't reach your home system… check that [integration] is running and on the same network."; app–cube → "Connection to the cube failed… try again in the app."; Wi‑Fi setup failed → "I couldn't connect to that Wi‑Fi network… Check the password and signal, or try again in the app."
      - No silent failures; voice + app detail. See Plan §2 "Standard error messages: device and network".
    - **F11.T1.S3 – Define prompts for internet permission and mode explanations** ✓
      - **Asking permission**: Default → "This question needs the internet. Allow online access just for this answer?"; paranoid → "Right now I'm in paranoid mode… Do you want me to use online sources for this?"; user yes → "Paranoid mode is off for this conversation. I may use your earlier messages in this chat as context."; user no → "Okay, I'll answer using only what's on the device."; profile not allowed → "Only adults can allow internet access…" / "Your profile doesn't allow internet access…"; global offline → "Online access is turned off for this device. You can turn it on in the app."
      - **Mode explanations**: Which mode? → "I'm in paranoid mode. I won't send this conversation to online services." / "I'm in normal mode for this conversation…"; restating scope → "I will only use on‑device processing…" / "You allowed me to access the internet for this question only."; explain privacy rules → "I keep everything on the device by default…"; list ways to contact internet → "I only contact the internet when you allow it for a question… You can see when I've used it in the app."
      - **In progress** (optional): "I'm checking online for that." See Plan §2 "Standard prompts: internet permission and mode explanations".
    - **F11.T1.S4 – Define onboarding flows for new users and features** ✓
      - **First-time cube**: Power on → ready-to-pair (LED/audio) → app discovers via Bluetooth → pairing + key exchange → Wi‑Fi setup (SSID/password in app, transfer to cube) → optional first profile (adult, name, paranoid default) → "You're all set. Say [wake word] to start."
      - **First-time app**: Open app → connect to cube (Bluetooth/Wi‑Fi discovery, pair) → if no profiles, prompt add first profile → dashboard with empty-state messaging.
      - **Add first device**: App or voice discovery; guided naming (e.g. "This is a light in the living room, name it 'sofa lamp'"); assign room; document in manual/app.
      - **Add first profile**: App Profiles → role (adult/guest/child), name, PIN, device access, internet policy; for child: parental controls explanation, linked adults, confirm.
      - **Recovery**: Button combo → recovery mode → app (Bluetooth) → Restore from backup or Factory reset; step-by-step; after reset, ready-to-pair, re-onboard or restore from app backup.
      - **Reset with recovery** (V1): After reset → Wi‑Fi → app offers restore from backup → user picks backup → restore routines + device catalog + profiles/settings/memories → confirm in app/voice.
      - **New feature flows**: First internet use → standard permission prompt + optional one-time short explanation. First remote backup → opt-in screen (what's stored, server has no key, revoke anytime) → key setup → first upload. First routine → "You can say [routine name] to run it, or change it in the app." First child profile → explain defaults and parental controls, parent confirms. See Plan §2 "Onboarding flows: new users and features".

- **F11.T2 – Hardware manual and quick start guide**
  - **Type**: task
  - **Subtasks:**
    - **F11.T2.S1 – Document device pairing steps (Bluetooth and Wi‑Fi)**
    - **F11.T2.S2 – Document basic voice commands and examples**
    - **F11.T2.S3 – Document factory reset and recovery procedures**
    - **F11.T2.S4 – Include safety, compliance, and warranty information**

- **F11.T3 – Legal and policy documents**
  - **Type**: task
  - **Subtasks:**
    - **F11.T3.S1 – Draft privacy policy aligned with on‑device processing and GDPR**
    - **F11.T3.S2 – Draft terms of use for device and optional cloud services**
    - **F11.T3.S3 – Draft COPPA statement and parental guidance**
    - **F11.T3.S4 – Review documents with legal counsel**

- **F11.T4 – QA, testing, and beta program**
  - **Type**: task
  - **Subtasks:**
    - **F11.T4.S1 – Define test strategy (unit, integration, end‑to‑end, hardware‑in‑loop)** ✓
      - **Unit**: Everything (frontend, backend, all calls); branch coverage. **Test config**: minimum **85%** overall coverage + **category-specific** coverage levels. External deps mocked.
      - **Storybook**: **Atoms** and **molecules**; where there's **conditional rendering**, a Storybook for the **page** too. Visual + component verification.
      - **Integration**: Pipelines with mocks; app vs mock cube API.
      - **E2E**: In scope for critical journeys; run in CI (simulator + stub or real device as needed).
      - **HIL**: Small device runs HIL **periodically, before every major release**; scope TBD when we get to it.
      - **CI**: All tests (unit, Storybook, integration, E2E) run on **every PR**; HIL only before major releases. See Plan §14 "Test strategy".
    - **F11.T4.S2 – Implement automated test suites for core components**
    - **F11.T4.S3 – Plan and run closed beta with selected users**
    - **F11.T4.S4 – Implement feedback collection and triage process**

