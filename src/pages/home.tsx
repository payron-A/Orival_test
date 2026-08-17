import Navbar from "../components/navbar";
import Hero from "../components/hero";
import '../styles/home/home.css'

export default function Home() {
return (
<>
<Navbar/>
<Hero/>
{/* -- POPULAR COURSES -- */}
<section className="section">
  <div className="container">
    <div className="section-head">
      <h2>Popular Courses</h2>
      <a href="#" className="view-all">View all <i className="fa-solid fa-chevron-right"></i></a>
    </div>
    <div className="course-grid">

      <a href="#" className="course-card">
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
      </a>

      <a href="#" className="course-card">
        <div className="course-thumb">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs9CmeU3c-v7KdaU4FdLpdRgHM-BMkDILtk5LXTlsNkQ&s=10" alt="English Conversation Skills"/>
          <span className="course-badge"><i className="fa-solid fa-language"></i> Language</span>
        </div>
        <div className="course-body">
          <div className="course-title">English Conversation Skills</div>
          <div className="course-meta">
            <span className="rating"><i className="fa-solid fa-star"></i> 4.6 <span className="count">(98)</span></span>
            <span className="price">12,500 <span className="unit">DZD</span></span>
          </div>
        </div>
      </a>

      <a href="#" className="course-card">
        <div className="course-thumb">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoTRD6StLMNAjhEsr97vl4SbJkJS_YlIb4k2OnEHv23w&s=10" alt="UI/UX Design Basics"/>
          <span className="course-badge"><i className="fa-solid fa-palette"></i> Design</span>
        </div>
        <div className="course-body">
          <div className="course-title">UI/UX Design Basics</div>
          <div className="course-meta">
            <span className="rating"><i className="fa-solid fa-star"></i> 4.9 <span className="count">(150)</span></span>
            <span className="price">15,000 <span className="unit">DZD</span></span>
          </div>
        </div>
      </a>

      <a href="#" className="course-card">
        <div className="course-thumb">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiVpyqoZEq9HEaGR14OON3KNq4ZjtGcsj8otqjCRkKng&s=10" alt="Digital Marketing"/>
          <span className="course-badge"><i className="fa-solid fa-briefcase"></i> Business</span>
        </div>
        <div className="course-body">
          <div className="course-title">Digital Marketing</div>
          <div className="course-meta">
            <span className="rating"><i className="fa-solid fa-star"></i> 4.7 <span className="count">(110)</span></span>
            <span className="price">14,000 <span className="unit">DZD</span></span>
          </div>
        </div>
      </a>

    </div>
  </div>
</section>

{/* -- CATEGORIES -- */}
<section className="section" style={{paddingBottom:"64px"}}>
  <div className="container">
    <div className="section-head" style={{marginBottom:"20px"}}>
      <h2>Browse by Category</h2>
    </div>
    <div className="category-grid">
      <a href="#" className="category-card">
        <div className="category-icon"><i className="fa-solid fa-car"></i></div>
        <h3>Driving</h3><p>22 Courses</p>
      </a>
      <a href="#" className="category-card">
        <div className="category-icon"><i className="fa-solid fa-language"></i></div>
        <h3>Language</h3><p>20 Courses</p>
      </a>
      <a href="#" className="category-card">
        <div className="category-icon"><i className="fa-solid fa-briefcase"></i></div>
        <h3>Business</h3><p>45 Courses</p>
      </a>
      <a href="#" className="category-card">
        <div className="category-icon"><i className="fa-solid fa-palette"></i></div>
        <h3>Design</h3><p>32 Courses</p>
      </a>
    </div>
  </div>
</section>

<footer className="site-footer">
  &copy; 2026 ORIVAL — Discover · Learn · Grow
</footer>

{/* -- BOTTOM NAV (mobile) -- */}
<nav className="bottom-nav">
  <ul>
    <li><a href="#" className="active"><i className="fa-solid fa-compass"></i>Discover</a></li>
    <li><a href="#"><i className="fa-solid fa-table-cells"></i>Categories</a></li>
    <li><a href="#"><i className="fa-solid fa-bookmark"></i>Saved</a></li>
    <li><a href="#"><i className="fa-solid fa-user"></i>Profile</a></li>
  </ul>
</nav>
</>
  );
}