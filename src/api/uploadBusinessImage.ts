import api from "@/lib/axios";

export async function uploadBusinessImage(businessId: number, file: File) {
  // Build multipart/form-data payload
  const form = new FormData();
  form.append("image", file);

  // IMPORTANT: no leading /api if baseURL is already '/api'
  const { data } = await api.post(`/businesses/${businessId}/image`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return data;
}
