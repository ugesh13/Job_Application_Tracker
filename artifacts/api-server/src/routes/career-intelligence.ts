import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import {
  db,
  jobsTable,
  profilesTable,
  userProjectsTable,
  userSkillsTable,
} from "@workspace/db";
import {
  ChatCareerAgentBody,
  ChatCareerAgentResponse,
  GetCareerTwinResponse,
  GetJobParams,
  GetJobTruthLayerResponse,
  GetOpportunityGraphResponse,
  GetReverseJobSearchResponse,
  SimulateTimeMachineBody,
  SimulateTimeMachineResponse,
} from "@workspace/api-zod";
import { AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

// Skill ontology domains
const DOMAINS: Record<string, string[]> = {
  "Frontend Development": [
    "react", "typescript", "javascript", "html", "css", "tailwindcss",
    "next.js", "vue", "angular", "ui/ux", "figma", "wireframing", "redux", "web"
  ],
  "Backend Development": [
    "node.js", "express", "python", "fastapi", "django", "java", "go",
    "rest api", "graphql", "microservices", "api", "backend", "c++", "c#"
  ],
  "Databases & Storage": [
    "postgresql", "mongodb", "sql", "redis", "mysql", "dynamodb",
    "supabase", "neon", "prisma", "drizzle", "database"
  ],
  "Cloud Infrastructure": [
    "aws", "gcp", "azure", "docker", "kubernetes", "serverless",
    "terraform", "cloud", "lambda", "s3", "ec2"
  ],
  "AI Engineering": [
    "gemini", "openai", "langchain", "llm", "machine learning", "pytorch",
    "tensorflow", "embeddings", "prompt engineering", "rag", "ai", "nlp"
  ],
  "DevOps & Quality": [
    "git", "ci/cd", "github actions", "jest", "testing", "linux",
    "monitoring", "agile", "scrum", "devops", "automation"
  ],
};

function calculateDomainScore(domainSkills: string[], userSkills: { name: string; yearsExperience: number }[], projects: { skills: string[] }[]): { score: number; matched: string[] } {
  const matched: string[] = [];
  let score = 0;

  for (const uSkill of userSkills) {
    const norm = uSkill.name.toLowerCase();
    const isDomain = domainSkills.some((d) => norm.includes(d) || d.includes(norm));
    if (isDomain) {
      matched.push(uSkill.name);
      score += 20 + Math.min(uSkill.yearsExperience * 5, 20);
    }
  }

  // Bonus for verified evidence in projects
  for (const proj of projects) {
    for (const pSkill of proj.skills || []) {
      const norm = pSkill.toLowerCase();
      if (domainSkills.some((d) => norm.includes(d) || d.includes(norm))) {
        score += 10;
      }
    }
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    matched: Array.from(new Set(matched)),
  };
}

// 1. GET /api/career/twin
router.get("/career/twin", async (req: AuthenticatedRequest, res): Promise<void> => {
  const userId = req.user!.uid;

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId))
    .limit(1);

  const skills = await db
    .select()
    .from(userSkillsTable)
    .where(eq(userSkillsTable.userId, userId));

  const projects = await db
    .select()
    .from(userProjectsTable)
    .where(eq(userProjectsTable.userId, userId));

  // Compute Skill DNA across the 6 domains
  const categories = Object.entries(DOMAINS).map(([domainName, domainSkills]) => {
    const { score, matched } = calculateDomainScore(domainSkills, skills, projects);
    const level = score >= 70 ? "Strong" : score >= 35 ? "Developing" : "Foundational";
    return {
      name: domainName,
      score,
      level,
      skills: matched,
    };
  });

  const sortedCats = [...categories].sort((a, b) => b.score - a.score);
  const topTwo = sortedCats.slice(0, 2);
  const developingAreas = sortedCats.filter((c) => c.score >= 20 && c.score < 70).map((c) => c.name);

  const strongestCombination = topTwo.length >= 2 && topTwo[0].score > 0
    ? `${topTwo[0].name} + ${topTwo[1].name}`
    : "General Software Engineering";

  const crossDomainInsight = topTwo.length >= 2 && topTwo[0].score > 0
    ? `Your evidence demonstrates strength in ${topTwo[0].name.toLowerCase()} reinforced by ${topTwo[1].name.toLowerCase()}. This combination supports roles requiring end-to-end feature ownership and technical breadth.`
    : "Add verified skills and projects to discover your cross-domain capability combinations.";

  // Evidence matrix: Claimed vs Verified by Projects
  const projectSkillSet = new Set(
    projects.flatMap((p) => (p.skills || []).map((s) => s.toLowerCase().trim()))
  );

  let verifiedCount = 0;
  const evidence = skills.map((skill) => {
    const norm = skill.name.toLowerCase().trim();
    const provenProjects = projects
      .filter((p) => (p.skills || []).some((s) => s.toLowerCase().trim() === norm || norm.includes(s.toLowerCase().trim())))
      .map((p) => p.name);

    const isVerified = provenProjects.length > 0;
    if (isVerified) verifiedCount++;

    return {
      skill: skill.name,
      provenBy: provenProjects,
      status: isVerified ? ("verified" as const) : ("claimed_only" as const),
    };
  });

  // Emerging Identity
  const primaryIdentity = topTwo[0]?.score >= 60 && topTwo[1]?.score >= 40
    ? `${topTwo[0].name.replace(" Development", "")} & ${topTwo[1].name.replace(" Development", "")} Engineer`
    : profile?.targetRole || "Software Engineer";

  const secondaryIdentity = topTwo[1]?.score >= 30
    ? `${topTwo[1].name.replace(" Infrastructure", "").replace(" Development", "")} Specialist`
    : "Application Developer";

  const developingIdentity = developingAreas[0]
    ? `${developingAreas[0].replace(" Development", "")} Practitioner`
    : "System Architecture";

  const evidenceList = projects.map((p) => `Verified by project "${p.name}" (${(p.skills || []).slice(0, 3).join(", ")})`);
  if (evidenceList.length === 0) {
    evidenceList.push("Based on candidate profile and self-reported skills.");
  }

  const safeProfile = {
    id: profile?.id ?? 0,
    name: profile?.name ?? "Candidate",
    email: profile?.email ?? "",
    role: profile?.role ?? "Developer",
    targetRole: profile?.targetRole ?? "Software Engineer",
    location: profile?.location ?? "Remote",
    avatarColor: profile?.avatarColor ?? "#47766c",
    initials: (profile?.name || "C").slice(0, 2).toUpperCase(),
    education: profile?.education ?? null,
    experienceYears: profile?.experienceYears ?? 0,
    careerGoal: profile?.careerGoal ?? null,
    bio: profile?.bio ?? null,
  };

  const response = {
    userId,
    profile: safeProfile,
    skillDNA: {
      categories,
      strongestCombination,
      crossDomainInsight,
      developingAreas,
    },
    evidence,
    emergingIdentity: {
      primary: primaryIdentity,
      secondary: secondaryIdentity,
      developing: developingIdentity,
      evidenceList,
    },
    provenance: {
      userProvidedCount: skills.length,
      verifiedCount,
      inferredCount: categories.length,
    },
  };

  res.json(GetCareerTwinResponse.parse(response));
});

