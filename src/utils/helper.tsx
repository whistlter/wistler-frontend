import { GeneralEnum } from "@/Enum/generalEnum";

export function formatNumber(value: number): string {
    if (value < 1000) return value.toString();

    const units = [
        { limit: 1_000_000_000, suffix: "B" },
        { limit: 1_000_000, suffix: "M" },
        { limit: 1_000, suffix: "(K)" },
    ];

    for (const unit of units) {
        if (value >= unit.limit) {
            const raw = value / unit.limit;

            // Keep up to 3 decimal places, trim trailing zeros
            const formatted = raw
                .toFixed(3)
                .replace(/\.?0+$/, "");

            return `${formatted}${unit.suffix}`;
        }
    }

    return value.toString();
}

export function formatDate(input: unknown): string {
    if (!input) return "";

    let date: Date | null = null;

    // 1. Native Date
    if (input instanceof Date) {
        date = input;
    }

    // 2. Firestore / Day.js / Luxon objects
    else if (
        typeof input === "object" &&
        input !== null &&
        typeof (input as any).toDate === "function"
    ) {
        date = (input as any).toDate();
    }

    // 3. Firestore Timestamp { seconds, nanoseconds }
    else if (
        typeof input === "object" &&
        input !== null &&
        "seconds" in input
    ) {
        const seconds = (input as any).seconds;
        date = new Date(seconds * 1000);
    }

    // 4. Number (timestamp)
    else if (typeof input === "number") {
        // Detect seconds vs milliseconds
        date =
            input < 1e12
                ? new Date(input * 1000)
                : new Date(input);
    }

    // 5. Numeric string timestamp
    else if (typeof input === "string" && /^\d+$/.test(input)) {
        const num = Number(input);
        date =
            num < 1e12
                ? new Date(num * 1000)
                : new Date(num);
    }

    // 6. Date string (ISO / backend)
    else if (typeof input === "string") {
        date = new Date(input);
    }

    // Invalid
    if (!date || isNaN(date.getTime())) return "";

    return date
        .toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        .replace(",", "");
}

export function statusToColor(status: string) {
    switch (status.toLowerCase()) {
        case GeneralEnum.ACTIVE:
            return "w-[6px] h-[6px] rounded-[1px] bg-[#57A523]";
        case GeneralEnum.IN_REVIEW:
            return "w-[6px] h-[6px] rounded-[1px] bg-[#FF9A54]";
        case GeneralEnum.PUBLISHED:
            return "w-[6px] h-[6px] rounded-[1px] bg-[#2873FF]";
        default:
            return "w-[6px] h-[6px] rounded-[1px] bg-[#969696]";
    }
}

export interface IsEmptyOptions {
    trimStrings?: boolean;
    zeroIsEmpty?: boolean;
    falseIsEmpty?: boolean;
    deep?: boolean;
    maxDepth?: number;
    detectCircular?: boolean;
}

const DEFAULT_OPTIONS: Required<IsEmptyOptions> = {
    trimStrings: true,
    zeroIsEmpty: false,
    falseIsEmpty: false,
    deep: true,
    maxDepth: 10,
    detectCircular: true,
};

export function isEmpty(
    value: unknown,
    options: IsEmptyOptions = {},
    depth = 0,
    seen?: WeakSet<object>
): boolean {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // -----------------------------------
    // RECURSION SAFETY
    // -----------------------------------
    if (depth > opts.maxDepth) return false;

    // -----------------------------------
    // NULL / UNDEFINED
    // -----------------------------------
    if (value === null || value === undefined) return true;

    // -----------------------------------
    // STRING
    // -----------------------------------
    if (typeof value === "string") {
        return opts.trimStrings
            ? value.trim().length === 0
            : value.length === 0;
    }

    // -----------------------------------
    // NUMBER
    // -----------------------------------
    if (typeof value === "number") {
        if (Number.isNaN(value)) return true;
        if (!Number.isFinite(value)) return false;
        return opts.zeroIsEmpty ? value === 0 : false;
    }

    // -----------------------------------
    // BOOLEAN
    // -----------------------------------
    if (typeof value === "boolean") {
        return opts.falseIsEmpty ? value === false : false;
    }

    // -----------------------------------
    // FUNCTION / SYMBOL
    // -----------------------------------
    if (typeof value === "function" || typeof value === "symbol") {
        return false;
    }

    // -----------------------------------
    // DATE
    // -----------------------------------
    if (value instanceof Date) {
        return isNaN(value.getTime());
    }

    // -----------------------------------
    // ARRAY
    // -----------------------------------
    if (Array.isArray(value)) {
        if (value.length === 0) return true;
        if (!opts.deep) return false;

        return value.every((v) =>
            isEmpty(v, opts, depth + 1, seen)
        );
    }

    // -----------------------------------
    // MAP / SET
    // -----------------------------------
    if (value instanceof Map || value instanceof Set) {
        if (value.size === 0) return true;
        if (!opts.deep) return false;

        return Array.from(value.values()).every((v) =>
            isEmpty(v, opts, depth + 1, seen)
        );
    }

    // -----------------------------------
    // TYPED ARRAYS
    // -----------------------------------
    if (ArrayBuffer.isView(value)) {
        return (value as any).length === 0;
    }

    // -----------------------------------
    // OBJECT (PLAIN ONLY)
    // -----------------------------------
    if (typeof value === "object") {
        if (opts.detectCircular) {
            seen ??= new WeakSet();
            if (seen.has(value as object)) return false;
            seen.add(value as object);
        }

        const proto = Object.getPrototypeOf(value);
        const isPlain =
            proto === Object.prototype || proto === null;

        if (!isPlain) return false;

        const keys = Object.keys(value as object);
        if (keys.length === 0) return true;
        if (!opts.deep) return false;

        return keys.every((k) =>
            isEmpty(
                (value as any)[k],
                opts,
                depth + 1,
                seen
            )
        );
    }

    return false;
}