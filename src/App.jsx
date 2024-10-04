import { useState } from "react";
import "./App.css";
import Resizer from "react-image-file-resizer";
import axios from "axios";

function App() {
  const [uploadButtonText, setUploadButtonText] = useState("Choose Image");
  const [values, setValues] = useState({
    title: "",
    description: "",
    image: {},
  });
  const [image, setImage] = useState({});

  const handleImage = (e) => {
    let file = e.target.files[0];
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });
    // resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post("http://localhost:8080/api/upload", {
          image: uri,
        });
        console.log("Bild uppladdad", data);
        // set image in the state
        setImage(data);
        setValues({ ...values, image: { key: data.key } });
      } catch (err) {
        console.log(err);
        setValues({ ...values, image: "" });
        console.log("Image upload failed. Try later.");
      } finally {
        setValues({ ...values, loading: false });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({
      title: "",
      description: "",
      image: {},
    });
    setUploadButtonText("Choose Image");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="column">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="column">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={values.description}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="column">
          <label>
            {uploadButtonText}
            <input
              type="file"
              name="image"
              onChange={handleImage}
              accept="image/*"
              hidden
            />
          </label>
        </div>
        <button type="submit">Upload</button>
      </form>
    </>
  );
}

export default App;
