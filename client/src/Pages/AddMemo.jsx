import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddMemo.css';
import ResponsiveAppBar from "../components/AppBar";
import AddMemo2 from './AddMemo2';

function AddMemo() {
  const [imagePreview, setImagePreview] = useState('');
  const [showAddMemo2, setShowAddMemo2] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Here you would typically save the data
    // Then switch to AddMemo2
    setShowAddMemo2(true);
  };

  if (showAddMemo2) {
    return <AddMemo2 />;
  }

  return (
    <>
      <ResponsiveAppBar/>
      <main>
        <div className="d-flex justify-content-center mt-4">
          <div className="card OuterContainer card col-11 col-md-9 col-lg-7 m-3 p-2">
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#3345c6', fontSize: '21px', fontWeight: '700' }}>
                Add Your Memory
              </h5>

              <div className="input-group mb-3 pe-1 ps-1 pt-2">
                <span className="input-group-text" id="basic-addon1">Title</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Title Here!"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  id="title"
                />
              </div>

              <div className="mb-3 pe-1 ps-1">
                <label htmlFor="imageInput" className="form-label">Upload Cover Image Here!..</label>
                <input
                  className="form-control"
                  id="imageInput"
                  type="file"
                  onChange={handleImageChange}
                />
                <br />
                {imagePreview && (
                  <img
                    className="ps-2"
                    src={imagePreview}
                    alt="Image Preview"
                    width="200"
                  />
                )}
              </div>

              <div className="container mt-4">
                <label htmlFor="dateInput" className="form-label">Select Date:</label>
                <input type="date" id="dateInput" className="form-control" />
              </div>

              <div className="d-flex justify-content-center align-items-center">
                <button 
                  className="btn btn-primary mt-3"
                  onClick={handleSubmit}
                >
                  Start Sharing
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AddMemo;