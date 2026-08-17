import "../styles/home/hero.css"
import { useState } from "react";

function Hero(){
  const [active,setActive] = useState<string>("");
return (
<section className="hero">
  <div className="container">
    <div>
      <h1>Find the <span className="accent">best courses</span> near you</h1>
      <p className="lead">Learn new skills with expert instructors and advance your future.</p>
      <div className="hero-search">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Search courses, skills, or categories..."/>
        <button className="btn btn-primary">Search</button>
      </div>
      <div className="pill-row">
        <button className={`${active === "Driving"?"active":""} pill`}
                onClick={()=>setActive("Driving")}>
                <i className="fa-solid fa-car"></i> 
                Driving
        </button>
        <button className={`${active === "Language"?"active":""} pill`}
                onClick={()=>setActive("Language")}>
                <i className="fa-solid fa-language"></i> 
                Language
        </button>
        <button className={`${active === "Business"?"active":""} pill`}
                onClick={()=>setActive("Business")}>
                <i className="fa-solid fa-briefcase"></i> 
                Business
        </button>
        <button className={`${active === "Design"?"active":""} pill`}
                onClick={()=>setActive("Design")}>
                <i className="fa-solid fa-palette"></i> 
                Design
        </button>
        <button className={`${active === "Development"?"active":""} pill`}
                onClick={()=>setActive("Development")}>
                <i className="fa-solid fa-code"></i> 
                Development
        </button>
      </div>
    </div>

    <div className="hero-art">
      <img src="photo/hero.png" alt="Student exploring courses"/>
      <i className="fa-solid fa-location-dot hero-pin" style={{top:"8%", left:"12%"}}></i>
      <i className="fa-solid fa-location-dot hero-pin" style={{top:"30%", right:"18%", fontSize:"16px", opacity:".7"}}></i>
      <i className="fa-solid fa-location-dot hero-pin" style={{bottom:"20%" ,right:"28%"}}></i>
    </div>
  </div>
</section>
    )
}
export default Hero;