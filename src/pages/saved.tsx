import Card from '../components/card'
import '../styles/saved.css'


function Saved(){
return (
<main>
    <section className="section">
        <div className="container">
            <h1>Saved Courses</h1>
            <div className="grid course-grid" style={{marginTop:"24px"}}>
                {Array.from({length:8}).map(_=>
                    <Card/>
                )}

            </div>
        </div>
    </section>
</main>
    )
}
export default Saved