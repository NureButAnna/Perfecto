import { useState, useMemo, useEffect } from "react";
import "./PriceList.css";
import { SearchIcon, MinusIcon, PlusIcon, TrashIcon, PhoneIcon } from "../utils/icons";


export default function PriceList() {

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
 
  useEffect(() => {
  Promise.all([
    fetch(`${import.meta.env.VITE_API_URL}/categories`).then(res => res.json()),
    fetch(`${import.meta.env.VITE_API_URL}/services`).then(res => res.json())
  ])
    .then(([cats, svcs]) => {
      setCategories([{ id: 0, name: "Усі послуги" }, ...cats]);
      setServices(svcs);
      setLoading(false);
    })
    .catch(console.error);
}, []);

  const filtered = useMemo(() => {
    let list = services;
    if (activeCategory !== 0) list = list.filter((s) => s.category_id === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    return list;
  }, [services, activeCategory, search]);
 

  const isInCart = (id) =>
  cart.some((c) => c.serviceId === id);
 
 const addToCart = (service) => {
  setCart((prev) => {
    const exists = prev.find((c) => c.serviceId === service.id);

    if (exists) {
      return prev.map((c) =>
        c.serviceId === service.id
          ? { ...c, qty: c.qty + 1 }
          : c
      );
    }

    return [
      ...prev,
      {
        serviceId: service.id,
        qty: 1,
        name: service.name,
        price: service.price
      }
    ];
  });
};

  const increaseQty = (id) =>
    setCart((prev) =>
      prev.map((c) => c.serviceId === id ? { ...c, qty: c.qty + 1 } : c)
    );

  const decreaseQty = (id) =>
    setCart((prev) =>
      prev.map((c) => c.serviceId === id ? { ...c, qty: Math.max(1, c.qty - 1) } : c)
    );
 
  const removeFromCart = (id) =>
  setCart((prev) => prev.filter((c) => c.serviceId !== id));

 
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  return (
     <>
      <div className="price-page">
        <div className="price-header">
          <h1>Прайс-лист</h1>
        </div>
 
        {loading ? (
          <div className="loader-wrap">
            <div className="spinner" />
            <span>Завантаження послуг…</span>
          </div>
        ) : (
          <>
            <div className="price-layout">
              <div className="sidebar">
                <div className="sidebar-title">Оберіть послугу</div>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`sidebar-item${activeCategory === cat.id ? " active" : ""}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <div className={`checkbox${activeCategory === cat.id ? " checked" : ""}`} />
                    {cat.name}
                  </div>
                ))}
              </div>
 
              <div className="main-panel">
                <div className="search-bar">
                  <span className="search-icon"><SearchIcon /></span>
                  <input
                    type="text"
                    placeholder="Введіть назву послуги"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
 
                <div className="service-table">
                  <div className="table-header">
                    <div className="table-header">
                      <div className="th">Назва послуги</div>
                      <div className="th">Ціна</div>
                    </div>
                  </div>
 
                  {filtered.length === 0 ? (
                    <div className="empty-state">Послуги не знайдено</div>
                  ) : (
                    filtered.map((svc) => (
                      <div className="service-row" key={svc.id}>
                        <div className="service-name">{svc.name}</div>
 
                      <div className="price-cell">
                          <span className="price-val">{svc.price} грн</span>

                          <button
                            className={`add-btn${isInCart(svc.id) ? " added" : ""}`}
                            onClick={() =>
                              isInCart(svc.id)
                                ? removeFromCart(svc.id)
                                : addToCart(svc)
                            }
                          >
                            {isInCart(svc.id) ? <MinusIcon /> : <PlusIcon />}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
 
             {cart.length > 0 && (
              <div className="estimate-section">
                <div className="estimate-card">
                  <div className="estimate-header">
                    Попередній розрахунок
                    <span className="badge">{cart.length}</span>
                  </div>
 
                  {cart.map((item) => (
                    <div className="cart-item" key={item.serviceId}>
                      <div className="cart-name">
                        {item.name}
                        <span style={{ marginLeft: 6, fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>
                        </span>
                      </div>
 
                     <div className="qty-control">
                        <button className="qty-btn" onClick={() => decreaseQty(item.serviceId)}>
                          <MinusIcon />
                        </button>
                        <span className="qty-num">{item.qty}</span>
                        <button className="qty-btn" onClick={() => increaseQty(item.serviceId)}>
                          <PlusIcon />
                        </button>
                      </div>
 
                      <div className="cart-price">{item.price * item.qty} грн</div>
 
                      <button className="cart-remove" onClick={() => removeFromCart(item.serviceId, item.tier)}>
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
 
                  <div className="estimate-footer">
                    <div>
                      <div className="total-label">Разом до сплати</div>
                      <div className="total-amount">{total} грн</div>
                    </div>
                    <button className="order-btn">Оформити замовлення</button>
                  </div>
                </div>
              </div>
            )}
 
            <div className="not-found-card">
              <div className="not-found-inner">
                <div className="nf-title">Не знайшли послугу?</div>
                <div className="nf-text">
                  <PhoneIcon />
                  Зателефонуйте нашому менеджеру або запитайте в{" "}
                  <span className="nf-link">ШІ-помічника</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}