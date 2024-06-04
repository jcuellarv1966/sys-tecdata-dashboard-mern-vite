import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import SideNavbar from "../../components/SideNavbar";
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
    switch (action.type) {

        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: "" };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false, error: action.payload };

        default:
            return state;
    }
};

const initialState = {
    name: "",
};

export default function WorkerCategoryEditScreen() {
    const navigate = useNavigate();
    const params = useParams(); // /productcategory/:id
    const { id: workerCategoryId } = params;

    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [values, setValues] = useState(initialState);
    const { name, } = values;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`http://localhost:5000/api/workerscategories/${workerCategoryId}`);
                setValues({ ...values, ...data });
                dispatch({ type: 'FETCH_SUCCESS' });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
                toast.error(getError(error));
            }
        };
        fetchData();
    }, [workerCategoryId]);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `http://localhost:5000/api/workerscategories/${workerCategoryId}`,
                { values }, { headers: { Authorization: `Bearer ${userInfo.token}` }, }
            );
            dispatch({ type: "UPDATE_SUCCESS" });
            toast.success('Worker Category updated successfully');
            navigate('/admin/workerscategories');
        } catch (err) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
            toast.error(getError(err));
        }
    };

    return (
        <div className="grid md:grid-cols-8 md:gap-0 mt-2">
            <Helmet>
                <title>Tec Data - Edit Worker Category ${workerCategoryId}</title>
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
                        <form className="mx-auto max-w-screen-md overflow-x-hidden" onSubmit={handleSubmit}>
                            <h1 className='text-xl font-bold text-blue-600'>Edit Worker Category {workerCategoryId}</h1>

                            <div className="mb-4">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className="w-full"
                                    name="name"
                                    placeholder="Name"
                                    value={name}
                                    onChange={handleChange}
                                    autoFocus
                                />
                            </div>

                            <div className="flex flex-wrap mt-3 mb-1">
                                <div className="w-full md:w-1/2 mb-2 px-[2px] md:mb-0">
                                    <button disabled={loadingUpdate} className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2 w-full">
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="h-5 w-5 text-white mr-1 hover:text-yellow-200"
                                        />
                                        {loadingUpdate ? "Loading" : "Save"}
                                    </button>
                                </div>
                                <div className="w-full md:w-1/2 mb-2 px-[2px] md:mb-0">
                                    <Link to={`/admin/workerscategories`} className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center w-full rounded-md outline outline-offset-0 outline-1">
                                        <FontAwesomeIcon
                                            icon={faArrowLeft}
                                            className="h-5 w-5 text-blue-500 mr-1"
                                        />
                                        Back</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}