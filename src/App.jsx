import { useState } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";

function App() {
  const [uploadButtonText, setUploadButtonText] = useState("Choose Image");
  const [values, setValues] = useState({
    title: "",
    description: "",
    image: {},
    loading: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState({});

  const handleImage = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    if (file) {
      setUploadButtonText(file.name);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please choose an image first");
      return;
    }

    setValues({ ...values, loading: true });

    // rezise
    Resizer.imageFileResizer(
      selectedFile,
      720,
      500,
      "JPEG",
      100,
      0,
      async (uri) => {
        try {
          let { data } = await axios.post("http://localhost:8080/api/upload", {
            image: uri,
          });
          console.log("Bild uppladdad", data);
          setImage(data);
          setValues({
            title: "",
            description: "",
            image: { key: data.key },
            loading: false,
          });
          setUploadButtonText("Choose Image");
          setSelectedFile(null);
          alert("Image uploaded successfully!");
        } catch (err) {
          console.log(err);
          setValues({ ...values, image: "", loading: false });
          alert("Image upload failed. Try later.");
        }
      }
    );
  };

  return (
    <>
      <form className="img-form" onSubmit={handleSubmit}>
        <div className="file-input">
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
        <button type="submit" disabled={values.loading}>
          {values.loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </>
  );
}

export default App;
