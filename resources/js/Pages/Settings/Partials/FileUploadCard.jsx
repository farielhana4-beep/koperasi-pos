import { useEffect, useRef, useState } from 'react';

export default function FileUploadCard({
    label,
    description,
    previewUrl,
    file,
    setFile,
    accept,
    helpText,
}) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(previewUrl);

    useEffect(() => {
        if (file instanceof File) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }

        setPreview(previewUrl);
    }, [file, previewUrl]);

    return (
        <div
            className="group rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/40 hover:bg-white/10"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
                event.preventDefault();
                const droppedFile = event.dataTransfer.files?.[0] ?? null;

                if (droppedFile) {
                    setFile(droppedFile);
                }
            }}
        >
            <div className="flex items-start gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80">
                    {preview ? (
                        <img
                            src={preview}
                            alt={label}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            No image
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{label}</h4>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                            Drag & drop
                        </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="inline-flex items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/15"
                        >
                            Choose file
                        </button>
                        <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Remove
                        </button>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">{helpText}</p>
                </div>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
        </div>
    );
}
