
//  ==================
//  FETCH LOCAL API
//  ==================
export async function CourseApi() {
      try{
        console.log("loading...")
        const rs= await fetch("/Data/courses.json");

        if(!rs.ok) {throw new Error("Fiald Fetch Data!")};
        const data= await rs.json();
        
        return data;
      }catch(err){
        console.log(err.message);
      }
}

//  ====================================
//  Create Saved & MyEnrollment Database
//  ====================================

(function () {
      localStorage.setItem("SavedCourses",[]);
      localStorage.setItem("MyEnrollmentCourses",[]);
})