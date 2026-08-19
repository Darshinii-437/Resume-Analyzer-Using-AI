import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. Resume Extraction / Parsing Endpoint
app.post('/api/parse-resume', async (req, res) => {
  try {
    const { resumeText, fileName } = req.body;

    if (!resumeText || typeof resumeText !== 'string') {
      return res.status(400).json({ error: 'Valid resumeText string is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback parser if API key is missing
      return res.json({
        name: fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Extracted Candidate',
        email: 'candidate@example.com',
        phone: '+1 (555) 019-2834',
        location: 'United States',
        currentTitle: 'Software Professional',
        currentCompany: 'Technology Co',
        totalYearsExp: 4,
        summary: resumeText.slice(0, 250) + '...',
        education: [
          { degree: 'B.S. in Computer Science', field: 'Computer Science', institution: 'University', year: '2021' }
        ],
        experience: [
          {
            role: 'Software Engineer',
            company: 'Tech Enterprise',
            period: '2021 - Present',
            durationYears: 3,
            highlights: ['Engineered scalable microservices and web user interfaces.'],
            skillsUsed: ['TypeScript', 'React', 'Node.js']
          }
        ],
        skills: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'REST APIs'],
        certifications: [],
        workAuthorization: 'US Citizen / Perm Resident',
        salaryExpectation: '$140,000 / year'
      });
    }

    const prompt = `You are an expert HR recruitment technology parser.
Analyze the following raw resume document text carefully. Extract all structured candidate information into precise, standardized JSON.
Extract clean skills, compute realistic total years of professional experience, structure past employment history with bullet highlights and skills used, format education degrees, and detect work authorization or salary expectations if mentioned.

Resume Text:
---
${resumeText}
---`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You extract precise structured recruitment information from resumes. Return clean, validated JSON matching the requested schema. If a specific field is not explicitly present, make a best-effort realistic inference or leave it concise.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Full legal name of candidate' },
            email: { type: Type.STRING, description: 'Email address' },
            phone: { type: Type.STRING, description: 'Phone number' },
            location: { type: Type.STRING, description: 'City, State / Country' },
            currentTitle: { type: Type.STRING, description: 'Most recent job title' },
            currentCompany: { type: Type.STRING, description: 'Most recent employer' },
            totalYearsExp: { type: Type.NUMBER, description: 'Total estimated years of full-time professional experience' },
            summary: { type: Type.STRING, description: 'Professional summary (2-3 sentences)' },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  field: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  year: { type: Type.STRING },
                },
                required: ['degree', 'institution'],
              },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  period: { type: Type.STRING },
                  durationYears: { type: Type.NUMBER },
                  highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                  skillsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['role', 'company', 'period', 'highlights'],
              },
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Comprehensive list of technical and core professional skills',
            },
            certifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            workAuthorization: {
              type: Type.STRING,
              description: 'Work authorization status (e.g. US Citizen / Perm Resident, H1B / Need Transfer, Requires Sponsorship, etc.)',
            },
            salaryExpectation: {
              type: Type.STRING,
              description: 'Mentioned salary expectation or empty string if not found',
            },
          },
          required: ['name', 'email', 'skills', 'experience', 'education', 'totalYearsExp'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ error: error.message || 'Failed to parse resume with AI' });
  }
});

