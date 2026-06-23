import { useState, useEffect } from "react";
import { dryCleanersApi } from "../../../api/checkoutApi";

export function useDryCleaners() {
  const [drycleaners, setDrycleaners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dryCleanersApi.getAll()
      .then(res => setDrycleaners(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { drycleaners, loading };
}