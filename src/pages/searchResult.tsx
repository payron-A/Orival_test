import { useEffect, useRef } from 'react';
import '../styles/searchResult.css'
import { Link } from 'react-router-dom';

function SearchResult(){
    const filterCard = useRef<HTMLDivElement | null>(null);
    const filterBtn = useRef<HTMLSpanElement | null>(null);
    useEffect(()=>{
        if(filterCard.current && filterBtn.current){
            filterBtn.current.onclick = ()=>{
                if(filterCard.current){
                    filterCard.current.classList.toggle("fullHeight");
                }
            }
        }
    },[filterCard.current])
return (
<main className="section">
  <div className="container">
    <h1 className="page-title">Search Results</h1>
    <p className="result-count">24 results for "driving"</p>

    <div className="results-layout">

      <aside className="filter-card" ref={filterCard}>
        <div className="filter-head">
            <span ref={filterBtn}><i className="fa-solid fa-sliders"></i> Filter</span>
            <button>Reset</button>
        </div>
        <div>
            <div className="filter-group">
                <h4>Category</h4>
                <label className="radio-row"><input type="radio" name="cat"/> All Categories</label>
                <label className="radio-row"><input type="radio" name="cat" checked/> Driving</label>
                <label className="radio-row"><input type="radio" name="cat"/> Language</label>
                <label className="radio-row"><input type="radio" name="cat"/> Business</label>
                <label className="radio-row"><input type="radio" name="cat"/> Design</label>
                <label className="radio-row"><input type="radio" name="cat"/> Development</label>
            </div>

            <div className="filter-group">
                <h4>Level</h4>
                <label className="radio-row"><input type="radio" name="lvl"/> All Levels</label>
                <label className="radio-row"><input type="radio" name="lvl" checked/> Beginner</label>
                <label className="radio-row"><input type="radio" name="lvl"/> Intermediate</label>
                <label className="radio-row"><input type="radio" name="lvl"/> Advanced</label>
            </div>

            <div className="filter-group">
                <h4>Price Range</h4>
                <input type="range" min="0" max="20000" value="20000" 
                       style={{width:"100%",accentColor: "var(--accent-1)"}}/>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:"11.5px", color:"var(--text-low)", marginTop:"4px"}}>
                    <span>0 DZD</span><span>20,000 DZD+</span>
                </div>
            </div>
            
            <button className="btn btn-primary btn-block">Apply Filters</button>
        </div>
      </aside>

      <div className="result-list">
        <Link to="/" className="result-card">
          <img className='cardImg'
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEeW1ho5g5KlEkHoJvTyF7wF-dMr9wQI5c_B-C0o8veg&s=10" alt=""/>
          <div className="result-info">
            <div className="result-top">
                <div>
                    <h3>Advanced Driving School</h3>
                    <div style={{display:"flex",gap:"10px"}}>
                        <span className="rating">
                            <i className="fa-solid fa-star"></i>
                            <span className='count'>4.5</span>
                        </span>
                        <span className="rating">
                            <i className="fa-solid fa-eye"></i>
                            <span className='count'>4k</span>
                        </span>
                    </div>
                </div>
                <i className="fa-regular fa-bookmark"></i>
            </div>
            <div className="instructor-row">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW08GCzI1g3iowYTU-UsTGoU9R8u3J68XDzhmJ2tuUw&s=10" alt="Alex Martin"/>
                <div>
                    <div className="label">Instructor</div>
                    <div className="name">Alex Martin</div>
                </div>
            </div>
            <p className="result-desc">
                Learn safe driving practices and become a confident driver.Learn safe driving practices and become a confident driver.
            </p>
            <span className="price">
                18,000
                <span className="unit">DZD</span>
            </span>
          </div>
        </Link>
        <Link to="/" className="result-card">
          <img className='cardImg'
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEeW1ho5g5KlEkHoJvTyF7wF-dMr9wQI5c_B-C0o8veg&s=10" alt=""/>
          <div className="result-info">
            <div className="result-top">
                <div>
                    <h3>Advanced Driving School</h3>
                    <div style={{display:"flex",gap:"10px"}}>
                        <span className="rating">
                            <i className="fa-solid fa-star"></i>
                            <span className='count'>4.5</span>
                        </span>
                        <span className="rating">
                            <i className="fa-solid fa-eye"></i>
                            <span className='count'>4k</span>
                        </span>
                    </div>
                </div>
                <i className="fa-regular fa-bookmark"></i>
            </div>
            <div className="instructor-row">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW08GCzI1g3iowYTU-UsTGoU9R8u3J68XDzhmJ2tuUw&s=10" alt="Alex Martin"/>
                <div>
                    <div className="label">Instructor</div>
                    <div className="name">Alex Martin</div>
                </div>
            </div>
            <p className="result-desc">
                Learn safe driving practices and become a confident driver.Learn safe driving practices and become a confident driver.
            </p>
            <span className="price">
                18,000
                <span className="unit">DZD</span>
            </span>
          </div>
        </Link>
        <Link to="/" className="result-card">
          <img className='cardImg'
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEeW1ho5g5KlEkHoJvTyF7wF-dMr9wQI5c_B-C0o8veg&s=10" alt=""/>
          <div className="result-info">
            <div className="result-top">
                <div>
                    <h3>Advanced Driving School</h3>
                    <div style={{display:"flex",gap:"10px"}}>
                        <span className="rating">
                            <i className="fa-solid fa-star"></i>
                            <span className='count'>4.5</span>
                        </span>
                        <span className="rating">
                            <i className="fa-solid fa-eye"></i>
                            <span className='count'>4k</span>
                        </span>
                    </div>
                </div>
                <i className="fa-regular fa-bookmark"></i>
            </div>
            <div className="instructor-row">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW08GCzI1g3iowYTU-UsTGoU9R8u3J68XDzhmJ2tuUw&s=10" alt="Alex Martin"/>
                <div>
                    <div className="label">Instructor</div>
                    <div className="name">Alex Martin</div>
                </div>
            </div>
            <p className="result-desc">
                Learn safe driving practices and become a confident driver.Learn safe driving practices and become a confident driver.
            </p>
            <span className="price">
                18,000
                <span className="unit">DZD</span>
            </span>
          </div>
        </Link>
        <Link to="/" className="result-card">
          <img className='cardImg'
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEeW1ho5g5KlEkHoJvTyF7wF-dMr9wQI5c_B-C0o8veg&s=10" alt=""/>
          <div className="result-info">
            <div className="result-top">
                <div>
                    <h3>Advanced Driving School</h3>
                    <div style={{display:"flex",gap:"10px"}}>
                        <span className="rating">
                            <i className="fa-solid fa-star"></i>
                            <span className='count'>4.5</span>
                        </span>
                        <span className="rating">
                            <i className="fa-solid fa-eye"></i>
                            <span className='count'>4k</span>
                        </span>
                    </div>
                </div>
                <i className="fa-regular fa-bookmark"></i>
            </div>
            <div className="instructor-row">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW08GCzI1g3iowYTU-UsTGoU9R8u3J68XDzhmJ2tuUw&s=10" alt="Alex Martin"/>
                <div>
                    <div className="label">Instructor</div>
                    <div className="name">Alex Martin</div>
                </div>
            </div>
            <p className="result-desc">
                Learn safe driving practices and become a confident driver.Learn safe driving practices and become a confident driver.
            </p>
            <span className="price">
                18,000
                <span className="unit">DZD</span>
            </span>
          </div>
        </Link>
        <Link to="/" className="result-card">
          <img className='cardImg'
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEeW1ho5g5KlEkHoJvTyF7wF-dMr9wQI5c_B-C0o8veg&s=10" alt=""/>
          <div className="result-info">
            <div className="result-top">
                <div>
                    <h3>Advanced Driving School</h3>
                    <div style={{display:"flex",gap:"10px"}}>
                        <span className="rating">
                            <i className="fa-solid fa-star"></i>
                            <span className='count'>4.5</span>
                        </span>
                        <span className="rating">
                            <i className="fa-solid fa-eye"></i>
                            <span className='count'>4k</span>
                        </span>
                    </div>
                </div>
                <i className="fa-regular fa-bookmark"></i>
            </div>
            <div className="instructor-row">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW08GCzI1g3iowYTU-UsTGoU9R8u3J68XDzhmJ2tuUw&s=10" alt="Alex Martin"/>
                <div>
                    <div className="label">Instructor</div>
                    <div className="name">Alex Martin</div>
                </div>
            </div>
            <p className="result-desc">
                Learn safe driving practices and become a confident driver.Learn safe driving practices and become a confident driver.
            </p>
            <span className="price">
                18,000
                <span className="unit">DZD</span>
            </span>
          </div>
        </Link>
        <Link to="/" className="result-card">
          <img className='cardImg'
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEeW1ho5g5KlEkHoJvTyF7wF-dMr9wQI5c_B-C0o8veg&s=10" alt=""/>
          <div className="result-info">
            <div className="result-top">
                <div>
                    <h3>Advanced Driving School</h3>
                    <div style={{display:"flex",gap:"10px"}}>
                        <span className="rating">
                            <i className="fa-solid fa-star"></i>
                            <span className='count'>4.5</span>
                        </span>
                        <span className="rating">
                            <i className="fa-solid fa-eye"></i>
                            <span className='count'>4k</span>
                        </span>
                    </div>
                </div>
                <i className="fa-regular fa-bookmark"></i>
            </div>
            <div className="instructor-row">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyW08GCzI1g3iowYTU-UsTGoU9R8u3J68XDzhmJ2tuUw&s=10" alt="Alex Martin"/>
                <div>
                    <div className="label">Instructor</div>
                    <div className="name">Alex Martin</div>
                </div>
            </div>
            <p className="result-desc">
                Learn safe driving practices and become a confident driver.Learn safe driving practices and become a confident driver.
            </p>
            <span className="price">
                18,000
                <span className="unit">DZD</span>
            </span>
          </div>
        </Link>
      </div>
    </div>
  </div>
</main>
    )
}export default SearchResult;