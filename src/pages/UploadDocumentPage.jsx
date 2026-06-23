import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadDocument, uploadLargeDocument } from "../api/documentsApi";

const INITIAL_FORM = {
  title: "",
  description: "",
  author: "",
  publisher: "",
  publishedYear: "",
};

// 50MB threshold — files above this should use the large upload mode
const LARGE_FILE_THRESHOLD = 50 * 1024 * 1024;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Field({ label, id, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ProgressBar({ percent }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Uploading...</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-200"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function UploadDocumentPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);
  const [isLarge, setIsLarge] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const picked = e.target.files[0] ?? null;
    setFile(picked);

    // Auto-suggest switching to large mode if the file exceeds the threshold,
    // but don't force it — the user controls the toggle.
    if (picked && picked.size > LARGE_FILE_THRESHOLD && !isLarge) {
      setError(
        `This file is ${formatBytes(picked.size)}. Consider switching to large file mode for better reliability.`
      );
    } else {
      setError("");
    }
  };

  const handleToggle = () => {
    setIsLarge((prev) => !prev);
    setFile(null);
    setProgress(0);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setProgress(0);

    try {
      if (isLarge) {
        // Metadata as query params, file as raw request body stream.
        await uploadLargeDocument(file, form, setProgress);
      } else {
        // Standard multipart/form-data for small files.
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("author", form.author);
        formData.append("publisher", form.publisher);
        formData.append("publishedYear", form.publishedYear);
        formData.append("file", file);
        await uploadDocument(formData);
      }

      navigate("/documents");
    } catch (err) {
      const message = err.response?.data;
      setError(typeof message === "string" ? message : "Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

  return (
    <div className="mx-auto max-w-3xl p-6 sm:p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-gray-800"
      >
        ← Back
      </button>

      <div>
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">Upload document</h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the document details and select a file to upload.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <Field label="Title" id="title" required>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="Document title"
            />
          </Field>

          <Field label="Description" id="description">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className={inputClass}
              placeholder="Optional description"
            />
          </Field>

          <Field label="Author" id="author" required>
            <input
              id="author"
              name="author"
              type="text"
              required
              value={form.author}
              onChange={handleChange}
              className={inputClass}
              placeholder="Author name"
            />
          </Field>

          <Field label="Publisher" id="publisher">
            <input
              id="publisher"
              name="publisher"
              type="text"
              value={form.publisher}
              onChange={handleChange}
              className={inputClass}
              placeholder="Publisher name"
            />
          </Field>

          <Field label="Published year" id="publishedYear">
            <input
              id="publishedYear"
              name="publishedYear"
              type="number"
              min="1000"
              max={new Date().getFullYear()}
              value={form.publishedYear}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. 2023"
            />
          </Field>

          {/* File selector with large/small toggle */}
          <div className="space-y-3 rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                File <span className="text-red-500">*</span>
              </span>

              {/* Toggle */}
              <button
                type="button"
                onClick={handleToggle}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-800"
              >
                <span>{isLarge ? "Large file mode" : "Standard mode"}</span>
                <div
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isLarge ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      isLarge ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </div>
              </button>
            </div>

            <p className="text-xs text-gray-400">
              {isLarge
                ? "Large file mode: streams directly to disk with a progress bar. Use for files over 50 MB."
                : "Standard mode: best for documents under 50 MB."}
            </p>

            <input
              id="file"
              name="file"
              type="file"
              required
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
            />

            {file && !isSubmitting && (
              <p className="text-xs text-gray-400">
                {file.name} — {formatBytes(file.size)}
              </p>
            )}

            {/* Progress bar — only shown during large upload */}
            {isSubmitting && isLarge && <ProgressBar percent={progress} />}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? isLarge
                  ? `Uploading ${progress}%`
                  : "Uploading..."
                : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}