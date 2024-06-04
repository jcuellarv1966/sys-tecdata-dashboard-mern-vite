import React, { useContext } from "react";
import { Store } from "../../utils/Store"
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { generatePublicUrlProducts } from "../../utils/urlConfig";

// eslint-disable-next-line no-unused-vars
export default function FileUploadProducts({ values, setValues, loadingUpload }) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const fileUploadAndResize = (e) => {
    console.log(e.target.value);
    let files = e.target.files;
    let allUploadedFiles = values.images;

    const config = {
      headers: { "content-type": "multipart/form-data", Authorization: `Bearer ${userInfo.token}` },
    };

    if (files) {
      // eslint-disable-next-line no-unused-labels
      loadingUpload: true;

      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          async () => {
            const form = new FormData();
            form.append("productImage", e.target.files[i]);
            try {
              const res = await axios.post(
                "http://localhost:5000/api/products/uploadimage",
                form,
                config
              );
              allUploadedFiles.push(res.data);
              setValues({ ...values, images: allUploadedFiles });
              // eslint-disable-next-line no-unused-labels
              loadingUpload: false;
            } catch (error) {
              console.log("UPLOAD IMAGES ERROR ...", error);
              // eslint-disable-next-line no-unused-labels
              loadingUpload: false;
            }
          },
          "base64"
        );
      }
    }
  };

  const handleImageRemove = async (file) => {
    try {
      // eslint-disable-next-line no-unused-labels
      loadingUpload: true;
      const res = await axios.post("http://localhost:5000/api/products/removeimage", {
        file,
      },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      const { images } = values;
      let filteredImages = images.filter((item) => {
        return item.file !== file;
      });
      setValues({ ...values, images: filteredImages });
      // eslint-disable-next-line no-unused-labels
      loadingUpload: false;
    } catch (error) {
      console.log(error);
      // eslint-disable-next-line no-unused-labels
      loadingUpload: false;
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        {values.images &&
          values.images.map((image) => (
            <div className="relative" key={image.file}>
              <div className="flex items-center justify-center w-80 h-36 mx-2 overflow-hidden rounded-2xl">
                <img
                  src={generatePublicUrlProducts(image.file)}
                  className="object-full"
                  layout='fill'
                  alt=""
                />
              </div>

              <div className="absolute top-0 right-0 w-4 h-6 mr-1 rounded-sm bg-red-700 border-1 border-outline">
                <button>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="h-4 w-4 text-white"
                    onClick={() => handleImageRemove(image.file)}
                  />
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="row mt-4 mb-2 mx-3">
        <label className="btn btn-secondary">
          Upload image(s)
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
}

FileUploadProducts.auth = { adminOnly: true };