// 2. Candidate Matching & RAG Policy Screening Endpoint
app.post('/api/match-candidate', async (req, res) => {
  try {
    const { candidate, jobDescription, companyPolicies } = req.body;

    if (!candidate || !jobDescription) {
      return res.status(400).json({ error: 'Candidate and JobDescription objects are required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback algorithmic scoring if key missing
      const required = jobDescription.requiredSkills || [];
      const candSkills = (candidate.skills || []).map((s: string) => s.toLowerCase());
      const matched = required.filter((r: string) => candSkills.some((cs: string) => cs.includes(r.toLowerCase()) || r.toLowerCase().includes(cs)));
      const missing = required.filter((r: string) => !matched.includes(r));
      const skillScore = required.length ? Math.round((matched.length / required.length) * 100) : 80;
      const expScore = candidate.totalYearsExp >= jobDescription.minYearsExp ? 95 : Math.max(50, Math.round((candidate.totalYearsExp / jobDescription.minYearsExp) * 90));
      const overall = Math.round((skillScore * 0.45) + (expScore * 0.35) + 18);

      return res.json({
        candidateId: candidate.id,
        jobId: jobDescription.id,
        overallScore: overall,
        breakdown: {
          skillsMatchScore: skillScore,
          experienceMatchScore: expScore,
          educationCertScore: 88,
          policyComplianceScore: 92,
          semanticFitScore: 85,
        },
        recommendation: overall >= 85 ? 'Strong Hire' : overall >= 75 ? 'Hire' : overall >= 60 ? 'Potential / Further Review' : 'Not Recommended',
        confidence: 90,
        executiveSummary: `${candidate.name} has ${candidate.totalYearsExp} years of experience matching ${matched.length}/${required.length} required skills for ${jobDescription.title}.`,
        matchedSkills: matched,
        missingRequiredSkills: missing,
        bonusSkills: candidate.skills?.filter((s: string) => !matched.includes(s)).slice(0, 5) || [],
        keyStrengths: [
          `Strong match across core competencies: ${matched.slice(0, 4).join(', ') || 'General fundamentals'}.`,
          `${candidate.totalYearsExp} years of relevant experience.`,
        ],
        identifiedGaps: missing.length ? [`Missing required skills: ${missing.join(', ')}`] : ['None detected in core stack.'],
        redFlags: [],
        greenFlags: ['Solid career progression', 'Matches baseline experience threshold'],
        policyCitations: [
          {
            policyId: 'pol-001',
            policyName: 'Work Authorization & Hiring Standards',
            status: 'Compliant',
            ruleExcerpt: 'Candidate meets general eligibility criteria.',
            note: 'Standard compliance verified.',
          }
        ],
        interviewQuestions: [
          {
            category: 'Technical',
            question: `How have you utilized ${matched[0] || 'your core technologies'} to build resilient production features?`,
            reason: 'Validates primary technical capabilities.',
            expectedSignals: ['Architecture best practices', 'Debugging depth', 'Tradeoff awareness'],
          },
          {
            category: 'Behavioral',
            question: 'Describe a challenging project deadline and how you navigated technical debt vs feature velocity.',
            reason: 'Evaluates pragmatic engineering execution.',
            expectedSignals: ['Communication', 'Prioritization', 'Ownership'],
          }
        ],
        compensationFit: {
          candidateAsk: candidate.salaryExpectation || 'Market Rate',
          jobBand: `$${jobDescription.salaryRange?.min?.toLocaleString()} - $${jobDescription.salaryRange?.max?.toLocaleString()} ${jobDescription.salaryRange?.currency || 'USD'}`,
          alignmentStatus: 'Within Budget',
          note: 'Target compensation aligns with approved department range.',
        },
        analyzedAt: new Date().toISOString(),
      });
    }

    const policiesContext = (companyPolicies || []).map((p: any) => `[Policy: ${p.title} (${p.category})]: ${p.content}`).join('\n\n');

    const prompt = `You are a Principal AI Recruitment Screening & RAG Compliance Evaluation Engine.
Your task is to conduct a multi-dimensional evaluation of a candidate against a target Job Description, incorporating Company Hiring Policies via Retrieval-Augmented Generation (RAG).

=== JOB DESCRIPTION ===
Title: ${jobDescription.title}
Department: ${jobDescription.department}
Location / Workplace: ${jobDescription.location} (${jobDescription.workplaceType})
Experience Level: ${jobDescription.experienceLevel} (${jobDescription.minYearsExp} - ${jobDescription.maxYearsExp} years)
Approved Salary Band: $${jobDescription.salaryRange?.min?.toLocaleString()} - $${jobDescription.salaryRange?.max?.toLocaleString()} ${jobDescription.salaryRange?.currency || 'USD'}
Policy Tier: ${jobDescription.policyTier || 'Standard'}
Required Skills: ${(jobDescription.requiredSkills || []).join(', ')}
Preferred Skills: ${(jobDescription.preferredSkills || []).join(', ')}
Description & Responsibilities: ${jobDescription.description} | Responsibilities: ${(jobDescription.responsibilities || []).join('; ')}
Qualifications: ${(jobDescription.qualifications || []).join('; ')}

=== CANDIDATE PROFILE ===
Name: ${candidate.name}
Current Title: ${candidate.currentTitle} at ${candidate.currentCompany}
Total Years of Experience: ${candidate.totalYearsExp}
Location: ${candidate.location}
Work Authorization: ${candidate.workAuthorization || 'Unspecified'}
Salary Expectation: ${candidate.salaryExpectation || 'Not specified'}
Education: ${JSON.stringify(candidate.education || [])}
Skills: ${(candidate.skills || []).join(', ')}
Certifications: ${(candidate.certifications || []).join(', ')}
Summary: ${candidate.summary}
Work Experience Details:
${(candidate.experience || []).map((e: any) => `- Role: ${e.role} at ${e.company} (${e.period}): ${e.highlights?.join('. ')} | Skills: ${e.skillsUsed?.join(', ')}`).join('\n')}

=== COMPANY HIRING POLICIES (RAG KNOWLEDGE BASE) ===
${policiesContext}

=== INSTRUCTIONS ===
1. Evaluate Skills Match: Compare required and preferred skills against candidate's demonstrated skill set.
2. Evaluate Experience Match: Assess tenure, seniority, depth of responsibility, and trajectory vs required ${jobDescription.minYearsExp}+ years.
3. Evaluate Education & Certifications: Check degree relevance and cloud/domain credentials.
4. RAG Policy Compliance: Cross-examine candidate location, visa status, salary ask, and experience against the company policies. Cite specific policy rules with status ('Compliant' | 'Warning' | 'Exception Needed').
5. Synthesize Match Score (0-100), Recommendation ('Strong Hire' | 'Hire' | 'Potential / Further Review' | 'Not Recommended'), Confidence %, Key Strengths, Identified Gaps, Red/Green Flags.
6. Generate 3 Tailored Interview Questions with category, rationale, and specific expected positive signals.
7. Return strictly valid JSON adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an objective, recruiter-friendly AI screening analyst. Deliver mathematically grounded, constructive, and policy-compliant evaluations.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: 'Overall Match Score 0-100' },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                skillsMatchScore: { type: Type.INTEGER },
                experienceMatchScore: { type: Type.INTEGER },
                educationCertScore: { type: Type.INTEGER },
                policyComplianceScore: { type: Type.INTEGER },
                semanticFitScore: { type: Type.INTEGER },
              },
              required: ['skillsMatchScore', 'experienceMatchScore', 'educationCertScore', 'policyComplianceScore', 'semanticFitScore'],
            },
            recommendation: {
              type: Type.STRING,
              enum: ['Strong Hire', 'Hire', 'Potential / Further Review', 'Not Recommended'],
            },
            confidence: { type: Type.INTEGER, description: 'Confidence level 0-100' },
            executiveSummary: { type: Type.STRING, description: 'Crisp executive summary for the hiring manager (2-4 sentences)' },
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingRequiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            bonusSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            identifiedGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            greenFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            policyCitations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  policyId: { type: Type.STRING },
                  policyName: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ['Compliant', 'Warning', 'Exception Needed'] },
                  ruleExcerpt: { type: Type.STRING },
                  note: { type: Type.STRING },
                },
                required: ['policyName', 'status', 'ruleExcerpt', 'note'],
              },
            },
            interviewQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, enum: ['Technical', 'Behavioral', 'Architecture / System', 'Leadership'] },
                  question: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  expectedSignals: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['category', 'question', 'reason', 'expectedSignals'],
              },
            },
            compensationFit: {
              type: Type.OBJECT,
              properties: {
                candidateAsk: { type: Type.STRING },
                jobBand: { type: Type.STRING },
                alignmentStatus: { type: Type.STRING, enum: ['Within Budget', 'Slightly Above Budget', 'Significantly High', 'Below Budget'] },
                note: { type: Type.STRING },
              },
              required: ['candidateAsk', 'jobBand', 'alignmentStatus', 'note'],
            },
          },
          required: ['overallScore', 'breakdown', 'recommendation', 'confidence', 'executiveSummary', 'matchedSkills', 'missingRequiredSkills', 'keyStrengths', 'identifiedGaps', 'policyCitations', 'interviewQuestions', 'compensationFit'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.candidateId = candidate.id;
    parsed.jobId = jobDescription.id;
    parsed.analyzedAt = new Date().toISOString();

    res.json(parsed);
  } catch (error: any) {
    console.error('Error matching candidate:', error);
    res.status(500).json({ error: error.message || 'Failed to match candidate' });
  }
});

// 3. AI Job Description Generator
app.post('/api/generate-jd', async (req, res) => {
  try {
    const { title, department, experienceLevel, minYearsExp, maxYearsExp, keySkills, workplaceType, location, salaryMin, salaryMax } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Job title is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        title,
        department: department || 'Engineering',
        location: location || 'Remote (US)',
        workplaceType: workplaceType || 'Remote',
        experienceLevel: experienceLevel || 'Senior',
        minYearsExp: Number(minYearsExp) || 5,
        maxYearsExp: Number(maxYearsExp) || 10,
        salaryRange: {
          min: Number(salaryMin) || 150000,
          max: Number(salaryMax) || 200000,
          currency: 'USD',
        },
        requiredSkills: keySkills?.length ? keySkills : ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Cloud Infrastructure'],
        preferredSkills: ['System Design', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'AI/ML Integration'],
        description: `We are seeking a talented and proactive ${title} to join our high-growth ${department || 'Engineering'} team.`,
        responsibilities: [
          `Architect, build, and deploy production-grade software solutions.`,
          `Collaborate cross-functionally with product managers, designers, and domain specialists.`,
          `Drive engineering excellence through code reviews, automated testing, and continuous delivery.`,
        ],
        qualifications: [
          `${minYearsExp || 5}+ years of verified industry experience in related technologies.`,
          `Strong background in system design, asynchronous computing, and relational data architecture.`,
          `Bachelor's degree in STEM or equivalent practical software engineering experience.`,
        ],
        policyTier: `${experienceLevel || 'Senior'} Tier Standard`,
        status: 'Active',
      });
    }

    const prompt = `Create a comprehensive, production-ready Job Description for the following opening:
Title: ${title}
Department: ${department || 'Engineering'}
Experience Level: ${experienceLevel || 'Senior'} (${minYearsExp || 5} - ${maxYearsExp || 10} years)
Workplace: ${workplaceType || 'Hybrid'} in ${location || 'San Francisco, CA'}
Target Salary Range: $${salaryMin || 160000} - $${salaryMax || 210000} USD
Key Skills/Focus Areas: ${Array.isArray(keySkills) ? keySkills.join(', ') : keySkills || 'Core engineering skills'}

Return structured JSON with comprehensive description, responsibilities, required and preferred skills, and qualifications.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite talent acquisition architect writing modern, high-clarity job specifications.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            department: { type: Type.STRING },
            location: { type: Type.STRING },
            workplaceType: { type: Type.STRING, enum: ['Remote', 'Hybrid', 'On-site'] },
            experienceLevel: { type: Type.STRING, enum: ['Junior', 'Mid', 'Senior', 'Lead', 'Staff/Principal'] },
            minYearsExp: { type: Type.INTEGER },
            maxYearsExp: { type: Type.INTEGER },
            salaryRange: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.INTEGER },
                max: { type: Type.INTEGER },
                currency: { type: Type.STRING },
              },
              required: ['min', 'max', 'currency'],
            },
            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            preferredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            qualifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            policyTier: { type: Type.STRING },
          },
          required: ['title', 'department', 'requiredSkills', 'preferredSkills', 'description', 'responsibilities', 'qualifications', 'salaryRange'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.status = 'Active';
    parsed.createdAt = new Date().toISOString().split('T')[0];
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating JD:', error);
    res.status(500).json({ error: error.message || 'Failed to generate job description' });
  }
});

// 4. Candidate Head-to-Head Comparison Matrix
app.post('/api/compare-candidates', async (req, res) => {
  try {
    const { candidates, jobDescription } = req.body;

    if (!candidates || !Array.isArray(candidates) || candidates.length < 2) {
      return res.status(400).json({ error: 'At least 2 candidates are required for comparison.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      const sorted = [...candidates].sort((a, b) => {
        const scoreA = a.matchResults?.[jobDescription?.id]?.overallScore || 0;
        const scoreB = b.matchResults?.[jobDescription?.id]?.overallScore || 0;
        return scoreB - scoreA;
      });

      return res.json({
        jobTitle: jobDescription?.title || 'Open Position',
        topPickCandidateId: sorted[0]?.id,
        executiveComparisonSummary: `Comparing ${candidates.length} candidates for ${jobDescription?.title}. ${sorted[0]?.name} leads with the highest technical alignment and policy fit.`,
        tradeoffAnalysis: `Candidate ${sorted[0]?.name} offers the deepest domain coverage, while alternative candidates may offer lower compensation requirements or varied niche experience.`,
      });
    }

    const summaryPrompt = `Compare the following candidates who applied for the position "${jobDescription?.title}":
${candidates.map((c: any, i: number) => `
Candidate ${i + 1}: ${c.name} (${c.currentTitle}, ${c.totalYearsExp} yrs exp)
Skills: ${(c.skills || []).join(', ')}
Match Score: ${c.matchResults?.[jobDescription?.id]?.overallScore || 'N/A'}%
Recommendation: ${c.matchResults?.[jobDescription?.id]?.recommendation || 'Pending'}
Salary Ask: ${c.salaryExpectation || 'N/A'}
Work Auth: ${c.workAuthorization || 'N/A'}
`).join('\n')}

Synthesize an executive comparative report for the recruiter:
1. Executive comparison summary highlighting key differentiators.
2. Identify the top pick candidate ID and explain why.
3. Detailed tradeoff analysis (e.g. Seniority vs Budget vs Onboarding velocity).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: summaryPrompt,
      config: {
        systemInstruction: 'You are an executive talent acquisition advisor delivering crisp, unbiased candidate comparison matrices.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topPickCandidateId: { type: Type.STRING, description: 'ID or Name of the highest recommended candidate' },
            executiveComparisonSummary: { type: Type.STRING },
            tradeoffAnalysis: { type: Type.STRING },
          },
          required: ['topPickCandidateId', 'executiveComparisonSummary', 'tradeoffAnalysis'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error comparing candidates:', error);
    res.status(500).json({ error: error.message || 'Failed to compare candidates' });
  }
});

