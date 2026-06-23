import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkoutApi } from "../api/checkoutApi";
import { useCart } from "./useCart";

export function useCheckout() {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submitOrder({ form, cart, user, openLogin }) {
    setError("");

    if (!user) {
      openLogin?.();
      return false;
    }

    if (cart.length === 0) {
      setError("Кошик порожній");
      return false;
    }

    if (!form.dry_cleaner_id) {
      setError("Оберіть філію");
      return false;
    }

    if (!form.delivery_datetime) {
      setError("Вкажіть дату та час доставки");
      return false;
    }

    const payload = {
      user_id: user.id,
      dry_cleaner_id: Number(form.dry_cleaner_id),
      payment_method: form.payment_method,
      comment: form.comment || null,

      order_services: cart.map((item) => ({
        service_id: item.id,
        number: item.quantity,
        price: item.price,
      })),

      delivery: {
        user_id: user.id,
        order_id: 0,
        delivery_type: form.delivery_type,
        city: form.city,
        street: form.street || null,
        house_number: form.house_number || null,
        flat_number: form.flat_number || null,
        nova_poshta_branch:
          form.delivery_type === "nova_poshta"
            ? form.nova_poshta_branch
            : null,
        delivery_datetime: form.delivery_datetime,
      },
    };

    setSubmitting(true);

    try {
      const res = await checkoutApi.createCheckout(payload);

      clearCart();

      navigate("/profile", {
        state: {
          tab: "orders",
          orderId: res.data.order_id,
        },
      });

      return true;
    } catch (err) {
      const detail = err?.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Не вдалося оформити замовлення"
      );

      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    submitOrder,
    submitting,
    error,
    setError,
  };
}