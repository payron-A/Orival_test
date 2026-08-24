import '../styles/courseDetails.css'
import { Link } from 'react-router-dom';

function CourseDetails(){
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
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEeW1ho5g5KlEkHoJvTyF7wF-dMr9wQI5c_B-C0o8veg&s=10" alt="Advanced Driving School"/>
          <span className="course-badge"><i className="fa-solid fa-car"></i> Driving</span>
          <button className="save-btn"><i className="fa-regular fa-heart"></i></button>
        </div>

        <h1 className="details-title">Advanced Driving School</h1>

        <div className="details-subrow">
          <span className="rating">
            <i className="fa-solid fa-star"></i> 
            4.8 
            <span className="count">(120 Reviews)</span>
          </span>
          <span>· 1.2k Students</span>
        </div>

        <div className="instructor-row">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW08GCzI1g3iowYTU-UsTGoU9R8u3J68XDzhmJ2tuUw&s=10" alt="Alex Martin"/>
          <div>
            <div className="label">Instructor</div>
            <div className="name">Alex Martin</div>
          </div>
        </div>

        <div className="about">
          <h2>About this course</h2>
          <p>Learn safe driving practices, traffic rules, and become a confident driver with professional instructors guiding every lesson.</p>
        </div>

        <div className="fact-row">
          <div className="fact"><i className="fa-regular fa-clock"></i> 4 weeks</div>
          <div className="fact"><i className="fa-solid fa-book-open"></i> 24 Lessons</div>
          <div className="fact"><i className="fa-solid fa-award"></i> Beginner</div>
        </div>

        <div className="content-block">
          <h2>Course Content</h2>
          <div className="accordion">

            <div className="accordion-item open">
              <button className="accordion-header"><span><span className="num">1.</span>Introduction to Driving</span><span className="right">3 Lessons <i className="fa-solid fa-chevron-down chev"></i></span></button>
              <div className="accordion-panel"><p>· Meeting your instructor</p><p>· Vehicle overview</p><p>· First safety checklist</p></div>
            </div>

            <div className="accordion-item">
              <button className="accordion-header"><span><span className="num">2.</span>Basic Vehicle Control</span><span className="right">5 Lessons <i className="fa-solid fa-chevron-down chev"></i></span></button>
              <div className="accordion-panel"><p>· Steering basics</p><p>· Braking &amp; acceleration</p><p>· Parking fundamentals</p><p>· Reversing</p><p>· Lane control</p></div>
            </div>

            <div className="accordion-item">
              <button className="accordion-header"><span><span className="num">3.</span>Traffic Rules &amp; Signs</span><span className="right">4 Lessons <i className="fa-solid fa-chevron-down chev"></i></span></button>
              <div className="accordion-panel"><p>· Road signs</p><p>· Right of way</p><p>· Speed limits</p><p>· Intersections</p></div>
            </div>

            <div className="accordion-item">
              <button className="accordion-header"><span><span className="num">4.</span>Advanced Driving Techniques</span><span className="right">6 Lessons <i className="fa-solid fa-chevron-down chev"></i></span></button>
              <div className="accordion-panel"><p>· Highway driving</p><p>· Night driving</p><p>· Bad weather conditions</p><p>· Defensive driving</p><p>· Roundabouts</p><p>· Overtaking safely</p></div>
            </div>

            <div className="accordion-item">
              <button className="accordion-header"><span><span className="num">5.</span>Road Safety</span><span className="right">3 Lessons <i className="fa-solid fa-chevron-down chev"></i></span></button>
              <div className="accordion-panel"><p>· Hazard perception</p><p>· Emergency stops</p><p>· First aid basics</p></div>
            </div>

            <div className="accordion-item">
              <button className="accordion-header"><span><span className="num">6.</span>Final Test Preparation</span><span className="right">3 Lessons <i className="fa-solid fa-chevron-down chev"></i></span></button>
              <div className="accordion-panel"><p>· Mock exam</p><p>· Common mistakes review</p><p>· Test day tips</p></div>
            </div>

          </div>
        </div>
      </div>

      <aside>
        <div className="side-card">
          <div className="big-price">18,000 <span style={{fontSize:"14px", fontWeight:600, color:"var(--text-mid)"}}>DZD</span></div>
          <div className="side-actions">
            <button className="btn btn-outline">Contact</button>
            <button className="btn btn-primary">Enroll Now</button>
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