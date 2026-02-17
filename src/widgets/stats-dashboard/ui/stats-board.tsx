import { useMemo, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";
import { Suspense, ErrorBoundary } from "@suspensive/react";
import { SuspenseQuery } from "@suspensive/react-query-5";
import { useTranslation } from "react-i18next";

import {
  githubStatsQueryOptions,
  calcRpgAttributes,
} from "@entities/github-stats";
import type { RpgAttributesMeta } from "@entities/github-stats";
import type { GithubStats } from "@shared/api/github";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@shared/ui";
import type { ChartConfig } from "@shared/ui";

const chartConfig = {
  value: {
    label: "Attribute",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface AttributeRow {
  label: string;
  value: number;
  chartVar: string;
  tooltip: string;
}

function buildRows(
  meta: RpgAttributesMeta,
  t: (key: string, opts?: Record<string, unknown>) => string,
): AttributeRow[] {
  return [
    {
      label: "VIT",
      value: meta.attributes.vit,
      chartVar: "--chart-1",
      tooltip: t("stats.tooltip.vit", { current: meta.currentStreak }),
    },
    {
      label: "CHA",
      value: meta.attributes.cha,
      chartVar: "--chart-2",
      tooltip: t("stats.tooltip.cha"),
    },
    {
      label: "WIS",
      value: meta.attributes.wis,
      chartVar: "--chart-3",
      tooltip: t("stats.tooltip.wis", {
        days: meta.accountAgeDays.toLocaleString(),
      }),
    },
    {
      label: "STR",
      value: meta.attributes.str,
      chartVar: "--chart-4",
      tooltip: t("stats.tooltip.str"),
    },
    {
      label: "AGI",
      value: meta.attributes.agi,
      chartVar: "--chart-5",
      tooltip: t("stats.tooltip.agi"),
    },
  ];
}

function buildRadarData(meta: RpgAttributesMeta) {
  return [
    { attribute: "VIT", value: meta.attributes.vit, fullMark: 100 },
    { attribute: "CHA", value: meta.attributes.cha, fullMark: 100 },
    { attribute: "WIS", value: meta.attributes.wis, fullMark: 100 },
    { attribute: "STR", value: meta.attributes.str, fullMark: 100 },
    { attribute: "AGI", value: meta.attributes.agi, fullMark: 100 },
  ];
}

function useStatusKey(meta: RpgAttributesMeta): string {
  if (!meta.isKindled) return "hollow";
  if (meta.currentStreak >= 30) return "blazing";
  if (meta.currentStreak >= 7) return "kindled";
  return "ember";
}

function HpBar({ meta }: { meta: RpgAttributesMeta }) {
  const { t } = useTranslation();
  const hpPercent = Math.min((meta.currentStreak / 365) * 100, 100);
  const barColor = meta.isKindled
    ? meta.currentStreak >= 7
      ? "bg-orange-500"
      : "bg-red-600"
    : "bg-gray-600";

  const statusKey = useStatusKey(meta);
  const statusLabel = t(`stats.status.${statusKey}`);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-pixel text-xs text-red-400">
          {t("stats.hp.title")}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {t("stats.hp.streak", {
            current: meta.currentStreak,
            best: meta.longestStreak,
          })}
        </span>
      </div>
      <div
        className="relative h-7 w-full border-2 border-black bg-secondary"
        role="progressbar"
        aria-valuenow={meta.currentStreak}
        aria-valuemin={0}
        aria-valuemax={365}
        aria-label={`${t("stats.hp.title")} — ${statusLabel}`}
      >
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${hpPercent}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center font-pixel text-xs text-white mix-blend-difference">
          {t("stats.hpBar", {
            status: statusLabel,
            current: meta.currentStreak,
          })}
        </span>
      </div>
    </div>
  );
}

function AttributeBar({ row }: { row: AttributeRow }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="group relative flex items-center gap-2"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        className="w-8 font-pixel text-xs"
        style={{ color: `var(${row.chartVar})` }}
      >
        {row.label}
      </span>
      <div
        className="relative h-4 flex-1 border border-black bg-secondary"
        role="progressbar"
        aria-valuenow={row.value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={row.label}
      >
        <div
          className="h-full transition-all"
          style={{
            width: `${row.value}%`,
            backgroundColor: `var(${row.chartVar})`,
            opacity: 0.6,
          }}
        />
      </div>
      <span className="w-8 text-right font-pixel text-[10px] text-muted-foreground">
        {row.value}
      </span>

      {/* Hover tooltip */}
      {showTooltip && (
        <div
          role="tooltip"
          className="absolute -top-9 left-10 z-20 whitespace-nowrap border-2 border-black bg-card px-3 py-1.5 font-mono text-[10px] text-foreground shadow-lg"
        >
          {row.tooltip}
        </div>
      )}
    </div>
  );
}

function AttributeList({ rows }: { rows: AttributeRow[] }) {
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <AttributeBar key={r.label} row={r} />
      ))}
    </div>
  );
}

