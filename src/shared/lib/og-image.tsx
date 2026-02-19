import type { RpgAttributes } from "@entities/github-stats";

export type OgImageType = "a" | "b";

export interface OgImageProps {
  username: string;
  jobName: string;
  jobColor: string;
  weapon: string;
  level: number;
  language: string;
  attributes: RpgAttributes;
  currentStreak: number;
  spriteBase64: string;
  fontBase64: string;
}

export interface OgCampfireProps {
  username: string;
  fontBase64: string;
  bonfireBase64: string;
  /** Up to 4 characters around the campfire */
  characters: {
    spriteBase64: string;
    level: number;
    jobName: string;
    flipX: boolean;
    pose: "sitting" | "back";
    x: number;
    y: number;
  }[];
}

const ATTR_CONFIG: {
  key: keyof RpgAttributes;
  label: string;
  color: string;
}[] = [
  { key: "vit", label: "VIT", color: "#c2783c" },
  { key: "cha", label: "CHA", color: "#d4a843" },
  { key: "wis", label: "WIS", color: "#5b8abf" },
  { key: "str", label: "STR", color: "#bf4545" },
  { key: "agi", label: "AGI", color: "#4dab6d" },
];

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Type A — Character status card */
export function buildOgSvg(props: OgImageProps): string {
  const {
    username,
    jobName,
    jobColor,
    weapon,
    level,
    language,
    attributes,
    currentStreak,
    spriteBase64,
    fontBase64,
  } = props;

  const W = 495;
  const H = 270;

  // ─── Layout constants ───
  const pad = 14; // outer padding
  const frameX = pad;
  const frameY = pad;
  const frameW = 160;
  const frameH = H - pad * 2; // full height minus padding
  const spriteSize = 115;
  const spriteX = frameX + (frameW - spriteSize) / 2;
  const spriteY = frameY + 60;

  // Right panel
  const rpX = frameX + frameW + 18;
  const rpRight = W - pad;

  // Attribute bars
  const barStartY = 118;
  const barH = 8;
  const barGap = 19;
  const labelX = rpX;
  const barX = rpX + 32;
  const barW = rpRight - barX - 32;
  const valX = rpRight - 8;

  const attrBars = ATTR_CONFIG.map((attr, i) => {
    const val = attributes[attr.key];
    const y = barStartY + i * barGap;
    const fillW = Math.round((val / 100) * barW);
    const beginDelay = (0.3 + i * 0.12).toFixed(2);

    return `
      <text x="${labelX}" y="${y + barH / 2}" fill="${attr.color}" font-size="9" dominant-baseline="central">${attr.label}</text>
      <rect x="${barX}" y="${y}" width="${barW}" height="${barH}" rx="1" fill="#0a0a18"/>
      <rect x="${barX}" y="${y}" width="0" height="${barH}" rx="1" fill="${attr.color}" opacity="0.7">
        <animate attributeName="width" from="0" to="${fillW}" dur="0.6s" begin="${beginDelay}s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
      </rect>
      <text x="${valX}" y="${y + barH / 2}" fill="#6a6a7a" font-size="8" text-anchor="end" dominant-baseline="central" opacity="0">
        <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${beginDelay}s" fill="freeze"/>
        ${String(val).padStart(3, "\u2007")}
      </text>
    `;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>
      @font-face {
        font-family: 'Galmuri9';
        src: url('data:font/woff2;base64,${fontBase64}') format('woff2');
      }
      text { font-family: 'Galmuri9', monospace; }

      .sprite-glow {
        animation: sglow 2.5s ease-in-out infinite;
      }
      @keyframes sglow {
        0%, 100% { filter: drop-shadow(0 0 3px rgba(212, 168, 67, 0.12)); }
        50% { filter: drop-shadow(0 0 8px rgba(212, 168, 67, 0.3)); }
      }
    </style>

    <!-- Subtle vignette -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0c0c16" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.35"/>
    </radialGradient>

    <!-- Ambient warm glow behind character -->
    <radialGradient id="charGlow" cx="50%" cy="45%">
      <stop offset="0%" stop-color="#d4a843" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#d4a843" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#0c0c16"/>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>

  <!-- Outer border — thin elegant line -->
  <rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="2" fill="none" stroke="#1e1e30" stroke-width="1"/>
  <!-- Inner border — accent highlight -->
  <rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="1" fill="none" stroke="#2a2a3a" stroke-width="0.5"/>

  <!-- Corner accents (small diamonds) -->
  <polygon points="10,4 14,8 10,12 6,8" fill="#3a3525" opacity="0.6"/>
  <polygon points="${W - 10},4 ${W - 6},8 ${W - 10},12 ${W - 14},8" fill="#3a3525" opacity="0.6"/>
  <polygon points="10,${H - 4} 14,${H - 8} 10,${H - 12} 6,${H - 8}" fill="#3a3525" opacity="0.6"/>
  <polygon points="${W - 10},${H - 4} ${W - 6},${H - 8} ${W - 10},${H - 12} ${W - 14},${H - 8}" fill="#3a3525" opacity="0.6"/>

  <!-- ═══ Character panel (left) ═══ -->

  <!-- Character frame background -->
  <rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" rx="2" fill="#0a0a18"/>
  <!-- Frame border -->
  <rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" rx="2" fill="none" stroke="#2a2a3a" stroke-width="1"/>
  <!-- Warm glow inside frame -->
  <rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" rx="2" fill="url(#charGlow)"/>

  <!-- Top accent line on frame -->
  <line x1="${frameX + 8}" y1="${frameY}" x2="${frameX + frameW - 8}" y2="${frameY}" stroke="#3a3525" stroke-width="1" opacity="0.5"/>

  <!-- Character sprite -->
  <g class="sprite-glow">
    <image href="${spriteBase64}" x="${spriteX}" y="${spriteY}" width="${spriteSize}" height="${spriteSize}" image-rendering="pixelated"/>
  </g>

  <!-- Weapon label -->
  <text x="${frameX + frameW / 2}" y="${frameY + frameH - 30}" fill="#5a5a6a" font-size="7" text-anchor="middle">${escapeXml(weapon)}</text>

  <!-- Level badge — inside frame, bottom -->
  <rect x="${frameX + 1}" y="${frameY + frameH - 20}" width="${frameW - 2}" height="19" rx="0 0 2 2" fill="#0e0e1a"/>
  <line x1="${frameX + 10}" y1="${frameY + frameH - 20}" x2="${frameX + frameW - 10}" y2="${frameY + frameH - 20}" stroke="#2a2a3a" stroke-width="0.5"/>
  <text x="${frameX + frameW / 2}" y="${frameY + frameH - 7}" fill="#d4a843" font-size="9" text-anchor="middle">Lv. ${level}</text>

  <!-- ═══ Right panel ═══ -->

  <!-- Username -->
  <text x="${rpX}" y="${pad + 22}" fill="#5a5a6a" font-size="9">@${escapeXml(username)}</text>

  <!-- Job name -->
  <text x="${rpX}" y="${pad + 46}" fill="${jobColor}" font-size="18">${escapeXml(jobName)}</text>

  <!-- Decorative line under job name -->
  <line x1="${rpX}" y1="${pad + 56}" x2="${rpRight - 8}" y2="${pad + 56}" stroke="#1e1e30" stroke-width="1"/>
  <line x1="${rpX}" y1="${pad + 56}" x2="${rpX + 50}" y2="${pad + 56}" stroke="#3a3525" stroke-width="1" opacity="0.7"/>

  <!-- Attribute section header -->
  <text x="${rpX}" y="108" fill="#3a3a4a" font-size="7" letter-spacing="2">─ ATTRIBUTES ─</text>

  <!-- Attribute bars -->
  ${attrBars}

  <!-- Footer divider -->
  <line x1="${rpX}" y1="${H - pad - 28}" x2="${rpRight - 8}" y2="${H - pad - 28}" stroke="#1e1e30" stroke-width="1"/>

  <!-- Footer info -->
  <text x="${rpX}" y="${H - pad - 12}" fill="#5a5a6a" font-size="9">
    MAIN <tspan fill="#d4a843" dx="4">${escapeXml(language)}</tspan>
  </text>
  <text x="${rpRight - 8}" y="${H - pad - 12}" fill="#5a5a6a" font-size="9" text-anchor="end">
    STREAK <tspan fill="#c2783c" dx="4">${currentStreak}d</tspan>
  </text>

  <!-- Bottom tag -->
  <text x="${W / 2}" y="${H - 2}" fill="#1e1e30" font-size="6" text-anchor="middle" letter-spacing="3">GIT LABYRINTH</text>
</svg>`;
}

/** Fallback — shown when user is not found or has no data */
export function buildFallbackSvg(fontBase64: string, lang: string): string {
  const W = 495;
  const H = 270;
  const isKo = lang.startsWith("ko");

  const title = "GIT LABYRINTH";
  const line1 = isKo
    ? "아직 등록되지 않은 모험가입니다."
    : "This adventurer has not been registered yet.";
  const line2 = isKo
    ? "사이트에 방문하여 캐릭터를 생성해 보세요!"
    : "Visit the site to create your character!";
  const url = "labyrinth.forimaginary.dev";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>
      @font-face {
        font-family: 'Galmuri9';
        src: url('data:font/woff2;base64,${fontBase64}') format('woff2');
      }
      text { font-family: 'Galmuri9', monospace; }
    </style>
  </defs>

  <rect width="${W}" height="${H}" fill="#0c0c16"/>
  <rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="2" fill="none" stroke="#1e1e30" stroke-width="1"/>
  <rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="1" fill="none" stroke="#2a2a3a" stroke-width="0.5"/>

  <polygon points="10,4 14,8 10,12 6,8" fill="#3a3525" opacity="0.6"/>
  <polygon points="${W - 10},4 ${W - 6},8 ${W - 10},12 ${W - 14},8" fill="#3a3525" opacity="0.6"/>
  <polygon points="10,${H - 4} 14,${H - 8} 10,${H - 12} 6,${H - 8}" fill="#3a3525" opacity="0.6"/>
  <polygon points="${W - 10},${H - 4} ${W - 6},${H - 8} ${W - 10},${H - 12} ${W - 14},${H - 8}" fill="#3a3525" opacity="0.6"/>

  <text x="${W / 2}" y="90" fill="#d4a843" font-size="20" text-anchor="middle" letter-spacing="4">${title}</text>
  <line x1="120" y1="105" x2="${W - 120}" y2="105" stroke="#3a3525" stroke-width="1" opacity="0.5"/>

  <text x="${W / 2}" y="140" fill="#6a6a7a" font-size="10" text-anchor="middle">${escapeXml(line1)}</text>
  <text x="${W / 2}" y="165" fill="#6a6a7a" font-size="10" text-anchor="middle">${escapeXml(line2)}</text>

  <text x="${W / 2}" y="210" fill="#d4a843" font-size="9" text-anchor="middle" opacity="0.8">${url}</text>

  <text x="${W / 2}" y="${H - 2}" fill="#1e1e30" font-size="6" text-anchor="middle" letter-spacing="3">GIT LABYRINTH</text>
</svg>`;
}

/** Type B — Campfire scene with multiple characters */
export function buildCampfireSvg(props: OgCampfireProps): string {
  const { username, fontBase64, bonfireBase64, characters } = props;

  const W = 495;
  const H = 270;
  const centerX = W / 2;
  const centerY = H / 2 - 5;

  // Bonfire at center
  const bonfireSize = 80;
  const bonfireX = centerX - bonfireSize / 2;
  const bonfireY = centerY - bonfireSize / 2 + 5;

  // Characters around the fire with hover tooltip
  const charSprites = characters
    .map((c, i) => {
      const spriteSize = 72;
      const sx = centerX + c.x - spriteSize / 2;
      const sy = centerY + c.y - spriteSize / 2;
      const flipTransform = c.flipX
        ? `translate(${sx + spriteSize}, ${sy}) scale(-1, 1)`
        : `translate(${sx}, ${sy})`;

      // Tooltip position (above the sprite)
      const tooltipX = centerX + c.x;
      const tooltipY = sy - 4;
      const tooltipText = `${escapeXml(c.jobName)} Lv.${c.level}`;

      return `
      <g class="char-group">
        <g transform="${flipTransform}">
          <image href="${c.spriteBase64}" width="${spriteSize}" height="${spriteSize}" image-rendering="pixelated"/>
        </g>
        <!-- Hover hitbox (non-flipped, covers sprite area) -->
        <rect x="${sx}" y="${sy}" width="${spriteSize}" height="${spriteSize}" fill="transparent" class="char-hitbox"/>
        <!-- Tooltip -->
        <g class="char-tooltip" opacity="0">
          <rect x="${tooltipX - 40}" y="${tooltipY - 12}" width="80" height="14" rx="1" fill="#0c0c16" stroke="#d4a843" stroke-width="0.5" opacity="0.9"/>
          <text x="${tooltipX}" y="${tooltipY - 2}" fill="#d4a843" font-size="7" text-anchor="middle" font-family="Galmuri9, monospace">${tooltipText}</text>
        </g>
      </g>
    `;
    })
    .join("");

  // Fire sparkle particles (static decorative)
  const sparkles: string[] = [];
  const sparkPositions = [
    { x: -8, y: -20, d: "0.0" },
    { x: 12, y: -28, d: "0.3" },
    { x: -15, y: -35, d: "0.6" },
    { x: 5, y: -42, d: "0.9" },
    { x: -3, y: -15, d: "1.2" },
    { x: 18, y: -22, d: "0.5" },
  ];
  for (const sp of sparkPositions) {
    sparkles.push(
      `<circle cx="${centerX + sp.x}" cy="${centerY + sp.y}" r="1" fill="#fbbf24" class="sparkle" style="animation-delay:${sp.d}s"/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>
      @font-face {
        font-family: 'Galmuri9';
        src: url('data:font/woff2;base64,${fontBase64}') format('woff2');
      }
      text { font-family: 'Galmuri9', monospace; }

      .fire-glow {
        animation: fglow 2s ease-in-out infinite;
      }
      @keyframes fglow {
        0%, 100% { opacity: 0.12; }
        50% { opacity: 0.25; }
      }

      .fire-glow-inner {
        animation: fglowi 1.5s ease-in-out infinite;
      }
      @keyframes fglowi {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.45; }
      }

      .sparkle {
        animation: spark 1.8s ease-in-out infinite;
      }
      @keyframes spark {
        0%, 100% { opacity: 0; transform: translateY(0); }
        30% { opacity: 0.9; }
        100% { opacity: 0; transform: translateY(-12px); }
      }

      .char-tooltip { transition: opacity 0.15s; }
      .char-hitbox:hover ~ .char-tooltip { opacity: 1; }
    </style>

    <!-- Fire ambient glow (outer warm) -->
    <radialGradient id="fireGlow" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3"/>
      <stop offset="40%" stop-color="#ef4444" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </radialGradient>

    <!-- Fire inner glow (bright core) -->
    <radialGradient id="fireGlowInner" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </radialGradient>

    <!-- Background grid pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="none"/>
      <line x1="40" y1="0" x2="40" y2="40" stroke="#1a1a2e" stroke-width="0.5"/>
      <line x1="0" y1="40" x2="40" y2="40" stroke="#1a1a2e" stroke-width="0.5"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#0c0c16"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  <!-- Fire ambient glow (outer) -->
  <ellipse cx="${centerX}" cy="${centerY}" rx="140" ry="100" fill="url(#fireGlow)" class="fire-glow"/>

  <!-- Fire inner glow (bright core around bonfire) -->
  <ellipse cx="${centerX}" cy="${centerY + 5}" rx="55" ry="45" fill="url(#fireGlowInner)" class="fire-glow-inner"/>

  <!-- Characters -->
  ${charSprites}

  <!-- Bonfire -->
  <image href="${bonfireBase64}" x="${bonfireX}" y="${bonfireY}" width="${bonfireSize}" height="${bonfireSize}" image-rendering="pixelated"/>

  <!-- Fire sparkles -->
  ${sparkles.join("\n  ")}

  <!-- Username tag -->
  <text x="${W / 2}" y="${H - 16}" fill="#4a4a5a" font-size="8" text-anchor="middle" font-family="Galmuri9, monospace">
    @${escapeXml(username)}
  </text>

  <!-- Bottom tag -->
  <text x="${W / 2}" y="${H - 6}" fill="#2a2a3a" font-size="6" text-anchor="middle" letter-spacing="3">GIT LABYRINTH</text>
</svg>`;
}
