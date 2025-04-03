import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './traditional.css';
import ResponsiveAppBar from "../components/AppBar"

function Traditional() {
  return (
    <>
      {/* <header>
        <nav className="navbar navbar-expand-md d-flex justify-content-between align-items-center px-3">
          <div className="container-fluid d-flex align-items-center">
            <Link className="navbar-brand ms-1 mt-1 d-flex align-items-center" to="/">
              <span className="fw-bold ms-2" id="Tit">Visual Diary</span>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end page me-4" id="navbarContent">
              <div className="navbar-nav">
                <Link to="/" className="nav-link char navbar-brand ms-4 mt-2">Home</Link>
                <Link to="/traditional" className="nav-link char navbar-brand ms-4 mt-2">Memories</Link>
                <Link to="/add-memo" className="nav-link Houses navbar-brand ms-4 mt-2">Add Memo</Link>
              </div>
            </div>
          </div>
        </nav>
      </header> */}

        <ResponsiveAppBar/>

      <main>
        <div className="containerOuter mt-5 ms-5 me-5 p-2 ps-4">
          <h5 className="ps-4 pt-3">Traditional 2025!</h5>

          <div className="firstcontaier d-flex flex-wrap justify-content-between p-2">
            <div className="img-div pt-3" style={{ width: '25%' }}>
              <img src="/images/bhaiyya(1).jpg" alt="" id="img1" />
            </div>
            <div className="para-div pe-3 ps-5" style={{ width: '75%' }}>
              <p className="text-body-emphasis paragraph" id="img1_Contennt">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur obcaecati
                facilis sint illum ipsum aliquam magnam architecto eum deleniti facere nostrum quis reiciendis
                ratione ex tenetur asperiores, aspernatur voluptas cupiditate.
                Id repudiandae fugit debitis numquam consectetur molestias ad vel enim nam. Recusandae enim
                ipsum, reiciendis ducimus accusamus nisi magnam doloribus exercitationem illum quos harum
                similique impedit minima saepe, natus fugit.
                Vero quod quisquam esse sit voluptatibus, optio qui, quia ad temporibus, eum delectus.
                Accusantium quo deleniti tenetur eveniet, nulla ad dolorem nesciunt iure, inventore vitae fuga
                perspiciatis quos recusandae officiis.
                Unde veritatis voluptatibus labore dolores repudiandae aliquam laudantium ab minima a omnis
                maiores sed rerum ipsa, ea asperiores beatae facere natus sapiente molestias. Harum quibusdam
                numquam excepturi tempora voluptates ipsa.
                Quis magni suscipit nam nemo, tempora, minima rerum impedit beatae illo, ipsum explicabo
                accusamus hic quisquam dolorem perspiciatis veritatis incidunt vero cumque amet ex aliquid!
                Sequi laborum eaque dolor iste!
              </p>
            </div>
          </div>

          <div className="secondcontainer d-flex flex-wrap justify-content-between p-2 pe-5">
            <div className="para-div pe-5" style={{ width: '75%' }}>
              <p className="text-body-emphasis paragraph" id="img2content">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur obcaecati
                facilis sint illum ipsum aliquam magnam architecto eum deleniti facere nostrum quis reiciendis
                ratione ex tenetur asperiores, aspernatur voluptas cupiditate.
                Id repudiandae fugit debitis numquam consectetur molestias ad vel enim nam. Recusandae enim
                ipsum, reiciendis ducimus accusamus nisi magnam doloribus exercitationem illum quos harum
                similique impedit minima saepe, natus fugit.
                Vero quod quisquam esse sit voluptatibus, optio qui, quia ad temporibus, eum delectus.
                Accusantium quo deleniti tenetur eveniet, nulla ad dolorem nesciunt iure, inventore vitae fuga
                perspiciatis quos recusandae officiis.
                Unde veritatis voluptatibus labore dolores repudiandae aliquam laudantium ab minima a omnis
                maiores sed rerum ipsa, ea asperiores beatae facere natus sapiente molestias. Harum quibusdam
                numquam excepturi tempora voluptates ipsa.
                Quis magni suscipit nam nemo, tempora, minima rerum impedit beatae illo, ipsum explicabo
                accusamus hic quisquam dolorem perspiciatis veritatis incidunt vero cumque amet ex aliquid!
                Sequi laborum eaque dolor iste!
              </p>
            </div>
            <div className="img-div pt-3" style={{ width: '25%' }}>
              <img src="/images/bhaiyya(1).jpg" alt="" id="img2" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Traditional;