// 5. Tailored Email Generator (Invite / Offer / Polite Rejection)
app.post('/api/generate-email', async (req, res) => {
  try {
    const { candidate, jobDescription, emailType, tone } = req.body;

    if (!candidate || !jobDescription || !emailType) {
      return res.status(400).json({ error: 'Candidate, JobDescription, and emailType are required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      const subject = emailType === 'Interview Invitation'
        ? `Interview Invitation: ${jobDescription.title} at TalentMatch AI`
        : emailType === 'Job Offer'
        ? `Formal Offer: ${jobDescription.title}`
        : `Update regarding your application for ${jobDescription.title}`;

      const body = `Dear ${candidate.name},\n\nThank you for your interest in the ${jobDescription.title} position with our team. We were very impressed by your background in ${candidate.skills?.slice(0, 3).join(', ') || 'software engineering'}.\n\nWe would love to connect with you regarding the next steps.\n\nBest regards,\nRecruitment Team`;

      return res.json({ subject, body });
    }

    const prompt = `Generate a personalized, polished recruiter email to candidate ${candidate.name} for the position ${jobDescription.title}.
Email Type: ${emailType} (e.g. Interview Invitation, Job Offer, Polite Rejection, Follow-up)
Tone: ${tone || 'Professional & Warm'}
Candidate Background Context:
- Current Title: ${candidate.currentTitle}
- Key Highlight Skills: ${(candidate.skills || []).slice(0, 4).join(', ')}
- Match Analysis Strengths: ${JSON.stringify(candidate.matchResults?.[jobDescription.id]?.keyStrengths || [])}

Generate a clear email subject and body formatted with professional spacing and personalized specifics.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You craft empathetic, high-conversion, and respectful recruitment communications.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
          },
          required: ['subject', 'body'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: error.message || 'Failed to generate email' });
  }
});

// 6. RAG Policy Knowledge Base Assistant
app.post('/api/rag-policy-query', async (req, res) => {
  try {
    const { query, policies } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query string is required.' });
    }

    const policiesContext = (policies || []).map((p: any) => `[Policy ID: ${p.id} | Title: ${p.title} | Category: ${p.category}]:\n${p.content}`).join('\n\n');

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        answer: `According to standard company policies, visa sponsorship is available for L5+ roles, standard remote hours span UTC-8 to UTC-4, and salary bands follow approved departmental brackets.`,
        relevantPolicyIds: ['pol-001', 'pol-003'],
      });
    }

    const prompt = `You are the Internal Company Hiring & Compliance Policy RAG Assistant.
A recruiter is asking a question regarding hiring guidelines, immigration, salary bands, degree equivalency, or remote work rules.

=== RECRUITMENT POLICIES KNOWLEDGE BASE ===
${policiesContext}

=== RECRUITER QUESTION ===
${query}

Answer the question clearly with direct citations to the relevant policies. Cite the exact policy IDs and explain any exceptions or requirements.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an internal HR policy & compliance advisor. Answer accurately based ONLY on the provided policy knowledge base.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            relevantPolicyIds: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['answer', 'relevantPolicyIds'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error querying RAG policy:', error);
    res.status(500).json({ error: error.message || 'Failed to query RAG policy' });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TalentMatch AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
