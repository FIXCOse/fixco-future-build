import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const AnimatedCounter = ({ target, suffix = "", decimals = 0 }: { target: number; suffix?: string; decimals?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{decimals ? count.toFixed(decimals) : Math.round(count).toLocaleString('sv-SE')}{suffix}</span>;
};

const stats = [
  { label: "Anställda hantverkare", value: 20, suffix: "+" },
  { label: "Olika yrken", value: 9, suffix: "" },
  { label: "Nöjda kunder", value: 99, suffix: "%" },
  { label: "Tillväxt senaste året", value: 22, suffix: "%" },
];

export const CareersStats = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-y border-border"
    >
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap justify-between items-center gap-8 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-baseline gap-2 text-center flex-1 min-w-[140px] justify-center">
              <span className="text-3xl md:text-4xl font-bold text-primary">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-sm text-muted-foreground whitespace-nowrap">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
