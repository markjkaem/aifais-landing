import { Calculator, Scale, Users, Megaphone, Target, ShoppingCart, Cpu, Headphones, Palette, Briefcase } from "lucide-react";
import { Sector } from "@/types/common";

export const SECTORS: Sector[] = [
    { id: "finance", name: "Finance & Administratie", icon: Calculator, color: "emerald", gradient: "from-emerald-500 to-teal-600", accentColor: "#10b981" },
    { id: "legal", name: "Juridisch & Compliance", icon: Scale, color: "violet", gradient: "from-violet-500 to-purple-600", accentColor: "#8b5cf6" },
    { id: "hr", name: "HR & Personeel", icon: Users, color: "blue", gradient: "from-blue-500 to-indigo-600", accentColor: "#3b82f6" },
    { id: "marketing", name: "Marketing", icon: Megaphone, color: "pink", gradient: "from-pink-500 to-rose-600", accentColor: "#ec4899" },
    { id: "sales", name: "Sales & CRM", icon: Target, color: "orange", gradient: "from-orange-500 to-amber-600", accentColor: "#f97316" },
    { id: "ecommerce", name: "E-commerce", icon: ShoppingCart, color: "cyan", gradient: "from-cyan-500 to-blue-600", accentColor: "#06b6d4" },
    { id: "technology", name: "IT & Software", icon: Cpu, color: "blue", gradient: "from-blue-600 to-violet-600", accentColor: "#2563eb" },
    { id: "support", name: "Klantenservice", icon: Headphones, color: "teal", gradient: "from-teal-500 to-cyan-600", accentColor: "#14b8a6" },
    { id: "creative", name: "Creatief & Design", icon: Palette, color: "fuchsia", gradient: "from-fuchsia-500 to-pink-600", accentColor: "#d946ef" },
    { id: "consulting", name: "Consulting", icon: Briefcase, color: "slate", gradient: "from-slate-600 to-gray-700", accentColor: "#475569" },
];
