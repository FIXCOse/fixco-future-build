import { motion } from "framer-motion";
import useCountUpOnce from "@/hooks/useCountUpOnce";
import { GradientText } from "./GradientText";

const statistics = [
  { key: "customers", label: "Nöjda kunder", value: 15000, suffix: "+" },
  { key: "days", label: "Dagars starttid", value: 5, suffix: "" },
  { key: "discount", label: "ROT-rabatt", value: 50, suffix: "%" },
  { key: "rating", label: "Kundbetyg", value: 4.9, suffix: "/5", decimals: 1 }
];

export const StatisticsBar = () => {
  return (
    <section className="py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statistics.map((stat, index) => (
            <StatItem key={stat.key} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface StatItemProps {
  stat: typeof statistics[0];
  index: number;
}

const StatItem = ({ stat, index }: StatItemProps) => {
  const { value, observe } = useCountUpOnce({
    key: `v2-stat-${stat.key}`,
    from: 0,
    to: stat.value,
    duration: 2000,
    formatter: (val) => stat.decimals ? val.toFixed(1) : Math.round(val).toLocaleString('sv-SE')
  });

  return (
    <motion.div
      ref={observe}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
        <GradientText>
          {value}{stat.suffix}
        </GradientText>
      </div>
      <div className="text-sm md:text-base text-muted-foreground">
        {stat.label}
      </div>
    </motion.div>
  );
};