// 2. POST /api/career/time-machine
router.post("/career/time-machine", async (req: AuthenticatedRequest, res): Promise<void> => {
  const parsed = SimulateTimeMachineBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = req.user!.uid;
  const { additionalSkills, targetDirection } = parsed.data;

  const skills = await db
    .select()
    .from(userSkillsTable)
    .where(eq(userSkillsTable.userId, userId));

  const projects = await db
    .select()
    .from(userProjectsTable)
    .where(eq(userProjectsTable.userId, userId));

  // Current domain vectors
  const currentDNA = Object.entries(DOMAINS).map(([name, domainSkills]) => {
    const { score } = calculateDomainScore(domainSkills, skills, projects);
    return { name, score };
  });

  // Simulated additions
  const simulatedSkills = [
    ...skills,
    ...additionalSkills.map((s: string) => ({ name: s, yearsExperience: 1 })),
  ];

  const simulatedDNA = Object.entries(DOMAINS).map(([name, domainSkills]) => {
    const current = currentDNA.find((c) => c.name === name)?.score || 0;
    const { score: simScore } = calculateDomainScore(domainSkills, simulatedSkills, projects);
    const delta = Math.max(0, simScore - current);
    return {
      name,
      currentScore: current,
      simulatedScore: simScore,
      delta,
    };
  });

  const newlyUnlockedCapabilities: string[] = [];
  for (const s of additionalSkills) {
    const lower = s.toLowerCase();
    if (lower.includes("docker") || lower.includes("kubernetes")) {
      newlyUnlockedCapabilities.push("Containerized service deployment & production orchestration");
    } else if (lower.includes("aws") || lower.includes("cloud")) {
      newlyUnlockedCapabilities.push("Cloud-native infrastructure provisioning and serverless architecture");
    } else if (lower.includes("typescript")) {
      newlyUnlockedCapabilities.push("Large-scale type-safe codebase maintenance & enterprise architecture");
    } else if (lower.includes("ai") || lower.includes("gemini") || lower.includes("llm")) {
      newlyUnlockedCapabilities.push("Context-augmented generative AI integration & semantic workflows");
    } else {
      newlyUnlockedCapabilities.push(`Specialized ${s} implementation and workflow integration`);
    }
  }

  const potentialDirections = [
    targetDirection || "Full-Stack Cloud Architect",
    "Systems & Infrastructure Specialist",
    "Production Platform Engineer",
  ];

  const suggestedLearningPath = [
    `Complete a focused build proving hands-on ${additionalSkills.slice(0, 2).join(" and ")}.`,
    "Deploy a functional demo with public repository documentation and architecture breakdown.",
    "Add the project to your Momentum profile to convert the simulation into verified candidate evidence.",
  ];

  const result = {
    simulatedDNA,
    newlyUnlockedCapabilities,
    potentialDirections,
    suggestedLearningPath,
    disclaimer: "Scenario estimate based on capability ontology. Simulation, not a prediction of hiring outcome.",
  };

  res.json(SimulateTimeMachineResponse.parse(result));
});

