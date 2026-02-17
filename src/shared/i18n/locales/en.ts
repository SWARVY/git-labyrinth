const en = {
  sync: {
    idle: "Sync Characters",
    pending: "Syncing...",
  },
  auth: {
    logout: "Logout",
  },
  myCard: {
    description: "Paste the markdown below into your GitHub README",
  },
  character: {
    equip: "Equip",
  },
  stats: {
    hp: {
      title: "HP — VITALITY",
      streak: "{{current}}d streak / best {{best}}d",
    },
    status: {
      hollow: "HOLLOW",
      ember: "EMBER",
      kindled: "KINDLED",
      blazing: "BLAZING",
    },
    hpBar: "{{status}} — {{current}} / 365",
    main: "MAIN",
    retry: "Retry",
    tooltip: {
      vit: "Vitality — Consecutive commit days ({{current}} / 365d, scaled to 100)",
      cha: "Charisma — GitHub followers (Max 1,000, scaled to 100)",
      wis: "Wisdom — Account age in days ({{days}} / 3,650d, scaled to 100)",
      str: "Strength — Total contributions in the last year (Max 5,000, scaled to 100)",
      agi: "Agility — Repositories contributed to (Max 50, scaled to 100)",
    },
  },
  nav: {
    about: "About",
  },
  about: {
    title: "About Git Labyrinth",
    intro:
      "Your GitHub activity awakens as a pixel hero in the dungeon. Every commit, every repository, every line of code shapes a character that represents your journey as a developer.",
    howItWorks: {
      title: "How it Works",
      step1: {
        title: "Link Your GitHub",
        description:
          "Sign in with your GitHub account to begin your adventure. Your coding history becomes the foundation of your character.",
      },
      step2: {
        title: "Characters Awaken",
        description:
          "Your repositories are analyzed and transformed into RPG characters. Each programming language determines your class, level, and abilities.",
      },
      step3: {
        title: "Share Your Card",
        description:
          "Generate an OG image card featuring your pixel heroes and embed it in your GitHub README to showcase your developer identity.",
      },
    },
    jobClasses: {
      title: "Job Classes",
      description:
        "Each programming language forges a unique warrior. Your most-used languages determine which heroes join your party.",
    },
    backToHome: "Back to Home",
    syncNotes: {
      title: "Sync Notes",
      description:
        "Character sync analyzes your GitHub repositories to create and update your RPG characters. Here are some things to keep in mind.",
      items: {
        repoLimit:
          "Up to 100 of your most recently updated repositories are analyzed. Older repos beyond this limit are not included.",
        ownerOnly:
          "Only repositories you own are scanned. Repos where you are a collaborator or contributor (but not the owner) are excluded.",
        languageDetection:
          "Language detection relies on GitHub's Linguist library. Some files may be classified differently than expected.",
        levelCalc:
          "Character level is determined by total bytes written in each language: Lv.1 (<10KB), Lv.2 (10KB+), Lv.3 (50KB+), Lv.4 (200KB+), Lv.5 (1MB+).",
        manualSync:
          'Sync is manual — press the "Sync Characters" button to refresh. Characters are not updated automatically.',
        privateRepos:
          "Only public repositories are analyzed. Private repositories are not accessed. Your GitHub token is never stored on our server — it exists only in the current session for security.",
        autoEquip:
          "After syncing, the highest-level unlocked character is auto-equipped if you have no character equipped or your current one becomes locked.",
      },
    },
  },
  jobs: {
    python: {
      name: "Summoner",
      description: "Call upon powerful libraries to aid you.",
      weapon: "Staff of Pythons",
    },
    javascript: {
      name: "Bard",
      description: "Weave magic into the browser DOM.",
      weapon: "Electric Lute",
    },
    typescript: {
      name: "Paladin",
      description: "Defender of Type Safety.",
      weapon: "Shield of Interface",
    },
    java: {
      name: "Knight",
      description: "The heavy armor of the Enterprise.",
      weapon: "Greatsword",
    },
    kotlin: {
      name: "Ranger",
      description: "Swift precision with Null Safety.",
      weapon: "Composite Bow",
    },
    swift: {
      name: "Rogue",
      description: "Strike fast, strike elegant.",
      weapon: "Twin Daggers",
    },
    "c++": {
      name: "Berserker",
      description: "Raw power at the cost of control.",
      weapon: "Giant Axe",
    },
    csharp: {
      name: "Spellsword",
      description: "Master of Windows and Games.",
      weapon: "Runeblade",
    },
    go: {
      name: "Monk",
      description: "Simplicity and Concurrency master.",
      weapon: "Iron Fists",
    },
    rust: {
      name: "Blacksmith",
      description: "Forging memory-safe steel.",
      weapon: "Forge Hammer",
    },
    php: {
      name: "Necromancer",
      description: "Undying lord of the Legacy Web.",
      weapon: "Bone Scythe",
    },
    ruby: {
      name: "Alchemist",
      description: "Transmuting Gems into happiness.",
      weapon: "Philosopher Stone",
    },
    novice: {
      name: "Novice",
      description: "A beginner starting their journey.",
      weapon: "Wooden Stick",
    },
    default: {
      name: "Adventurer",
      description: "A wandering coder seeking a path.",
      weapon: "Rusty Sword",
    },
  },
} as const;

export default en;
