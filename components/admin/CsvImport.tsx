"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface CsvImportProps {
    productId: string;
    onSuccess?: () => void;
}

export function CsvImport({ productId, onSuccess }: CsvImportProps) {
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [importedCount, setImportedCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus("uploading");
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("productId", productId);

            const response = await fetch("/api/admin/import/accounts", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setImportedCount(data.imported);
                setMessage(`Successfully imported ${data.imported} accounts`);
                if (data.errors?.length) {
                    setMessage((m) => `${m} (${data.errors.length} skipped)`);
                }
                onSuccess?.();
                // Reset after delay
                setTimeout(() => {
                    setStatus("idle");
                    setMessage("");
                    window.location.reload();
                }, 2000);
            } else {
                setStatus("error");
                setMessage(data.error || "Import failed");
            }
        } catch {
            setStatus("error");
            setMessage("Upload failed. Please try again.");
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="border-t border-snow-primary/20 pt-4 mt-4">
            <p className="text-xs text-gray-500 mb-3">Or import from CSV file:</p>

            <label className="flex items-center justify-center gap-2 w-full border border-dashed border-snow-primary/30 rounded-lg py-3 px-4 cursor-pointer hover:border-snow-accent/50 hover:bg-white/5 transition-colors">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={status === "uploading"}
                />

                {status === "idle" && (
                    <>
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Import CSV</span>
                    </>
                )}

                {status === "uploading" && (
                    <>
                        <Loader2 className="w-4 h-4 text-snow-accent animate-spin" />
                        <span className="text-sm text-snow-accent">Importing...</span>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">{importedCount} imported!</span>
                    </>
                )}

                {status === "error" && (
                    <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400">Failed</span>
                    </>
                )}
            </label>

            {message && status === "error" && (
                <p className="text-xs text-red-400 mt-2">{message}</p>
            )}

            <div className="mt-3 p-2 bg-white/5 rounded text-xs text-gray-500">
                <FileText className="w-3 h-3 inline mr-1" />
                CSV format: <code className="text-snow-accent">username,password</code>
            </div>
        </div>
    );
}
