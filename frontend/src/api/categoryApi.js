export async function getCategories() {
  const res = await fetch("http://localhost:8000/categories/");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function getServicesByCategory(id) {
  const res = await fetch(`http://127.0.0.1:8000/categories/${id}/services`);
  return res.json();
}