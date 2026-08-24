import { Link } from 'react-router-dom';

type MyEnrollmentCourses = {
  title : string,
  category : string,
  lastLessons : string,
  star : number,
  complete : number,
  imgSrc : string,
}
function MyEnrollmentPanel({title,category,lastLessons,star,complete,imgSrc}:MyEnrollmentCourses){
    return(
<Link to="" className="enroll-card">
    <img src={imgSrc}/>
    <div className="enroll-info">
        <h3>{title}</h3>
        <div className="result-meta">
            <span className="rating">
                <i className="fa-solid fa-star"></i> 
                <span className='count'>{star}</span>
            </span> 
            <span style={{color:"var(--text-mid)",fontSize:"13px"}}> . {category}  . {lastLessons} Lessons left</span>
        </div>
        {/* <div className="progress-track">
            <div className="progress-fill" style={{width:"75%"}}></div>
        </div> */}
        <div className="progress-pct"
             style={{fontSize:"13px"}}>{complete}% Complete</div>
    </div>
    <i className="fa-solid fa-chevron-right enroll-arrow"></i>
</Link>
    )
}
export default MyEnrollmentPanel;