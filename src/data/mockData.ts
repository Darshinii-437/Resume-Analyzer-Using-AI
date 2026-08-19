import { JobDescription, Candidate, CompanyPolicy } from '../types';

export const initialCompanyPolicies: CompanyPolicy[] = [
  {
    id: 'pol-001',
    category: 'Work Authorization & Visa',
    title: 'Global Immigration & Visa Sponsorship Policy (FY26)',
    content: 'Company sponsors H-1B transfers, O-1, TN, and Green Card applications for Senior (L5+), Staff, and Principal engineering/data roles with over 5+ years of demonstrable industry experience. Entry-level (L3) and Junior (L4) positions do not support new H-1B lottery sponsorship unless specified in writing by the Engineering VP. F-1 STEM OPT candidates are eligible for mid-to-senior tiers.',
    tags: ['visa', 'h1b', 'immigration', 'sponsorship', 'work_auth'],
    lastUpdated: '2026-01-15',
    isMandatory: true,
  },
  {
    id: 'pol-002',
    category: 'Experience & Education',
    title: 'Degree & Practical Equivalency Standard',
    content: 'A Bachelor of Science (BS) in Computer Science or related STEM discipline is standard. However, 2 additional years of verified high-impact production engineering experience can substitute for formal degree requirements. Candidates with non-traditional backgrounds (bootcamps, open-source maintainership) who demonstrate strong system architecture acumen must be evaluated on merit without penalty.',
    tags: ['education', 'degree', 'equivalency', 'bootcamp', 'experience'],
    lastUpdated: '2026-02-01',
    isMandatory: true,
  },
  {
    id: 'pol-003',
    category: 'Compensation & Bands',
    title: 'Engineering & Product Salary Bands (US / Remote Tier 1)',
    content: 'Senior Software Engineer (L5): $160,000 - $210,000 base + equity. Staff Engineer (L6): $215,000 - $275,000 base. Principal Engineer (L7): $280,000 - $340,000 base. If candidate salary expectation exceeds the maximum band by more than 15%, HR Compensation Committee pre-approval is required before extending an on-site interview loop.',
    tags: ['salary', 'compensation', 'budget', 'equity', 'bands'],
    lastUpdated: '2026-03-10',
    isMandatory: true,
  },
  {
    id: 'pol-004',
    category: 'Remote & Relocation',
    title: 'Distributed Workforce & Core Working Hours',
    content: 'All remote employees must reside within timezone bands spanning UTC-8 (PST) to UTC-4 (EST), or UTC+0 to UTC+2 for EMEA roles. Daily core synchronization hours are 10:00 AM to 3:00 PM EST for engineering standups and design reviews. Relocation stipends up to $8,000 are available for required on-site or hybrid hubs.',
    tags: ['remote', 'location', 'timezone', 'relocation', 'hybrid'],
    lastUpdated: '2026-01-20',
    isMandatory: false,
  },
  {
    id: 'pol-005',
    category: 'DEI & Anti-Bias',
    title: 'Structured & Objective Screening Standard',
    content: 'Recruiters must evaluate candidates strictly against job description criteria, competency matrix rubrics, and verified technical outcomes. Résumé screening must ignore age indicators, graduation dates, home addresses beyond general timezone suitability, and personal background details to mitigate cognitive and algorithmic bias.',
    tags: ['dei', 'anti-bias', 'fairness', 'compliance', 'rubric'],
    lastUpdated: '2026-02-14',
    isMandatory: true,
  },
  {
    id: 'pol-006',
    category: 'Compliance & Legal',
    title: 'Employment Verification & Non-Compete Clearance',
    content: 'Candidates progressing to the Final Offer stage must pass standard criminal and 7-year employment history verification. Any active non-compete agreements with direct competitors in generative AI model training or high-frequency trade algorithms must be reviewed by Legal before formal written offers.',
    tags: ['background_check', 'non_compete', 'legal', 'compliance'],
    lastUpdated: '2026-01-05',
    isMandatory: true,
  }
];

