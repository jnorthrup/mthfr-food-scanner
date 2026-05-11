import { motion } from "framer-motion";

interface HomeHeaderProps {
  greeting: string;
}

export function HomeHeader({ greeting }: HomeHeaderProps) {
  return (
    <motion.div
      data-design-id="home-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1"
    >
      <h1 data-design-id="home-greeting" className="text-2xl font-bold">
        {greeting}
      </h1>
      <p data-design-id="home-subtitle" className="text-muted-foreground">
        Ready to scan your next product?
      </p>
    </motion.div>
  );
}
