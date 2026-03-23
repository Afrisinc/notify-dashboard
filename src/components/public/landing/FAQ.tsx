import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FAQItem[] = [
  { id: "1", question: "What is Notifyr?", answer: "Notifyr is a multi-channel notification platform that lets you send email, SMS, push, and in-app notifications through a single API. It's designed for developers and teams who need reliable, scalable notification delivery." },
  { id: "2", question: "Which channels are supported?", answer: "We support Email, SMS, Push Notifications, and In-App messaging. All channels are accessible through our unified REST API and dashboard." },
  { id: "3", question: "How is billing calculated?", answer: "Billing is based on the number of notifications sent per month. Each channel counts as one notification. You can view usage in real-time on your dashboard." },
  { id: "4", question: "What about security and compliance?", answer: "We're SOC 2 compliant with enterprise-grade encryption at rest and in transit. We support role-based access control, audit logs, and data processing agreements (DPA)." },
  { id: "5", question: "Is there a free plan?", answer: "Yes! Our free plan includes 100 notifications per month, 1 template, and email channel access. No credit card required to get started." },
  { id: "6", question: "Can I use custom templates?", answer: "Absolutely. Create templates with our visual editor or import them from the marketplace. Templates support dynamic variables like {{name}} and {{code}}." },
  { id: "7", question: "What support options are available?", answer: "Free plans get community support. Pro plans include priority email support with 24-hour response times. Enterprise plans come with a dedicated account manager and SLA guarantee." },
  { id: "8", question: "How do I migrate from another service?", answer: "We provide migration guides and our support team can help you transition. Most teams are fully migrated within a day thanks to our compatible API design." },
];

export function FAQ({
  items = DEFAULT_FAQS,
  searchable = true,
}: {
  items?: FAQItem[];
  searchable?: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? items.filter((i) => i.question.toLowerCase().includes(query.toLowerCase()))
    : items;

  return (
    <section className="py-20 border-t border-border/50">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="heading-section">Frequently asked questions</h2>
          <p className="text-foreground/75 dark:text-foreground/80 mt-3">Everything you need to know about Notifyr</p>
        </motion.div>

        {searchable && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 dark:text-foreground/60" />
            <Input
              placeholder="Search questions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        <Accordion type="single" collapsible className="space-y-2">
          {filtered.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="bg-card border border-border rounded-lg px-4 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground dark:text-white hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 dark:text-foreground/90 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filtered.length === 0 && (
          <p className="text-center text-foreground/70 dark:text-foreground/80 py-8">No matching questions found.</p>
        )}
      </div>
    </section>
  );
}
