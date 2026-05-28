import { useEffect, useState } from 'react';
import '../styles/courseDetails.css'
import { Link, useParams } from 'react-router-dom';

function CourseDetails({courses,setCourses}){
  const {title} = useParams();
  const course = [...courses].find(course => course.title === title);
  const [IsSaved,setIsSaved] = useState(course.IsSaved);
  const [InMyEnrollment,setInMyEnrollment] = useState(course.InMyEnrollment);

  // useEffect(()=>{
  //   course.IsSaved = IsSaved;
  //   const NewCourse = course;
  //   courses.forEach((c,i) => {
  //     if(c.title === NewCourse.title){
  //       courses.splice(i,1,NewCourse);
  //     }
  //   });
  //   setCourses(courses);
  //   localStorage.setItem("courses",JSON.stringify(courses));
  // },[IsSaved])

  // useEffect(()=>{
  //   course.InMyEnrollment = InMyEnrollment;
  //   const NewCourse = course;
  //   courses.forEach((c,i) => {
  //     if(c.title === NewCourse.title){
  //       courses.splice(i,1,NewCourse);
  //     }
  //   });
  //   setCourses(courses);
  //   localStorage.setItem("courses",JSON.stringify(courses));
  // },[InMyEnrollment]);

return(
<main className="section">
  <div className="container">
    <Link to="/" className="back-link">
      <i className="fa-solid fa-chevron-left"></i> 
      Back to courses
    </Link>
    <div className="details-layout">

      <div>
        
        <div className="details-hero">
          <img src={course.imgSrc} alt={course.title}/>
          <span className="course-badge"><i className="fa-solid fa-car"></i> {course.category}</span>
          <button className="save-btn"
                  onClick={()=>{
                    !IsSaved?setIsSaved(true):setIsSaved(false);
                  }}>
            <i className={`${IsSaved?"fa-solid":"fa-regular"} fa-heart`}
               style={{color:IsSaved?"red":"var(--text-hi)"}}></i>
          </button>
        </div>

        <h1 className="details-title">{course.title}</h1>

        <div className="details-subrow">
          <span className="rating">
            <i className="fa-solid fa-star"></i> 
            4.8 
            <span className="count">({course.count} Reviews)</span>
          </span>
          <span>· ${course.students} Students</span>
        </div>

        <div className="instructor-row">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW08GCzI1g3iowYTU-UsTGoU9R8u3J68XDzhmJ2tuUw&s=10" alt="Alex Martin"/>
          <div>
            <div className="label">Instructor</div>
            <div className="name">{course.Instructor}</div>
          </div>
        </div>

        <div className="about">
          <h2>About this course</h2>
          <p>{course.desc}.</p>
        </div>

        <div className="fact-row">
          <div className="fact"><i className="fa-regular fa-clock"></i> 4 weeks</div>
          <div className="fact"><i className="fa-solid fa-book-open"></i> 24 Lessons</div>
          <div className="fact"><i className="fa-solid fa-award"></i> {course.courseLevel}</div>
        </div>

        <div className="content-block">
          <h2>Course Content</h2>
          <div className="accordion">
            {course.CourseContent.map((lessons,id:number)=>
                <div key={id} className={`accordion-item ${id === 0?"open":""}`}>
                  <button className="accordion-header"
                          onClick={(e)=>{
                            e.currentTarget.closest(".accordion-item").classList.toggle("open");
                          }}>
                    <span>
                      <span className="num">{id + 1}.</span>
                        {lessons.courseName}
                    </span>
                    <span className="right">
                      {lessons.content.length} Lessons 
                      <i className="fa-solid fa-chevron-down chev"></i>
                    </span>
                  </button>
                  <div className="accordion-panel">
                    {lessons.content.map((lesson:string,i:number)=>
                      <p key={i}>· {lesson}</p>
                    )
                  }
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>

      <aside>
        <div className="side-card">
          <div className="big-price">18,000 <span style={{fontSize:"14px", fontWeight:600, color:"var(--text-mid)"}}>DZD</span></div>
          <div className="side-actions">
            <button className="btn btn-outline">Contact</button>
            <button className="btn btn-primary"
                  style={{background:!InMyEnrollment?"var(--gradient)":"transparent",
                          color:!InMyEnrollment?"#0b0b0e":"red",
                          border:!InMyEnrollment?"none":"1px solid red"
                  }}
                  onClick={()=>{
                    !InMyEnrollment?setInMyEnrollment(true):setInMyEnrollment(false);
                  }}>
                  {!InMyEnrollment?"Enroll Now":"Cancel Enroll"}
            </button>
          </div>
        </div>

        <div className="side-card">
          <div className="reviews-head">
            <h3>Reviews (120)</h3>
            <Link to="/">View all</Link>
          </div>
          <div className="review-summary">
            <span className="score">4.8</span>
            <div className="bars">
              <div className="bar-row"><span>5</span><div className="bar-track"><div className="bar-fill" style={{width:"85%"}}></div></div></div>
              <div className="bar-row"><span>4</span><div className="bar-track"><div className="bar-fill" style={{width:"10%"}}></div></div></div>
              <div className="bar-row"><span>3</span><div className="bar-track"><div className="bar-fill" style={{width:"3%"}}></div></div></div>
              <div className="bar-row"><span>2</span><div className="bar-track"><div className="bar-fill" style={{width:"1%"}}></div></div></div>
              <div className="bar-row"><span>1</span><div className="bar-track"><div className="bar-fill" style={{width:"1%"}}></div></div></div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  </div>
</main>

    )
}export default CourseDetails;