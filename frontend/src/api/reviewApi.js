const BASE_URL = "http://127.0.0.1:8000";

export async function getReviews() {
  const res = await fetch(`${BASE_URL}/reviews/`);
  if (!res.ok) throw new Error("Не вдалося завантажити відгуки");
  return res.json();
}

export async function submitReview(reviewData) {
  const token = localStorage.getItem("access_token");
  console.log("token:", token);

  console.log("reviewData:", reviewData);
  const res = await fetch(`${BASE_URL}/reviews/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(reviewData),
  });

  if (!res.ok) throw new Error("Не вдалося відправити відгук");
  return res.json();
}