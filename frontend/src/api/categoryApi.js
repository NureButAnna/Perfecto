const BASE_URL = import.meta.env.VITE_API_URL;

export async function getCategory(id) {
  const res = await fetch(`${BASE_URL}/categories/${id}`);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories/`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function getServices() {
  const res = await fetch(`${BASE_URL}/services/`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function getServicesByCategory(id) {
  const res = await fetch(`${BASE_URL}/services/category/${id}`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}