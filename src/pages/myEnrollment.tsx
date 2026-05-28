import { useState } from 'react';
import MyEnrollmentPanel from '../components/myEnrollmentPanel';
import Footer from '../components/footer';
import '../styles/myEnrollment.css'

type MyEnrollmentCourses = {
  title : string,
  category : string,
  lastLessons : string,
  star : number,
  complete : number,
  imgSrc : string,
}
function MyEnrollment({courses}){
  const [active,setActive] = useState<string>("In Progress");
  const myEnrollmentCourses : MyEnrollmentCourses[] = [...courses].filter(course => course.InMyEnrollment);
return (
<>
<main className="section">
  <div className="container" >
    <h1 className="page-title">My Enrollments</h1>
    <p className="page-sub">Track progress across everything you're learning</p>
 
    <div className="enroll-tabs">
      <button className={`enroll-tab ${active === "In Progress"?"active":""}`}
              onClick={()=>setActive("In Progress")}>
              In Progress
      </button>
      <button className={`enroll-tab ${active === "Completed"?"active":""}`}
              onClick={()=>setActive("Completed")}>
              Completed
      </button>
    </div>
 
    {/* <!-- IN PROGRESS --> */}
    <div className="enroll-panel" style={{display:active === "In Progress"? "flex":"none"}}>
      {
        myEnrollmentCourses.map(course =>
          <MyEnrollmentPanel key={course.title}
                             title={course.title}
                             category={course.category}
                             lastLessons={course.lastLessons}
                             star={course.star}
                             complete={course.complete}
                             imgSrc= {course.imgSrc}/>
        )
      }
 
    </div>
    
    {/* -- COMPLETED -- */}
    <div className="enroll-panel" style={{display:active === "Completed"? "block":"none"}}>
 
      <a href="course-details.html" className="enroll-card">
        <img src="https://source.unsplash.com/160x160/?conversation,people-talking" alt=""/>
        <div className="enroll-info">
          <h3>English Conversation Skills</h3>
          <div className="result-meta"><span className="rating"><i className="fa-solid fa-star"></i> 4.6</span> · Language · Completed Apr 28, 2024</div>
          <div className="progress-track"><div className="progress-fill" style={{width:"100%", background:" linear-gradient(135deg,#22c55e,#16a34a)"}}></div></div>
          <div className="progress-pct" style={{color:"#22c55e"}}><i className="fa-solid fa-circle-check"></i> Certificate earned</div>
        </div>
        <i className="fa-solid fa-chevron-right enroll-arrow"></i>
      </a>
 
      <a href="course-details.html" className="enroll-card">
        <img src="https://source.unsplash.com/160x160/?driving,steering-wheel" alt=""/>
        <div className="enroll-info">
          <h3>Advanced Driving School</h3>
          <div className="result-meta"><span className="rating"><i className="fa-solid fa-star"></i> 4.8</span> · Driving · Completed May 15, 2024</div>
          <div className="progress-track"><div className="progress-fill" style={{width:"100%", background:" linear-gradient(135deg,#22c55e,#16a34a)"}}></div></div>
          <div className="progress-pct" style={{color:"#22c55e"}}><i className="fa-solid fa-circle-check"></i> Certificate earned</div>
        </div>
        <i className="fa-solid fa-chevron-right enroll-arrow"></i>
      </a>
 
      <a href="course-details.html" className="enroll-card">
        <img src="https://source.unsplash.com/160x160/?traffic,road-signs" alt=""/>
        <div className="enroll-info">
          <h3>Traffic Rules &amp; Safety</h3>
          <div className="result-meta"><span className="rating"><i className="fa-solid fa-star"></i> 4.7</span> · Driving · Completed Mar 02, 2024</div>
          <div className="progress-track"><div className="progress-fill" style={{width:"100%", background:" linear-gradient(135deg,#22c55e,#16a34a)"}}></div></div>
          <div className="progress-pct" style={{color:"#22c55e"}}><i className="fa-solid fa-circle-check"></i> Certificate earned</div>
        </div>
        <i className="fa-solid fa-chevron-right enroll-arrow"></i>
      </a>
 
    </div>
    
  </div>
</main>
<Footer page='My Enrollments'/>
</>
    )
}
export default MyEnrollment;