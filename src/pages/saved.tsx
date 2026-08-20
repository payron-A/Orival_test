import Card from '../components/card'
import '../styles/saved.css'

type PopularCourses = {
  title : string,
  category : string,
  price : number,
  star : number,
  count : number,
  iconName : string,
  imgSrc : string,
}
function Saved(){
  const savedCourses: PopularCourses[] = [
    {
      category:"Driving",title:"Advanced Driving School",price:18000,
      star:4.5,count:200,iconName:"fa-car",imgSrc:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEeW1ho5g5KlEkHoJvTyF7wF-dMr9wQI5c_B-C0o8veg&s=10"
    },
    {
      category:"Language",title:"English Conversation Skills",price:5000,
      star:4.6 ,count:500,iconName:"fa-language",imgSrc:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs9CmeU3c-v7KdaU4FdLpdRgHM-BMkDILtk5LXTlsNkQ&s=10"
    },
    {
      category:"Design",title:"UI/UX",price:9000,
      star:3.5,count:600,iconName:"fa-palette",imgSrc:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoTRD6StLMNAjhEsr97vl4SbJkJS_YlIb4k2OnEHv23w&s=10"
    },
    {
      category:"Business",title:"Digital Marketing",price:20000,
      star:4.9,count:179,iconName:"fa-briefcase",imgSrc:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEeW1ho5g5KlEkHoJvTyF7wF-dMr9wQI5c_B-C0o8veg&s=10"
    },

  ]
return (
<main>
    <section className="section">
        <div className="container">
            <h1>Saved Courses</h1>
            <div className="grid course-grid" style={{marginTop:"24px"}}>
                {savedCourses.map(course=>
                    <Card title={course.title}
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
    )
}
export default Saved