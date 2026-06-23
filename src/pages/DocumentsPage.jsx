import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDocuments, deleteDocument, downloadDocument } from "../api/documentsApi";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getMyDocuments();
        setDocuments(response.data);
      } catch {
        setError("Failed to load documents.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    setDeletingId(id);
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch {
      alert("Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (e, id, fileName) => {
    e.stopPropagation();
    setDownloadingId(id);
    try {
      await downloadDocument(id, fileName);
    } catch {
      alert("Failed to download document.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">Loading documents...</p>
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
    <div className="mx-auto max-w-6xl p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            {documents.length} document{documents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/documents/upload")}
          className="flex-shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          + Upload
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
            </svg>
          </span>
          <h2 className="text-base font-semibold text-gray-900">No documents yet</h2>
          <p className="mt-1 text-sm text-gray-500">Upload a file to get started.</p>
          <button
            onClick={() => navigate("/documents/upload")}
            className="mt-5 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            Upload your first document
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Title", "Author", "Year", "Size", "Uploaded", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => navigate(`/documents/${doc.id}`)}
                  className="cursor-pointer transition hover:bg-indigo-50"
                >
                  <td className="px-5 py-4">
                    <span className="font-medium text-gray-900">{doc.title}</span>
                    {doc.description && (
                      <p className="mt-0.5 max-w-xs truncate text-xs text-gray-400">
                        {doc.description}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{doc.author}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{doc.publishedYear}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {formatBytes(doc.fileSizeInBytes)}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {formatDate(doc.uploadedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDownload(e, doc.id, doc.fileName)}
                        disabled={downloadingId === doc.id}
                        className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
                      >
                        {downloadingId === doc.id ? "..." : "Download"}
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, doc.id)}
                        disabled={deletingId === doc.id}
                        className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        {deletingId === doc.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}