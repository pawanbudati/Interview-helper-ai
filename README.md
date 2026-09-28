# 🦜 Parakeet AI Copilot (Desktop Assistant)

A real-time AI copilot designed for live job interviews, technical assessments, and meetings. Built with a native transparent desktop overlay (Electron), React, Vite, and Tailwind CSS.

---

## ✨ Key Features

1. **Stealth Desktop HUD Overlay (Always-on-Top)**:
   - Floating, borderless, glassmorphic window designed to sit right below your camera or next to your interview call.
   - **Opacity Slider:** Adjust transparency from 35% to 100% solid dark.
   - **Font Scaling:** Switch between `S`, `M`, and `L` typography for effortless glancing without moving your eyes away from the screen.
   - **Global Background Hotkeys:**
     - `Ctrl + Shift + H`: Instant hide / show stealth toggle.
     - `Ctrl + Shift + M`: Mute / unmute audio listening.
     - `Ctrl + Shift + Space`: Force trigger instant answer.

2. **Dual Audio Stream Capture**:
   - **Microphone:** Listens to your voice.
   - **Meeting Audio Loopback (WebRTC):** Captures the interviewer's voice directly from Zoom, Microsoft Teams, or Google Meet tabs/windows.
   - **Real-Time Glowing Waveform:** Dynamic visual feedback showing live audio levels.

3. **Glanceable Teleprompter Answers**:
   - **Say This First (Opener):** 1-2 sentence immediate hook so you can start speaking right away without awkward hesitation.
   - **Talking Points with Metrics:** Structured bullet points automatically referencing past projects, metrics, and technologies from your resume.
   - **Code & Specs:** Formatted code blocks and architectural trade-offs for technical and system design questions.
   - **Anticipated Follow-ups:** 2 follow-up questions the interviewer is likely to ask next.

4. **Multi-Mode Support**:
   - **Behavioral (STAR Method):** Situation, Task, Action, Result.
   - **System Design:** Scalability, caching, database partitioning, bottlenecks.
   - **Live Coding / LeetCode:** Time/Space complexity, edge cases, step-by-step algorithms.
   - **General Interview:** Elevator pitch, strengths, and company fit.

5. **Multi-Provider AI Engine**:
   - **Offline Demo Mode:** Realistic simulated responses for instant testing with **0 API keys needed**.
   - **Google Gemini:** `gemini-2.5-flash` / `gemini-2.0-flash` for ultra-fast, long-context reasoning.
   - **Groq:** Llama-3.3-70b for sub-500ms time-to-first-token.
   - **OpenAI:** GPT-4o / GPT-4o-mini.

6. **Candidate Profile & Mock Interview Room**:
   - Save your real resume, target company name, and job description.
   - Built-in practice interview simulator with automated AI scoring, STAR compliance review, and model answers.

---

## 🚀 Quick Start

### 1. Launch with One Click
Double-click `run.bat` in the project folder, or run:

```bash
npm run electron:dev
```

### 2. Browser Mode (Alternative)
If you prefer running inside your web browser (Chrome / Edge):

```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## ⌨️ Hotkeys Reference

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Shift + H` | Instant Stealth Toggle (Hide / Show overlay) |
| `Ctrl + Shift + M` | Toggle Microphone On / Off |
| `Ctrl + Shift + Space` | Trigger Instant Answer |
| `Enter` | Submit question from the manual input box |

---

## 🛠️ Project Structure

```
parakeet-ai-tool/
├── electron/
│   ├── main.cjs               # Native frameless window, global shortcuts & audio capture
│   └── preload.cjs            # Secure IPC bridge between Electron and UI
├── src/
│   ├── components/
│   │   ├── AnswerDisplay.tsx          # Teleprompter answer viewer (Opener, Bullets, Code)
│   │   ├── AudioVisualizer.tsx        # Glowing audio waveform equalizer
│   │   ├── CandidateProfileModal.tsx  # Resume, Job Description & API keys setup
│   │   ├── HUDHeader.tsx              # Draggable titlebar, mode selector, opacity slider
│   │   ├── LiveTranscript.tsx         # Live speech recognition & manual question input
│   │   ├── MockInterviewModal.tsx     # Practice interview room with AI scoring
│   │   └── QuickPromptsBar.tsx        # 1-click test simulation presets
│   ├── services/
│   │   ├── aiService.ts               # Gemini, Groq, OpenAI & offline demo generation
│   │   ├── speechService.ts           # Web Speech API, loopback audio & VAD
│   │   └── storageService.ts          # Local persistence for resume and settings
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   ├── App.tsx                        # Main application container
│   ├── index.css                      # Tailwind v4 glassmorphism styling
│   └── main.tsx                       # React root entrypoint
├── package.json
├── run.bat                            # Windows launcher
├── tsconfig.json
└── vite.config.ts
```
