"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ScanBarcode,
  Plus,
  TrendingUp,
  Clock,
  Heart,
  Search,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeSearch } from "@/components/home/HomeSearch";
import { HomeSearchResults } from "@/components/home/HomeSearchResults";
import { HomeQuickActions } from "@/components/home/HomeQuickActions";
import { HomeStats } from "@/components/home/HomeStats";
import { HomeRecentScans } from "@/components/home/HomeRecentScans";
import { HomeEmptyState } from "@/components/home/HomeEmptyState";

export function HomeScreen() {
  const { scanHistory, favorites, setActiveTab, setCurrentProduct } =
    useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const recentScans = scanHistory.slice(0, 5);
  const filteredHistory = searchQuery
    ? scanHistory.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.upc.includes(searchQuery),
      )
    : [];

  return (
    <ScrollArea className="h-full">
      <div data-design-id="home-screen" className="pb-24 px-5 pt-4 space-y-6">
        <HomeHeader greeting={greeting} />
        <HomeSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {searchQuery && filteredHistory.length > 0 && (
          <HomeSearchResults
            filteredHistory={filteredHistory}
            setCurrentProduct={setCurrentProduct}
            setActiveTab={setActiveTab}
          />
        )}

        {!searchQuery && (
          <>
            <HomeQuickActions setActiveTab={setActiveTab} />
            <HomeStats scanHistory={scanHistory} favorites={favorites} />

            {recentScans.length > 0 ? (
              <HomeRecentScans
                recentScans={recentScans}
                setActiveTab={setActiveTab}
                setCurrentProduct={setCurrentProduct}
              />
            ) : (
              <HomeEmptyState setActiveTab={setActiveTab} />
            )}
          </>
        )}
      </div>
    </ScrollArea>
  );
}
