import React, { useContext, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
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
    faPlusCircle,
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
                categories: action.payload,
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
            return { ...state, loadingDelete: true }
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };

        default:
            return state;
    }
};

export default function WorkerPositionListScreen() {
    const [{ loading, error, categories, loadingCreate, loadingDelete, successDelete }, dispatch] =
        useReducer(reducer, {
            loading: true,
            categories: [],
            error: '',
        });

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                const { data } = await axios.get(`http://localhost:5000/api/workersplaces`);
                dispatch({ type: "FETCH_SUCCESS", payload: data });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };

        if (successDelete) {
            dispatch({ type: "DELETE_RESET" });
        } else {
            fetchData();
        }
    }, [userInfo, successDelete]);

    const deleteHandler = async (categoryId) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                dispatch({ type: "DELETE_REQUEST" });
                await axios.delete(`http://localhost:5000/api/workersplaces/${categoryId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'DELETE_SUCCESS' });
                toast.success('Worker Position deleted successfully');
            } catch (err) {
                dispatch({ type: "DELETE_FAIL" });
                toast.error(getError(error));
            }
        }
    };

    const formatoMexico = (number) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        let arr = number.toString().split('.');
        arr[0] = arr[0].replace(exp, rep);
        return arr[1] ? arr.join('.') : arr[0];
    }

    return (
        <div className='grid md:grid-cols-8 md:gap-1 mt-4'>
            <Helmet>
                <title>Tec Data - List of Worker Positions</title>
            </Helmet>
            <div>
                <SideNavbar />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                <div className="flex justify-between mb-4">
                    <h1 className='text-2xl text-blue-900 text-bold'>List of Worker Positions</h1>
                    <div>
                        <Link to="/admin/workerpositioncreate" className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2">
                            <FontAwesomeIcon
                                icon={faPlusCircle}
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
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="border-b bg-gray-200">
                                <tr>
                                    <th className="px-4 p.1 text-left w-2">Id</th>
                                    <th className="p-1 text-left">Name</th>
                                    <th className="p-1 text-left">Category</th>
                                    <th className="px-1 p-1 text-right">Basic Salary</th>
                                    <th className="px-1 p-1 text-right">Bonificatios</th>
                                    <th className="px-1 p-1 text-right">Food Supplier</th>
                                    <th className="px-1 p-1 text-right">Movilizations</th>
                                    <th className="px-1 p-1 text-right">Brut Salary</th>
                                    <th className="p-1 text-center">Edit</th>
                                    <th className="p-1 text-left">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category._id} className="border-b">
                                        <td className="px-3 p-1 w-2">
                                            {category._id.substring(20, 24)}
                                        </td>
                                        <td className=" p-1 ">{category.name}</td>
                                        <td className=" p-1 ">{category.workerCategory.name}</td>
                                        <td className=" p-1 text-right">{formatoMexico(parseFloat(category.basicSalary).toFixed(2))}</td>
                                        <td className=" p-1 text-right">{formatoMexico(parseFloat(category.bonifications).toFixed(2))}</td>
                                        <td className=" p-1 text-right">{formatoMexico(parseFloat(category.foodSupplier).toFixed(2))}</td>
                                        <td className=" p-1 text-right">{formatoMexico(parseFloat(category.movilizations).toFixed(2))}</td>
                                        <td className=" p-1 text-right">{formatoMexico(parseFloat(category.brutSalary).toFixed(2))}</td>
                                        <td className=" p-1 w-14 text-center">
                                            <Link to={`/admin/workerposition/${category._id}`}>
                                                <FontAwesomeIcon
                                                    icon={faPencilAlt}
                                                    className="h-4 w-4 text-green-700"
                                                />
                                            </Link>
                                        </td>
                                        <td className=" p-1 w-14 text-center">
                                            <a onClick={() => deleteHandler(category._id)}>
                                                <FontAwesomeIcon
                                                    icon={faTrashAlt}
                                                    className="h-4 w-4 text-red-700"
                                                />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}