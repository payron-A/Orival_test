import { Link } from "react-router-dom";
import Hero from "../components/hero";
import Footer from "../components/footer";
import Card from "../components/card";
import CategoryPanel from "../components/categoryPanel";
import '../styles/home/home.css'


type PopularCourses = {
  title : string,
  category : string,
  price : number,
  star : number,
  count : number,
  iconName : string,
  imgSrc : string,
}
type Props = {
  setActive : React.Dispatch<React.SetStateAction<string>>,
  courses : any[],
}
export default function Home({setActive,courses}:Props) {
  const PopularCourses: PopularCourses[] = courses;
return (
<>
<Hero/>
{/* -- POPULAR COURSES -- */}
<section className="section">
  <div className="container">
    <div className="section-head">
      <h2>Popular Courses</h2>
      <Link to="" className="view-all">View all <i className="fa-solid fa-chevron-right"></i></Link>
    </div>
    <div className="course-grid">
      {
        PopularCourses.map(course =>
          <Card 
            key={course.title}
            title={course.title}
            category={course.category}
            price={course.price}
            star={course.star}
            count={course.count}
            iconName={course.iconName}
            imgSrc={course.imgSrc}/>
        )
      }
    </div>
  </div>
</section>

{/* -- CATEGORIES -- */}
<section className="section" style={{paddingBottom:"64px"}}>
  <div className="container">
    <div className="section-head" style={{marginBottom:"20px"}}>
      <h2>Browse by Category</h2>
      <Link to="/category" className="view-all"
            onClick={()=>setActive("Categories")}>View all <i className="fa-solid fa-chevron-right"></i></Link>
    </div>
    <div className="category-grid">
      <CategoryPanel title="Driving"
                     count={22}
                     iconName="fa-car"/>
      <CategoryPanel title="Language"
                     count={20}
                     iconName="fa-language"/>
      <CategoryPanel title="Business"
                     count={45}
                     iconName="fa-briefcase"/>
      <CategoryPanel title="Design"
                     count={24}
                     iconName="fa-palette"/>
    </div>
  </div>
</section>

<Footer page="Discover"/>
</>
  );
}