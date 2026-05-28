import CategoryPanel from '../components/categoryPanel';
import Footer from '../components/footer';
import '../styles/category.css'

type Category = {
    title:string,
    count:number,
    iconName:string,
  }
function Category(){
  
  const Categories:Category[] = [
    {title:"Driving",count:22,iconName:"fa-car"},
    {title:"Language",count:20,iconName:"fa-language"},
    {title:"Business",count:45,iconName:"fa-briefcase"},
    {title:"Design",count:24,iconName:"fa-palette"},
    {title:"Development",count:12,iconName:"fa-code"},
    {title:"Marketing",count:50,iconName:"fa-bullhorn"},
    {title:"Personal Development",count:32,iconName:"fa-user-graduate"},
    {title:"Photography",count:9,iconName:"fa-camera"},
  ]
return (
<>
<main className="section">
  <div className="container">
    <h1 className="page-title">Categories</h1>
    <p className="page-sub">Browse courses by category</p>

    <div className="category-grid">
      {
        Categories.map((category => 
          <CategoryPanel key={category.title}
                         title={category.title}
                         count={category.count}
                         iconName={category.iconName}/>
        ))
      }
    </div>
  </div>
</main>
<Footer page="Category"/>
</>
    )
}
export default Category;