import { useState } from "react";

export function useCheckoutForm() {
  const [form, setForm] = useState({
    dry_cleaner_id: "",
    payment_method: "card",
    delivery_type: "courier",
    city: "",
    street: "",
    house_number: "",
    flat_number: "",
    nova_poshta_branch: "",
    delivery_datetime: "",
    comment: "",
  });

  const handleChange = (e) =>
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  return { form, handleChange };
}