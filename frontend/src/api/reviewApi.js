import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function getReviews() {
  try {
    const res = await api.get("/reviews/");
    return res.data;
  } catch (error) {
    console.error("getReviews error:", error);

    throw new Error("Не вдалося завантажити відгуки", {
      cause: error,
    });
  }
}

export async function submitReview(reviewData) {
  const token = localStorage.getItem("access_token");

  console.log("token:", token);
  console.log("reviewData:", reviewData);

  try {
    const res = await api.post("/reviews/", reviewData, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return res.data;
  } catch (error) {
    console.error("submitReview error:", error);

    throw new Error("Не вдалося відправити відгук", {
      cause: error,
    });
  }
}