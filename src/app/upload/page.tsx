"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { DashboardShell } from "@/src/components/layout/dashboard-shell";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/src/components/ui/input";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedKey, setUploadedKey] = useState("");
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const presignResponse = await fetch("/api/uploads/presign", {
        method: "POST",
      });

      if (!presignResponse.ok) {
        throw new Error("Failed to get upload url");
      }

      const { uploadUrl, key } = await presignResponse.json();

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/pdf",
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      setUploadedKey(key);
      toast.success("Upload Successful!", {
        description: `${file.name} has been uploaded and sent for audit.`,
        position: "top-center",
        duration: 2000,
      });
      router.push(`/audits?filter=${key}`); // Redirect to audits page with filter
    } catch (error) {
      console.error(error);
      toast.error("Upload Failed", {
        description: `There was an error uploading your file. ${error}`,
        position: "top-center",
        duration: 2000,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto  ">
          <CardContent className="space-y-2 p-6 flex flex-col items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Upload EOB / Itemized Bills
              </h2>
              <p className="text-muted-foreground mt-1">PDF files only</p>
            </div>

            <div className="p-2">
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <Button
              className={"max-w-fit"}
              disabled={!file || uploading}
              onClick={handleUpload}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload PDF
                </>
              )}
            </Button>

            {uploadedKey && (
              <div className="flex items-center gap-2 rounded-md border p-3">
                <CheckCircle2 className="h-5 w-5" />
                <span>Uploaded successfully</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
