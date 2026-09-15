import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import {
  db,
  jobsTable,
  profilesTable,
  userProjectsTable,
  userSkillsTable,
} from "@workspace/db";
import { GetJobFitScoreResponse, GetJobParams } from "@workspace/api-zod";
import { AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

// Common skill dictionary for keyword extraction if skills_required is empty
const COMMON_SKILLS = [
  "React", "TypeScript", "JavaScript", "Next.js", "Node.js", "Python",
  "TailwindCSS", "CSS", "HTML", "GraphQL", "PostgreSQL", "SQL", "MongoDB",
  "AWS", "Docker", "Git", "Figma", "UI/UX", "User Research", "Wireframing",
  "Design Systems", "Prototyping", "Product Strategy", "Agile", "Scrum",
  "REST API", "CI/CD", "Testing", "Jest", "Vue.js", "Angular", "Express",
  "Redux", "Data Analysis", "Communication", "Leadership"
];

function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase();
  return COMMON_SKILLS.filter((skill) =>
    normalized.includes(skill.toLowerCase())
  );
}

router.get("/jobs/:id/fit-score", async (req: AuthenticatedRequest, res): Promise<void> => {
  const params = GetJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const userId = req.user!.uid;

  // 1. Fetch Job
  const [job] = await db
    .select()
    .from(jobsTable)
    .where(and(eq(jobsTable.id, params.data.id), eq(jobsTable.userId, userId)));

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  // 2. Fetch User Profile, Skills, Projects
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

  // Determine required skills from job
  let requiredSkills = job.skillsRequired || [];
  if (requiredSkills.length === 0) {
    const combinedText = `${job.title} ${job.description || ""} ${job.industry || ""}`;
    requiredSkills = extractKeywords(combinedText);
    if (requiredSkills.length === 0) {
      // Default common set if none detected
      requiredSkills = ["Communication", "Problem Solving", "Collaboration"];
    }
  }

  const userSkillNames = skills.map((s) => s.name.trim().toLowerCase());

  // Calculate matching & missing skills
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const reqSkill of requiredSkills) {
    const isMatched = userSkillNames.some(
      (uSkill) =>
        uSkill.includes(reqSkill.toLowerCase()) ||
        reqSkill.toLowerCase().includes(uSkill),
    );
    if (isMatched) {
      matchingSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  }

  // 3. Skill match score (0 - 55)
  const skillRatio = requiredSkills.length > 0
    ? matchingSkills.length / requiredSkills.length
    : 1;
  const skillScore = Math.round(skillRatio * 55);

  // 4. Role alignment score (0 - 20)
  let roleScore = 10;
  if (profile?.targetRole) {
    const target = profile.targetRole.toLowerCase();
    const title = job.title.toLowerCase();
    if (title.includes(target) || target.includes(title)) {
      roleScore = 20;
    } else {
      const words = target.split(/\s+/);
      const matchWord = words.some((w) => w.length > 3 && title.includes(w));
      roleScore = matchWord ? 16 : 8;
    }
  }

  // 5. Experience alignment (0 - 15)
  let expScore = 10;
  const userYears = profile?.experienceYears ?? 0;
  const level = job.experienceLevel.toLowerCase();
  if (level.includes("entry") || level.includes("junior")) {
    expScore = 15;
  } else if (level.includes("mid")) {
    expScore = userYears >= 2 ? 15 : 10;
  } else if (level.includes("senior") || level.includes("lead")) {
    expScore = userYears >= 4 ? 15 : 6;
  }

  // 6. Matching projects (0 - 10)
  const matchingProjects = projects
    .map((proj) => {
      const projSkills = (proj.skills || []).map((s) => s.toLowerCase());
      const matched = requiredSkills.filter((reqSkill) =>
        projSkills.some((pSkill) => pSkill.includes(reqSkill.toLowerCase())),
      );
      const score = requiredSkills.length > 0
        ? Math.round((matched.length / requiredSkills.length) * 100)
        : 50;
      return {
        id: proj.id,
        name: proj.name,
        matchScore: score,
        matchingSkills: matched,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const projectScore = matchingProjects.length > 0 && matchingProjects[0].matchScore > 0
    ? Math.min(10, Math.round((matchingProjects[0].matchScore / 100) * 10))
    : (projects.length > 0 ? 5 : 0);

  const overallScore = Math.min(100, Math.max(15, skillScore + roleScore + expScore + projectScore));

  let recommendation: string;
  if (overallScore >= 80) {
    recommendation = "Strong Match";
  } else if (overallScore >= 60) {
    recommendation = "Good Match";
  } else if (overallScore >= 40) {
    recommendation = "Stretch Role";
  } else {
    recommendation = "Not Recommended";
  }

  // Generate improvement tips
  const improvementTips: string[] = [];
  if (missingSkills.length > 0) {
    improvementTips.push(`Add or upskill in ${missingSkills.slice(0, 2).join(" & ")} to increase your match.`);
  }
  if (matchingProjects.length === 0) {
    improvementTips.push("Create a portfolio project highlighting relevant technologies for this role.");
  } else if (matchingProjects[0].matchScore < 50) {
    improvementTips.push(`Feature project "${matchingProjects[0].name}" but tailor its description to emphasize ${job.title} competencies.`);
  }
  if (!job.resumeVersion) {
    improvementTips.push("Assign a tailored resume version before applying to maximize recruiter response.");
  }
  if (improvementTips.length === 0) {
    improvementTips.push("Your profile is well-aligned! Mention specific measurable impacts in your application.");
  }

  // Readiness score (based on completed prep)
  let readiness = 40;
  if (matchingSkills.length > 0) readiness += 25;
  if (job.resumeVersion) readiness += 15;
  if (matchingProjects.length > 0) readiness += 15;
  if (job.notes && job.notes.length > 20) readiness += 5;
  readiness = Math.min(100, readiness);

  const responseData = {
    jobId: job.id,
    overallScore,
    recommendation,
    matchingSkills,
    missingSkills,
    matchingProjects,
    improvementTips,
    readinessScore: readiness,
  };

  res.json(GetJobFitScoreResponse.parse(responseData));
});

export default router;
