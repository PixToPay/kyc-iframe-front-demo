import { motion } from "framer-motion";
import clsx from "classnames";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Ajustes principais:
 * - Layout baseado em grid fluido (2 linhas no desktop).
 * - Linha conectora animada entre etapas (quebra entre fileiras).
 * - Cards mais compactos (melhor legibilidade e ritmo visual).
 * - Mantém todos os dados e ícones do fluxo original.
 */

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

const STEPS: Step[] = [
  {
    id: 1,
    title: "Gerar integração",
    subtitle: "Crie sua Public Key e configure domínios",
    icon: "tabler:key",
    badge: "Segurança",
    highlights: [
      "Gere Public Key no backoffice",
      "Defina CORS e origens permitidas",
    ],
    code: `'x-public-key': '<SUA_PUBLIC_KEY>'`,
    linkLabel: "Documentação de chaves",
    linkHref: "#",
  },
  {
    id: 2,
    title: "Criar sessão (pre-register)",
    subtitle: "CPF → GUID para onboarding ou liveness",
    icon: "tabler:cursor-text",
    badge: "API",
    highlights: [
      "Envie CPF e tipo de fluxo",
      "Receba GUID e validade da sessão",
    ],
    code: `POST /kyc/pre-register { cpf, flow } -> { guid }`,
  },
  {
    id: 3,
    title: "Abrir o fluxo",
    subtitle: "Monte a URL no iframe (mobile-first)",
    icon: "tabler:link",
    badge: "Iframe",
    highlights: [
      "Carregue o link responsivo",
      "Permissões: camera; geolocation",
    ],
    code: `<iframe src=".../?guid=UUID&step=1" allow="camera; geolocation" />`,
  },
  {
    id: 4,
    title: "Usuário realiza verificação",
    subtitle: "Documento + selfie (mobile)",
    icon: "tabler:device-mobile",
    badge: "Mobile",
    highlights: [
      "Qualidade e foco automático",
      "Compressão otimizada de imagens",
    ],
  },
  {
    id: 5,
    title: "Validações automáticas",
    subtitle: "OCR, similaridade e compliance",
    icon: "tabler:checks",
    highlights: ["Face-match ≥ threshold do tenant", "PEP e sanções checadas"],
    code: `{ status: 'approved', similarity: 0.99 }`,
  },
  {
    id: 6,
    title: "Eventos em tempo real",
    subtitle: "Acompanhe via postMessage",
    icon: "tabler:message-dots",
    badge: "Eventos",
    highlights: [
      "type: 'stepUpdate' (1–8)",
      "type: 'processCompleted' (status)",
    ],
    code: `window.addEventListener('message', e => console.log(e.data))`,
  },
  {
    id: 7,
    title: "Resultados & auditoria",
    subtitle: "Dashboard PixtoPay",
    icon: "tabler:chart-dots",
    badge: "Dashboard",
    highlights: [
      "Status e métricas em tempo real",
      "Trilha de auditoria completa",
    ],
    linkLabel: "Acessar Dashboard",
    linkHref: "https://backoffice.pixtopay.com.br/plataforma/",
  },
];

function StepCard({ step }: { step: Step }) {
  return (
    <motion.div
      className="relative bg-white border border-gray-200/70 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-5 md:p-6 transition-all"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Icon
          icon={step.icon}
          className="text-[color:var(--brand-primary)] text-lg"
        />
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

      {/* Highlights */}
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

      {/* Code */}
      {step.code && (
        <pre className="text-[11px] bg-slate-900 text-emerald-300 p-3 rounded-md overflow-hidden whitespace-pre-wrap break-words border border-slate-800 shadow-[0_5px_20px_rgba(2,6,23,0.25)]">
          {`${step.code}`}
        </pre>
      )}

      {/* Link */}
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
  const anchorsRef = useRef<Array<HTMLDivElement | null>>([]);
  return (
    <section id="flow" className="py-16 bg-[color:var(--brand-bg)]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--brand-dark)]">
            Fluxo do Processo KYC — visão completa
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Da integração ao resultado final — tudo conectado em um fluxo
            contínuo e simples de operar.
          </p>
        </div>

        {/* GRID FLEXÍVEL - 2 colunas fixas no desktop/tablet (cards largos) com conectores SVG */}
        <div className="relative hidden sm:block">
          <div className="grid gap-10 sm:grid-cols-2 relative z-10">
            {STEPS.map((step, idx) => (
              <div
                key={step.id}
                ref={(el) => (anchorsRef.current[idx] = el)}
                className="relative z-10"
              >
                {/* Nó esquerdo */}
                <div
                  className="absolute top-1/2 -left-2 w-3 h-3 rounded-full bg-white border border-gray-300"
                  aria-hidden="true"
                />
                <StepCard step={step} />
              </div>
            ))}
          </div>
          {/* SVG overlay atrás dos cards */}
          <div className="absolute inset-0 z-0">
            <FlowConnectors anchors={anchorsRef.current} />
          </div>
        </div>

        {/* TIMELINE VERTICAL - MOBILE */}
        <div className="sm:hidden relative pl-6 mt-2">
          <div className="absolute left-3 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-[color:var(--brand-primary)] to-[color:var(--kyc-accent)]" />
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="relative">
                <div
                  className="absolute -left-3 top-4 w-4 h-4 rounded-full border-2 bg-white border-gray-300"
                  aria-hidden="true"
                />
                {/* Segmento de conexão para o próximo card */}
                {i < STEPS.length - 1 && (
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

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="#demo"
            className="inline-flex items-center gap-2 bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] font-semibold px-6 py-3 rounded-lg shadow hover:shadow-lg transition"
          >
            Ver demonstração no iframe <Icon icon="tabler:arrow-right" />
          </a>
          <p className="text-xs text-gray-500 mt-3">
            * Recomendado executar a verificação no celular (acesso à câmera e
            localização).
          </p>
        </div>
      </div>
    </section>
  );
}
