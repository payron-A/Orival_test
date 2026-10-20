import { createContext,useContext, useEffect, useState, type ReactNode } from "react";
import { defaultCourses } from "../data";
import type { Course } from "../types/courses";
import type{ Enrollment, EnrollmentStatus,  User} from "../types/user";

type ApiState = {
    courses : Course[],
    setCourses : React.Dispatch<React.SetStateAction<Course[]>>,
    savedCourseIds: string[],
    enrollments: Record<string, Enrollment>,
    toggleSaveCourse: (courseId: string) => void,
    enroll: (courseId: string) => void,
    setLessonComplete: (courseId: string, lessonId: string, totalLessons: number) => void,
    isSavedCourse: (id: string) => boolean,
    isEnrolled: (id: string) => boolean,
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
}
const apiContext = createContext<ApiState | null>(null);
export function ApiProvider({children}:{children:ReactNode}){
//____Courses:
  const [courses,setCourses] = useState<Course[]>(
      load("courses",defaultCourses)
  );
//____Saved Courses:
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>(
    load("save_courses",[])
  );
  const toggleSaveCourse = (courseId: string) =>{
    setSavedCourseIds(
      (prev) => 
        !savedCourseIds.includes(courseId)?
            [...prev,courseId]:
            [...prev].filter(cI => cI !== courseId)
        );
  }
//____Enrollments:
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>(
    load("enrollments",{})
  );
  const enroll = (courseId: string) =>
    setEnrollments((prev) => ({
      ...prev,
      [courseId]: prev[courseId] ?? {
        courseId,
        status: "not-started" as EnrollmentStatus,
        progress: 0,
        enrolledAt: new Date().toISOString().slice(0, 10),
      },
    })
  );
  const setLessonComplete = (courseId: string, lessonId: string, totalLessons: number) =>
    setEnrollments((prev) => {
      const existing = prev[courseId] ?? { courseId, status: "not-started" as EnrollmentStatus, progress: 0, enrolledAt: new Date().toISOString().slice(0, 10) };
      const progress = Math.min(100, Math.round(existing.progress + 100 / totalLessons));
      return {
        ...prev,
        [courseId]: {
          ...existing,
          lastLessonId: lessonId,
          progress,
          status: progress >= 100 ? "completed" : "in-progress",
        },
      };
    }
  );
//____User:
  const [user,setUser] = useState<User | null>(
    load("user",null)
  )
  
  useEffect(()=>{
    save("courses",courses);
    save("save_courses",savedCourseIds);
    save("enrollments",enrollments);
    save("user",user)
  },[courses,savedCourseIds,enrollments,user])

  const value:ApiState = {
    courses,
    setCourses,
    savedCourseIds,
    enrollments,
    toggleSaveCourse,
    enroll,
    setLessonComplete,
    isSavedCourse: (id) => savedCourseIds.includes(id),
    isEnrolled: (id) => Boolean(enrollments[id]),
    user,
    setUser

  }
  return (
    <apiContext.Provider value={value}>{children}</apiContext.Provider>
  )
}
export function useApi(){
    const ctx = useContext(apiContext);
    if (!ctx) throw new Error("useApi must be used within ApiProvider");
    return ctx;
}
function save(key:string,value:unknown[] | Record<string, Enrollment> | User | null){
  try{
    localStorage.setItem(key,JSON.stringify(value))
  }catch(err:unknown){
    if(err instanceof Error){
      console.log(err.message);
    }
  }
}
function load(key:string,seedData:unknown[] | Record<string, Enrollment> | User | null){
  try{
    const saved = localStorage.getItem(key);
    if(saved) return JSON.parse(saved);
  }catch(err:unknown){
    if(err instanceof Error){
      console.log(err.message)
    }
  }
  return seedData
}
