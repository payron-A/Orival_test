import Card from '../components/card'
import Footer from '../components/footer'
type PopularCourses = {
  title : string,
  category : string,
  price : number,
  star : number,
  count : number,
  iconName : string,
  imgSrc : string,
}
function Saved({courses}:{courses:any[]}){
  const savedCourses: PopularCourses[] = [...courses].filter(course => course.IsSaved);
return (
<>
<main>
    <section className="section">
        <div className="container">
            <h1 className="page-title">Saved Courses</h1>
            <p className="page-sub">All saved Courses</p>
            <div className="grid course-grid" style={{marginTop:"24px"}}>
                {savedCourses.map(course=>
                    <Card 
                          key={course.title}
                          title={course.title}
                          category={course.category}
                          price={course.price}
                          star={course.star}
                          count={course.count}
                          iconName={course.iconName}
                          imgSrc={course.imgSrc}/>
                )}

            </div>
        </div>
    </section>
</main>
<Footer page='Saved'/>
</>
    )
}
export default Saved