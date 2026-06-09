"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, LucideIcon } from "lucide-react";

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    options: Option[];
    placeholder?: string;
    icon?: LucideIcon;
    disabled?: boolean;
}

const MultiSelect = ({
    value,
    onChange,
    options,
    placeholder = "اختر الدروس",
    icon: Icon,
    disabled = false,
}: MultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutside);

        return () => {
            document.removeEventListener("mousedown", handleOutside);
        };
    }, []);

    const toggleOption = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onChange(value.filter((item) => item !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    const removeItem = (itemValue: string) => {
        onChange(value.filter((item) => item !== itemValue));
    };

    const selectedOptions = options?.filter((option) =>
        value.includes(option.value)
    );

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Trigger */}
            <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                onKeyDown={(e) => {
                    if (disabled) return;

                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsOpen((prev) => !prev);
                    }
                }}
                className={`
          w-full min-h-[52px]
          relative pr-11 pl-10 py-2
          bg-slate-50 border border-slate-200/80
          rounded-xl text-right
          transition-all duration-200
          cursor-pointer
          ${isOpen
                        ? "border-accent bg-white ring-2 ring-accent/10"
                        : "hover:bg-slate-100/60"
                    }
          ${disabled ? "opacity-50 pointer-events-none" : ""}
        `}
            >
                {Icon && (
                    <Icon
                        size={18}
                        className={`absolute right-4 top-4 transition-colors ${isOpen ? "text-accent" : "text-slate-400"
                            }`}
                    />
                )}

                <ChevronDown
                    size={16}
                    className={`absolute left-4 top-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-accent" : ""
                        }`}
                />

                {selectedOptions?.length === 0 ? (
                    <span className="text-slate-400 text-sm">
                        {placeholder}
                    </span>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {selectedOptions?.map((item) => (
                            <div
                                key={item.value}
                                className="
                  flex items-center gap-1
                  px-2 py-1
                  bg-accent/10
                  text-accent
                  rounded-lg
                  text-xs
                  font-semibold
                "
                            >
                                <span>{item.label}</span>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeItem(item.value);
                                    }}
                                    className="hover:text-red-500 transition"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="
            absolute z-50 top-full mt-2 w-full
            bg-white border border-slate-100
            rounded-2xl shadow-xl
            overflow-hidden
          "
                >
                    <div className="max-h-72 overflow-y-auto py-2">
                        {options?.map((option) => {
                            const selected = value.includes(option.value);

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleOption(option.value)}
                                    className={`
                    w-full px-4 py-3
                    flex items-center justify-between
                    text-right transition-all duration-150
                    ${selected
                                            ? "bg-accent/5"
                                            : "hover:bg-slate-50"
                                        }
                  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`
                        w-5 h-5 rounded-md border
                        flex items-center justify-center
                        transition-all
                        ${selected
                                                    ? "bg-accent border-accent text-white"
                                                    : "border-slate-300"
                                                }
                      `}
                                        >
                                            {selected && <Check size={12} />}
                                        </div>

                                        <span
                                            className={
                                                selected
                                                    ? "font-semibold text-accent"
                                                    : "text-slate-700"
                                            }
                                        >
                                            {option.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {value?.length > 0 && (
                        <div className="border-t bg-slate-50 px-4 py-2 text-xs text-slate-500">
                            تم اختيار {value.length} درس
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;