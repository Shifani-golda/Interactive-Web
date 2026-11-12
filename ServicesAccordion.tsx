import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ServiceItem Interface
 * Match this structure with your existing content array.
 */
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  tags?: string[];
}

export interface ServicesAccordionProps {
  badge?: string;
  title?: string;
  description?: string;
  items?: ServiceItem[];
}

export const defaultFeaturesData: ServiceItem[] = [
  {
    id: "01",
    title: "Speak the way you actually speak.",
    description:
      "Capture everyday transactions in your preferred language, without stopping what you're doing. Speak naturally in English, Telugu, Tamil, Hindi, or Kannada, and let your day book catch up effortlessly.",
    tags: ["Voice-First Entry", "Multilingual", "Zero Typing", "Natural Speech"],
  },
  {
    id: "02",
    title: "Keep every promise in one place.",
    description:
      "Track what customers owe, without losing a note or a name. Keep customer credit (udhār) organized with due date tracking, upcoming reminders, and instant balance updates.",
    tags: ["Udhār Tracking", "Customer Balances", "Due Date Alerts", "Credit Ledger"],
  },
  {
    id: "03",
    title: "Know your numbers.",
    description:
      "A clearer view of where your business stands today. Review weekly cash flow, compare income vs expenses, and spot trends with simple visual summaries built for daily business.",
    tags: ["Cash Flow", "Smart Reports", "Weekly Trends", "Financial Overview"],
  },
  {
    id: "04",
    title: "A tidy record of every day.",
    description:
      "Income, expenses, and customer credit all in a single unified timeline. Clean, chronological ledger entries keep your daily bookkeeping transparent and ready at any time.",
    tags: ["Day Book", "Timeline View", "Instant Balance", "Daily Transactions"],
  },
  {
    id: "05",
    title: "Receipts that stay found.",
    description:
      "Keep supporting details close to your transactions and export a clean CSV ledger whenever you need it for accountant reviews, tax preparation, or offline records.",
    tags: ["CSV Export", "Receipt Records", "Audit Ready", "Offline Archives"],
  },
  {
    id: "06",
    title: "Fewer things to remember.",
    description:
      "Keep due dates and daily entries from slipping through the cracks with proactive follow-up alerts, status badges, and gentle review notifications that keep you on schedule.",
    tags: ["Payment Reminders", "Follow-Up Alerts", "Due Date Watch", "Automated Notifications"],
  },
];

export default function ServicesAccordion({
  badge = "SMALL DETAILS. BIG RELIEF.",
  title = "Your business toolkit, without the busywork.",
  description = "Everything you need to stay on top of your day, all in one place.",
  items = defaultFeaturesData,
}: ServicesAccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id || "01");

  return (
    <section className="w-full py-20 px-6 md:px-16 bg-background text-foreground">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Sticky Left Header */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          {badge && (
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              {badge}
            </span>
          )}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-normal max-w-md">
            {description}
          </p>
        </div>

        {/* Right Interactive Cards List */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {items.map((item) => (
            <ServiceCard
              key={item.id}
              item={item}
              isOpen={activeId === item.id}
              onClick={() => setActiveId(activeId === item.id ? null : item.id)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

function ServiceCard({
  item,
  isOpen,
  onClick,
}: {
  item: ServiceItem;
  isOpen: boolean;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Tracks cursor relative to card bounds for radial spotlight glow
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`relative group cursor-pointer rounded-2xl border p-6 md:p-8 transition-colors duration-300 overflow-hidden bg-card text-card-foreground ${
        isOpen
          ? "border-primary/60 shadow-lg"
          : "border-border hover:border-border/80"
      }`}
    >
      {/* Cursor Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(22, 163, 74, 0.08), transparent 40%)`,
        }}
      />

      {/* Card Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <span className="text-sm font-mono text-muted-foreground font-medium">{item.id}</span>
          <h3 className="text-lg md:text-2xl font-semibold tracking-wide text-foreground">
            {item.title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-2xl text-muted-foreground font-light shrink-0"
        >
          +
        </motion.div>
      </div>

      {/* Expandable Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-6">
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {item.description}
              </p>

              {/* Badges/Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