export const initialJobDescriptions: JobDescription[] = [
  {
    id: 'job-101',
    title: 'Senior Full-Stack AI Engineer',
    department: 'Engineering & AI Platform',
    location: 'San Francisco, CA (or Remote US)',
    workplaceType: 'Hybrid',
    experienceLevel: 'Senior',
    minYearsExp: 5,
    maxYearsExp: 10,
    salaryRange: {
      min: 165000,
      max: 205000,
      currency: 'USD'
    },
    requiredSkills: ['TypeScript', 'React', 'Node.js', 'LLM Integration (Gemini/OpenAI)', 'PostgreSQL', 'REST & GraphQL APIs', 'Tailwind CSS'],
    preferredSkills: ['Vector Databases (Pinecone/Chroma)', 'RAG Architecture', 'Docker / Kubernetes', 'Next.js', 'Python / FastAPI', 'CI/CD Pipelines'],
    description: 'We are looking for a Senior Full-Stack AI Engineer to spearhead our next-generation generative AI workflows and intelligent recruitment engines. You will architect responsive web apps, craft high-throughput server backends, and connect LLM/RAG pipelines.',
    responsibilities: [
      'Architect robust full-stack applications with React, TypeScript, Node.js, and modern AI SDKs.',
      'Design and deploy RAG pipelines, semantic vector search, and LLM orchestration workflows.',
      'Collaborate with product and design to deliver polished, high-performance recruiter dashboards.',
      'Establish testing standards, API contracts, and scalable microservices on cloud infrastructure.'
    ],
    qualifications: [
      '5+ years of full-stack web engineering experience in production environments.',
      'Strong hands-on experience building apps that integrate Large Language Models (Gemini/OpenAI) and embedding workflows.',
      'Proven mastery of TypeScript, modern React hooks, Node.js, and relational databases.',
      'BS in Computer Science or equivalent verified software engineering track record.'
    ],
    policyTier: 'Engineering L5 (Senior Tier)',
    status: 'Active',
    createdAt: '2026-08-01'
  },
  {
    id: 'job-102',
    title: 'Lead Machine Learning & NLP Scientist',
    department: 'AI Research & Data Science',
    location: 'New York, NY (Remote US/Canada)',
    workplaceType: 'Remote',
    experienceLevel: 'Lead',
    minYearsExp: 7,
    maxYearsExp: 12,
    salaryRange: {
      min: 210000,
      max: 260000,
      currency: 'USD'
    },
    requiredSkills: ['Python', 'PyTorch', 'Large Language Models (LLMs)', 'Information Retrieval / RAG', 'Transformers / Hugging Face', 'MLOps', 'Vector Embeddings'],
    preferredSkills: ['Distributed Training (DeepSpeed)', 'LangChain / LlamaIndex', 'C++ Inference Optimization', 'GCP / Vertex AI', 'MLflow'],
    description: 'Lead our AI Research and Information Retrieval squad. You will architect state-of-the-art RAG retrieval algorithms, fine-tune domain-specific language models, and evaluate candidate matching accuracy metrics.',
    responsibilities: [
      'Lead technical strategy for RAG retrieval ranking, reranking algorithms, and embedding models.',
      'Fine-tune open weights and foundation models for structured extraction and semantic entity alignment.',
      'Mentor junior and mid-level data scientists and establish rigorous offline/online evaluation frameworks.'
    ],
    qualifications: [
      '7+ years of industry experience applying NLP, machine learning, and deep learning algorithms.',
      'MS or PhD in Computer Science, Computational Linguistics, AI, or equivalent practical output.',
      'Extensive publication or production history in Transformer-based architectures, RAG, and dense vector retrieval.'
    ],
    policyTier: 'Engineering L6 (Lead/Staff Tier)',
    status: 'Active',
    createdAt: '2026-08-05'
  },
  {
    id: 'job-103',
    title: 'Principal Cloud & DevOps Architect',
    department: 'Infrastructure & Security',
    location: 'Austin, TX (or Remote US)',
    workplaceType: 'Remote',
    experienceLevel: 'Staff/Principal',
    minYearsExp: 8,
    maxYearsExp: 15,
    salaryRange: {
      min: 225000,
      max: 285000,
      currency: 'USD'
    },
    requiredSkills: ['Kubernetes', 'Terraform', 'Google Cloud Platform (GCP)', 'AWS', 'Docker', 'CI/CD (GitHub Actions)', 'Security & IAM Compliance'],
    preferredSkills: ['Service Mesh (Istio)', 'Observability (Datadog/Prometheus)', 'SOC2 Compliance', 'Cost Optimization', 'Helm'],
    description: 'Design and safeguard our multi-region cloud infrastructure, container orchestration clusters, zero-trust security postures, and automated build pipelines.',
    responsibilities: [
      'Architect resilient, auto-scaling Kubernetes clusters capable of high-burst AI model inference.',
      'Manage Infrastructure as Code across multi-cloud environments with Terraform and GitOps.',
      'Lead enterprise security hardening, SOC2 audit readiness, and automated secret lifecycle management.'
    ],
    qualifications: [
      '8+ years in cloud infrastructure, SRE, and systems architecture at scale.',
      'Deep expertise in Kubernetes internals, networking, Terraform, and cloud IAM security policies.'
    ],
    policyTier: 'Engineering L6/L7 (Principal Tier)',
    status: 'Active',
    createdAt: '2026-08-10'
  }
];

