import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { Suspense } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

import { loginWithGithub, consumeReturnPath } from '@features/auth';
import { userQueryOptions } from '@entities/user';
import backgroundImg from '@shared/assets/background.png';

gsap.registerPlugin(useGSAP);

function HomeContent() {
  const navigate = useNavigate();
  const { data: user } = useSuspenseQuery(userQueryOptions);

  useEffect(() => {
    if (user) {
      const returnPath = consumeReturnPath();
      navigate({ to: returnPath });
    }
  }, [user, navigate]);

  if (user) return null;

  return (
    <button
      onClick={() => loginWithGithub()}
      className="animate-game-start-pulse cursor-pointer border-0 bg-transparent font-pixel text-xl tracking-[0.25em] text-primary md:text-2xl"
      aria-label="GitHub 로그인으로 게임 시작"
    >
      — GAME START —
    </button>
  );
}

export function HomePage() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // 1. Ambient glow fades in
      tl.fromTo(
        "[data-anim='glow']",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power1.inOut' }
      );

      // 2. Title fades in from above
      tl.fromTo(
        "[data-anim='title']",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.2'
      );

      // 3. Subtitle appears
      tl.fromTo(
        "[data-anim='subtitle']",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.3'
      );

      // 4. GAME START pulses in
      tl.fromTo(
        "[data-anim='start']",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '+=0.3'
      );

      // 5. Footer hint
      tl.fromTo(
        "[data-anim='hint']",
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.1'
      );

      // 6. About link
      tl.fromTo(
        "[data-anim='about']",
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.2'
      );
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0f]"
    >
      {/* Background image — centered, covers entire viewport */}
      <img
        src={backgroundImg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Single combined overlay: soft edge fades + radial vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'linear-gradient(to bottom, rgba(10,10,15,0.8) 0%, transparent 8%, transparent 82%, rgba(10,10,15,0.7) 100%)',
            'radial-gradient(ellipse at center 45%, transparent 25%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.75) 100%)',
          ].join(', '),
        }}
      />

      {/* Ambient glow behind title (animates in) */}
      <div
        data-anim="glow"
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0"
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '400px',
          background:
            'radial-gradient(ellipse, rgba(251, 191, 36, 0.15) 0%, rgba(217, 119, 6, 0.06) 40%, transparent 70%)',
        }}
      />

      {/* Main content — centered vertical layout */}
      <div className="relative z-10 flex select-none flex-col items-center">
        {/* Title */}
        <div data-anim="title" className="mb-4 opacity-0">
          <h1
            className="font-title text-4xl tracking-tight md:text-6xl lg:text-7xl"
            style={{
              background:
                'linear-gradient(to bottom, #fff7ed, #fde68a 30%, #f59e0b 60%, #d97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: [
                'drop-shadow(0 0 4px rgba(251,191,36,0.8))',
                'drop-shadow(0 0 20px rgba(245,158,11,0.4))',
                'drop-shadow(0 4px 0 rgba(0,0,0,0.9))',
                'drop-shadow(0 5px 0 rgba(120,53,15,0.6))',
              ].join(' '),
            }}
          >
            GIT LABYRINTH
          </h1>
        </div>

        {/* Subtitle */}
        <p
          data-anim="subtitle"
          className="mb-16 font-mono text-xs tracking-[0.3em] text-amber-300/60 opacity-0 md:text-sm"
        >
          ENTER THE CODE — SURVIVE THE MAZE
        </p>

        {/* GAME START button */}
        <div data-anim="start" className="opacity-0">
          <Suspense
            clientOnly
            fallback={
              <span className="animate-game-start-pulse font-pixel text-xl tracking-[0.25em] text-primary md:text-2xl">
                — LOADING —
              </span>
            }
          >
            <HomeContent />
          </Suspense>
        </div>

        {/* Footer hint */}
        <p
          data-anim="hint"
          className="mt-8 font-mono text-[10px] tracking-widest text-amber-400/50 opacity-0"
        >
          PRESS START TO LINK YOUR GITHUB
        </p>

        {/* About link */}
        <Link
          to="/about"
          data-anim="about"
          className="mt-4 font-pixel text-[9px] tracking-widest text-amber-400/30 opacity-0 transition-colors hover:text-amber-400/70"
        >
          ABOUT THIS GAME
        </Link>
      </div>
    </main>
  );
}
