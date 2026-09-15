import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetProfileQueryKey,
  getListProjectsQueryKey,
  getListSkillsQueryKey,
  useCreateProject,
  useCreateSkill,
  useDeleteProject,
  useDeleteSkill,
  useGetProfile,
  useListProjects,
  useListSkills,
  useUpdateProfile,
  type Profile,
  type Project,
  type Skill,
} from '@workspace/api-client-react';
import {
  Briefcase,
  Check,
  ExternalLink,
  FolderGit2,
  Goal,
  GraduationCap,
  Plus,
  Sparkles,
  Trash2,
  User,
  Wrench,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, PageTitle, Field } from '../components/shared';
import { fallbackProfile } from '../lib/constants';

export default function SettingsPage() {
  const profileQuery = useGetProfile();
  const profile = (profileQuery.data as Profile | undefined) ?? fallbackProfile;
  const updateProfile = useUpdateProfile();

  const skillsQuery = useListSkills();
  const skills = (skillsQuery.data as Skill[] | undefined) ?? [];
  const createSkill = useCreateSkill();
  const deleteSkill = useDeleteSkill();

  const projectsQuery = useListProjects();
  const projects = (projectsQuery.data as Project[] | undefined) ?? [];
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const qc = useQueryClient();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'projects'>('profile');

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: profile.name || '',
    role: profile.role || '',
    targetRole: profile.targetRole || '',
    location: profile.location || '',
    education: profile.education || '',
    experienceYears: profile.experienceYears || 0,
    careerGoal: profile.careerGoal || '',
    bio: profile.bio || '',
  });
  const [saved, setSaved] = useState(false);

  // Skill Form state
  const [skillName, setSkillName] = useState('');
  const [skillProficiency, setSkillProficiency] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [skillYears, setSkillYears] = useState(1);

  // Project Form state
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectSkills, setProjectSkills] = useState('');

  const saveProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(
      {
        data: {
          ...profileForm,
          experienceYears: Number(profileForm.experienceYears),
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetProfileQueryKey() });
          setSaved(true);
          setTimeout(() => setSaved(false), 2600);
        },
      },
    );
  };

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    createSkill.mutate(
      {
        data: {
          name: skillName.trim(),
          proficiency: skillProficiency,
          yearsExperience: Number(skillYears),
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListSkillsQueryKey() });
          setSkillName('');
        },
      },
    );
  };

  const handleDeleteSkill = (id: number) => {
    deleteSkill.mutate(
      { id },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListSkillsQueryKey() });
        },
      },
    );
  };

  const handleAddProject = (e: FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const skillsArray = projectSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createProject.mutate(
      {
        data: {
          name: projectName.trim(),
          description: projectDesc.trim() || undefined,
          url: projectUrl.trim() || undefined,
          skills: skillsArray,
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
          setProjectName('');
          setProjectDesc('');
          setProjectUrl('');
          setProjectSkills('');
          setShowAddProject(false);
        },
      },
    );
  };

  const handleDeleteProject = (id: number) => {
    deleteProject.mutate(
      { id },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        },
      },
    );
  };

  return (
    <>
      <PageTitle
        eyebrow="Career Operating System"
        title="Career Profile & Settings"
        intro="Tailor your profile, skills, and portfolio projects to power automated role matching and application readiness."
      />

      {saved && (
        <div
          role="status"
          data-testid="status-profile-saved"
          className="mb-5 flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-[13px] font-semibold text-accent"
        >
          <Check size={16} /> Profile updated successfully.
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-border/70 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold transition ${
            activeTab === 'profile'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <User size={15} /> Profile & Goals
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold transition ${
            activeTab === 'skills'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Wrench size={15} /> Skills Portfolio ({skills.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold transition ${
            activeTab === 'projects'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <FolderGit2 size={15} /> Projects Showcase ({projects.length})
        </button>
      </div>

      {/* TAB 1: Profile & Goals */}
      {activeTab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <section className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-4">
              <Avatar profile={profile} />
              <div>
                <h2 className="font-display text-[24px]">{profile.name}</h2>
                <p className="mt-1 text-[12px] text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-primary/7 p-4">
              <div className="flex items-center gap-2 text-[11px] font-bold text-primary">
                <Goal size={15} /> Career Focus
              </div>
              <p className="mt-2 text-[13px] font-semibold text-foreground">
                {profile.careerGoal || 'Add your target trajectory in the form.'}
              </p>
            </div>

            <div className="mt-6 space-y-3 text-[12px] text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Target Role</span>
                <span className="font-semibold text-foreground">{profile.targetRole || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Experience</span>
                <span className="font-semibold text-foreground">{profile.experienceYears || 0} years</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Education</span>
                <span className="font-semibold text-foreground">{profile.education || 'Not specified'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verified Skills</span>
                <span className="font-mono-ui font-semibold text-primary">{skills.length} skills</span>
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <button
                type="button"
                onClick={logout}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-[13px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Log out of workspace
              </button>
            </div>
          </section>

          <form onSubmit={saveProfile} className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <div className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">
              Personalized Intelligence
            </div>
            <h2 className="mt-1 font-display text-[26px]">Career Details</h2>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your full name">
                  <input
                    data-testid="input-profile-name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </Field>
                <Field label="Current / Past title">
                  <input
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    placeholder="e.g. Software Engineer"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Target role">
                  <input
                    data-testid="input-profile-target-role"
                    value={profileForm.targetRole}
                    onChange={(e) => setProfileForm({ ...profileForm, targetRole: e.target.value })}
                    placeholder="e.g. Senior Full Stack Engineer"
                  />
                </Field>
                <Field label="Location preference">
                  <input
                    data-testid="input-profile-location"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="e.g. Remote / Bengaluru"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Years of experience">
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={profileForm.experienceYears}
                    onChange={(e) => setProfileForm({ ...profileForm, experienceYears: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Education / Degree">
                  <input
                    value={profileForm.education}
                    onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                    placeholder="e.g. B.Tech in Computer Science"
                  />
                </Field>
              </div>

              <Field label="Career Objective & North Star">
                <input
                  value={profileForm.careerGoal}
                  onChange={(e) => setProfileForm({ ...profileForm, careerGoal: e.target.value })}
                  placeholder="e.g. Build scalable generative AI and cloud software products"
                />
              </Field>

              <Field label="Bio / Elevator Pitch">
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Brief summary of your expertise, strengths, and what sets you apart…"
                  className="w-full rounded-xl border border-input bg-card p-3 text-[13px] outline-none focus:border-primary"
                />
              </Field>
            </div>

            <div className="mt-8 flex justify-end border-t border-border pt-6">
              <button
                type="submit"
                data-testid="button-save-profile"
                disabled={updateProfile.isPending}
                className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-primary-foreground disabled:opacity-60"
              >
                {updateProfile.isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Skills Portfolio */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <form onSubmit={handleAddSkill} className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <div className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
              AI Matching Engine
            </div>
            <h3 className="mt-1 font-display text-[22px]">Add a verified skill</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Skills are compared against job listings to compute your instant Fit Score and Skill Gaps.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1.5fr_1fr_1fr_auto]">
              <input
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="Skill name (e.g. React, Python, Docker)"
                className="rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
              />
              <select
                value={skillProficiency}
                onChange={(e) => setSkillProficiency(e.target.value as any)}
                className="rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <input
                type="number"
                min={0}
                max={30}
                value={skillYears}
                onChange={(e) => setSkillYears(Number(e.target.value))}
                placeholder="Years exp"
                className="rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={createSkill.isPending || !skillName.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-foreground disabled:opacity-60"
              >
                <Plus size={16} /> Add Skill
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <h3 className="font-display text-[20px]">Your Active Skills ({skills.length})</h3>
            {skills.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
                No skills added yet. Add your core tools and technologies above!
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 p-3.5"
                  >
                    <div>
                      <div className="font-bold text-foreground">{skill.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="capitalize text-primary font-semibold">{skill.proficiency}</span>
                        <span>•</span>
                        <span>{skill.yearsExperience}y exp</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Projects Showcase */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-[24px]">Portfolio Projects</h3>
              <p className="text-[13px] text-muted-foreground">
                Momentum matches your projects to job criteria so you can prove competence with tangible work.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddProject(!showAddProject)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground"
            >
              <Plus size={16} /> Add Project
            </button>
          </div>

          {showAddProject && (
            <form onSubmit={handleAddProject} className="rounded-2xl border border-primary/25 bg-card p-6 shadow-md">
              <h4 className="font-display text-[20px]">New Portfolio Project</h4>
              <div className="mt-4 space-y-3">
                <input
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Project name (e.g. AI Workflow Platform)"
                  className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
                />
                <textarea
                  rows={2}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Brief description of what it does, architecture, and impact…"
                  className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
                />
                <input
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="Project URL or GitHub link (e.g. https://github.com/...)"
                  className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
                />
                <input
                  value={projectSkills}
                  onChange={(e) => setProjectSkills(e.target.value)}
                  placeholder="Skills & tools used, comma-separated (e.g. React, TypeScript, Node.js, PostgreSQL)"
                  className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
                />
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="rounded-xl px-4 py-2 text-[13px] font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProject.isPending || !projectName.trim()}
                  className="rounded-xl bg-primary px-5 py-2 text-[13px] font-bold text-primary-foreground disabled:opacity-60"
                >
                  Save Project
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {projects.length === 0 ? (
              <div className="col-span-2 rounded-2xl border border-dashed border-border p-10 text-center text-[13px] text-muted-foreground">
                No projects added yet. Click &quot;Add Project&quot; above to showcase your projects for role matching.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col justify-between rounded-2xl border border-card-border bg-card p-5 shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-[16px] text-foreground">{project.name}</h4>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-1 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                    {project.description && (
                      <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                        {project.description}
                      </p>
                    )}
                    {project.skills && project.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-md bg-primary/8 px-2 py-0.5 text-[11px] font-semibold text-primary"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex justify-end border-t border-border/60 pt-3">
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(project.id)}
                      className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