// 3. GET /api/career/reverse-search
router.get("/career/reverse-search", async (req: AuthenticatedRequest, res): Promise<void> => {
  const userId = req.user!.uid;

  const skills = await db
    .select()
    .from(userSkillsTable)
    .where(eq(userSkillsTable.userId, userId));

  const projects = await db
    .select()
    .from(userProjectsTable)
    .where(eq(userProjectsTable.userId, userId));

  const skillNames = skills.map((s) => s.name);
  const projectNames = projects.map((p) => p.name);

  const directions = [
    {
      title: "API Platform & Integration Engineer",
      matchLevel: "High Alignment",
      whyDiscovered: `Your expertise in ${skillNames.slice(0, 3).join(", ") || "APIs"} demonstrates proficiency in connecting modular web services and data endpoints.`,
      supportingEvidence: projectNames.length > 0 ? projectNames.slice(0, 2) : ["Candidate verified skill set"],
      potentialRoles: ["API Engineer", "Integration Developer", "Backend Solutions Engineer"],
    },
    {
      title: "AI-Enabled Application Engineer",
      matchLevel: "High Potential",
      whyDiscovered: "Modern software teams look for developers who bridge practical UI development with generative and automated API workflows.",
      supportingEvidence: projectNames.length > 0 ? [projectNames[0]] : ["Core development proficiency"],
      potentialRoles: ["AI Application Developer", "Forward Deployed Engineer", "Product Engineer"],
    },
    {
      title: "Developer Experience (DX) Specialist",
      matchLevel: "Emerging Direction",
      whyDiscovered: "Strong foundational tooling and component-driven architecture evidence allows developers to transition into internal platform and DX teams.",
      supportingEvidence: ["Component-driven development evidence"],
      potentialRoles: ["Platform Engineer", "Design Systems Engineer", "Technical Enablement Specialist"],
    },
    {
      title: "Full-Lifecycle Product Engineer",
      matchLevel: "Strong Alignment",
      whyDiscovered: "Building end-to-end features with tangible project proof matches growth-stage companies seeking self-sufficient contributors.",
      supportingEvidence: projectNames,
      potentialRoles: ["Product Engineer", "Full Stack Developer", "Founding Engineer"],
    },
  ];

  res.json(GetReverseJobSearchResponse.parse({ directions }));
});

