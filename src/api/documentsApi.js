import axiosClient from "./axiosClient";

export const getMyDocuments = () =>
  axiosClient.get("/documents/my-documents");

export const getDocumentById = (id) =>
  axiosClient.get(`/documents/${id}`);

export const deleteDocument = (id) =>
  axiosClient.delete(`/documents/${id}`);

export const downloadDocument = async (id, fileName) => {
  const response = await axiosClient.get(`/documents/${id}/download`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// [FromForm] with IFormFile — must use FormData, not JSON.
export const uploadDocument = (formData) =>
  axiosClient.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Large file upload — metadata goes as query params, raw file stream
// goes as the request body with application/octet-stream.
// onProgress is a callback receiving a 0–100 number.
export const uploadLargeDocument = (file, metadata, onProgress) => {
  const params = new URLSearchParams({
    title: metadata.title,
    description: metadata.description,
    author: metadata.author,
    publisher: metadata.publisher,
    publishedYear: metadata.publishedYear,
    fileName: file.name,
    contentType: file.type || "application/octet-stream",
    fileSizeInBytes: file.size,
  });

  return axiosClient.post(
    `/documents/upload-large?${params.toString()}`,
    file, // the File object is sent directly as the request body stream
    {
      headers: { "Content-Type": file.type || "application/octet-stream" },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percent);
      },
    }
  );
};