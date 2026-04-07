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
            className="flex items-center justify-center gap-2 bg-[#5700FF] text-white px-6 py-4 rounded-xl font-black shadow-lg shadow-[#5700FF]/20 hover:scale-[1.02] transition-all"
            disabled={isPending}
        >
            <Icon size={20} className={isPending ? "animate-spin" : ""} />
            <span>{text}</span>
        </button>
    );
};

export default MainButton;