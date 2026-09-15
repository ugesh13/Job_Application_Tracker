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
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, req.user!.uid)).limit(1);
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
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
  
  const [updated] = await db
    .insert(profilesTable)
    .values({
      userId: req.user!.uid,
      name: data.name || "User",
      email: data.email || "",
      role: data.role || "",
      targetRole: data.targetRole || "",
      location: data.location || "",
      avatarColor: data.avatarColor || "#C88B62",
      education: data.education ?? null,
      experienceYears: data.experienceYears ?? 0,
      careerGoal: data.careerGoal ?? null,
      bio: data.bio ?? null,
    })
    .onConflictDoUpdate({
      target: profilesTable.userId,
      set: {
        name: data.name ?? undefined,
        email: data.email ?? undefined,
        role: data.role ?? undefined,
        targetRole: data.targetRole ?? undefined,
        location: data.location ?? undefined,
        avatarColor: data.avatarColor ?? undefined,
        education: data.education ?? undefined,
        experienceYears: data.experienceYears ?? undefined,
        careerGoal: data.careerGoal ?? undefined,
        bio: data.bio ?? undefined,
      },
    })
    .returning();

  res.json(UpdateProfileResponse.parse(serializeProfile(updated)));
});

export default router;