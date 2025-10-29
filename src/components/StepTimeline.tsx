import { motion } from "framer-motion";

export function StepTimeline({
  current = 0,
  total = 8,
}: {
  current?: number;
  total?: number;
}) {
  return (
    <div className="mt-4 flex items-center justify-between">
      {[...Array(total)].map((_, i) => (
        <motion.div
          key={i}
          className={`h-2 flex-1 mx-0.5 rounded-full ${i < current ? "bg-brand-primary" : "bg-gray-200"}`}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}
