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
import { faCalculator, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
            return { ...state, loadingUpdate: true, error: "" };
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
    workerCategory: "",
    basicSalary: "",
    bonifications: "",
    foodSupplier: "",
    movilizations: "",
    brutSalary: "",
};

export default function WorkerPositionEditScreen() {
    const navigate = useNavigate();
    const params = useParams(); // /productcategory/:id
    const { id: workerPositionId } = params;

    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [values, setValues] = useState(initialState);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const {
        name,
        workerCategory,
        basicSalary,
        bonifications,
        foodSupplier,
        movilizations,
        brutSalary,
    } = values;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                loadWorkerPosition();
                dispatch({ type: "FETCH_SUCCESS" });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
                toast.error(getError(error));
            }
        };
        fetchData();
        loadCategories();
    }, []);

    const loadWorkerPosition = async () => {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`http://localhost:5000/api/workersplaces/${workerPositionId}`);
        setValues({ ...values, ...data });
        dispatch({ type: "FETCH_SUCCESS" });
    };

    const loadCategories = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/workerscategories`);
        setCategories(data);
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = async (e) => {
        e.preventDefault();
        setSelectedCategory(e.target.value);
        if (values.workerCategory._id === e.target.value) {
            loadProduct();
        }
    };

    const handleCalculus = async (e) => {
        e.preventDefault();
        e.preventDefault();
        setValues({ ...values, brutSalary: parseFloat(basicSalary) + parseFloat(bonifications) + parseFloat(foodSupplier) + parseFloat(movilizations) })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        values.workerCategory = selectedCategory ? selectedCategory : values.workerCategory;
        try {
            dispatch({ type: "UPDATE_REQUEST" });
            await axios.put(`http://localhost:5000/api/workersplaces/${workerPositionId}`,
                { values }, { headers: { Authorization: `Bearer ${userInfo.token}` }, }
            );
            dispatch({ type: "UPDATE_SUCCESS" });
            toast.success("Worker Position updated successfully");
            navigate('/admin/workerspositions');
        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL' });
            toast.error(getError(err));
        }
    }

    return (<div className="grid md:grid-cols-8 md:gap-0 mt-2">
        <Helmet>
            <title>Tec Data - Edit Worker Position ${workerPositionId}</title>
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
                        <h1 className='text-xl font-bold text-blue-600'>Edit Worker Position {workerPositionId}</h1>

                        <div className="mb-2">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="w-full h-8"
                                name="name"
                                placeholder="Name"
                                value={name}
                                onChange={handleChange}
                                autoFocus
                            />
                        </div>

                        <div className="mb-2">
                            <label>Worker Category</label>
                            <select
                                name="category"
                                required
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                aria-label="Default select example"
                                value={selectedCategory ? selectedCategory : workerCategory._id}
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

                        <div className="mb-2">
                            <label htmlFor="name">Basic Salary</label>
                            <input
                                type="number"
                                required
                                className="w-full text-right h-8"
                                name="basicSalary"
                                value={basicSalary}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="name">Bonifications</label>
                            <input
                                type="number"
                                required
                                className="w-full text-right h-8"
                                name="bonifications"
                                value={bonifications}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="name">Food Supplier</label>
                            <input
                                type="number"
                                required
                                className="w-full text-right h-8"
                                name="foodSupplier"
                                value={foodSupplier}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="name">Movilizations</label>
                            <input
                                type="number"
                                required
                                className="w-full text-right h-8"
                                name="movilizations"
                                value={movilizations}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="name">Brut Salary</label>
                            <input
                                type="number"
                                required
                                className="w-full text-right h-8"
                                name="brutSalary"
                                value={brutSalary}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-wrap mt-3 mb-2">
                            <div className="w-full md:w-1/3 px-[2px] mb-2 md:mb-0">
                                <button
                                    disabled={loadingUpdate}
                                    className="indigo-button w-full"
                                    onClick={handleCalculus}
                                >
                                    <FontAwesomeIcon
                                        icon={faCalculator}
                                        className="h-6 w-6 text-white mr-1 hover:text-yellow-200"
                                    />
                                    {loadingUpdate ? "Loading" : "Calc"}
                                </button>
                            </div>
                            <div className="w-full md:w-1/3 px-[2px] mb-2 md:mb-0">
                                <button disabled={loadingUpdate} className="primary-button w-full">
                                    <FontAwesomeIcon
                                        icon={faSave}
                                        className="h-6 w-6 text-white mr-1 hover:text-yellow-200"
                                    />
                                    {loadingUpdate ? "Loading" : "Save"}
                                </button>
                            </div>
                            <div className="w-full md:w-1/3 px-[2px] mb-2 md:mb-0">
                                <Link to={`/admin/workerspositions`} className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center w-full rounded-md outline outline-offset-0 outline-1">
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