import '../styles/footer.css'

function Footer({page}:{page:string}){
return (
<footer className="site-footer">
  &copy; 2026 ORIVAL — {page} · Learn · Grow
</footer>
    )
}
export default Footer;