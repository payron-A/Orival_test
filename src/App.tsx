import Home from "./pages/home";
import Saved from "./pages/saved";
import Navbar from "./components/navbar";
import Category from "./pages/category";
import MyEnrollment from "./pages/myEnrollment";
import CourseDetails from "./pages/courseDetails";
import SearchResult from "./pages/searchResult";
import { Route,Routes} from "react-router-dom";
import { useState } from "react";
function App() {
  const [active,setActive] = useState<string>("Discover");
  return (
<>
<Navbar active={active} setActive={setActive}/>
<Routes>
  <Route path="/" element={<Home setActive={setActive}/>}/>
  <Route path="/category" element={<Category/>}/>
  <Route path="/saved" element={<Saved/>}/>
  <Route path="/myEnrollment" element={<MyEnrollment/>}/>
  <Route path="/courseDetails" element={<CourseDetails/>}/>
  <Route path="/searchResult" element={<SearchResult/>}/>
</Routes>
</>
)
}

export default App
