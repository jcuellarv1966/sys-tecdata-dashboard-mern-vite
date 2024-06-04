import React, { useContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet-async';
import SideNavbarAdvisory from "../../components/SideNavbarAdvisory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
    switch (action.type) {

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
    description: ""
};

const ClientContractClauseCreateScreen = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();

    const [{ loading, error, loadingCreate }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    const [values, setValues] = useState(initialState);
    const { name, description } = values;

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: "CREATE_REQUEST" });
            await axios.post(`http://localhost:5000/api/clientcontractclauses`, { name, description },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
            dispatch({ type: "CREATE_SUCCESS" });
            setValues(initialState);
            toast.success("Client Contract Clause created successfully");
            navigate("/advisory/clientcontractclauses");
        } catch (err) {
            dispatch({ type: "CREATE_FAIL", payload: getError(err) });
            toast.error(getError(error));
        }
    };

    return (
        <div className="grid md:grid-cols-8 md:gap-0 mt-2">
            <Helmet>
                <title>Tec Data - Create Client Contract Clause</title>
            </Helmet>
            <div>
                <SideNavbarAdvisory />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">

                <form className="mx-auto max-w-screen-md overflow-x-hidden" onSubmit={handleSubmit}>
                    <h1 className='text-xl font-bold text-blue-600'>Create Client Contract Clause</h1>

                    <div className="mb-4">
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

                    <div className="mb-4">
                        <label htmlFor="name">Description</label>
                        <input
                            type="text"
                            className="w-full h-8"
                            name="description"
                            placeholder="Description"
                            value={description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-wrap mt-3 mb-1">
                        <div className="w-full md:w-1/2 mb-2 px-[2px] md:mb-0">
                            <button disabled={loadingCreate} className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2 w-full">
                                <FontAwesomeIcon
                                    icon={faSave}
                                    className="h-5 w-5 text-white mr-1 hover:text-yellow-200"
                                />
                                {loadingCreate ? "Loading" : "Save"}
                            </button>
                        </div>
                        <div className="w-full md:w-1/2 mb-2 px-[2px] md:mb-0">
                            <Link to={`/advisory/clientcontractclauses`} className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center w-full rounded-md outline outline-offset-0 outline-1">
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className="h-5 w-5 text-blue-500 mr-1"
                                />
                                Back</Link>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default ClientContractClauseCreateScreen;