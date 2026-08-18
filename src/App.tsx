import Home from "./pages/home";
import Saved from "./pages/saved";
import Navbar from "./components/navbar";
import Category from "./pages/category";
import { Route,Routes} from "react-router-dom";
function App() {
  return (
<>
<Navbar/>
<Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/category" element={<Category/>}/>
  <Route path="/saved" element={<Saved/>}/>
</Routes>
</>
)
}

export default App
