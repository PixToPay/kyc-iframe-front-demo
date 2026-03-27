import { motion } from "framer-motion";
import clsx from "classnames";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Step = {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  highlights?: string[];
  code?: string;
  linkLabel?: string;
  linkHref?: string;
};

const STEP_CODES: Record<number, string | undefined> = {
  1: `'x-public-key': '<SUA_PUBLIC_KEY>'`,
  2: `POST /customer/register
{
  "cpf": "00000000272",
  "integration_id": "...",
  "webhook_url": "https://...", // optional
  "transaction_id": "..." // optional
} -> { onboarding_id }`,
  3: `<iframe src=".../?guid=UUID&step=1" allow="camera; geolocation" />`,
  5: `{ status: 'approved', similarity: 0.99 }`,
  6: `window.addEventListener('message', e => console.log(e.data))`,
};

function StepCard({ step }: { step: Step }) {
  return (
    <motion.div
      className="relative bg-white border border-gray-200/70 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-5 md:p-6 transition-all"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-10 h-10 rounded-full bg-[color:var(--brand-primary)]/15 border-2 border-[color:var(--brand-primary)] flex items-center justify-center">
          <Icon
            icon={step.icon}
            className="text-[color:var(--brand-dark)] text-xl"
          />
        </span>
        <h4 className="font-semibold text-[color:var(--brand-dark)] text-base md:text-lg">
          {step.id}. {step.title}
        </h4>
        {step.badge && (
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border">
            {step.badge}
          </span>
        )}
      </div>
      <p className="text-[12px] text-gray-600 mb-3 leading-relaxed">
        {step.subtitle}
      </p>

      {step.highlights && (
        <ul className="text-xs text-gray-700 space-y-1 mb-3">
          {step.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <Icon
                icon="tabler:point-filled"
                className="text-[color:var(--brand-primary)] mt-[3px]"
              />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      {step.code && (
        <pre className="text-[11px] bg-slate-900 text-emerald-300 p-3 rounded-md overflow-hidden whitespace-pre-wrap break-words border border-slate-800 shadow-[0_5px_20px_rgba(2,6,23,0.25)]">
          {`${step.code}`}
        </pre>
      )}

      {step.linkHref && (
        <a
          href={step.linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] mt-3 inline-flex items-center gap-1 text-[color:var(--brand-dark)] hover:underline"
        >
          {step.linkLabel} <Icon icon="tabler:arrow-up-right" />
        </a>
      )}
    </motion.div>
  );
}

type Point = { x: number; y: number };

function FlowConnectors({
  anchors,
}: {
  anchors: Array<HTMLDivElement | null>;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const recalc = () => {
      const root = svgRef.current?.parentElement;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    };
    recalc();
    const raf = requestAnimationFrame(recalc);
    const ro = new ResizeObserver(recalc);
    if (svgRef.current?.parentElement) ro.observe(svgRef.current.parentElement);
    anchors.forEach((a) => a && ro.observe(a));
    window.addEventListener("resize", recalc);
    window.addEventListener("scroll", recalc, { passive: true });
    return () => {
      window.removeEventListener("resize", recalc);
      window.removeEventListener("scroll", recalc);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [anchors.length]);

  const points: Point[] = useMemo(() => {
    const root = svgRef.current?.parentElement;
    if (!root) return [];
    const base = root.getBoundingClientRect();
    return anchors
      .map((el) => el?.getBoundingClientRect())
      .filter(Boolean)
      .map((r) => ({
        x: (r as DOMRect).left - base.left + (r as DOMRect).width / 2,
        y: (r as DOMRect).top - base.top + (r as DOMRect).height / 2,
      }));
  }, [
    anchors
      .map(
        (a) =>
          `${a?.offsetLeft}-${a?.offsetTop}-${a?.offsetWidth}-${a?.offsetHeight}`
      )
      .join("|"),
    size,
  ]);

  if (size.w === 0 || points.length < 2) return null;

  const paths: string[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const mid: Point = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const dy = Math.sign(p2.y - p1.y || 1) * 40;
    const cx = mid.x;
    const cy = mid.y + dy;
    paths.push(`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`);
  }

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none hidden sm:block z-20"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flowStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C0F334" />
          <stop offset="100%" stopColor="#A9D001" />
        </linearGradient>
        <marker
          id="arrow"
          markerWidth="8"
          markerHeight="8"
          refX="8"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="#A9D001" />
        </marker>
      </defs>
      {paths.map((d, idx) => (
        <path
          key={idx}
          d={d}
          fill="none"
          stroke="url(#flowStroke)"
          strokeWidth="4"
          strokeOpacity="0.8"
          strokeLinecap="round"
          markerEnd="url(#arrow)"
        />
      ))}
    </svg>
  );
}

export function EndToEndFlow() {
  const { t } = useTranslation("landing");
  const anchorsRef = useRef<Array<HTMLDivElement | null>>([]);
  const steps: Step[] = useMemo(
    () => [
      {
        id: 1,
        title: t("flow.steps.1.title"),
        subtitle: t("flow.steps.1.subtitle"),
        icon: "tabler:key",
        badge: t("flow.steps.1.badge"),
        highlights: t("flow.steps.1.highlights", { returnObjects: true }) as string[],
        code: STEP_CODES[1],
        linkLabel: t("flow.steps.1.linkLabel"),
        linkHref: "#",
      },
      {
        id: 2,
        title: t("flow.steps.2.title"),
        subtitle: t("flow.steps.2.subtitle"),
        icon: "tabler:cursor-text",
        badge: t("flow.steps.2.badge"),
        highlights: t("flow.steps.2.highlights", { returnObjects: true }) as string[],
        code: STEP_CODES[2],
      },
      {
        id: 3,
        title: t("flow.steps.3.title"),
        subtitle: t("flow.steps.3.subtitle"),
        icon: "tabler:link",
        badge: t("flow.steps.3.badge"),
        highlights: t("flow.steps.3.highlights", { returnObjects: true }) as string[],
        code: STEP_CODES[3],
      },
      {
        id: 4,
        title: t("flow.steps.4.title"),
        subtitle: t("flow.steps.4.subtitle"),
        icon: "tabler:device-mobile",
        badge: t("flow.steps.4.badge"),
        highlights: t("flow.steps.4.highlights", { returnObjects: true }) as string[],
      },
      {
        id: 5,
        title: t("flow.steps.5.title"),
        subtitle: t("flow.steps.5.subtitle"),
        icon: "tabler:checks",
        highlights: t("flow.steps.5.highlights", { returnObjects: true }) as string[],
        code: STEP_CODES[5],
      },
      {
        id: 6,
        title: t("flow.steps.6.title"),
        subtitle: t("flow.steps.6.subtitle"),
        icon: "tabler:message-dots",
        badge: t("flow.steps.6.badge"),
        highlights: t("flow.steps.6.highlights", { returnObjects: true }) as string[],
        code: STEP_CODES[6],
      },
      {
        id: 7,
        title: t("flow.steps.7.title"),
        subtitle: t("flow.steps.7.subtitle"),
        icon: "tabler:chart-dots",
        badge: t("flow.steps.7.badge"),
        highlights: t("flow.steps.7.highlights", { returnObjects: true }) as string[],
        linkLabel: t("flow.steps.7.linkLabel"),
        linkHref: "https://backoffice.pixtopay.com.br/plataforma/",
      },
    ],
    [t]
  );
  return (
    <section id="flow" className="py-16 bg-[color:var(--brand-bg)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--brand-dark)]">
            {t("flow.title")}
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            {t("flow.subtitle")}
          </p>
        </div>

        <div className="relative hidden sm:block">
          <div className="grid gap-10 sm:grid-cols-2 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                ref={(el) => (anchorsRef.current[idx] = el)}
                className="relative z-10"
              >
                <div
                  className="absolute top-1/2 -left-2 w-3 h-3 rounded-full bg-white border border-gray-300"
                  aria-hidden="true"
                />
                <StepCard step={step} />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 z-0">
            <FlowConnectors anchors={anchorsRef.current} />
          </div>
        </div>

        <div className="sm:hidden relative pl-6 mt-2">
          <div className="absolute left-3 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-[color:var(--brand-primary)] to-[color:var(--kyc-accent)]" />
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={s.id} className="relative">
                <div
                  className="absolute -left-3 top-4 w-4 h-4 rounded-full border-2 bg-white border-gray-300"
                  aria-hidden="true"
                />
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-3 top-8 bottom-[-8px] w-1 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <StepCard step={s} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#demo"
            className="inline-flex items-center gap-2 bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] font-semibold px-6 py-3 rounded-lg shadow hover:shadow-lg transition"
          >
            {t("flow.cta")} <Icon icon="tabler:arrow-right" />
          </a>
          <p className="text-xs text-gray-500 mt-3">
            {t("flow.ctaSuffix")}
          </p>
        </div>
      </div>
    </section>
  );
}
