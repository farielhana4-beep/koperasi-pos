import InputError from '@/Components/InputError';
import { useEffect, useRef, useState } from 'react';

const PLACEHOLDER_IMAGE = '/images/product-placeholder.svg';

async function normalizeImageFile(file) {
    if (!file || !file.type.startsWith('image/') || file.type === 'image/svg+xml') {
        return file;
    }

    const bitmap = await createImageBitmap(file);
    const size = Math.min(bitmap.width, bitmap.height);
    const sourceX = Math.max((bitmap.width - size) / 2, 0);
    const sourceY = Math.max((bitmap.height - size) / 2, 0);
    const canvas = document.createElement('canvas');
    const outputSize = 1200;

    canvas.width = outputSize;
    canvas.height = outputSize;

    const context = canvas.getContext('2d');

    if (!context) {
        return file;
    }

    context.drawImage(
        bitmap,
        sourceX,
        sourceY,
        size,
        size,
        0,
        0,
        outputSize,
        outputSize,
    );

    const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, file.type || 'image/jpeg', 0.92),
    );

    if (!blob) {
        return file;
    }

    const extension =
        blob.type === 'image/png'
            ? '.png'
            : blob.type === 'image/webp'
              ? '.webp'
              : '.jpg';

    return new File([blob], file.name.replace(/\.(png|jpe?g|webp)$/i, extension), {
        type: blob.type || 'image/jpeg',
        lastModified: Date.now(),
    });
}

export default function ProductImageDropzone({
    file,
    existingImageUrl,
    onFileChange,
    error,
}) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(
        existingImageUrl || PLACEHOLDER_IMAGE,
    );

    useEffect(() => {
        if (!file) {
            setPreviewUrl(existingImageUrl || PLACEHOLDER_IMAGE);
            return undefined;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file, existingImageUrl]);

    const handleFiles = async (files) => {
        const nextFile = files?.[0] ?? null;

        if (!nextFile) {
            return;
        }

        onFileChange(await normalizeImageFile(nextFile));
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
    };

    return (
        <div className="space-y-2">
            <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        inputRef.current?.click();
                    }
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`cursor-pointer rounded-2xl border border-dashed p-4 transition ${
                    isDragging
                        ? 'border-cyan-400/50 bg-cyan-400/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-cyan-400/30'
                }`}
            >
                <div className="mx-auto w-full max-w-[200px]">
                    <div className="aspect-square overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                        <img
                            src={previewUrl}
                            alt="Product preview"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                <p className="mt-3 text-center text-sm text-slate-400">
                    Click or drag an image here. JPG, PNG, or WebP up to 2MB.
                </p>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(event) => {
                        handleFiles(event.target.files);
                        event.target.value = '';
                    }}
                />
            </div>

            {file ? (
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={() => onFileChange(null)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
                    >
                        Remove image
                    </button>
                </div>
            ) : null}

            <InputError message={error} className="text-center" />
        </div>
    );
}
