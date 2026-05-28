import { createContext,useContext, useEffect, useState, type ReactNode } from "react";
import { courses } from "../data";
import type { Course } from "../types/courses";


const coursesContext = createContext<CourseShell | null>(null);
type CourseShell = {
    localCourses : Course[],
    setLocalCourses : React.Dispatch<React.SetStateAction<Course[]>>,
}
export function CoursesProvider({children}:{children:ReactNode}){

    const [localCourses,setLocalCourses] = useState<Course[] | null>(
        JSON.parse(localStorage.getItem("courses")) || courses
    );

    useEffect(()=>{
        localStorage.setItem("courses",JSON.stringify(localCourses))
    },[localCourses])
    return (
    <coursesContext.Provider value={{localCourses,setLocalCourses}}>
        {children}
    </coursesContext.Provider>
    )
}
export function useCourses(){
    const ctx = useContext(coursesContext);
      if (!ctx) throw new Error("useApp must be used within AppProvider");
      return ctx;
}