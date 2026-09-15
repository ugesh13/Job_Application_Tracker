import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
import {
  GetProfileResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
} from "@workspace/api-zod";

import { AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

let profileSeedPromise: Promise<void> | undefined;
const ensureProfileSeed = () => {
  return Promise.resolve();
};

const serializeProfile = (profile: typeof profilesTable.$inferSelect) => ({
  ...profile,
  education: profile.education ?? null,
  experienceYears: profile.experienceYears ?? 0,
  careerGoal: profile.careerGoal ?? null,
  bio: profile.bio ?? null,
  initials: (profile.name || "U")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
});

router.get("/profile", async (req: AuthenticatedRequest, res): Promise<void> => {
  await ensureProfileSeed();
  let [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, req.user!.uid))
    .limit(1);

  if (!profile) {
    const initialName = req.user?.email ? req.user.email.split("@")[0] : "Candidate";
    const [created] = await db
      .insert(profilesTable)
      .values({
        userId: req.user!.uid,
        name: initialName,
        email: req.user?.email || "",
        role: "Software Professional",
        targetRole: "Full Stack Engineer",
        location: "Remote / Hybrid",
        avatarColor: "#47766c",
        education: "Bachelor's Degree",
        experienceYears: 2,
        careerGoal: "Accelerate career growth into high-impact roles",
        bio: "",
      })
      .onConflictDoNothing()
      .returning();

    profile = created || (await db.select().from(profilesTable).where(eq(profilesTable.userId, req.user!.uid)).limit(1))[0];
  }

  res.json(GetProfileResponse.parse(serializeProfile(profile)));
});

router.patch("/profile", async (req: AuthenticatedRequest, res): Promise<void> => {
  await ensureProfileSeed();
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  
  const data = parsed.data;

  const updateSet: Record<string, any> = {};
  if (typeof data.name === "string" && data.name.trim().length > 0) updateSet.name = data.name.trim();
  if (typeof data.email === "string") updateSet.email = data.email.trim();
  if (typeof data.role === "string") updateSet.role = data.role.trim();
  if (typeof data.targetRole === "string") updateSet.targetRole = data.targetRole.trim();
  if (typeof data.location === "string") updateSet.location = data.location.trim();
  if (typeof data.avatarColor === "string") updateSet.avatarColor = data.avatarColor;
  if (data.education !== undefined) updateSet.education = data.education;
  if (data.experienceYears !== undefined) updateSet.experienceYears = Number(data.experienceYears);
  if (data.careerGoal !== undefined) updateSet.careerGoal = data.careerGoal;
  if (data.bio !== undefined) updateSet.bio = data.bio;
  
  const [updated] = await db
    .insert(profilesTable)
    .values({
      userId: req.user!.uid,
      name: (data.name && data.name.trim()) || "Candidate",
      email: data.email || req.user?.email || "",
      role: data.role || "Software Professional",
      targetRole: data.targetRole || "Full Stack Engineer",
      location: data.location || "Remote",
      avatarColor: data.avatarColor || "#47766c",
      education: data.education ?? null,
      experienceYears: data.experienceYears ?? 0,
      careerGoal: data.careerGoal ?? null,
      bio: data.bio ?? null,
    })
    .onConflictDoUpdate({
      target: profilesTable.userId,
      set: Object.keys(updateSet).length > 0 ? updateSet : { name: data.name || "Candidate" },
    })
    .returning();

  res.json(UpdateProfileResponse.parse(serializeProfile(updated)));
});

export default router;