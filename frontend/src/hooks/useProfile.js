import { useState } from "react";

export function useProfile(user) {
  const [tab, setTab] = useState("info");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  function startEdit() {
    setForm({
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic ?? "",
      email: user.email,
      phone_number: user.phone_number,
      password: "",
    });
    setEditing(true);
    setError("");
    setSuccess(false);
  }

  return {
    tab, setTab,
    editing, setEditing,
    form, setForm,
    error, setError,
    saving, setSaving,
    success, setSuccess,
    startEdit,
  };
}