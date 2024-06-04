import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import SideNavbar from "../../components/SideNavbar";
import FileUploadProducts from "../../components/FileUploadProducts";
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };

        default:
            return state;
    }
};

const initialState = {
    title: "",
    category: "",
    price: "",
    brand: "",
    countInStock: "",
    description: "",
    featuredImage: "",
    isFeatured: false,
};

export default function ProductEditScreen() {
    const navigate = useNavigate();
    const params = useParams(); // /product/:id
    const { id: productId } = params;

    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [values, setValues] = useState(initialState);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const {
        title,
        category,
        price,
        brand,
        countInStock,
        description,
    } = values;

    useEffect(() => {
        const fetchData = async () => {
            try {
                loadProduct();
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };

        fetchData();
        loadCategories();
    }, [productId]);

    const loadProduct = async () => {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setValues({ ...values, ...data });
        dispatch({ type: "FETCH_SUCCESS" });
    };

    const loadCategories = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/productscategories`);
        setCategories(data);
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = async (e) => {
        e.preventDefault();
        setSelectedCategory(e.target.value);
        if (values.category._id === e.target.value) {
            loadProduct();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        values.category = selectedCategory ? selectedCategory : values.category;
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `http://localhost:5000/api/products/${productId}`,
                { values }, { headers: { Authorization: `Bearer ${userInfo.token}` }, }
            );
            dispatch({ type: "UPDATE_SUCCESS" });
            toast.success('Product updated successfully');
            navigate('/admin/products');
        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL' });
            toast.error(getError(err));
        }
    };

    return (
        <div className="grid md:grid-cols-8 md:gap-0 mt-2">
            <Helmet>
                <title>Tec Data - Edit Product ${productId}</title>
            </Helmet>
            <div>
                <SideNavbar />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <div className='overflow-x-hidden'>
                        <div className="p-0">
                            <FileUploadProducts
                                values={values}
                                setValues={setValues}
                                loadingUpload={loadingUpload}
                            />
                        </div>

                        <form className="mx-auto max-w-screen-lg min-w-fit" onSubmit={handleSubmit}>
                            <h1 className='text-xl font-bold text-blue-600'>Edit Product {productId}</h1>

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
                                        value={selectedCategory ? selectedCategory : category._id}
                                        onClick={handleCategoryChange}
                                        onChange={handleCategoryChange}
                                    >
                                        <option disabled>Please select</option>
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
                                    <button disabled={loadingUpdate} className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2 w-full">
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="h-5 w-5 text-white mr-1 hover:text-yellow-200"
                                        />
                                        {loadingUpdate ? "Loading" : "Update"}
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
                    </div>


                )}
            </div>
        </div>
    );
}