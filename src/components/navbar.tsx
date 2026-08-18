import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css'

function Navbar(){

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement | null>(null);
  const [active,setActive] = useState<string>("Discover");
  useEffect(()=>{
    if(menuToggleRef.current && menuToggleRef.current){
      menuToggleRef.current.onclick = ()=>{
        if(mobileMenuRef){
          mobileMenuRef.current.classList.toggle("open");
        }
      }
    }
  },[mobileMenuRef.current])
  window.onresize =()=>{
    mobileMenuRef.current.classList.remove("open");
  }
return(
<header className="navbar">
  <div className="container">
    <a className="logo">
      <span className="logo-text">
        <span className="accent">O</span>
        RIVAL
      </span>
    </a>
    <nav className="nav-links">
      <Link to="/" className={`${active === "Discover"?"active":""}`}
         onClick={()=>setActive("Discover")}>
         Discover
      </Link>
      <Link to="/category" className={`${active === "Categories"?"active":""}`}
         onClick={()=>setActive("Categories")}>
         Categories
      </Link>
      <Link to="/saved" className={`${active === "Saved"?"active":""}`}
         onClick={()=>setActive("Saved")}>
         Saved
      </Link>
      <Link to="/" className={`${active === "My Enrollments"?"active":""}`}
         onClick={()=>setActive("My Enrollments")}>
        My Enrollments
      </Link>
    </nav>
    <div className="nav-search">
      <input type="text" className='searchInput'id='search' placeholder='Search courses, skills...'/>
      <label htmlFor="search">
        <i className="fa-solid fa-magnifying-glass"></i>
      </label>
    </div>
    <div className="nav-right">
      <button className="icon-btn">
        <i className="fa-regular fa-bell"></i>
        <span className="dot"></span>
      </button>
      <Link to="/"className="avatar">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW08GCzI1g3iowYTU-UsTGoU9R8u3J68XDzhmJ2tuUw&s=10" alt="profile"/>
      </Link>
      <button className="menu-toggle"
              ref={menuToggleRef}>
        <i className="fa-solid fa-bars"></i>
      </button>
    </div>
  </div>
  <div className="mobile-menu"
        ref={mobileMenuRef}>
    <Link to="/" className={`${active === "Discover"?"active":""}`}>Discover</Link>
    <Link to="/category" className={`${active === "Categories"?"active":""}`}>Categories</Link>
    <Link to="/saved" className={`${active === "Saved"?"active":""}`}>Saved</Link>
    <Link to="/" className={`${active === "My Enrollments"?"active":""}`}>My Enrollments</Link>
  </div>
</header>
    )
}
export default Navbar;