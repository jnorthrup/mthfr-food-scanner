import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HomeSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HomeSearch({ searchQuery, setSearchQuery }: HomeSearchProps) {
  return (
    <motion.div
      data-design-id="home-search"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        data-design-id="home-search-input"
        placeholder="Search scanned products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 h-12 rounded-xl"
      />
    </motion.div>
  );
}
