import { Bell } from "lucide-react";

export default function ComingSoonTool({ toolName }: { toolName: string }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Bell className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        {toolName} is bijna klaar!
      </h2>
      <p className="text-slate-500 mb-8">
        We leggen de laatste hand aan deze tool. Wil je een seintje krijgen zodra hij live staat?
      </p>
      
      <form className="flex gap-2 max-w-md mx-auto">
        <input 
          type="email" 
          placeholder="Je e-mailadres" 
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          Houd me op de hoogte
        </button>
      </form>
    </div>
  );
}
