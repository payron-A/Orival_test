import { Link } from 'react-router-dom';

type Category = {
    title:string,
    count:number,
    iconName:string,
}
function CategoryPanel({title,count,iconName}:Category){
return (
<Link to='' className="category-card">
    <div className="category-icon">
        <i className={`fa-solid ${iconName}`}></i>
    </div>
    <h3>{title}</h3>
    <p>{count} Courses</p>
</Link>
    )
}export default CategoryPanel;