// 4. GET /api/career/opportunity-graph
router.get("/career/opportunity-graph", async (req: AuthenticatedRequest, res): Promise<void> => {
  const userId = req.user!.uid;

  const skills = await db
    .select()
    .from(userSkillsTable)
    .where(eq(userSkillsTable.userId, userId));

  const nodes = [
    { id: "core_skills", label: "Your Verified Skills", category: "root", level: "Primary" },
    ...skills.map((s) => ({ id: `skill_${s.id}`, label: s.name, category: "skill", level: s.proficiency })),
    { id: "cap_api", label: "API Engineering", category: "capability", level: "Core" },
    { id: "cap_ui", label: "Interface Systems", category: "capability", level: "Core" },
    { id: "cap_data", label: "Data Persistence", category: "capability", level: "Core" },
    { id: "dir_fullstack", label: "Full Stack Engineer", category: "direction", level: "Career Direction" },
    { id: "dir_backend", label: "Backend Specialist", category: "direction", level: "Career Direction" },
    { id: "dir_ai", label: "AI Applications", category: "direction", level: "Career Direction" },
  ];

  const edges = skills.flatMap((s) => {
    const sId = `skill_${s.id}`;
    const name = s.name.toLowerCase();
    const result = [{ source: "core_skills", target: sId, relationship: "possesses" }];

    if (name.includes("react") || name.includes("css") || name.includes("ui") || name.includes("figma")) {
      result.push({ source: sId, target: "cap_ui", relationship: "builds" });
      result.push({ source: "cap_ui", target: "dir_fullstack", relationship: "unlocks" });
    }
    if (name.includes("node") || name.includes("python") || name.includes("fastapi") || name.includes("sql")) {
      result.push({ source: sId, target: "cap_api", relationship: "powers" });
      result.push({ source: "cap_api", target: "dir_backend", relationship: "unlocks" });
    }
    if (name.includes("sql") || name.includes("postgres") || name.includes("mongo")) {
      result.push({ source: sId, target: "cap_data", relationship: "manages" });
    }
    if (name.includes("ai") || name.includes("gemini") || name.includes("llm")) {
      result.push({ source: sId, target: "dir_ai", relationship: "enables" });
    }
    return result;
  });

  res.json(GetOpportunityGraphResponse.parse({ nodes, edges }));
});

// 5. GET /api/jobs/:id/truth-layer
router.get("/jobs/:id/truth-layer", async (req: AuthenticatedRequest, res): Promise<void> => {
  const params = GetJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const userId = req.user!.uid;

  const [job] = await db
    .select()
    .from(jobsTable)
    .where(and(eq(jobsTable.id, params.data.id), eq(jobsTable.userId, userId)));

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  const skills = await db
    .select()
    .from(userSkillsTable)
    .where(eq(userSkillsTable.userId, userId));

  const projects = await db
    .select()
    .from(userProjectsTable)
    .where(eq(userProjectsTable.userId, userId));

  // Deconstruct job into Core, Secondary, Nice to Have, and Inferred
  const reqSkills = job.skillsRequired && job.skillsRequired.length > 0
    ? job.skillsRequired
    : [job.title, "Problem Solving", "Collaboration"];

  const coreRequirements = reqSkills.slice(0, Math.max(1, Math.ceil(reqSkills.length * 0.6)));
  const secondaryRequirements = reqSkills.slice(coreRequirements.length);
  const niceToHave = [
    "Experience in high-velocity agile sprints",
    "Production debugging and telemetry observability",
    "Portfolio projects showcasing end-to-end deployment",
  ];

  const aiInferredCompetencies = [
    {
      competency: "Cross-Functional Collaboration & Technical Communication",
      inferredFrom: "Job responsibilities require partnering with product designers and engineering leads.",
      disclaimer: "AI-inferred — not explicitly stated in the job description.",
    },
    {
      competency: "Production Operational Reliability",
      inferredFrom: "Mentions ownership of user-facing systems and uptime responsibility.",
      disclaimer: "AI-inferred — not explicitly stated in the job description.",
    },
  ];

  // Strategy comparison
  const userSkillNames = skills.map((s) => s.name.toLowerCase());
  const hasCoreMatch = coreRequirements.some((c) =>
    userSkillNames.some((u) => u.includes(c.toLowerCase()) || c.toLowerCase().includes(u))
  );

  const strategies = [
    {
      id: "apply_now",
      name: "Strategy A: Apply Immediately",
      alignmentScore: hasCoreMatch ? 78 : 55,
      readinessLevel: hasCoreMatch ? "Ready" : "Moderate",
      pros: "Enters the hiring pipeline early before candidate volume surges.",
      cons: "Missing secondary qualifications may place you in general pool without differentiation.",
      recommended: hasCoreMatch,
    },
    {
      id: "build_evidence",
      name: "Strategy B: Build Targeted Project Evidence First",
      alignmentScore: 92,
      readinessLevel: "High Evidence",
      pros: "Creates verifiable proof of required skills in your portfolio before recruiter review.",
      cons: "Requires 3–7 days of focused development before submission.",
      recommended: !hasCoreMatch,
    },
    {
      id: "tailor_resume",
      name: "Strategy C: Tailor Resume to Core Competencies",
      alignmentScore: 84,
      readinessLevel: "Optimized Presentation",
      pros: "Highlights existing relevant projects front-and-center.",
      cons: "Does not add new technical capabilities, only clarifies existing evidence.",
      recommended: false,
    },
  ];

  // Recruiter perspective simulation
  const recruiterPerspective = {
    firstImpression: hasCoreMatch
      ? "Candidate demonstrates relevant foundational tools. A reviewer will look for tangible project proof verifying production implementation."
      : "Candidate has promising foundational skill, but key core competencies are not yet proven by documented projects.",
    perceivedEvidenceStrength: projects.length > 0 ? "Solid Project Evidence" : "Self-Reported Claims (Evidence Needed)",
    likelyQuestions: [
      `How have you applied ${coreRequirements[0] || "core technologies"} in a real project environment?`,
      "Can you walk through an architecture trade-off you made when designing your system?",
      "How do you approach debugging unexpected production issues?",
    ],
    improvementAdvice: [
      `Feature a project explicitly demonstrating ${coreRequirements[0] || "the core stack"}.`,
      "Include measurable impact metrics in your application notes rather than generic responsibility lists.",
      "Highlight concrete architectural decisions in your repository README.",
    ],
  };

  const whatIfIDontApply = {
    marketAlternativesCount: 5,
    uniquenessAssessment: "This role matches common industry tech stacks. Comparable opportunities appear regularly in search.",
    skillOverlapInsight: "Skills required for this role overlap by 75% with other mid-level roles in your pipeline.",
  };

  const result = {
    jobId: job.id,
    coreRequirements,
    secondaryRequirements,
    niceToHave,
    aiInferredCompetencies,
    strategies,
    recruiterPerspective,
    whatIfIDontApply,
  };

  res.json(GetJobTruthLayerResponse.parse(result));
});

