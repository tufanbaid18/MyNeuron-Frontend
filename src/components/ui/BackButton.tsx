import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

function BackButton() {
  const router = useRouter();
  return (
    <button
      className="group flex items-center gap-2 w-fit px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500/30 cursor-pointer"
      onClick={() => router.history.back()}
    >
      <ArrowLeft size={18} className="transition-transform duration-300 ease-out group-hover:-translate-x-1" />
      <span>Back</span>
    </button>
  );
}

export default BackButton;
