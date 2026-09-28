import type { CandidateProfile, TargetJob, AISettings, InterviewMode, GeneratedAnswer } from '../types';

export const buildSystemPrompt = (
  profile: CandidateProfile,
  job: TargetJob,
  mode: InterviewMode,
  settings: AISettings
): string => {
  return `You are Parakeet Copilot, an elite real-time live interview co-pilot.
Your user is in a LIVE INTERVIEW right now. They need glanceable, high-impact bullet points they can speak naturally.

CANDIDATE CONTEXT:
- Name: ${profile.name}
- Current Role: ${profile.currentRole} (${profile.experienceYears} yrs experience)
- Skills: ${profile.skills}
- Resume Highlights:
${profile.resumeText}

TARGET JOB & COMPANY:
- Company: ${job.companyName}
- Target Role: ${job.jobTitle}
- Job Overview:
${job.jobDescription}

CURRENT INTERVIEW MODE: ${mode.toUpperCase()}
${getModeInstructions(mode)}

USER PREFERENCES:
- Response Length: ${settings.responseLength}
- Custom Rules: ${settings.customInstructions || 'None'}

CRITICAL OUTPUT FORMATTING RULES:
1. "Quick Hook": A 1-2 sentence compelling opener the candidate can immediately speak out loud while glancing at the screen. Avoid generic openings like "That's a great question".
2. "Bullet Points": 3-4 punchy, high-impact bullets. Use the candidate's actual projects, technologies, and metrics from their resume. Bold key action verbs and metrics.
3. "Code / Tech Specs": If technical or coding, include clean, standard code or architecture diagrams/trade-offs.
4. "Follow-up Traps": 2 anticipated follow-up questions from the interviewer.

Format your response strictly as valid JSON with this exact schema:
{
  "quickHook": "Direct 1-2 sentence opening hook to speak right away...",
  "bulletPoints": [
    "First concrete point emphasizing Situation & Task with metrics...",
    "Second concrete point detailing specific Action taken...",
    "Third concrete point showing measurable Result & business impact..."
  ],
  "codeSnippet": "optional code or system components (leave empty string if not applicable)",
  "followUps": [
    "Anticipated follow-up 1...",
    "Anticipated follow-up 2..."
  ]
}
Return ONLY the raw JSON object. Do not wrap in markdown quotes if possible, or use standard \`\`\`json.`;
};

function getModeInstructions(mode: InterviewMode): string {
  switch (mode) {
    case 'behavioral':
      return `Behavioral Focus: Strictly use the STAR method (Situation, Task, Action, Result). Highlight leadership, conflict resolution, ownership, and measurable business impact from the candidate's background.`;
    case 'system-design':
      return `System Design Focus: Outline requirements, high-level architecture (APIs, caching, DB, queue, load balancing), data flow, bottlenecks, scalability trade-offs, and failure recovery.`;
    case 'coding':
      return `Coding / Algorithmic Focus: State the optimal approach, time/space complexity (Big-O), key edge cases (null, empty, limits), and clean idiomatic code implementation.`;
    case 'general':
    default:
      return `General Interview Focus: Confident, crisp answers. Connect the candidate's past achievements directly to why they are an outstanding match for ${mode}.`;
  }
}