// 6. POST /api/career/agent/chat
router.post("/career/agent/chat", async (req: AuthenticatedRequest, res): Promise<void> => {
  const parsed = ChatCareerAgentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = req.user!.uid;
  const userMessage = parsed.data.message.toLowerCase();

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId))
    .limit(1);

  const skills = await db
    .select()
    .from(userSkillsTable)
    .where(eq(userSkillsTable.userId, userId));

  const projects = await db
    .select()
    .from(userProjectsTable)
    .where(eq(userProjectsTable.userId, userId));

  const skillList = skills.map((s) => s.name).join(", ");
  const projectList = projects.map((p) => `"${p.name}" (${(p.skills || []).join(", ")})`).join("; ");

  const groundedEvidence = [
    `Profile: ${profile?.name || "Candidate"} targeting ${profile?.targetRole || "Software Engineering"}.`,
    `Active Skills (${skills.length}): ${skillList || "None added yet"}.`,
    `Portfolio Projects (${projects.length}): ${projectList || "None added yet"}.`,
  ];

  let reply = "";
  if (userMessage.includes("backend") || userMessage.includes("why")) {
    reply = `Based on your profile, your verified skills (${skillList || "tools"}) and projects demonstrate strong capability in service architecture and backend data flows. When paired with your portfolio evidence, backend and API-centric roles offer the clearest path to demonstrable technical impact.`;
  } else if (userMessage.includes("docker") || userMessage.includes("learn") || userMessage.includes("what if")) {
    reply = `If you develop Docker proficiency, your Skill DNA in DevOps will rise significantly. More importantly, it transforms your claimed project evidence into production-ready deployment proof, answering a primary recruiter concern for mid-to-senior positions.`;
  } else if (userMessage.includes("project") || userMessage.includes("proves")) {
    if (projects.length > 0) {
      reply = `Your project "${projects[0].name}" provides the strongest concrete evidence of your technical execution, especially in ${(projects[0].skills || []).join(", ") || "software design"}. Highlighting its architecture will serve you best in technical discussions.`;
    } else {
      reply = "You haven't added portfolio projects yet. Adding even one project with a live link or repository dramatically strengthens your verified evidence over self-reported skills.";
    }
  } else if (userMessage.includes("holding me back") || userMessage.includes("weakest")) {
    reply = `Looking at your evidence structure, the biggest lever is closing the gap between claimed skills and verified projects. Adding repository evidence for your core competencies will eliminate recruiter hesitation faster than adding more unverified skills.`;
  } else {
    reply = `I have analyzed your career evidence (${skills.length} skills, ${projects.length} projects, target role: ${profile?.targetRole || "Engineer"}). You have a solid foundation; focusing on verifiable portfolio evidence and tailored applications will yield the highest response rate.`;
  }

  const suggestedQuestions = [
    "Which of my projects best proves my ability?",
    "What would happen if I learned Docker and AWS?",
    "What is currently holding me back from my target direction?",
    "Why are you suggesting these specific career paths?",
  ];

  res.json(
    ChatCareerAgentResponse.parse({
      reply,
      groundedEvidence,
      suggestedQuestions,
    })
  );
});

export default router;
