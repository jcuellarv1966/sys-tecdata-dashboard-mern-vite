import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../utils/Store"
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { generatePublicUrlPartners } from "../../utils/urlConfig";

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPLOAD_REQUEST':
      return { ...state, error: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, error: '' };
    case 'UPLOAD_FAIL':
      return { ...state, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, error: '' };
    case 'DELETE_SUCCESS':
      return { ...state, error: '' };
    case 'DELETE_FAIL':
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default function FileUploadPartners({ values, setValues }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [tab, setTab] = useState(0);

  const [{ error }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const isActive = (index) => {
    if (tab === index) return " active";
    return ""
  }

  const fileUploadAndResize = (e) => {
    console.log(e.target.value);
    let files = e.target.files;
    let allUploadedFiles = values.images;

    const config = {
      headers: { "content-type": "multipart/form-data", Authorization: `Bearer ${userInfo.token}` },
    };

    if (files) {
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
            form.append("partnerImage", e.target.files[i]);
            try {
              dispatch({ type: "UPLOAD_REQUEST" });
              const res = await axios.post(
                "http://localhost:5000/api/partners/uploadimage",
                form,
                config
              );
              allUploadedFiles.push(res.data);
              setValues({ ...values, images: allUploadedFiles });
              dispatch({ type: "UPLOAD_SUCCESS" });
            } catch (err) {
              console.log("UPLOAD IMAGES ERROR ...", err);
              dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
              toast.error(getError(error));
            }
          },
          "base64"
        );
      }
    }
  };

  const handleImageRemove = async (file) => {
    try {
      dispatch({ type: "DELETE_REQUEST" });
      const res = await axios.post("http://localhost:5000/api/partners/removeimage", {
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
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (err) {
      console.log(err);
      dispatch({ type: "DELETE_FAIL", payload: getError(err) });
      toast.error(getError(error));
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {values.images.length > 0 ? (
          <>
            <div className="relative" key={values.images[tab].file}>
              <div className="flex items-center justify-center w-72 h-120 mx-2 overflow-hidden rounded-2xl">
                <img src={generatePublicUrlPartners(values.images[tab].file)} alt={values.images[tab].file}
                  className="d-block img-thumbnail rounded mt-4 w-100"
                  style={{ height: '350px' }} />
              </div>

              <div className="absolute top-4 right-2 w-6 h-6 mr-0 rounded-sm bg-red-700 border-1 border-outline text-center">
                <button>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="h-4 w-4 text-white mt-1"
                    onClick={() => {
                      {
                        (tab < (values.images.length - 1)) ?
                          handleImageRemove(values.images[tab].file) : (tab === 0) ? handleImageRemove(values.images[tab].file) : null
                      }
                    }}
                  />
                </button>
              </div>
            </div>

            <div className="row mx-0" style={{ cursor: 'pointer' }} >

              {values.images.map((image, index) => (
                <img key={index} src={generatePublicUrlPartners(image.file)} alt={image.file}
                  className={`img-thumbnail rounded ${isActive(index)}`}
                  style={{ height: '60px', width: '70px' }}
                  onClick={() => {
                    setTab(index);
                  }} />
              ))}

            </div>
          </>
        ) : ""}
      </div>

      <div className="row mt-4 mb-2 mx-3 px-3">
        <label className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
          <span>Upload File(s)</span>
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

FileUploadPartners.auth = { adminOnly: true };
