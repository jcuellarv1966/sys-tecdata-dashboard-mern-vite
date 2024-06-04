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
import SearchWorkerBox from "../../components/SearchWorkerBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserPlus,
    faPencilAlt,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import dateFormat from "dateformat";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: "" };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                workers: action.payload.workers,
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

export default function WorkerListScreen() {
    const [{ loading, error, workers, pages, loadingCreate, loadingDelete, successDelete }, dispatch] =
        useReducer(reducer, {
            loading: true,
            workers: [],
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
                const { data } = await axios.get(`http://localhost:5000/api/workers/admin?page=${page} `, {
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

    const deleteHandler = async (workerId, image) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        try {
            dispatch({ type: "DELETE_REQUEST" });
            if (image && image !== "") {
                await axios.post("http://localhost:5000/api/workers/removeimage", { file, },
                    { headers: { Authorization: `Bearer ${userInfo.token}` }, }
                );
            }
            await axios.delete(`http://localhost:5000/api/workers/${workerId}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: "DELETE_SUCCESS" });
            toast.success("Woirker deleted successfully");
        } catch (err) {
            dispatch({ type: "DELETE_FAIL" });
            toast.error(getError(err));
        }
    };

    const formatoMexico = (number) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        let arr = number.toString().split('.');
        arr[0] = arr[0].replace(exp, rep);
        return arr[1] ? arr.join('.') : arr[0];
    }

    function addHoursToDate(objDateStr, intHours) {
        var objDate = new Date(objDateStr);
        var numberOfMlSeconds = objDate.getTime();
        var addMlSeconds = (intHours * 60) * 60000;
        var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
        return newDateObj;
      }

    return (
        <div className='grid md:grid-cols-8 md:gap-1 mt-4'>
            <Helmet>
                <title>Tec Data - List of Workers</title>
            </Helmet>
            <div>
                <SideNavbar />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                <div className="flex justify-between mb-4">
                    <h1 className='text-2xl text-blue-900 text-bold'>List of Workers</h1>
                    <SearchWorkerBox />
                    <div>
                        <Link to="/admin/workercreate" className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2">
                            <FontAwesomeIcon
                                icon={faUserPlus}
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
                        <div className="overflow-x-auto mb-2">
                            <table className="min-w-full">
                                <thead className="border-b bg-gray-200">
                                    <tr>
                                        <th className="px-3 text-left w-3">Id</th>
                                        <th className="px-1 text-left">RUT</th>
                                        <th className="px-1 p-0 text-left">LastName</th>
                                        <th className="px-1 p-0 text-left">FirstName</th>
                                        <th className="px-1 p-0 text-left">Phone</th>
                                        <th className="px-1 p-0 text-left">Email</th>
                                        <th className="px-1 p-0 text-left">Category</th>
                                        <th className="px-1 p-0 text-left">Place</th>
                                        <th className="px-1 p-0 text-right">Basic Salary</th>
                                        <th className="px-2 p-0 text-right">Begin Date</th>
                                        <th className="p-0 text-left">Edit</th>
                                        <th className="p-0 text-left">Delete</th>
                                    </tr>
                                </thead>
                                {
                                    <tbody>
                                        {workers.map((worker) => (
                                            <tr key={worker._id} className="border-b text-xs">
                                                <td className=" p-1 ">
                                                    {worker._id.substring(20, 24)}
                                                </td>
                                                <td className=" p-1 w-3">{worker.rut}</td>
                                                <td className=" p-1 ">{worker.lastName}</td>
                                                <td className=" p-1 ">{worker.firstName}</td>
                                                <td className=" p-1 ">{worker.contactNumber}</td>
                                                <td className=" p-1 ">{worker.email}</td>
                                                <td className=" p-1 ">{worker.workerCategory.name}</td>
                                                <td className=" p-1 ">{worker.workerPlace.name}</td>
                                                <td className=" p-1 text-right">{formatoMexico(parseFloat(worker.basicSalary).toFixed(2))}</td>
                                                <td className=" px-0 p-1 text-center w-1">
                                                    {dateFormat(addHoursToDate(worker.beginDate, 4), "dd-mm-yy")}
                                                </td>
                                                <td className=" p-1 ">
                                                    <Link to={`/admin/worker/${worker._id}`}>
                                                        <FontAwesomeIcon
                                                            icon={faPencilAlt}
                                                            className="h-4 w-4 text-green-700"
                                                        />
                                                    </Link>
                                                </td>
                                                <td className=" p-1 text-center">
                                                    <a className="cursor-pointer" onClick={() => deleteHandler(worker._id, worker.image)}>
                                                        <FontAwesomeIcon
                                                            icon={faTrashAlt}
                                                            className="h-4 w-4 text-red-700"
                                                        />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                }
                            </table>
                        </div>
                        <div>
                            {[...Array(pages).keys()].map((x) => (
                                <Link
                                    className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                    key={x + 1}
                                    to={`/admin/workers?page=${x + 1}`}
                                >
                                    {x + 1}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}