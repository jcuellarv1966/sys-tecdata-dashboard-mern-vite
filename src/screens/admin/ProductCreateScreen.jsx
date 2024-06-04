import React, { useContext, useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet-async';
import SideNavbar from "../../components/SideNavbar";
import FileUploadProducts from "../../components/FileUploadProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
    switch (action.type) {

        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, error: "" };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };

        case "CREATE_REQUEST":
            return { ...state, loadingCreate: true, error: "" };
        case "CREATE_SUCCESS":
            return { ...state, loadingCreate: false };
        case "CREATE_FAIL":
            return { ...state, loadingCreate: false, error: action.payload };

        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return { ...state, loadingUpload: false, errorUpload: '', };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };

        default:
            return state;
    }
};

const initialState = {
    title: "",
    category: "",
    categories: [],
    images: [],
    price: "",
    brand: "",
    countInStock: "",
    description: "",
    featuredImage: "",
    isFeatured: false,
};

function ProductCreateScreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();

    const [{ loading, loadingCreate, error, loadingUpload }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    const [values, setValues] = useState(initialState);

    const {
        title,
        category,
        categories,
        images,
        price,
        brand,
        countInStock,
        description,
    } = values;

    useEffect(() => {
        try {
            dispatch({ type: "FETCH_REQUEST" });
            loadCategories();
            dispatch({ type: "FETCH_SUCCESS" });
        } catch (err) {
            dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            toast.error(getError(error));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadCategories = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/productscategories`);
        if (data.length > 0) {
            setValues({ ...values, categories: data, category: data[0]._id });
        }
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = async (e) => {
        e.preventDefault();
        setValues({ ...values, category: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: "CREATE_REQUEST" });
            await axios.post(`http://localhost:5000/api/products`, {
                title, price, images, category, countInStock, brand, description
            },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
            dispatch({ type: "CREATE_SUCCESS" });
            setValues(initialState);
            toast.success("Product created successfully");
            navigate("/admin/products");
        } catch (err) {
            dispatch({ type: "CREATE_FAIL", payload: getError(err) });
            toast.error(getError(err));
        }
    };

    return (
        <div className="grid md:grid-cols-8 md:gap-0 mt-2">
            <Helmet>
                <title>Tec Data - Create Product</title>
            </Helmet>
            <div>
                <SideNavbar />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="alert-error">{error}</div>
                ) : (
                    <>
                        <div className="p-0">
                            <FileUploadProducts
                                values={values}
                                setValues={setValues}
                                loadingUpload={loadingUpload}
                            />
                        </div>
                        <form className="mx-auto max-w-screen-lg overflow-x-hidden" onSubmit={handleSubmit}>
                            <h1 className='text-xl font-bold text-blue-600'>Create Product</h1>

                            <div className="flex flex-wrap mb-2">
                                <div className="w-full md:w-2/3 px-1 mb-2 md:mb-0">
                                    <label htmlFor="title">Title</label>
                                    <input
                                        type="text"
                                        className="w-full h-8"
                                        required
                                        name="title"
                                        placeholder="Title"
                                        value={title}
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-1">
                                    <label>Category</label>
                                    <select
                                        name="category"
                                        className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                        aria-label="Default select example"
                                        required
                                        value={category}
                                        onChange={handleCategoryChange}
                                    >
                                        <option disabled value="">
                                            Please select
                                        </option>
                                        {categories.length > 0 &&
                                            categories.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-wrap mb-2">
                                <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                    <label htmlFor="brand">Brand</label>
                                    <input
                                        type="text"
                                        className="w-full h-8"
                                        required
                                        name="brand"
                                        placeholder="Brand"
                                        value={brand}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-1">
                                    <label htmlFor="price">Price</label>
                                    <input
                                        type="number"
                                        className="w-full h-8"
                                        required
                                        name="price"
                                        placeholder="Price"
                                        value={price}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-1">
                                    <label htmlFor="countInStock">Count in Stock</label>
                                    <input
                                        type="number"
                                        className="w-full h-8"
                                        required
                                        name="countInStock"
                                        placeholder="Count in Stock"
                                        value={countInStock}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-2 px-1">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    type="text"
                                    rows="2"
                                    className="p-2.5 appearance-none block w-full bg-gray-200 text-gray-700 border border-solid border-gray-200 rounded py-3 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    name="description"
                                    placeholder="Description ..."
                                    value={description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="flex flex-wrap mt-3 mb-1">
                                <div className="w-full md:w-1/2 px-1 mb-2 md:mb-0">
                                    <button disabled={loadingCreate} className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2 w-full">
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="h-5 w-5 text-white mr-1 hover:text-yellow-200"
                                        />
                                        {loadingCreate ? "Loading" : "Save"}
                                    </button>
                                </div>
                                <div className="w-full md:w-1/2 px-1 mb-2 md:mb-0">
                                    <a href={`/admin/products`} className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center w-full rounded-md outline outline-offset-0 outline-1">
                                        <FontAwesomeIcon
                                            icon={faArrowLeft}
                                            className="h-5 w-5 text-blue-500 mr-1"
                                        />
                                        Back</a>
                                </div>
                            </div>
                        </form>
                    </>


                )}
            </div>
        </div>
    )
}

export default ProductCreateScreen;