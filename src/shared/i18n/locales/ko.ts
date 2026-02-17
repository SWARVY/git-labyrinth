const ko = {
  sync: {
    idle: "캐릭터 동기화",
    pending: "동기화 중...",
  },
  auth: {
    logout: "로그아웃",
  },
  myCard: {
    description: "GitHub README에 아래 마크다운을 붙여넣으세요",
  },
  character: {
    equip: "장착",
  },
  stats: {
    hp: {
      title: "HP — 생명력",
      streak: "{{current}}일 연속 / 최고 {{best}}일",
    },
    status: {
      hollow: "소멸",
      ember: "잔불",
      kindled: "점화",
      blazing: "맹렬",
    },
    hpBar: "{{status}} — {{current}} / 365",
    main: "특기",
    retry: "다시 시도",
    tooltip: {
      vit: "생명력 — 연속 커밋 일수 ({{current}} / 365일 → 100점 환산)",
      cha: "매력 — GitHub 팔로워 수 (최대 1,000명 → 100점 환산)",
      wis: "지혜 — 계정 생존 일수 ({{days}} / 3,650일 → 100점 환산)",
      str: "힘 — 지난 1년 총 기여 수 (최대 5,000 → 100점 환산)",
      agi: "민첩 — 기여한 리포지토리 수 (최대 50개 → 100점 환산)",
    },
  },
  nav: {
    about: "소개",
  },
  about: {
    title: "Git Labyrinth 소개",
    intro:
      "GitHub 활동이 던전 속 픽셀 영웅으로 깨어납니다. 커밋 하나하나, 저장소 하나하나, 코드 한 줄 한 줄이 개발자로서의 여정을 담은 캐릭터를 만들어갑니다.",
    howItWorks: {
      title: "이용 방법",
      step1: {
        title: "GitHub 연동",
        description:
          "GitHub 계정으로 로그인하여 모험을 시작하세요. 코딩 이력이 캐릭터의 토대가 됩니다.",
      },
      step2: {
        title: "캐릭터 각성",
        description:
          "리포지토리를 분석하여 RPG 캐릭터로 변환합니다. 사용한 프로그래밍 언어에 따라 직업, 레벨, 능력이 결정됩니다.",
      },
      step3: {
        title: "카드 공유",
        description:
          "픽셀 영웅이 담긴 OG 이미지 카드를 생성하고, GitHub README에 삽입하여 개발자 정체성을 드러내세요.",
      },
    },
    jobClasses: {
      title: "직업 목록",
      description:
        "각 프로그래밍 언어는 고유한 전사를 빚어냅니다. 가장 많이 사용한 언어가 파티에 합류할 영웅을 결정합니다.",
    },
    backToHome: "홈으로 돌아가기",
    syncNotes: {
      title: "동기화 안내",
      description:
        "캐릭터 동기화는 GitHub 리포지토리를 분석하여 RPG 캐릭터를 생성·갱신합니다. 아래 사항을 참고해 주세요.",
      items: {
        repoLimit:
          "최근 업데이트된 리포지토리 최대 100개만 분석됩니다. 이를 초과하는 오래된 리포지토리는 반영되지 않습니다.",
        ownerOnly:
          "본인이 소유한 리포지토리만 대상입니다. 협업자(Collaborator)로 참여 중인 타인의 리포지토리는 포함되지 않습니다.",
        languageDetection:
          "언어 감지는 GitHub의 Linguist 라이브러리에 의존합니다. 일부 파일은 예상과 다르게 분류될 수 있습니다.",
        levelCalc:
          "캐릭터 레벨은 해당 언어의 총 바이트 수로 결정됩니다: Lv.1 (10KB 미만), Lv.2 (10KB 이상), Lv.3 (50KB 이상), Lv.4 (200KB 이상), Lv.5 (1MB 이상).",
        manualSync:
          '동기화는 수동입니다. "캐릭터 동기화" 버튼을 눌러야 갱신되며, 자동으로 업데이트되지 않습니다.',
        privateRepos:
          "공개 리포지토리만 분석 대상입니다. 비공개 리포지토리에는 접근하지 않습니다. 보안을 위해 GitHub 토큰은 서버에 저장되지 않으며, 현재 세션에서만 유효합니다.",
        autoEquip:
          "동기화 후, 장착된 캐릭터가 없거나 기존 캐릭터가 잠기면 가장 높은 레벨의 캐릭터가 자동으로 장착됩니다.",
      },
    },
  },
  jobs: {
    python: {
      name: "소환사",
      description: "수많은 라이브러리를 불러내 전장을 지배한다.",
      weapon: "파이썬의 지팡이",
    },
    javascript: {
      name: "음유시인",
      description: "브라우저 DOM 위에 마법의 선율을 엮어낸다.",
      weapon: "번개의 류트",
    },
    typescript: {
      name: "성기사",
      description: "타입 안전이라는 신념 아래, 흔들림 없는 수호자.",
      weapon: "인터페이스의 방패",
    },
    java: {
      name: "기사",
      description: "엔터프라이즈의 철벽을 지키는 중장갑 전사.",
      weapon: "대검",
    },
    kotlin: {
      name: "레인저",
      description: "Null의 위협 속에서도 빈틈없는 정밀함을 발휘한다.",
      weapon: "복합 활",
    },
    swift: {
      name: "도적",
      description: "빠르게, 그리고 우아하게.",
      weapon: "쌍단검",
    },
    "c++": {
      name: "광전사",
      description: "제어를 내려놓은 자, 날것의 힘을 손에 넣는다.",
      weapon: "거대한 도끼",
    },
    csharp: {
      name: "마검사",
      description: "윈도우와 게임, 두 세계를 넘나드는 마검의 달인.",
      weapon: "룬블레이드",
    },
    go: {
      name: "수도승",
      description: "단순함 속에 깃든 동시성의 경지.",
      weapon: "철권",
    },
    rust: {
      name: "대장장이",
      description: "오직 메모리 안전한 강철만을 벼려낸다.",
      weapon: "단조 망치",
    },
    php: {
      name: "강령술사",
      description: "레거시 웹에 군림하는 불사의 군주.",
      weapon: "뼈 낫",
    },
    ruby: {
      name: "연금술사",
      description: "보석을 행복으로 연성하는 자.",
      weapon: "현자의 돌",
    },
    novice: {
      name: "초보자",
      description: "모든 여정은 여기서 시작된다.",
      weapon: "나무 막대",
    },
    default: {
      name: "모험가",
      description: "자신만의 길을 찾아 떠도는 코더.",
      weapon: "녹슨 검",
    },
  },
} as const;

export default ko;
