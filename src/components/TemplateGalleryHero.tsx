import { useState } from "react";
import { Search, Mail, MessageSquare, Bell, Smartphone, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TemplateGalleryHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  templatesCount?: number;
}

const categoryTabs = [
  { id: "all", label: "All Templates", icon: null },
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "push", label: "Push", icon: Bell },
  { id: "in-app", label: "In-App", icon: Smartphone },
];

export function TemplateGalleryHero({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  templatesCount = 100,
}: TemplateGalleryHeroProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-background/50 pt-20 pb-12">
        {/* Background Elements - Notification delivery metaphor */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Gradient Orbs - primary accent */}
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          {/* Subtle grid pattern for notification context */}
          <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* New Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary dark:text-primary border-primary/30 px-3 py-1 text-xs font-semibold tracking-wide"
              >
                ✨ Ready to use. No coding required.
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                <span className="text-content block">Perfect notifications</span>
                <span className="text-gradient-primary block">in minutes</span>
              </h1>
              <p className="text-lg text-content-secondary max-w-2xl leading-relaxed">
                Stop building from scratch. Pick from 100+ proven templates, customize in seconds, and send. Every template ships with mobile layouts, dark mode, and variable support—built in.
              </p>
            </motion.div>

            {/* Search and Browse Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 max-w-2xl items-stretch"
            >
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-content-secondary transition-colors group-focus-within:text-primary" />
                <Input
                  type="text"
                  placeholder="Find by use case (e.g. 'welcome', 'order confirmation')..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-card border border-border/60 rounded-xl pl-12 pr-4 py-3 text-base placeholder:text-content-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all dark:bg-slate-900/50 group-focus-within:shadow-sm group-focus-within:shadow-primary/10"
                />
              </div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold shadow-primary/30 hover:shadow-primary/50 transition-all rounded-xl"
                >
                  Explore Gallery →
                </Button>
              </motion.div>
            </motion.div>

            {/* Category Stats - Hidden on mobile, shown on desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="hidden md:flex justify-between items-center pt-6 border-t border-border/30"
            >
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-content">{templatesCount}+</div>
                  <p className="text-xs text-content-secondary mt-1">Ready to use</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-content">2.5M+</div>
                  <p className="text-xs text-content-secondary mt-1">Sent successfully</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-content">4.9★</div>
                  <p className="text-xs text-content-secondary mt-1">Community rating</p>
                </div>
              </div>

              {/* Desktop Filter Icons */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-lg hover:bg-card"
                  title="Filter by email"
                >
                  <Mail className="h-5 w-5 text-content-secondary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-lg hover:bg-card"
                  title="Filter by notifications"
                >
                  <Bell className="h-5 w-5 text-content-secondary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-lg hover:bg-card"
                  title="Filter options"
                >
                  <Filter className="h-5 w-5 text-content-secondary" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs Section */}
      <section className="sticky top-16 z-40 bg-background/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-border/30 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 py-4">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden flex items-center justify-between">
              <p className="text-sm font-semibold text-content">Browse by Channel</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                {showMobileFilters ? "Hide" : "Show"}
              </Button>
            </div>

            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`flex flex-wrap gap-2 ${showMobileFilters ? "block" : "hidden md:flex"}`}
            >
              {categoryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFilter === tab.id;

                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onFilterChange(tab.id)}
                    className={`rounded-full font-medium transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-primary/40 hover:shadow-primary/50"
                        : "hover:bg-primary/5 text-content-secondary hover:text-content border border-transparent hover:border-primary/20"
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4 mr-1.5" />}
                    {tab.label}
                  </Button>
                );
              })}
            </motion.div>

            {/* Filter close button on mobile */}
            {showMobileFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(false)}
                className="w-full md:hidden"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