// Demo mode intelligent response generator for testing without an API key
export async function generateDemoAnswer(
  question: string,
  profile: CandidateProfile,
  mode: InterviewMode,
  onToken?: (partial: Partial<GeneratedAnswer>) => void
): Promise<GeneratedAnswer> {
  const lowerQ = question.toLowerCase();
  
  let hook = `In my experience as a ${profile.currentRole}, I tackle this by aligning technical execution directly with user and business impact.`;
  let bullets = [
    `**Situation & Context:** At my recent role, we experienced a critical challenge where scalability and system reliability were top priorities.`,
    `**Action & Engineering:** I took ownership by implementing automated caching, refactoring key API bottlenecks, and establishing observability metrics.`,
    `**Result & Impact:** Successfully reduced p99 latency by over 40% and improved team deployment confidence without downtime.`
  ];
  let codeSnippet = '';
  let followUps = [
    `"How did you monitor performance regressions after that release?"`,
    `"What trade-offs did you consider between consistency and availability?"`
  ];

  if (lowerQ.includes('conflict') || lowerQ.includes('disagree') || lowerQ.includes('team')) {
    hook = `I view healthy disagreement as a sign of high engagement; my approach is to ground conversations in shared goals and objective data.`;
    bullets = [
      `**Active Listening:** Heard out the alternative viewpoint regarding technical architecture without defensive pushback.`,
      `**Data-Driven Alignment:** Built a small proof-of-concept benchmark measuring both approaches under peak load.`,
      `**Outcome:** The team aligned on the hybrid solution, delivering the feature 1 week ahead of schedule.`
    ];
    followUps = [
      `"How do you handle it when a team consensus isn't reached?"`,
      `"Tell me about a time you had to deliver bad news to leadership."`
    ];
  } else if (lowerQ.includes('design') || lowerQ.includes('architecture') || lowerQ.includes('scale') || mode === 'system-design') {
    hook = `For designing a scalable system like this, I start by clarifying functional vs non-functional requirements (throughput, latency, consistency), then design the data tier.`;
    bullets = [
      `**API & Gateway Layer:** Stateless HTTP/gRPC services behind an L7 load balancer with rate-limiting and JWT authentication.`,
      `**Caching & Data Tier:** Redis cluster for sub-10ms reads; PostgreSQL/Aurora with read-replicas for strong ACID writes; CDC via Kafka.`,
      `**Resilience:** Circuit breakers (Resilience4j), asynchronous dead-letter queues, and graceful degradation under traffic surges.`
    ];
    codeSnippet = `// High-Level Data Flow:
// Client -> Cloudflare CDN -> ALB -> API Gateway
//           ├── Cache Check (Redis / Elasticache)
//           ├── Worker Queue (Kafka / SQS) -> Background Consumers
//           └── Primary Database (PostgreSQL / DynamoDB)`;
    followUps = [
      `"How would you handle hot-key partitioning in your Redis cache?"`,
      `"What is your disaster recovery and multi-region replication strategy?"`
    ];
  } else if (lowerQ.includes('code') || lowerQ.includes('algorithm') || lowerQ.includes('reverse') || mode === 'coding') {
    hook = `The optimal approach utilizes two pointers / sliding window to achieve O(N) linear time complexity with O(1) auxiliary memory.`;
    bullets = [
      `**Approach:** Initialize left and right pointers; process elements inwards to eliminate unnecessary duplicate scans.`,
      `**Complexity:** Time: **O(N)** single pass, Space: **O(1)** in-place manipulation.`,
      `**Edge Cases:** Null input, single-element collections, and extreme integer boundary values.`
    ];
    codeSnippet = `function solveProblem(items: number[]): number {
  if (!items || items.length === 0) return 0;
  let left = 0, right = items.length - 1;
  let maxResult = 0;
  
  while (left < right) {
    const current = Math.min(items[left], items[right]) * (right - left);
    maxResult = Math.max(maxResult, current);
    if (items[left] < items[right]) left++;
    else right--;
  }
  return maxResult;
}`;
    followUps = [
      `"Can this be parallelized for terabyte-scale distributed datasets?"`,
      `"What would change if the input was an unbounded real-time stream?"`
    ];
  }

  // Simulate streaming response
  const result: GeneratedAnswer = {
    id: `ans-${Date.now()}`,
    question,
    quickHook: hook,
    bulletPoints: bullets,
    codeSnippet,
    followUps,
    createdAt: Date.now()
  };

  if (onToken) {
    onToken({ quickHook: hook.slice(0, Math.floor(hook.length / 2)) });
    await new Promise((r) => setTimeout(r, 120));
    onToken({ quickHook: hook, bulletPoints: [bullets[0]] });
    await new Promise((r) => setTimeout(r, 150));
    onToken({ quickHook: hook, bulletPoints: [bullets[0], bullets[1]] });
    await new Promise((r) => setTimeout(r, 150));
    onToken(result);
  }

  return result;
}

// Streaming generator for Gemini, Groq, and OpenAI
export async function streamAnswerFromAI(
  question: string,
  profile: CandidateProfile,
  job: TargetJob,
  mode: InterviewMode,
  settings: AISettings,
  onToken: (partial: Partial<GeneratedAnswer>) => void
): Promise<GeneratedAnswer> {
  if (settings.provider === 'demo' || (!settings.geminiKey && !settings.groqKey && !settings.openaiKey)) {
    return generateDemoAnswer(question, profile, mode, onToken);
  }

  const systemPrompt = buildSystemPrompt(profile, job, mode, settings);
  const userPrompt = `INTERVIEWER QUESTION: "${question}"\n\nGenerate structured response according to the JSON format.`;

  try {
    let fullText = '';

    if (settings.provider === 'gemini' && settings.geminiKey) {
      const model = settings.modelName || 'gemini-2.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.geminiKey}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      fullText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (settings.provider === 'groq' && settings.groqKey) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      fullText = data?.choices?.[0]?.message?.content || '';
    } else if (settings.provider === 'openai' && settings.openaiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      fullText = data?.choices?.[0]?.message?.content || '';
    }

    // Clean JSON markdown blocks if any
    const cleaned = fullText.replace(/```json\s*|\s*```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const formattedAnswer: GeneratedAnswer = {
      id: `ans-${Date.now()}`,
      question,
      quickHook: parsed.quickHook || `Regarding this question, I focus on delivering scalable, high-leverage outcomes.`,
      bulletPoints: Array.isArray(parsed.bulletPoints) ? parsed.bulletPoints : [parsed.bulletPoints || 'Key point from experience'],
      codeSnippet: parsed.codeSnippet || undefined,
      followUps: Array.isArray(parsed.followUps) ? parsed.followUps : [],
      createdAt: Date.now()
    };

    onToken(formattedAnswer);
    return formattedAnswer;
  } catch (error) {
    console.warn('AI API failed or returned invalid format, falling back to smart simulation:', error);
    return generateDemoAnswer(question, profile, mode, onToken);
  }
}
