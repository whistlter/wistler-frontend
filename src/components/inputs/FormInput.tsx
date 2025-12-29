import { useState, useEffect, useRef } from "react";
import { INPUT_CONFIG } from "./inputConfig";
import { AppIcons } from "@/constants/constant";

type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "textarea"
  | "search"
  | "select";

type Props = {
  type?: InputType;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  maxLength?: number;
  onChange?: (value: string) => void;
};

export function FormInput({
  type = "text",
  placeholder = "",
  value = "",
  disabled = false,
  onChange,
  maxLength,
}: Props) {
  const config = INPUT_CONFIG[type] ?? {};

  const [internalValue, setInternalValue] = useState(value);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  function validate(val: string) {
    if (config.validate) {
      setError(val === "" ? null : config.validate(val));
    }
  }

  function emit(value: string) {
    setInternalValue(value);

    if (config.debounce) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        onChange?.(value);
        validate(value);
      }, config.debounce);
    } else {
      onChange?.(value);
      validate(value);
    }
  }

  const resolvedType =
    type === "password" && !showPassword ? "password" : "text";

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        {/* Left icon */}
        {config.leftIcon && (
          <img
            src={config.leftIcon}
            alt=""
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          />
        )}

        {/* Input */}
        {type === "textarea" ? (
          <textarea
            disabled={disabled}
            value={internalValue}
            placeholder={placeholder}
            onChange={(e) => emit(e.target.value)}
            className="
            w-full rounded-xl border border-[#E8E8E8] bg-white px-3 py-2.5 text-sm
            shadow-[0_1px_1px_rgba(0,0,0,0.03)]
            focus:border-[#EB003D] focus:outline-none
            placeholder:text-[#969696] placeholder:text-[13px] placeholder:font-medium
          "
          />
        ) : (
          <input
            disabled={disabled}
            type={resolvedType}
            value={internalValue}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(e) => emit(e.target.value)}
            className={`
    w-full rounded-xl border border-[#E8E8E8] bg-white py-2.5 text-sm
    shadow-[0_1px_1px_rgba(0,0,0,0.03)]
    focus:border-[#EB003D] focus:outline-none
    placeholder:text-[#969696] placeholder:text-[13px] placeholder:font-medium
    appearance-none
    [&::-ms-reveal]:hidden [&::-ms-clear]:hidden
    ${config.leftIcon ? "pl-10 pr-10" : "px-3"}
  `}
          />
        )}

        {/* Password toggle */}
        {config.rightToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <img
              src={showPassword ? AppIcons.eyeOpen : AppIcons.eyeClosed}
              alt=""
              className="w-4 h-4"
            />
          </button>
        )}

        {/* Clear search */}
        {type === "search" && internalValue && (
          <button
            type="button"
            onClick={() => emit("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <img src={AppIcons.x} alt="" className="w-4 h-4 cursor-pointer w-5 h-[100%]" />
          </button>
        )}
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}