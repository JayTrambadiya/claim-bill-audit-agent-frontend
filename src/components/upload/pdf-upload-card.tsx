"use client";

import { ChangeEvent, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileUp, Loader2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

type PresignResponse = {
    uploadUrl: string;
    key: string;
    headers: {
        "Content-Type": string;
    };
};

type UploadState =
    | { status: "idle" }
    | { status: "uploading"; progress: number; filename: string }
    | { status: "success"; filename: string; key: string }
    | { status: "error"; message: string };

function formatBytes(bytes: number) {
    const megabytes = bytes / (1024 * 1024);

    return `${megabytes.toFixed(1)} MB`;
}

function uploadFileToS3(file: File, presign: PresignResponse, onProgress: (progress: number) => void) {
    return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("PUT", presign.uploadUrl);
        xhr.setRequestHeader("Content-Type", presign.headers["Content-Type"]);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
                return;
            }

            reject(new Error(`S3 upload failed with status ${xhr.status}.`));
        };

        xhr.onerror = () => reject(new Error("Network error while uploading to S3."));
        xhr.send(file);
    });
}

export function PdfUploadCard() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" });

    async function handleFile(file: File) {
        if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
            setUploadState({ status: "error", message: "Please select a PDF file." });
            return;
        }

        if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
            setUploadState({
                status: "error",
                message: `PDF must be smaller than ${formatBytes(MAX_UPLOAD_BYTES)}.`,
            });
            return;
        }

        setUploadState({ status: "uploading", progress: 0, filename: file.name });

        try {
            const presignResponse = await fetch("/api/uploads/presign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                    size: file.size,
                }),
            });
            const presignBody = await presignResponse.json();

            if (!presignResponse.ok) {
                throw new Error(presignBody.error ?? "Could not create an upload URL.");
            }

            await uploadFileToS3(file, presignBody, (progress) => {
                setUploadState({ status: "uploading", progress, filename: file.name });
            });

            setUploadState({ status: "success", filename: file.name, key: presignBody.key });
        } catch (error) {
            setUploadState({
                status: "error",
                message: error instanceof Error ? error.message : "Upload failed.",
            });
        } finally {
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    }

    function handleSelectFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            void handleFile(file);
        }
    }

    const isUploading = uploadState.status === "uploading";

    return (
        <div className="rounded-lg border-2 border-dashed border-primary/25 bg-gradient-to-br from-sky-50 to-violet-50 p-8 text-center sm:p-12">
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={handleSelectFile}
            />
            <div className="mx-auto flex size-14 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-border">
                {isUploading ? (
                    <Loader2 className="size-7 animate-spin text-primary" />
                ) : (
                    <FileUp className="size-7 text-primary" />
                )}
            </div>
            <h2 className="mt-5 text-xl font-semibold">
                Upload EOB or itemized bill
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                PDF files only. Documents upload directly to S3 through a short-lived presigned URL.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                    className="trueclaim-gradient h-10 border-0 px-5 text-white shadow-sm hover:opacity-90"
                    disabled={isUploading}
                    onClick={() => inputRef.current?.click()}
                >
                    {isUploading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <FileUp className="size-4" />
                    )}
                    {isUploading ? "Uploading" : "Select PDF"}
                </Button>
                <Button
                    variant="outline"
                    className="h-10 px-5"
                    disabled={isUploading}
                    onClick={() => setUploadState({ status: "idle" })}
                >
                    Reset
                </Button>
            </div>

            {uploadState.status === "uploading" ? (
                <div className="mx-auto mt-6 max-w-md text-left">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate pr-3">{uploadState.filename}</span>
                        <span>{uploadState.progress}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white ring-1 ring-border">
                        <div
                            className="trueclaim-gradient h-full transition-all"
                            style={{ width: `${uploadState.progress}%` }}
                        />
                    </div>
                </div>
            ) : null}

            {uploadState.status === "success" ? (
                <div className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-left text-sm text-emerald-800">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                    <div>
                        <div className="font-medium">{uploadState.filename} uploaded.</div>
                        <div className="mt-1 break-all text-xs text-emerald-700">
                            S3 key: {uploadState.key}
                        </div>
                    </div>
                </div>
            ) : null}

            {uploadState.status === "error" ? (
                <div className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-left text-sm text-red-800">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{uploadState.message}</span>
                </div>
            ) : null}
        </div>
    );
}
