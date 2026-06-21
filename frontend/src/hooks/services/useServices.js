import { useEffect, useState } from "react";
import { getCategories } from "../../api/categoryApi";

export function useServices() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(data => setCategories(data))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}