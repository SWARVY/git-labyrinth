const GITHUB_PROFILE_URL = 'https://github.com/SWARVY';
const GITHUB_REPO_URL = 'https://github.com/SWARVY/persona';

export function AppFooter() {
  return (
    <footer className="relative z-10 mx-auto max-w-5xl select-none px-4 pb-6 pt-10">
      <div className="border-t border-primary/10 pt-4">
        <div className="flex items-center justify-between font-pixel text-[9px] text-muted-foreground/40">
          <span>&copy; 2026 Git Labyrinth</span>
          <nav className="flex items-center gap-3" aria-label="Footer links">
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary/60"
            >
              @SWARVY
            </a>
            <span className="text-primary/20" aria-hidden="true">
              ◆
            </span>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary/60"
            >
              Repository
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
