import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainNews from "./screens/MainNews";
import Landing from "./screens/Landing";










export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/decentralized_news" element={<MainNews/>} />
          <Route path="/" element={<Landing/>} />
          <Route path="/about" element={<div>About</div>} />
          <Route path="/contact" element={<div>Contact</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}