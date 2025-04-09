import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddMemo.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function AddMemo({ onMemoryCreated, onCancel }) {
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [privacy, setPrivacy] = useState('private');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrivacyChange = (e) => {
    setPrivacy(e.target.value);
  };

  const handleSubmit = async () => {
    const title = document.getElementById('title').value;
    const date = document.getElementById('dateInput').value;

    if (!title || !date || !imageFile) {
      alert('Please fill all fields and upload an image');
      return;
    }

    setIsSubmitting(true);

    // Create filename-safe title
    const filenameSafeTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single
      .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens

    // Prepare form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('filenameSafeTitle', filenameSafeTitle);
    formData.append('date', date);
    formData.append('isPrivate', privacy === 'private');
    formData.append('image', imageFile);

    try {
      const token = localStorage.getItem('token');
      console.log('Submitting with:', {
        title,
        date,
        privacy,
        filenameSafeTitle,
        imageFile: imageFile ? imageFile.name : 'No file'
      });

      const response = await fetch('http://localhost:5000/api/memories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      console.log('Response status:', response.status);

      const result = await response.json();
      console.log('Response body:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save memory');
      }
      
      // Call the parent component's callback with memoryId
      onMemoryCreated({
        memoryId: result.memoryId,
        filenameSafeTitle: filenameSafeTitle
    });
    } catch (error) {
      console.error('Error saving memory:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main>
        <div className="d-flex justify-content-center mt-4">
          <div className="card OuterContainer card col-11 col-md-9 col-lg-7 m-3 p-2">
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#3345c6', fontSize: '21px', fontWeight: '700' }}>
                Add Your Memory
              </h5>

              <div className="input-group mb-3 pe-1 ps-2 pt-2">
                <span className="input-group-text" id="basic-addon1">Title</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Title Here!"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  id="title"
                  required
                />
              </div>

              <div className="dateInput container mt-4 mb-4">
                <label htmlFor="dateInput" className="form-label">Select Date:</label>
                <div className="input-group">
                  <span className="input-group-text" id="basic-addon1">Date</span>
                  <input type="date" id="dateInput" className="form-control" required />
                </div>
              </div>

              <div className="mb-3 pe-1 ps-2">
                <FormControl component="fieldset" className="mb-3">
                  <FormLabel component="legend">Privacy</FormLabel>
                  <RadioGroup
                    row
                    aria-label="privacy"
                    name="privacy"
                    value={privacy}
                    onChange={handlePrivacyChange}
                  >
                    <FormControlLabel value="private" control={<Radio />} label="Private" />
                    <FormControlLabel value="public" control={<Radio />} label="Public" />
                  </RadioGroup>
                </FormControl>
              </div>

              <div className="mb-3 pe-1 ps-2">
                <label htmlFor="imageInput" className="form-label">Upload Cover Image Here!..</label>
                <input
                  className="form-control"
                  id="imageInput"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
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

              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Start Sharing'}
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