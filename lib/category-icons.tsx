import {
  BookOpen,
  Sparkles,
  Wand2,
  Heart,
  Rocket,
  Search,
  Users,
  Briefcase,
  History,
  Lightbulb,
  Globe,
  Ghost,
  Utensils,
  Leaf,
  GraduationCap
} from "lucide-react";

export function getCategoryIcon(category: string, className: string) {
  const cat = category.toLowerCase();
  
  if (cat.includes("fiction") && !cat.includes("non-fiction") && !cat.includes("science")) return <Wand2 className={className} />;
  if (cat.includes("romance") || cat.includes("love")) return <Heart className={className} />;
  if (cat.includes("sci-fi") || cat.includes("science fiction") || cat.includes("space")) return <Rocket className={className} />;
  if (cat.includes("mystery") || cat.includes("thriller") || cat.includes("crime")) return <Search className={className} />;
  if (cat.includes("biography") || cat.includes("memoir") || cat.includes("autobiography")) return <Users className={className} />;
  if (cat.includes("business") || cat.includes("finance") || cat.includes("money") || cat.includes("economics")) return <Briefcase className={className} />;
  if (cat.includes("history") || cat.includes("historical")) return <History className={className} />;
  if (cat.includes("philosophy") || cat.includes("self-help") || cat.includes("psychology")) return <Lightbulb className={className} />;
  if (cat.includes("travel") || cat.includes("geography")) return <Globe className={className} />;
  if (cat.includes("horror") || cat.includes("scary")) return <Ghost className={className} />;
  if (cat.includes("cooking") || cat.includes("food") || cat.includes("recipe")) return <Utensils className={className} />;
  if (cat.includes("nature") || cat.includes("environment") || cat.includes("biology")) return <Leaf className={className} />;
  if (cat.includes("academic") || cat.includes("education") || cat.includes("textbook") || cat.includes("study")) return <GraduationCap className={className} />;
  if (cat.includes("fantasy") || cat.includes("magic")) return <Sparkles className={className} />;
  
  return <BookOpen className={className} />;
}

