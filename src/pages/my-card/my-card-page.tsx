import { Suspense } from "@suspensive/react";
import { SuspenseQuery } from "@suspensive/react-query-5";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { userQueryOptions } from "@entities/user";
import type { OgImageType } from "@shared/lib/og-image";

function OgPreviewImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => setIsLoaded(true), []);

  return (
    <div className={`relative ${className ?? ""}`}>
      {!isLoaded && (
        <div className="aspect-2/1 w-full animate-pulse border-2 border-black bg-muted" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        className={`w-full transition-opacity duration-300 ${isLoaded ? "opacity-100" : "h-0 opacity-0"}`}
      />
    </div>
  );
}

const OG_TYPES: { value: OgImageType; label: string; description: string }[] = [
  { value: "a", label: "TYPE A", description: "Character Status" },
  { value: "b", label: "TYPE B", description: "Campfire" },
];

function ReadmeCard({ userId }: { userId: string }) {
  const { i18n } = useTranslation();
  const [selectedType, setSelectedType] = useState<OgImageType>("a");
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const lang = i18n.language?.startsWith("ko") ? "ko" : "en";
  const ogUrlA = `${origin}/api/og?userId=${userId}&lang=${lang}`;
  const ogUrlB = `${origin}/api/og?userId=${userId}&type=b&lang=${lang}`;
  const activeUrl = selectedType === "a" ? ogUrlA : ogUrlB;
  const markdown = `[![Git Labyrinth](${activeUrl})](${origin})`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="border-2 border-secondary border-t-primary/30 bg-card/50 p-5"
      style={{ boxShadow: "inset 0 1px 8px rgba(0,0,0,0.3)" }}
    >
      {/* Type selector */}
      <div className="mb-4 flex gap-2" role="group" aria-label="OG image type">
        {OG_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setSelectedType(t.value)}
            aria-pressed={selectedType === t.value}
            className={`flex-1 border-2 px-3 py-2 font-pixel text-[10px] transition-colors ${
              selectedType === t.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-black bg-secondary text-muted-foreground hover:bg-primary/5"
            }`}
          >
            <span className="block">{t.label}</span>
            <span className="block text-[8px] opacity-60">{t.description}</span>
          </button>
        ))}
      </div>

      {/* Preview — both types shown, selected one highlighted */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {OG_TYPES.map((t) => {
          const url = t.value === "a" ? ogUrlA : ogUrlB;
          const isActive = selectedType === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setSelectedType(t.value)}
              className={`overflow-hidden border-2 bg-secondary transition-all ${
                isActive
                  ? "border-primary shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                  : "border-black opacity-50 hover:opacity-75"
              }`}
            >
              <OgPreviewImage src={url} alt={`${t.label} Preview`} />
            </button>
          );
        })}
      </div>

      {/* Markdown snippet */}
      <div className="mb-3">
        <p className="mb-1 font-pixel text-[9px] text-muted-foreground">
          MARKDOWN FOR README
        </p>
        <div className="flex items-stretch gap-2">
          <code className="flex-1 select-text overflow-x-auto border-2 border-black bg-secondary px-3 py-2 font-mono text-[10px] text-foreground">
            {markdown}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="border-2 border-black bg-secondary px-3 py-2 font-pixel text-[10px] text-primary transition-colors hover:bg-primary/10"
          >
            <span aria-live="polite">{copied ? "COPIED!" : "COPY"}</span>
          </button>
        </div>
      </div>

      {/* Direct link */}
      <p className="font-mono text-[9px] text-muted-foreground/60">
        Direct URL:{" "}
        <a
          href={activeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="select-text text-primary/50 underline"
        >
          {activeUrl}
        </a>
      </p>
    </div>
  );
}

export function MyCardPage() {
  const { t } = useTranslation();

  return (
    <main className="dungeon-bg relative mx-auto max-w-5xl select-none px-4 py-6">
      <h1
        className="section-title mb-6 font-pixel text-xl text-primary"
        style={{ textShadow: "0 0 6px rgba(245, 158, 11, 0.3)" }}
      >
        <span className="text-primary/40">◆</span>
        <span>My Card</span>
        <span className="text-primary/40">◆</span>
      </h1>

      <p className="mb-4 font-mono text-xs text-muted-foreground">
        &gt; {t("myCard.description")}
      </p>

      <Suspense
        clientOnly
        fallback={
          <div
            className="border-2 border-secondary border-t-primary/30 bg-card/50 p-5"
            style={{ boxShadow: "inset 0 1px 8px rgba(0,0,0,0.3)" }}
          >
            <div className="mb-4 h-40 w-full animate-pulse border-2 border-black bg-muted" />
            <div className="mb-3 h-8 w-full animate-pulse bg-muted" />
          </div>
        }
      >
        <SuspenseQuery {...userQueryOptions}>
          {({ data: user }) => (user ? <ReadmeCard userId={user.id} /> : null)}
        </SuspenseQuery>
      </Suspense>
    </main>
  );
}
