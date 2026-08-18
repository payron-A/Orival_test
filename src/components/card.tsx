import { Link } from "react-router-dom";
import '../styles/card.css';

function Card(){
    return (
<Link to="/" className="course-card">
    <div className="course-thumb">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEeW1ho5g5KlEkHoJvTyF7wF-dMr9wQI5c_B-C0o8veg&s=10" alt="Advanced Driving School"/>
      <span className="course-badge"><i className="fa-solid fa-car"></i> Driving</span>
    </div>
    <div className="course-body">
      <div className="course-title">Advanced Driving School</div>
      <div className="course-meta">
        <span className="rating"><i className="fa-solid fa-star"></i> 4.8 <span className="count">(120)</span></span>
        <span className="price">18,000 <span className="unit">DZD</span></span>
      </div>
    </div>
</Link>
      )
}
export default Card;