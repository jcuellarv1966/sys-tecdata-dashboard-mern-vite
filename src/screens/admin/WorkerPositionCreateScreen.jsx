import React, { useContext, useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet-async';
import SideNavbar from "../../components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };

        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true, error: "" };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false, error: action.payload };

        default:
            return state;
    }
};

const initialState = {
    name: "",
    workerCategory: "",
    categories: [],
    basicSalary: "",
    bonifications: "",
    foodSupplier: "",
    movilizations: "",
    brutSalary: "",
};

function WorkerPositionCreateScreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();

    const [{ loading, error, loadingCreate }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    const [values, setValues] = useState(initialState);
    const [flag, setFlag] = useState(0);

    const {
        name,
        workerCategory,
        categories,
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
                loadCategories();
                handleFirstCategoryChange();
                dispatch({ type: "FETCH_SUCCESS" });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
                toast.error(getError(err));
            }
        };
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    const loadCategories = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/workerscategories`);
        setValues({ ...values, categories: data });
    };

    const handleFirstCategoryChange = async () => {
        const myWorkerCategory = JSON.stringify(categories[0], ["_id"]);
        if (myWorkerCategory !== undefined) {
            const datazo = JSON.parse(myWorkerCategory)._id;
            setValues({ ...values, workerCategory: datazo });
            console.log(values.workerCategory);
            setFlag(0);
        }
        if (values.workerCategory === "") {
            setFlag(flag + 1);
        }
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = async (e) => {
        e.preventDefault();
        setValues({ ...values, workerCategory: e.target.value });
    };

    const handleCalculus = async (e) => {
        e.preventDefault();
        setValues({ ...values, brutSalary: parseFloat(basicSalary) + parseFloat(bonifications) + parseFloat(foodSupplier) + parseFloat(movilizations) })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: "CREATE_REQUEST" });
            await axios.post(`http://localhost:5000/api/workersplaces`, {
                name,
                workerCategory,
                basicSalary,
                bonifications,
                foodSupplier,
                movilizations,
                brutSalary,
            },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
            dispatch({ type: "CREATE_SUCCESS" });
            setValues(initialState);
            toast.success("Worker Place created successfully");
            navigate("/admin/workerspositions");
        } catch (err) {
            dispatch({ type: "CREATE_FAIL", payload: getError(err) });
            toast.error(getError(error));
        }
    }

    return (
        <div className="grid md:grid-cols-8 md:gap-0 mt-2">
            <Helmet>
                <title>Tec Data - Create Worker Position</title>
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
                    <form className="mx-auto max-w-screen-md overflow-x-hidden" onSubmit={handleSubmit}>
                        <h1 className='text-xl font-bold text-blue-600'>Create Worker Position</h1>

                        <div className="mb-2">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                required
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
                                value={workerCategory}
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
                                    disabled={loadingCreate}
                                    className="indigo-button w-full"
                                    onClick={handleCalculus}
                                >
                                    <FontAwesomeIcon
                                        icon={faCalculator}
                                        className="h-6 w-6 text-white mr-1 hover:text-yellow-200"
                                    />
                                    {loadingCreate ? "Loading" : "Calc"}
                                </button>
                            </div>
                            <div className="w-full md:w-1/3 px-[2px] mb-2 md:mb-0">
                                <button disabled={loadingCreate} className="primary-button w-full">
                                    <FontAwesomeIcon
                                        icon={faSave}
                                        className="h-6 w-6 text-white mr-1 hover:text-yellow-200"
                                    />
                                    {loadingCreate ? "Loading" : "Save"}
                                </button>
                            </div>
                            <div className="w-full md:w-1/3 px-[2px] mb-2 md:mb-0">
                                <Link to={`/admin/workerspositions`} className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center w-full rounded-md outline outline-offset-0 outline-1">
                                    <FontAwesomeIcon
                                        icon={faArrowLeft}
                                        className="h-5 w-5 text-blue-500 mr-1"
                                    />
                                    Back</Link>to                         </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default WorkerPositionCreateScreen;