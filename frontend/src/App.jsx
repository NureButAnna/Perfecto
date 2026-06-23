import { Routes, Route, Outlet } from "react-router-dom";

import Home from "./features/pages/Home/Home";
import Services from "./features/pages/Services/Services";
import AllServices from "./features/pages/Services/AllServices/AllServices";
import Photo from "./features/pages/Photo/Photo";
import PriceList from "./features/pages/PriceList/PriceList";
import Delivery from "./features/pages/Delivery/Delivery";
import Cart from "./features/pages/Cart/Cart";
import Checkout from "./features/pages/Checkout/Checkout";
import Profile from "./features/pages/Profile/Profile";
import NotFound from "./features/pages/NotFound/NotFound";
import AiChat from "./components/AiChat/AiChat";
 

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AdminLogin     from "./features/pages/Admin/AdminLogin";
import AdminDashboard from "./features/pages/Admin/AdminDashboard";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<WithLayout />}>
        <Route index element={<Home />} />
        <Route path="category" element={<AllServices />} />
        <Route path="category/:id" element={<Services />} />
        <Route path="photo" element={<Photo />} />
        <Route path="pricelist" element={<PriceList />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*"     element={<AdminDashboard />} />
    </Routes>
  );
}

function WithLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <AiChat />
    </>
  );
}