const ATTR_COLORS: Record<string, string> = {
  VIT: "var(--chart-1)",
  CHA: "var(--chart-2)",
  WIS: "var(--chart-3)",
  STR: "var(--chart-4)",
  AGI: "var(--chart-5)",
};

function CustomAxisTick(props: {
  x: number;
  y: number;
  payload: { value: string };
}) {
  const { x, y, payload } = props;
  const color = ATTR_COLORS[payload.value] ?? "var(--color-muted-foreground)";
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={11}
      fontFamily="Galmuri9, Galmuri11, monospace"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {payload.value}
    </text>
  );
}

function CustomDot(props: {
  cx: number;
  cy: number;
  payload: { attribute: string };
}) {
  const { cx, cy, payload } = props;
  const color = ATTR_COLORS[payload.attribute] ?? "var(--chart-1)";
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={color}
      stroke="#000"
      strokeWidth={1.5}
    />
  );
}

function RadarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const attr = item.payload.attribute as string;
  const value = item.payload.value as number;
  const color = ATTR_COLORS[attr] ?? "var(--chart-1)";
  return (
    <div className="border-2 border-black bg-card px-3 py-1.5 shadow-lg">
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5" style={{ backgroundColor: color }} />
        <span className="font-pixel text-xs" style={{ color }}>
          {attr}
        </span>
        <span className="font-pixel text-xs text-foreground">{value}</span>
      </div>
    </div>
  );
}

function RadarChartPanel({
  data,
}: {
  data: ReturnType<typeof buildRadarData>;
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-62.5 w-full"
    >
      <RadarChart data={data}>
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis dataKey="attribute" tick={CustomAxisTick as any} />
        <ChartTooltip content={<RadarTooltip />} />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="var(--chart-2)"
          fill="var(--chart-2)"
          fillOpacity={0.2}
          strokeWidth={2}
          dot={CustomDot as any}
        />
      </RadarChart>
    </ChartContainer>
  );
}

function StatsContent({ data }: { data: GithubStats }) {
  const { t } = useTranslation();
  const meta = useMemo(() => calcRpgAttributes(data), [data]);
  const radarData = useMemo(() => buildRadarData(meta), [meta]);
  const rows = useMemo(() => buildRows(meta, t), [meta, t]);

  return (
    <div className="select-none space-y-4 border-4 border-black bg-card p-4 ring-4 ring-secondary ring-inset">
      <HpBar meta={meta} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RadarChartPanel data={radarData} />
        <div className="flex flex-col justify-center">
          <AttributeList rows={rows} />
          <div className="mt-3 border-t border-secondary pt-2">
            <span className="font-pixel text-[10px] text-muted-foreground">
              {t("stats.main")}:{" "}
            </span>
            <span className="font-pixel text-xs text-primary">
              {data.topLanguage ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="space-y-4 border-4 border-black bg-card p-4 ring-4 ring-secondary ring-inset">
      {/* HP label row */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 animate-pulse bg-muted" />
          <div className="h-3 w-28 animate-pulse bg-muted" />
        </div>
        <div className="h-7 w-full animate-pulse border-2 border-black bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Radar chart area */}
        <div className="flex aspect-square max-h-62.5 items-center justify-center">
          <div className="h-44 w-44 animate-pulse bg-muted opacity-20" />
        </div>

        {/* Attribute rows + footer */}
        <div className="flex flex-col justify-center">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-8 animate-pulse bg-muted" />
                <div className="h-4 flex-1 animate-pulse bg-muted" />
                <div className="h-4 w-8 animate-pulse bg-muted" />
              </div>
            ))}
          </div>
          {/* MAIN footer */}
          <div className="mt-3 border-t border-secondary pt-2">
            <div className="h-3 w-24 animate-pulse bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsError({ error, reset }: { error: Error; reset: () => void }) {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      className="border-4 border-destructive bg-destructive/10 p-4 text-center"
    >
      <p className="font-mono text-sm text-destructive">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 font-mono text-xs text-destructive underline"
      >
        {t("stats.retry")}
      </button>
    </div>
  );
}

export function StatsBoard() {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <StatsError error={error} reset={reset} />
      )}
    >
      <Suspense clientOnly fallback={<StatsSkeleton />}>
        <SuspenseQuery {...githubStatsQueryOptions}>
          {({ data }) => <StatsContent data={data} />}
        </SuspenseQuery>
      </Suspense>
    </ErrorBoundary>
  );
}