export const initialCandidates: Candidate[] = [
  {
    id: 'cand-001',
    name: 'Elena Rostova',
    email: 'elena.rostova@devmail.io',
    phone: '+1 (415) 892-4412',
    location: 'San Francisco, CA',
    currentTitle: 'Senior Full-Stack & AI Engineer',
    currentCompany: 'Nexus Generative Labs',
    totalYearsExp: 6,
    summary: '6+ years specializing in TypeScript, React, Node.js, and production LLM orchestration. Built multi-tenant RAG applications with Pinecone and Gemini models serving 200k+ daily queries.',
    education: [
      {
        degree: 'B.S. in Computer Science',
        field: 'Software Engineering & AI',
        institution: 'University of California, Berkeley',
        year: '2020'
      }
    ],
    experience: [
      {
        role: 'Senior Full-Stack AI Engineer',
        company: 'Nexus Generative Labs',
        period: '2023 - Present',
        durationYears: 3,
        highlights: [
          'Architected an end-to-end RAG assistant utilizing TypeScript, Gemini 1.5/2.0 API, and PostgreSQL with pgvector.',
          'Reduced p95 API response latency by 42% through intelligent server-side caching and token streaming.',
          'Built modern responsive UI with React 18, Tailwind CSS, and Framer Motion.'
        ],
        skillsUsed: ['TypeScript', 'React', 'Node.js', 'LLM Integration (Gemini/OpenAI)', 'PostgreSQL', 'Pinecone', 'Tailwind CSS']
      },
      {
        role: 'Software Engineer II',
        company: 'CloudMatrix Technologies',
        period: '2020 - 2023',
        durationYears: 3,
        highlights: [
          'Developed microservices in Node.js and GraphQL for enterprise analytics dashboard.',
          'Containerized deployment pipelines with Docker and GitHub Actions CI/CD.'
        ],
        skillsUsed: ['TypeScript', 'Node.js', 'GraphQL', 'Docker', 'PostgreSQL', 'React']
      }
    ],
    skills: ['TypeScript', 'React', 'Node.js', 'LLM Integration (Gemini/OpenAI)', 'PostgreSQL', 'Tailwind CSS', 'REST & GraphQL APIs', 'Vector Databases (Pinecone/Chroma)', 'RAG Architecture', 'Docker / Kubernetes', 'Python / FastAPI'],
    certifications: ['AWS Certified Solutions Architect - Associate', 'Google Cloud Certified Professional Cloud Developer'],
    workAuthorization: 'US Citizen / Perm Resident',
    salaryExpectation: '$185,000 / year',
    appliedDate: '2026-08-12',
    targetJobId: 'job-101',
    status: 'Screened',
    rawResumeText: `ELENA ROSTOVA
San Francisco, CA | elena.rostova@devmail.io | +1 (415) 892-4412 | US Citizen
GitHub: github.com/erostova | LinkedIn: linkedin.com/in/elena-rostova

PROFESSIONAL SUMMARY
Senior Full-Stack & AI Engineer with 6 years of experience building high-scale web platforms and generative AI applications. Proficient in TypeScript, React, Node.js, vector databases, and enterprise RAG architecture.

WORK EXPERIENCE
Nexus Generative Labs | Senior Full-Stack AI Engineer (2023 - Present)
- Spearheaded development of flagship RAG platform using TypeScript, React, and Gemini APIs.
- Integrated PostgreSQL with pgvector and Pinecone for real-time document search across 10M+ embeddings.
- Enhanced UX with streaming token UI, responsive Tailwind components, and optimistic mutation states.

CloudMatrix Technologies | Software Engineer II (2020 - 2023)
- Engineered scalable Node.js backend services and GraphQL APIs powering 500k monthly active users.
- Built reusable component library using React, TypeScript, and modern state management.

EDUCATION
B.S. in Computer Science - University of California, Berkeley (2016 - 2020)

SKILLS & CERTIFICATIONS
- Languages: TypeScript, JavaScript, Python, SQL, HTML/CSS
- Frameworks: React, Node.js, Express, Next.js, FastAPI, Tailwind CSS
- AI/Data: Gemini SDK, OpenAI API, Vector DBs (Pinecone, Chroma), RAG, LangChain
- Certifications: AWS Certified Solutions Architect, GCP Professional Cloud Developer`,
    matchResults: {
      'job-101': {
        candidateId: 'cand-001',
        jobId: 'job-101',
        overallScore: 95,
        breakdown: {
          skillsMatchScore: 98,
          experienceMatchScore: 94,
          educationCertScore: 96,
          policyComplianceScore: 100,
          semanticFitScore: 92
        },
        recommendation: 'Strong Hire',
        confidence: 96,
        executiveSummary: 'Outstanding candidate with a near-perfect match for the Senior Full-Stack AI Engineer opening. Elena brings 6 years of production TypeScript/React experience combined with proven generative AI/RAG system implementations at Nexus Generative Labs.',
        matchedSkills: ['TypeScript', 'React', 'Node.js', 'LLM Integration (Gemini/OpenAI)', 'PostgreSQL', 'REST & GraphQL APIs', 'Tailwind CSS', 'Vector Databases (Pinecone/Chroma)', 'RAG Architecture', 'Docker / Kubernetes', 'Python / FastAPI'],
        missingRequiredSkills: [],
        bonusSkills: ['Vector Databases (Pinecone/Chroma)', 'RAG Architecture', 'Docker / Kubernetes', 'Python / FastAPI', 'AWS Certified'],
        keyStrengths: [
          'Direct production experience deploying LLM & RAG pipelines with Gemini models.',
          'Full-stack mastery across modern React UI, Node.js microservices, and vector databases.',
          'Strong educational credentials (BS CS from UC Berkeley) + 2 tier-1 cloud certifications.',
          'US Citizen located in San Francisco matching hybrid requirements perfectly.'
        ],
        identifiedGaps: [
          'Slightly less experience with Kubernetes cluster operations (primarily Docker/CI-CD focused).'
        ],
        redFlags: [],
        greenFlags: [
          'Demonstrated latency optimization track record (-42% p95).',
          'Salary ask ($185k) fits comfortably inside the $165k - $205k band.',
          '100% compliant with all company visa, residency, and education standards.'
        ],
        policyCitations: [
          {
            policyId: 'pol-001',
            policyName: 'Global Immigration & Visa Sponsorship Policy',
            status: 'Compliant',
            ruleExcerpt: 'US Citizen / Permanent Resident requires zero visa filing overhead.',
            note: 'No sponsorship or transfer required. Immediate start availability.'
          },
          {
            policyId: 'pol-002',
            policyName: 'Degree & Practical Equivalency Standard',
            status: 'Compliant',
            ruleExcerpt: 'BS in Computer Science or related STEM discipline is standard.',
            note: 'Holds BS CS from UC Berkeley (2020).'
          },
          {
            policyId: 'pol-003',
            policyName: 'Engineering & Product Salary Bands',
            status: 'Compliant',
            ruleExcerpt: 'Senior Software Engineer (L5): $160,000 - $210,000 base.',
            note: 'Salary ask of $185,000 is directly centered in the midpoint.'
          }
        ],
        interviewQuestions: [
          {
            category: 'Technical',
            question: 'Can you walk through how you structured the streaming token response in React with the Gemini API to prevent re-render cascades?',
            reason: 'Validates hands-on frontend performance and LLM streaming integration depth.',
            expectedSignals: ['Use of ReadableStream/EventSource', 'State buffering or custom hook', 'Smooth layout updates without DOM thrashing']
          },
          {
            category: 'Architecture / System',
            question: 'When chunking enterprise documents for vector retrieval, how did you choose chunk sizes, overlap, and metadata filtering strategies to minimize hallucinations?',
            reason: 'Tests understanding of real-world RAG edge cases and embedding tuning.',
            expectedSignals: ['Context window tradeoffs', 'Semantic chunking vs fixed-size', 'Hybrid search (dense + sparse BM25)']
          },
          {
            category: 'Behavioral',
            question: 'Describe a situation where an AI feature produced unexpected or biased output in production. How did you diagnose and remediate it?',
            reason: 'Assesses responsible AI practices and incident response.',
            expectedSignals: ['Prompt guardrails', 'Output validation schemas', 'Logging and telemetry']
          }
        ],
        compensationFit: {
          candidateAsk: '$185,000',
          jobBand: '$165,000 - $205,000',
          alignmentStatus: 'Within Budget',
          note: 'Ideal fit for L5 band, no compensation exception needed.'
        },
        analyzedAt: '2026-08-15T14:22:00Z'
      }
    }
  },
  {
    id: 'cand-002',
    name: 'Marcus Sterling',
    email: 'marcus.sterling@cloudcraft.net',
    phone: '+1 (206) 555-0198',
    location: 'Seattle, WA',
    currentTitle: 'Lead Cloud Infrastructure Architect',
    currentCompany: 'HyperScale Systems',
    totalYearsExp: 10,
    summary: '10 years designing resilient multi-cloud architectures, Kubernetes clusters, and Terraform GitOps workflows. Led SOC2 Type II compliance and multi-region failover setups.',
    education: [
      {
        degree: 'B.S. in Electrical & Computer Engineering',
        field: 'Computer Systems',
        institution: 'University of Washington',
        year: '2016'
      }
    ],
    experience: [
      {
        role: 'Lead Cloud Infrastructure Architect',
        company: 'HyperScale Systems',
        period: '2021 - Present',
        durationYears: 5,
        highlights: [
          'Architected 500+ node Kubernetes clusters across GCP and AWS handling $20M+ monthly transactions.',
          'Authored reusable Terraform modules reducing infrastructure provisioning time by 75%.',
          'Spearheaded automated secret rotation and zero-trust network boundaries with Istio.'
        ],
        skillsUsed: ['Kubernetes', 'Terraform', 'Google Cloud Platform (GCP)', 'AWS', 'Docker', 'CI/CD (GitHub Actions)', 'Security & IAM Compliance']
      },
      {
        role: 'Senior DevOps Engineer',
        company: 'Cascade Analytics',
        period: '2016 - 2021',
        durationYears: 5,
        highlights: [
          'Implemented Datadog monitoring and Prometheus telemetry across 80+ microservices.',
          'Constructed zero-downtime Blue/Green deployment pipelines via GitHub Actions.'
        ],
        skillsUsed: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Python']
      }
    ],
    skills: ['Kubernetes', 'Terraform', 'Google Cloud Platform (GCP)', 'AWS', 'Docker', 'CI/CD (GitHub Actions)', 'Security & IAM Compliance', 'Service Mesh (Istio)', 'Observability (Datadog/Prometheus)', 'SOC2 Compliance'],
    certifications: ['Certified Kubernetes Administrator (CKA)', 'AWS Certified Solutions Architect - Professional', 'Google Cloud Certified Professional Cloud Architect'],
    workAuthorization: 'US Citizen / Perm Resident',
    salaryExpectation: '$245,000 / year',
    appliedDate: '2026-08-14',
    targetJobId: 'job-103',
    status: 'Screened',
    rawResumeText: `MARCUS STERLING
Seattle, WA | marcus.sterling@cloudcraft.net | +1 (206) 555-0198 | US Citizen
LinkedIn: linkedin.com/in/marcussterling

SUMMARY
Principal Cloud & DevOps Architect with 10 years of expertise in Kubernetes, Terraform, multi-cloud GCP/AWS design, zero-trust security, and high-availability systems.

EXPERIENCE
HyperScale Systems | Lead Cloud Infrastructure Architect (2021 - Present)
- Orchestrated enterprise Kubernetes platform managing 500+ microservices on GCP GKE and AWS EKS.
- Developed modular Terraform infrastructure as code with policy-as-code guardrails (Open Policy Agent).
- Led compliance audits achieving SOC2 Type II certification with zero critical findings.

Cascade Analytics | Senior DevOps Engineer (2016 - 2021)
- Built automated multi-stage CI/CD pipelines deploying to hybrid environments.
- Implemented deep observability with Prometheus, Grafana, and Datadog.

EDUCATION
B.S. in Electrical & Computer Engineering, University of Washington (2012 - 2016)

SKILLS & CERTIFICATIONS
- CKA (Certified Kubernetes Administrator), AWS Solutions Architect Pro, GCP Cloud Architect
- Kubernetes, Terraform, GCP, AWS, Docker, GitHub Actions, Helm, Istio, Vault, Datadog`,
    matchResults: {
      'job-103': {
        candidateId: 'cand-002',
        jobId: 'job-103',
        overallScore: 96,
        breakdown: {
          skillsMatchScore: 99,
          experienceMatchScore: 98,
          educationCertScore: 95,
          policyComplianceScore: 97,
          semanticFitScore: 94
        },
        recommendation: 'Strong Hire',
        confidence: 97,
        executiveSummary: 'Top-tier Principal Cloud Architect candidate. Marcus possesses 10 years of multi-cloud engineering, triple cloud certifications (CKA, AWS Pro, GCP Pro), and proven enterprise scale handling 500+ node Kubernetes clusters.',
        matchedSkills: ['Kubernetes', 'Terraform', 'Google Cloud Platform (GCP)', 'AWS', 'Docker', 'CI/CD (GitHub Actions)', 'Security & IAM Compliance', 'Service Mesh (Istio)', 'Observability (Datadog/Prometheus)', 'SOC2 Compliance'],
        missingRequiredSkills: [],
        bonusSkills: ['Service Mesh (Istio)', 'Observability (Datadog/Prometheus)', 'SOC2 Compliance', 'CKA Certified'],
        keyStrengths: [
          'Extensive 10-year battle-tested cloud & Kubernetes architectural leadership.',
          'Triple cloud certification pedigree including CKA and GCP Professional Architect.',
          'Direct experience driving SOC2 Type II security audit compliance.',
          'Compensation expectations are well-aligned with our Principal Engineer budget.'
        ],
        identifiedGaps: [
          'Minimal direct experience with proprietary AI accelerators (TPUs), though general GPU node autoscaling is solid.'
        ],
        redFlags: [],
        greenFlags: [
          'Zero visa overhead (US Citizen).',
          'Located in PST (Seattle, WA), perfectly within US remote core hours.',
          'Strong cultural fit for high-ownership infrastructure leadership.'
        ],
        policyCitations: [
          {
            policyId: 'pol-001',
            policyName: 'Global Immigration & Visa Sponsorship Policy',
            status: 'Compliant',
            ruleExcerpt: 'US Citizen requires no sponsorship paperwork.',
            note: 'Immediate compliance.'
          },
          {
            policyId: 'pol-003',
            policyName: 'Engineering & Product Salary Bands',
            status: 'Compliant',
            ruleExcerpt: 'Principal Engineer (L7): $280,000 - $340,000 base. Staff Engineer: $215,000 - $275,000.',
            note: 'Candidate salary ask ($245k) sits comfortably in the Staff/Principal band.'
          },
          {
            policyId: 'pol-004',
            policyName: 'Distributed Workforce & Core Working Hours',
            status: 'Compliant',
            ruleExcerpt: 'Remote employees must reside within UTC-8 to UTC-4.',
            note: 'Seattle is UTC-8 (PST), completely within allowed band.'
          }
        ],
        interviewQuestions: [
          {
            category: 'Architecture / System',
            question: 'How do you design Kubernetes multi-tenant clusters with strict network isolation and GPU scheduling for LLM inference workloads?',
            reason: 'Validates ability to support our AI compute workloads securely.',
            expectedSignals: ['NetworkPolicies / CNI', 'Node affinity and taints/tolerations', 'MIG (Multi-Instance GPU) partitioning']
          },
          {
            category: 'Technical',
            question: 'Walk through your approach to zero-downtime database and infrastructure state migrations using Terraform and GitOps.',
            reason: 'Evaluates resilience and disaster recovery preparedness.',
            expectedSignals: ['State locking', 'Canary rollouts', 'Rollback verification']
          }
        ],
        compensationFit: {
          candidateAsk: '$245,000',
          jobBand: '$225,000 - $285,000',
          alignmentStatus: 'Within Budget',
          note: 'Direct match for Staff/Principal scale.'
        },
        analyzedAt: '2026-08-16T10:15:00Z'
      }
    }
  },
  {
    id: 'cand-003',
    name: 'Dr. Arjun Patel',
    email: 'arjun.patel.ai@researchlab.org',
    phone: '+1 (617) 495-2001',
    location: 'Boston, MA',
    currentTitle: 'Staff AI Research Scientist',
    currentCompany: 'Cognitive Vector Labs',
    totalYearsExp: 8,
    summary: '8 years of cutting-edge NLP research, RAG retrieval optimization, and LLM fine-tuning. Published 6 papers at NeurIPS/ACL on dense retrieval and hybrid re-ranking.',
    education: [
      {
        degree: 'Ph.D. in Computer Science (NLP & Information Retrieval)',
        field: 'Artificial Intelligence',
        institution: 'MIT',
        year: '2021'
      },
      {
        degree: 'B.Tech in Computer Science',
        field: 'Computer Engineering',
        institution: 'IIT Bombay',
        year: '2017'
      }
    ],
    experience: [
      {
        role: 'Staff AI Research Scientist',
        company: 'Cognitive Vector Labs',
        period: '2022 - Present',
        durationYears: 4,
        highlights: [
          'Engineered state-of-the-art hybrid dense-sparse RAG retrieval engine achieving +18% MRR@10 benchmark gain.',
          'Fine-tuned open foundation models on domain-specific corpora using LoRA/QLoRA with PyTorch.',
          'Mentored a team of 4 data scientists and set up automated MLOps evaluation pipelines.'
        ],
        skillsUsed: ['Python', 'PyTorch', 'Large Language Models (LLMs)', 'Information Retrieval / RAG', 'Transformers / Hugging Face', 'MLOps', 'Vector Embeddings']
      },
      {
        role: 'AI Research Scientist',
        company: 'MIT AI Lab / CSAIL',
        period: '2018 - 2022',
        durationYears: 4,
        highlights: [
          'Authored benchmark papers on cross-encoder reranking and contextual embeddings.',
          'Developed distributed training scripts with DeepSpeed across multi-GPU nodes.'
        ],
        skillsUsed: ['Python', 'PyTorch', 'Hugging Face', 'DeepSpeed', 'NLP']
      }
    ],
    skills: ['Python', 'PyTorch', 'Large Language Models (LLMs)', 'Information Retrieval / RAG', 'Transformers / Hugging Face', 'MLOps', 'Vector Embeddings', 'Distributed Training (DeepSpeed)', 'LangChain / LlamaIndex', 'GCP / Vertex AI'],
    certifications: ['DeepLearning.AI Generative AI Specialist', 'Google Cloud Certified Professional Machine Learning Engineer'],
    workAuthorization: 'H1B / Need Transfer',
    salaryExpectation: '$250,000 / year',
    appliedDate: '2026-08-11',
    targetJobId: 'job-102',
    status: 'Screened',
    rawResumeText: `DR. ARJUN PATEL
Boston, MA | arjun.patel.ai@researchlab.org | +1 (617) 495-2001 | H-1B Visa (Valid through 2028)
Google Scholar: scholar.google.com/citations?user=arjunpatel | GitHub: github.com/arjun-nlp

SUMMARY
Staff AI Research Scientist and Ph.D. with 8 years of specialized expertise in Information Retrieval, RAG architectures, Transformer models, and PyTorch deep learning.

EXPERIENCE
Cognitive Vector Labs | Staff AI Research Scientist (2022 - Present)
- Designed next-gen RAG framework integrating dense embedding models and BM25 hybrid ranking.
- Supervised fine-tuning of 7B-70B parameter models using LoRA/QLoRA for enterprise knowledge distillation.
- Established MLOps evaluation framework for hallucination detection and grounding accuracy.

MIT CSAIL | AI Research Fellow & Doctoral Candidate (2018 - 2022)
- Researched dense passage retrieval, cross-attention re-rankers, and vector indexing.
- Published 6 peer-reviewed papers at NeurIPS, ACL, and EMNLP.

EDUCATION
Ph.D. in Computer Science (NLP & IR) - Massachusetts Institute of Technology (MIT) (2018 - 2022)
B.Tech in Computer Science - IIT Bombay (2013 - 2017)

SKILLS
Python, PyTorch, LLMs, RAG, Transformers, Hugging Face, MLOps, Vector Embeddings, DeepSpeed, LangChain, Vertex AI`,
    matchResults: {
      'job-102': {
        candidateId: 'cand-003',
        jobId: 'job-102',
        overallScore: 98,
        breakdown: {
          skillsMatchScore: 100,
          experienceMatchScore: 98,
          educationCertScore: 100,
          policyComplianceScore: 95,
          semanticFitScore: 98
        },
        recommendation: 'Strong Hire',
        confidence: 98,
        executiveSummary: 'Exceptional candidate of world-class pedigree for the Lead ML & NLP Scientist position. Dr. Patel holds an MIT PhD in Information Retrieval, 8 years of research & production RAG experience, and demonstrated leadership at Cognitive Vector Labs.',
        matchedSkills: ['Python', 'PyTorch', 'Large Language Models (LLMs)', 'Information Retrieval / RAG', 'Transformers / Hugging Face', 'MLOps', 'Vector Embeddings', 'Distributed Training (DeepSpeed)', 'LangChain / LlamaIndex', 'GCP / Vertex AI'],
        missingRequiredSkills: [],
        bonusSkills: ['Distributed Training (DeepSpeed)', 'LangChain / LlamaIndex', 'GCP / Vertex AI', 'GCP ML Engineer Certified'],
        keyStrengths: [
          'PhD in NLP/Information Retrieval from MIT with 6 high-impact NeurIPS/ACL papers.',
          'Direct author and architect of high-performing hybrid RAG retrieval engines.',
          'Strong balance of deep theoretical foundation and pragmatic production MLOps.',
          'Meets all Lead/Staff engineering qualifications seamlessly.'
        ],
        identifiedGaps: [
          'Requires standard H-1B transfer filing (well within company policy for L6 Staff/Lead roles).'
        ],
        redFlags: [],
        greenFlags: [
          'Recognized authority in dense retrieval and grounding evaluation.',
          'Salary expectation ($250k) fits well within the $210k - $260k Lead band.',
          'Location in Boston (EST) is optimal for remote synchronization.'
        ],
        policyCitations: [
          {
            policyId: 'pol-001',
            policyName: 'Global Immigration & Visa Sponsorship Policy',
            status: 'Compliant',
            ruleExcerpt: 'Company sponsors H-1B transfers for Senior (L5+), Staff, and Lead engineering roles with over 5+ years of experience.',
            note: 'Candidate has 8 years experience and is applying for Lead/L6. H-1B transfer is fully supported.'
          },
          {
            policyId: 'pol-002',
            policyName: 'Degree & Practical Equivalency Standard',
            status: 'Compliant',
            ruleExcerpt: 'Ph.D./MS in Computer Science or AI discipline is recognized at highest tier.',
            note: 'MIT PhD in Computer Science with top honors.'
          },
          {
            policyId: 'pol-003',
            policyName: 'Engineering & Product Salary Bands',
            status: 'Compliant',
            ruleExcerpt: 'Staff/Lead Engineer (L6): $215,000 - $275,000 base.',
            note: 'Salary ask of $250,000 is within budget.'
          }
        ],
        interviewQuestions: [
          {
            category: 'Technical',
            question: 'How do you formulate the loss function when fine-tuning a dual-encoder model for dense passage retrieval to prevent negative sample collision?',
            reason: 'Evaluates deep scientific understanding of vector embedding training dynamics.',
            expectedSignals: ['InfoNCE / Multiple Negatives Ranking Loss', 'In-batch hard negatives mining', 'Cross-entropy temperature calibration']
          },
          {
            category: 'Architecture / System',
            question: 'In a real-time production RAG system with 50 million company documents, how would you balance latency vs recall between approximate nearest neighbor (HNSW) and cross-encoder re-ranking?',
            reason: 'Tests practical architectural tradeoff intuition for high-scale enterprise deployment.',
            expectedSignals: ['Two-stage retrieval funnel', 'M and efConstruction tuning in HNSW', 'Async batching for re-ranker model']
          }
        ],
        compensationFit: {
          candidateAsk: '$250,000',
          jobBand: '$210,000 - $260,000',
          alignmentStatus: 'Within Budget',
          note: 'Comfortably inside L6 band.'
        },
        analyzedAt: '2026-08-16T11:40:00Z'
      }
    }
  },
  {
    id: 'cand-004',
    name: 'Samantha Wei',
    email: 'sam.wei@frontendcraft.co',
    phone: '+1 (312) 555-8831',
    location: 'Chicago, IL',
    currentTitle: 'Full-Stack Developer',
    currentCompany: 'Apex Digital Solutions',
    totalYearsExp: 3,
    summary: '3 years of full-stack development experience focused on React, JavaScript, and Node.js REST APIs. Built responsive e-commerce web portals and recently completed training in OpenAI API prompting.',
    education: [
      {
        degree: 'B.A. in Digital Media & Web Design',
        field: 'Interactive Media',
        institution: 'DePaul University',
        year: '2023'
      },
      {
        degree: 'Full-Stack Web Development Certificate',
        field: 'Software Engineering',
        institution: 'General Assembly',
        year: '2023'
      }
    ],
    experience: [
      {
        role: 'Full-Stack Developer',
        company: 'Apex Digital Solutions',
        period: '2023 - Present',
        durationYears: 2,
        highlights: [
          'Built responsive user interfaces using React and Tailwind CSS.',
          'Created CRUD REST APIs in Express.js and MySQL.',
          'Explored prototype integration with OpenAI text completion endpoints.'
        ],
        skillsUsed: ['JavaScript', 'React', 'Node.js', 'Express', 'Tailwind CSS', 'MySQL']
      },
      {
        role: 'Junior Frontend Intern',
        company: 'Loop Interactive',
        period: '2022 - 2023',
        durationYears: 1,
        highlights: [
          'Maintained component styling and resolved UI bugs across web client.'
        ],
        skillsUsed: ['HTML', 'CSS', 'JavaScript', 'React']
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'Tailwind CSS', 'REST APIs', 'MySQL', 'HTML/CSS'],
    certifications: ['General Assembly Software Engineering Immersive'],
    workAuthorization: 'US Citizen / Perm Resident',
    salaryExpectation: '$135,000 / year',
    appliedDate: '2026-08-15',
    targetJobId: 'job-101',
    status: 'Screened',
    rawResumeText: `SAMANTHA WEI
Chicago, IL | sam.wei@frontendcraft.co | +1 (312) 555-8831 | US Citizen

SUMMARY
Full-Stack Developer with 3 years building React applications, Tailwind CSS layouts, and Node.js REST services. Passionate about modern UI engineering and eager to expand into AI development.

EXPERIENCE
Apex Digital Solutions | Full-Stack Developer (2023 - Present)
- Developed front-end components using React and Tailwind CSS for client web apps.
- Created Express.js routes and connected to MySQL databases.
- Integrated experimental chat prototypes with OpenAI API.

Loop Interactive | Junior Frontend Intern (2022 - 2023)
- Implemented responsive mobile layouts and UI bug fixes.

EDUCATION
B.A. in Digital Media, DePaul University (2019 - 2023)
Full-Stack Web Certificate, General Assembly (2023)

SKILLS
React, JavaScript, Node.js, Express, Tailwind CSS, MySQL, REST APIs, Git`,
    matchResults: {
      'job-101': {
        candidateId: 'cand-004',
        jobId: 'job-101',
        overallScore: 68,
        breakdown: {
          skillsMatchScore: 70,
          experienceMatchScore: 60,
          educationCertScore: 72,
          policyComplianceScore: 92,
          semanticFitScore: 66
        },
        recommendation: 'Potential / Further Review',
        confidence: 89,
        executiveSummary: 'Samantha is an enthusiastic early-career engineer with solid React and Node.js fundamentals, but falls short of the Senior tier (5+ years) required for this role. Her experience (3 years total, mostly mid-level UI) lacks deep production RAG, TypeScript, and distributed system complexity.',
        matchedSkills: ['React', 'Node.js', 'Tailwind CSS', 'REST & GraphQL APIs'],
        missingRequiredSkills: ['TypeScript', 'LLM Integration (Gemini/OpenAI)', 'PostgreSQL', 'Vector Databases (Pinecone/Chroma)', 'RAG Architecture'],
        bonusSkills: [],
        keyStrengths: [
          'Clean styling and component construction with React and Tailwind CSS.',
          'High enthusiasm and demonstrable interest in adopting AI SDKs.',
          'US Citizen located in Chicago (Central time zone), great team collaboration attitude.'
        ],
        identifiedGaps: [
          'Years of experience (3 years) is below the 5-year minimum for Senior (L5).',
          'Lacks professional TypeScript codebase track record (primarily vanilla JavaScript).',
          'No production experience with vector databases, embeddings, or RAG architecture.',
          'Database experience is primarily basic MySQL CRUD rather than complex query/schema design.'
        ],
        redFlags: [],
        greenFlags: [
          'Salary expectation ($135k) is well below our senior cap.',
          'Strong candidate for a Mid-Level (L4) opening if one becomes available.'
        ],
        policyCitations: [
          {
            policyId: 'pol-002',
            policyName: 'Degree & Practical Equivalency Standard',
            status: 'Warning',
            ruleExcerpt: '2 additional years of verified engineering experience required for non-CS STEM degrees to meet Senior (L5) criteria.',
            note: 'Candidate has 3 years experience with BA in Digital Media; needs 2 more years to qualify for Senior title.'
          },
          {
            policyId: 'pol-003',
            policyName: 'Engineering & Product Salary Bands',
            status: 'Compliant',
            ruleExcerpt: 'Candidate ask ($135k) is under the Senior band minimum ($160k).',
            note: 'Cost-effective, but level calibration is needed.'
          }
        ],
        interviewQuestions: [
          {
            category: 'Technical',
            question: 'How would you migrate a large JavaScript React codebase to strict TypeScript, and what strategies do you use for typing complex async API responses?',
            reason: 'Assesses readiness to step up to TypeScript production standards.',
            expectedSignals: ['Incremental tsconfig migration', 'Generics and Zod / runtime schema validation']
          },
          {
            category: 'Behavioral',
            question: 'Tell me about a time you had to learn a completely new technology (such as AI SDKs) under tight deadlines to deliver a feature.',
            reason: 'Measures learning velocity and adaptability.',
            expectedSignals: ['Self-directed learning', 'Hands-on experimentation', 'Seeking feedback']
          }
        ],
        compensationFit: {
          candidateAsk: '$135,000',
          jobBand: '$165,000 - $205,000',
          alignmentStatus: 'Below Budget',
          note: 'Under budget, matches Mid-Level (L4) profile.'
        },
        analyzedAt: '2026-08-16T16:00:00Z'
      }
    }
  },
  {
    id: 'cand-005',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.almansoor@ai-engine.dev',
    phone: '+1 (512) 809-7712',
    location: 'Austin, TX',
    currentTitle: 'Senior Machine Learning & RAG Engineer',
    currentCompany: 'Aura Intelligence',
    totalYearsExp: 7,
    summary: '7 years building enterprise AI pipelines, vector retrieval architectures, and fine-tuning open-source LLMs. Expert in Python, PyTorch, Pinecone, LangChain, and FastAPI.',
    education: [
      {
        degree: 'M.S. in Computer Science (Machine Learning)',
        field: 'Artificial Intelligence',
        institution: 'University of Texas at Austin',
        year: '2019'
      },
      {
        degree: 'B.S. in Computer Science',
        field: 'Software Systems',
        institution: 'Texas A&M University',
        year: '2017'
      }
    ],
    experience: [
      {
        role: 'Senior Machine Learning Engineer',
        company: 'Aura Intelligence',
        period: '2021 - Present',
        durationYears: 5,
        highlights: [
          'Built enterprise RAG engine with contextual embeddings, BM25 reranking, and semantic chunking for 50k business users.',
          'Fine-tuned Llama and Mistral models for automated document classification with PyTorch and Hugging Face.',
          'Deployed scalable inference endpoints on Google Cloud Vertex AI and Triton Server.'
        ],
        skillsUsed: ['Python', 'PyTorch', 'Large Language Models (LLMs)', 'Information Retrieval / RAG', 'Transformers / Hugging Face', 'Vector Embeddings', 'GCP / Vertex AI']
      },
      {
        role: 'Data Scientist / ML Engineer',
        company: 'Dell Technologies AI Lab',
        period: '2019 - 2021',
        durationYears: 2,
        highlights: [
          'Developed predictive time-series models and automated feature engineering pipelines in Python.',
          'Built REST endpoints for real-time model scoring.'
        ],
        skillsUsed: ['Python', 'PyTorch', 'Docker', 'REST APIs', 'FastAPI']
      }
    ],
    skills: ['Python', 'PyTorch', 'Large Language Models (LLMs)', 'Information Retrieval / RAG', 'Transformers / Hugging Face', 'MLOps', 'Vector Embeddings', 'LangChain / LlamaIndex', 'GCP / Vertex AI', 'Docker / Kubernetes', 'TypeScript'],
    certifications: ['Google Cloud Professional Machine Learning Engineer', 'TensorFlow Developer Certificate'],
    workAuthorization: 'US Citizen / Perm Resident',
    salaryExpectation: '$220,000 / year',
    appliedDate: '2026-08-16',
    targetJobId: 'job-102',
    status: 'Screened',
    rawResumeText: `TARIQ AL-MANSOOR
Austin, TX | tariq.almansoor@ai-engine.dev | +1 (512) 809-7712 | US Citizen
GitHub: github.com/tariqalmansoor | LinkedIn: linkedin.com/in/tariqalmansoor

SUMMARY
Senior ML & RAG Engineer with 7 years of hands-on experience building production generative AI systems, dense passage retrieval pipelines, PyTorch models, and Vertex AI deployments.

EXPERIENCE
Aura Intelligence | Senior ML Engineer (2021 - Present)
- Architected enterprise RAG system with Pinecone, LangChain, and hybrid reranking.
- Fine-tuned 8B/70B parameter models using LoRA and Hugging Face Transformers.
- Deployed high-concurrency model serving APIs on GCP with Docker and Kubernetes.

Dell Technologies | Data Scientist / ML Engineer (2019 - 2021)
- Built automated ML feature pipelines and real-time inference services.

EDUCATION
M.S. in Computer Science (Machine Learning), UT Austin (2017 - 2019)
B.S. in Computer Science, Texas A&M (2013 - 2017)

SKILLS & CERTIFICATIONS
Python, PyTorch, LLMs, RAG, Transformers, Hugging Face, Vector DBs, GCP Vertex AI, Docker, C++`,
    matchResults: {
      'job-102': {
        candidateId: 'cand-005',
        jobId: 'job-102',
        overallScore: 92,
        breakdown: {
          skillsMatchScore: 95,
          experienceMatchScore: 90,
          educationCertScore: 95,
          policyComplianceScore: 100,
          semanticFitScore: 91
        },
        recommendation: 'Hire',
        confidence: 94,
        executiveSummary: 'Strong candidate for the Lead ML & NLP Scientist role. Tariq brings 7 years of deep PyTorch, RAG architecture, and GCP Vertex AI production experience with an MS in CS from UT Austin and US Citizen work authorization.',
        matchedSkills: ['Python', 'PyTorch', 'Large Language Models (LLMs)', 'Information Retrieval / RAG', 'Transformers / Hugging Face', 'MLOps', 'Vector Embeddings', 'LangChain / LlamaIndex', 'GCP / Vertex AI'],
        missingRequiredSkills: [],
        bonusSkills: ['LangChain / LlamaIndex', 'GCP / Vertex AI', 'Docker / Kubernetes', 'TypeScript'],
        keyStrengths: [
          '7 years of verified production RAG and generative AI system deployment.',
          'Strong formal academic foundation (MS CS from UT Austin).',
          'Certified GCP Professional Machine Learning Engineer.',
          '100% compliant with company policies and remote requirements.'
        ],
        identifiedGaps: [
          'Slightly fewer academic research publications compared to pure research track candidates, but exceptionally strong on engineering delivery.'
        ],
        redFlags: [],
        greenFlags: [
          'US Citizen in Austin, TX with immediate availability.',
          'Salary expectation ($220k) is aligned with the lower-mid range of the $210k - $260k band.'
        ],
        policyCitations: [
          {
            policyId: 'pol-001',
            policyName: 'Global Immigration & Visa Sponsorship Policy',
            status: 'Compliant',
            ruleExcerpt: 'US Citizen requires no visa filing.',
            note: 'Immediate compliance.'
          },
          {
            policyId: 'pol-003',
            policyName: 'Engineering & Product Salary Bands',
            status: 'Compliant',
            ruleExcerpt: 'Lead Engineer (L6): $210,000 - $260,000.',
            note: '$220,000 ask fits well within the budget.'
          }
        ],
        interviewQuestions: [
          {
            category: 'Technical',
            question: 'How do you handle context window truncation and prompt token budgeting when feeding multi-document retrieval results into a generative model?',
            reason: 'Tests practical engineering acumen in production RAG systems.',
            expectedSignals: ['Re-ranking scoring thresholds', 'Map-reduce summarization', 'Token counter estimation']
          }
        ],
        compensationFit: {
          candidateAsk: '$220,000',
          jobBand: '$210,000 - $260,000',
          alignmentStatus: 'Within Budget',
          note: 'Direct match for L6 scale.'
        },
        analyzedAt: '2026-08-16T18:30:00Z'
      }
    }
  }
];
