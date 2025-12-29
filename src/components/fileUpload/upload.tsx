import { useEffect, useRef, useState } from "react";

type Props = {
    onUpload?: (file: File, onProgress: (p: number) => void) => Promise<void>;
    onFileSelect?: (file: File | null) => void;
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export default function FileUpload({ onUpload, onFileSelect }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);

    /* ----------------------------
       CLEANUP
    ---------------------------- */
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    /* ----------------------------
       FILE PICKER
    ---------------------------- */
    function openPicker() {
        if (!uploading) inputRef.current?.click();
    }

    /* ----------------------------
       VALIDATE + PROCESS FILE
    ---------------------------- */
    async function processFile(file: File) {
        setError(null);

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Only JPG and PNG images are allowed.");
            return;
        }

        if (file.size > MAX_SIZE) {
            setError("Maximum file size is 2MB.");
            return;
        }

        if (preview) URL.revokeObjectURL(preview);

        const url = URL.createObjectURL(file);
        setPreview(url);
        setFileName(file.name);
        onFileSelect?.(file);

        if (onUpload) {
            setUploading(true);
            setProgress(0);

            try {
                await onUpload(file, (p) => setProgress(p));
            } catch {
                setError("Upload failed. Please try again.");
                removeImage();
                return;
            } finally {
                setUploading(false);
            }
        }
    }

    /* ----------------------------
       INPUT CHANGE
    ---------------------------- */
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    }

    /* ----------------------------
       DRAG & DROP
    ---------------------------- */
    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    }

    /* ----------------------------
       REMOVE IMAGE
    ---------------------------- */
    function removeImage() {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setFileName(null);
        setProgress(0);
        setError(null);
        onFileSelect?.(null);

        if (inputRef.current) inputRef.current.value = "";
    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                hidden
                accept="image/jpeg,image/png"
                onChange={handleChange}
            />

            <div
                onClick={!preview ? openPicker : undefined}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`
          relative h-48 w-full overflow-hidden rounded-lg
          border-2 border-dashed
          ${dragging ? "border-pink-500 bg-pink-50" : "border-[#E8E8E8]"}
          bg-[#F9F9F9]
          cursor-pointer transition
        `}
            >
                {/* PREVIEW */}
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-full w-full object-contain bg-[#F9F9F9]"
                        />

                        {/* REMOVE */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                            }}
                            className="
                absolute top-3 right-3
                h-8 w-8 rounded-full
                bg-black/60 text-white
                flex items-center justify-center
                hover:bg-black transition cursor-pointer
              "
                        >
                            ✕
                        </button>

                        {/* FILE NAME */}
                        {fileName && (
                            <div className="absolute bottom-2 right-3 text-xs text-[#666] bg-white/90 px-2 py-1 rounded-md shadow">
                                {fileName}
                            </div>
                        )}

                        {/* PROGRESS */}
                        {uploading && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                                <div
                                    className="h-full bg-pink-600 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    /* EMPTY STATE */
                    <div className="flex h-full flex-col items-center justify-center text-center px-4">
                        <svg
                            className="mb-3 h-12 w-12 text-[#969696]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>

                        <p className="text-[13px] font-medium text-[#969696]">
                            Attach photo or drag & drop
                        </p>
                        <p className="mt-1 text-xs text-[#969696]">
                            jpg, jpeg, png • up to 2mb
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-xs font-medium text-red-500">
                    {error}
                </p>
            )}
        </>
    );
}