import Footer from '../components/footer';
import '../styles/category.css'


function Category(){

return (
<>
<main className="section">
  <div className="container">
    <h1 className="page-title">Categories</h1>
    <p className="page-sub">Browse courses by category</p>

    <div className="category-grid">

        <a href="#" className="category-card">
            <div className="category-icon">
                <i className="fa-solid fa-car"></i>
            </div>
            <h3>Driving</h3>
            <p>22 Courses</p>
        </a>

        <a href="#" className="category-card"><div className="category-icon"><i className="fa-solid fa-language"></i></div><h3>Language</h3><p>20 Courses</p></a>
        <a href="#" className="category-card"><div className="category-icon"><i className="fa-solid fa-briefcase"></i></div><h3>Business</h3><p>45 Courses</p></a>
        <a href="#" className="category-card"><div className="category-icon"><i className="fa-solid fa-palette"></i></div><h3>Design</h3><p>32 Courses</p></a>
        <a href="#" className="category-card"><div className="category-icon"><i className="fa-solid fa-code"></i></div><h3>Development</h3><p>38 Courses</p></a>
        <a href="#" className="category-card"><div className="category-icon"><i className="fa-solid fa-bullhorn"></i></div><h3>Marketing</h3><p>26 Courses</p></a>
        <a href="#" className="category-card"><div className="category-icon"><i className="fa-solid fa-user-graduate"></i></div><h3>Personal Development</h3><p>22 Courses</p></a>
        <a href="#" className="category-card"><div className="category-icon"><i className="fa-solid fa-camera"></i></div><h3>Photography</h3><p>18 Courses</p></a>
    </div>
  </div>
</main>
<Footer/>
</>
    )
}
export default Category;