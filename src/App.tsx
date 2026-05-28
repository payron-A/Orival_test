import { CourseApi } from '../public/APIs/courseAPI.js'
import Home from "./pages/home";
import Saved from "./pages/saved";
import Navbar from "./components/navbar";
import Category from "./pages/category";
import MyEnrollment from "./pages/myEnrollment";
import CourseDetails from "./pages/courseDetails";
import SearchResult from "./pages/searchResult";
import { Route,Routes} from "react-router-dom";
import { useEffect, useState } from "react";
function App() {

  const [active,setActive] = useState<string>("Discover");
  const [courses,setCourses] = useState<any[]>(
    JSON.parse(localStorage.getItem("courses")) || []
  );
//  ==================
//  FETCH LOCAL API
//  ==================
    useEffect(()=>{
      const load = async()=>{
        const data = await CourseApi();
        if(courses.length === 0){
          setCourses(data);
        } 
      }
      load();
    },[])

//  Save Data in LocalStorage
  useEffect(()=>{
    localStorage.setItem("courses",JSON.stringify(courses));
  },[])


  return (
<>
<Navbar active={active} setActive={setActive}/>
<Routes>
  <Route path="/" element={<Home setActive={setActive}courses={courses}/>}/>
  <Route path="/category" element={<Category/>}/>
  <Route path="/saved" element={<Saved courses={courses}/>}/>
  <Route path="/myEnrollment" element={<MyEnrollment courses={courses}/>}/>
  <Route path="/courseDetails/:title" element={<CourseDetails courses={courses} setCourses={setCourses}/>}/>
  <Route path="/searchResult/" element={<SearchResult/>}/>
</Routes>
</>
)
}

export default App
