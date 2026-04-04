import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { RootLayout } from "./layouts/RootLayout"
import Home from "./pages/Home"
import Laptops from "./pages/laptops/Laptops"
import LaptopDetail from "./pages/laptops/LaptopDetail"
import LaptopCompare from "./pages/laptops/LaptopCompare"
import Phones from "./pages/phones/Phones"
import PhoneDetail from "./pages/phones/PhoneDetail"
import PhoneCompare from "./pages/phones/PhoneCompare"
import Headphones from "./pages/headphones/Headphones"
import HeadphoneDetail from "./pages/headphones/HeadphoneDetail"
import HeadphoneCompare from "./pages/headphones/HeadphoneCompare"
import Saved from "./pages/saved/Saved"
import Trending from "./pages/trending/Trending"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          
          <Route path="/laptops" element={<Laptops />} />
          <Route path="/laptops/:slug" element={<LaptopDetail />} />
          <Route path="/laptops/compare" element={<LaptopCompare />} />
          
          <Route path="/phones" element={<Phones />} />
          <Route path="/phones/:slug" element={<PhoneDetail />} />
          <Route path="/phones/compare" element={<PhoneCompare />} />
          
          <Route path="/headphones" element={<Headphones />} />
          <Route path="/headphones/:slug" element={<HeadphoneDetail />} />
          <Route path="/headphones/compare" element={<HeadphoneCompare />} />
          
          <Route path="/saved" element={<Saved />} />
          <Route path="/trending" element={<Trending />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

