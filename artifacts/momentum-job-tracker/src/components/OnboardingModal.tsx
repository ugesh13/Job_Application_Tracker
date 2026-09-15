import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetProfileQueryKey,
  getListSkillsQueryKey,
  useCreateSkill,
  useUpdateProfile,
  type Profile,
} from '@workspace/api-client-react';
import {
  Briefcase,
  Check,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Target,
  Wand2,
  X,
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'TailwindCSS',
  'PostgreSQL', 'Figma', 'UI/UX Design', 'Next.js', 'GraphQL',
  'REST APIs', 'Git', 'Docker', 'System Design'
];

interface OnboardingModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ profile, isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const qc = useQueryClient();
  const updateProfile = useUpdateProfile();
  const createSkill = useCreateSkill();

  const [careerGoal, setCareerGoal] = useState(profile.careerGoal || 'Full Stack Engineer');
  const [targetRole, setTargetRole] = useState(profile.targetRole || 'Full Stack Developer');
  const [education, setEducation] = useState(profile.education || 'B.Tech / Bachelor of Science');
  const [experienceYears, setExperienceYears] = useState(profile.experienceYears || 2);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'TypeScript', 'TailwindCSS']);
  const [customSkill, setCustomSkill] = useState('');

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleFinish = async () => {
    // 1. Update Profile
    await updateProfile.mutateAsync({
      data: {
        careerGoal,
        targetRole,
        education,
        experienceYears: Number(experienceYears),
      },
    });

    // 2. Add selected skills
    for (const skill of selectedSkills) {
      try {
        await createSkill.mutateAsync({
          data: {
            name: skill,
            proficiency: 'intermediate',
            yearsExperience: Number(experienceYears),
          },
        });
      } catch {
        // Continue if already exists
      }
    }

    qc.invalidateQueries({ queryKey: getGetProfileQueryKey() });
    qc.invalidateQueries({ queryKey: getListSkillsQueryKey() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-primary">
            <Sparkles size={16} /> AI Career OS Setup
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step progress pills */}
        <div className="mt-5 flex gap-2">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>

        {step === 1 && (
          <div className="mt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Target size={20} />
            </div>
            <h3 className="mt-3 font-display text-[22px]">What is your career focus?</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Momentum matches opportunities, analyzes skill gaps, and prepares applications tailored to your target trajectory.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Target Role
                </label>
                <input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="mt-1 w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Career Goal
                </label>
                <input
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Transition into high-scale AI products"
                  className="mt-1 w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Highest Education
                  </label>
                  <input
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    className="mt-1 w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-foreground"
              >
                Next: Select Core Skills <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Wand2 size={20} />
            </div>
            <h3 className="mt-3 font-display text-[22px]">Select your core skills</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              These skills power live fit calculations and show which roles are worth your time.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTED_SKILLS.map((skill) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                      active
                        ? 'border border-primary bg-primary text-primary-foreground'
                        : 'border border-border bg-card text-foreground hover:border-primary/50'
                    }`}
                  >
                    {active && <Check size={13} />} {skill}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                placeholder="Add another skill…"
                className="min-w-0 flex-1 rounded-xl border border-input bg-card px-3.5 py-2 text-[13px] outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="rounded-xl border border-border px-3.5 py-2 text-[12px] font-bold hover:bg-muted"
              >
                Add
              </button>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-border px-4 py-2.5 text-[13px] font-semibold text-muted-foreground hover:bg-muted"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={updateProfile.isPending || selectedSkills.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-primary-foreground disabled:opacity-60"
              >
                <Sparkles size={15} /> Launch Career OS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
