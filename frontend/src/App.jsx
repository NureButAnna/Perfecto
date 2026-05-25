import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import Photo from "./pages/Photo/Photo";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/photo" element={<Photo />} />
      </Routes>

      <Footer />
    </>
  );
}