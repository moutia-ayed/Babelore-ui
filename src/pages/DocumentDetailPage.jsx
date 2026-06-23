import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocumentById, downloadDocument } from "../api/documentsApi";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DetailRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-8">
      <span className="w-40 shrink-0 text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getDocumentById(id);
        setDocument(response.data);
      } catch {
        setError("Document not found.");
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [id]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadDocument(id, document.fileName);
    } catch {
      alert("Failed to download document.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 sm:p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-gray-800"
      >
        ← Back to files
      </button>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h1 className="text-xl font-semibold text-gray-900">{document.title}</h1>
          {document.description && (
            <p className="mt-1 text-sm text-gray-500">{document.description}</p>
          )}
        </div>

        <div className="divide-y divide-gray-100 px-6">
          <DetailRow label="Author" value={document.author} />
          <DetailRow label="Publisher" value={document.publisher} />
          <DetailRow label="Published year" value={document.publishedYear} />
          <DetailRow label="File name" value={document.fileName} />
          <DetailRow label="Content type" value={document.contentType} />
          <DetailRow label="File size" value={formatBytes(document.fileSizeInBytes)} />
          <DetailRow label="Uploaded at" value={formatDate(document.uploadedAt)} />
        </div>

        <div className="px-6 py-5">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDownloading ? "Downloading..." : "Download file"}
          </button>
        </div>
      </div>
    </div>
  );
}
