import { LucideIcon } from "lucide-react";

interface MainButtonProps {
  setStateFn?: (value: boolean) => void;
  icon: LucideIcon;
  text: string;
  isPending?: boolean;
}

const MainButton = ({
  setStateFn,
  icon: Icon,
  text,
  isPending,
}: MainButtonProps) => {
  return (
    <button
      onClick={() => setStateFn && setStateFn(true)}
      className="flex items-center justify-center gap-2 bg-[#5700FF] text-white 
                      px-2 py-2 md:px-6 md:py-4 rounded-lg md:rounded-xl font-black shadow-lg 
                      shadow-[#5700FF]/20 hover:scale-[1.02] transition-all text-sm md:text-lg"
      disabled={isPending}
    >
      {/* <Icon size={20} className={isPending ? "animate-spin" : ""} /> */}
      <Icon className={` w-3 h-3 md:w-6 md:h-6 lg:w-8 lg:h-8 ${isPending ? "animate-spin" : ""} `}
      />
      <span>{text}</span>
    </button>
  );
};

export default MainButton;
