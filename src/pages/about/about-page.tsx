import { useTranslation } from 'react-i18next';

import { JOB_CLASSES, getJobSprites } from '@shared/constants/jobs';

const LANGUAGE_DISPLAY: { key: string; label: string }[] = [
  { key: 'python', label: 'Python' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'java', label: 'Java' },
  { key: 'kotlin', label: 'Kotlin' },
  { key: 'swift', label: 'Swift' },
  { key: 'c++', label: 'C++' },
  { key: 'csharp', label: 'C#' },
  { key: 'go', label: 'Go' },
  { key: 'rust', label: 'Rust' },
  { key: 'php', label: 'PHP' },
  { key: 'ruby', label: 'Ruby' },
];

const STEP_KEYS = ['step1', 'step2', 'step3'] as const;
const STEP_ICONS = ['I', 'II', 'III'] as const;

const SYNC_NOTE_KEYS = [
  { key: 'repoLimit', icon: '📦' },
  { key: 'ownerOnly', icon: '👤' },
  { key: 'languageDetection', icon: '🔍' },
  { key: 'levelCalc', icon: '⚔' },
  { key: 'manualSync', icon: '🔄' },
  { key: 'privateRepos', icon: '🔒' },
  { key: 'autoEquip', icon: '🛡' },
] as const;

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="dungeon-bg relative mx-auto max-w-5xl select-none px-4 py-6">
      {/* Page Title */}
      <header className="mb-10 text-center">
        <h1
          className="section-title mb-4 font-pixel text-xl text-primary"
          id="about-title"
        >
          <span className="text-primary/40">◆</span>
          <span>{t('about.title')}</span>
          <span className="text-primary/40">◆</span>
        </h1>
        <p className="mx-auto max-w-2xl font-mono text-xs leading-relaxed text-muted-foreground md:text-sm">
          {t('about.intro')}
        </p>
      </header>

      {/* How it Works */}
      <section className="mb-12" aria-labelledby="how-it-works-title">
        <h2
          className="section-title mb-6 font-pixel text-base text-primary"
          id="how-it-works-title"
        >
          <span className="text-primary/40">◆</span>
          <span>{t('about.howItWorks.title')}</span>
          <span className="text-primary/40">◆</span>
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {STEP_KEYS.map((stepKey, i) => (
            <article
              key={stepKey}
              className="border-2 border-secondary border-t-primary/30 bg-card/50 p-5"
              style={{ boxShadow: 'inset 0 1px 8px rgba(0,0,0,0.3)' }}
            >
              {/* Step number */}
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center border-2 border-primary/30 bg-primary/10 font-pixel text-xs text-primary"
                  aria-hidden="true"
                >
                  {STEP_ICONS[i]}
                </span>
                <h3 className="font-pixel text-xs text-primary">
                  {t(`about.howItWorks.${stepKey}.title`)}
                </h3>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                {t(`about.howItWorks.${stepKey}.description`)}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Sync Notes */}
      <section className="mb-12" aria-labelledby="sync-notes-title">
        <h2
          className="section-title mb-2 font-pixel text-base text-primary"
          id="sync-notes-title"
        >
          <span className="text-primary/40">◆</span>
          <span>{t('about.syncNotes.title')}</span>
          <span className="text-primary/40">◆</span>
        </h2>
        <p className="mb-6 text-center font-mono text-[11px] text-muted-foreground">
          {t('about.syncNotes.description')}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {SYNC_NOTE_KEYS.map(({ key, icon }) => (
            <article
              key={key}
              className="flex items-start gap-3 border-2 border-secondary border-t-primary/30 bg-card/50 p-4"
              style={{ boxShadow: 'inset 0 1px 8px rgba(0,0,0,0.3)' }}
            >
              <span
                className="mt-0.5 shrink-0 font-pixel text-[10px] text-primary/40"
                aria-hidden="true"
              >
                {icon}
              </span>
              <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
                {t(`about.syncNotes.items.${key}`)}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Job Classes */}
      <section aria-labelledby="job-classes-title">
        <h2
          className="section-title mb-2 font-pixel text-base text-primary"
          id="job-classes-title"
        >
          <span className="text-primary/40">◆</span>
          <span>{t('about.jobClasses.title')}</span>
          <span className="text-primary/40">◆</span>
        </h2>
        <p className="mb-6 text-center font-mono text-[11px] text-muted-foreground">
          {t('about.jobClasses.description')}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGE_DISPLAY.map(({ key, label }) => {
            const job = JOB_CLASSES[key];
            if (!job) return null;

            const sprites = getJobSprites(key);

            return (
              <article
                key={key}
                className="flex items-start gap-4 border-2 border-secondary border-t-primary/30 bg-card/50 p-4"
                style={{ boxShadow: 'inset 0 1px 8px rgba(0,0,0,0.3)' }}
              >
                {/* Character sprite */}
                <figure className="shrink-0">
                  <img
                    src={sprites.standing}
                    alt={t(`jobs.${key}.name`)}
                    className="h-16 w-16 object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </figure>

                {/* Job info */}
                <div className="min-w-0 flex-1">
                  {/* Job name + language tag */}
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`font-pixel text-xs ${job.color}`}>
                      {t(`jobs.${key}.name`)}
                    </span>
                    <span className="border border-primary/20 bg-primary/5 px-1.5 py-0.5 font-mono text-[8px] text-primary/60">
                      {label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mb-1.5 font-mono text-[10px] leading-relaxed text-muted-foreground">
                    {t(`jobs.${key}.description`)}
                  </p>

                  {/* Weapon */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-pixel text-[8px] text-primary/30"
                      aria-hidden="true"
                    >
                      ⚔
                    </span>
                    <span className="font-mono text-[9px] text-primary/50">
                      {t(`jobs.${key}.weapon`)}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
