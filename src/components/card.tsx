import { Link } from "react-router-dom";
import '../styles/card.css';

type Card = {
  imgSrc : string,
  iconName : string,
  title : string,
  category : string,
  star : number,
  count : number,
  price :number,
}
function Card({imgSrc,iconName,title,category,star,count,price}:Card){
    return (
<Link to={`/courseDetails/${title}`} className="course-card">
    <div className="course-thumb">
      <img src={imgSrc} alt="Advanced Driving School"/>
      <span className="course-badge"><i className={`fa-solid ${iconName}`}></i> {category}</span>
    </div>
    <div className="course-body">
      <div className="course-title">{title}</div>
      <div className="course-meta">
        <span className="rating"><i className="fa-solid fa-star"></i> {star} <span className="count">{count} review</span></span>
        <span className="price">{price} <span className="unit">DZD</span></span>
      </div>
    </div>
</Link>
      )
}
export default Card;