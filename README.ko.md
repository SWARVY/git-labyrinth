<div align="center">

# Git Labyrinth

**GitHub 활동이 던전 속 픽셀 영웅으로 깨어납니다.**

커밋 하나하나, 저장소 하나하나, 코드 한 줄 한 줄이 개발자로서의 여정을 담은 캐릭터를 만들어갑니다.

[![Git Labyrinth](https://labyrinth.forimaginary.dev/api/og?userId=a7fd806f-b150-483e-a362-d1d86eb74b8a&lang=ko)](https://labyrinth.forimaginary.dev)

[![Git Labyrinth](https://labyrinth.forimaginary.dev/api/og?userId=a7fd806f-b150-483e-a362-d1d86eb74b8a&type=b&lang=ko)](https://labyrinth.forimaginary.dev)

[사이트 바로가기](https://labyrinth.forimaginary.dev) | [English](./README.md)

이 프로젝트가 마음에 드셨다면 **Star**를 눌러주세요! 던전의 불씨를 살리는 데 큰 힘이 됩니다.

</div>

## 이용 방법

1. **GitHub 연동** — GitHub 계정으로 로그인하여 모험을 시작하세요. 코딩 이력이 캐릭터의 토대가 됩니다.
2. **캐릭터 각성** — 리포지토리를 분석하여 RPG 캐릭터로 변환합니다. 사용한 프로그래밍 언어에 따라 직업, 레벨, 능력이 결정됩니다.
3. **카드 공유** — 픽셀 영웅이 담긴 OG 이미지 카드를 생성하고, GitHub README에 삽입하여 개발자 정체성을 드러내세요.

## 직업 목록

각 프로그래밍 언어는 고유한 전사를 빚어냅니다. 가장 많이 사용한 언어가 파티에 합류할 영웅을 결정합니다.

| 언어 | 직업 | 무기 |
|------|------|------|
| Python | 소환사 | 파이썬의 지팡이 |
| JavaScript | 음유시인 | 번개의 류트 |
| TypeScript | 성기사 | 인터페이스의 방패 |
| Java | 기사 | 대검 |
| Kotlin | 레인저 | 복합 활 |
| Swift | 도적 | 쌍단검 |
| C++ | 광전사 | 거대한 도끼 |
| C# | 마검사 | 룬블레이드 |
| Go | 수도승 | 철권 |
| Rust | 대장장이 | 단조 망치 |
| PHP | 강령술사 | 뼈 낫 |
| Ruby | 연금술사 | 현자의 돌 |

## RPG 스탯

GitHub 활동이 5가지 RPG 능력치로 변환되며, 각각 0~100 사이로 환산됩니다.

| 스탯 | 기반 데이터 | 최대 기준 |
|------|-------------|-----------|
| **VIT** (생명력) | 연속 커밋 일수 | 365일 |
| **CHA** (매력) | GitHub 팔로워 수 | 1,000명 |
| **WIS** (지혜) | 계정 생존 일수 | 3,650일 (10년) |
| **STR** (힘) | 지난 1년 총 기여 수 | 5,000 |
| **AGI** (민첩) | 기여한 리포지토리 수 | 50개 |

## README에 삽입하기

로그인 후 캐릭터를 동기화하면, 사이트에서 마크다운 코드를 복사할 수 있습니다. 이를 GitHub 프로필 README에 붙여넣으세요.

```md
[![Git Labyrinth](https://labyrinth.forimaginary.dev/api/og?userId=YOUR_USER_ID&lang=ko)](https://labyrinth.forimaginary.dev)
```

## 기술 스택

- **프레임워크**: React + TanStack Start
- **스타일링**: Tailwind CSS v4
- **인증 및 DB**: Supabase (GitHub OAuth + PostgreSQL)
- **API**: GitHub GraphQL API (Octokit)
- **배포**: Docker + Dokploy

## 라이선스

MIT
