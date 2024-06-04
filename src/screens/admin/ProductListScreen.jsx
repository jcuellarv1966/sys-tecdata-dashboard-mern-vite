import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from "../../../utils/error";
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Helmet } from 'react-helmet-async';
import SideNavbar from "../../components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faNotesMedical,
    faPencilAlt,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };

        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false }
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };

        default:
            return state;
    }
};

export default function ProductListScreen() {
    const [{ loading, error, products, pages, loadingCreate, loadingDelete, successDelete }, dispatch] =
        useReducer(reducer, {
            loading: true,
            products: [],
            error: '',
        });

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                const { data } = await axios.get(`http://localhost:5000/api/products/admin?page=${page} `, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [page, userInfo, successDelete]);

    const deleteHandler = async (productId, images) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                dispatch({ type: "DELETE_REQUEST" });
                if (images) {
                    for (let i = 0; i < images.length; i++) {
                        let file = images[i].file;
                        await axios.post("http://localhost:5000/api/products/removeimage", { file, },
                            { headers: { Authorization: `Bearer ${userInfo.token}` }, }
                        );
                    }
                };
                await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'DELETE_SUCCESS' });
                toast.success('product deleted successfully');
            } catch (err) {
                dispatch({ type: "DELETE_FAIL" });
                toast.error(getError(error));
            }
        }
    };

    return (
        <div className='grid md:grid-cols-8 md:gap-1 mt-4'>
            <Helmet>
                <title>Tec Data - List of Products</title>
            </Helmet>
            <div>
                <SideNavbar />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                <div className="flex justify-between mb-4">
                    <h1 className='text-2xl text-blue-900 text-bold'>List of Products</h1>
                    <div>
                        <Link to="/admin/productcreate" className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2">
                            <FontAwesomeIcon
                                icon={faNotesMedical}
                                className="h-5 w-5 text-white mr-3 hover:text-yellow-200"
                            />
                            {loadingCreate ? "Loading" : "Create"}
                        </Link>
                    </div>
                </div>

                {loadingCreate && <LoadingBox></LoadingBox>}
                {loadingDelete && <LoadingBox></LoadingBox>}

                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <div className="overflow-x-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b bg-gray-200">
                                    <tr>
                                        <th className="px-3 p-1 text-left">Id</th>
                                        <th className='p-1 text-left'>Product</th>
                                        <th className='p-1 px-4 text-right'>Price</th>
                                        <th className='p-1'>Category</th>
                                        <th className='p-1'>Brand</th>
                                        <th className="p-1 text-left">Edit</th>
                                        <th className="p-1 text-center">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td className="p-1">
                                                {product._id.substring(20, 24)}
                                            </td>
                                            <td className='p-1'>{product.title}</td>
                                            <td className=" p-1 px-3 text-right">{(parseFloat(product.price).toFixed(2)).toString()}
                                            </td>
                                            <td className='p-1'>{product.category ? product.category.name : ""}</td>
                                            <td className='p-1'>{product.brand}</td>
                                            <td className="p-1 px-2">
                                                <Link to={`/admin/product/${product._id}`}>
                                                    <FontAwesomeIcon
                                                        icon={faPencilAlt}
                                                        className="h-4 w-4 text-green-700"
                                                    />
                                                </Link>
                                            </td>
                                            <td className="p-1 text-center">
                                                <button onClick={() => deleteHandler(product._id, product.images)}>
                                                    <FontAwesomeIcon
                                                        icon={faTrashAlt}
                                                        className="h-4 w-4 text-red-700 cursor-pointer"
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            {[...Array(pages).keys()].map((x) => (
                                <Link
                                    className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                    key={x + 1}
                                    to={`/admin/products?page=${x + 1}`}
                                >
                                    {x + 1}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}