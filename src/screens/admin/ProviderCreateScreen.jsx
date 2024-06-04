import React, { useContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet-async';
import SideNavbar from "../../components/SideNavbar";
import { Link } from "react-router-dom";
import FileUploadProviders from "../../components/FileUploadProviders";
import InputMask from 'react-input-mask';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
    switch (action.type) {

        case "CREATE_REQUEST":
            return { ...state, loadingCreate: true, error: "" };
        case "CREATE_SUCCESS":
            return { ...state, loadingCreate: false };
        case "CREATE_FAIL":
            return { ...state, loadingCreate: false, error: action.payload };

        default:
            return state;
    }
};

const initialState = {
    rut: "",
    razSocial: "",
    address: "",
    email: "",
    contactNumber: "+56900000000",
    credit: 0,
    bornDate: "",
    beginDate: "",
    endDate: "",
    images: [],
    current: "Np",
};

function InputRut(props) {
    return (
        <InputMask
            className={props.className}
            mask='99999999999'
            maskChar="0"
            required={props.required}
            value={props.value}
            onChange={props.onChange}>
        </InputMask>
    );
}

function InputContactNumber(props) {
    return (
        <InputMask
            className={props.className}
            mask='+56999999999'
            maskChar="9"
            required={props.required}
            alwaysShowMask={true}
            value={props.value}
            onChange={props.onChange}>
        </InputMask>
    );
}

function ProviderCreateScreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const navigate = useNavigate();

    const [{ loadingCreate, error }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    const [values, setValues] = useState(initialState);
    const [vigente, setVigente] = useState(false);

    const {
        rut,
        razSocial,
        address,
        email,
        contactNumber,
        credit,
        bornDate,
        beginDate,
        endDate,
        images,
        current,
    } = values;

    const handleInputRUT = ({ target: { value } }) => setValues({ ...values, rut: value });

    const handleInputContactNumber = ({ target: { value } }) => setValues({ ...values, contactNumber: value });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (vigente === true) {
            values.current = "Yes"
        } else {
            values.current = "No"
        }
        try {
            dispatch({ type: "CREATE_REQUEST" });
            await axios.post(`http://localhost:5000/api/providers`, {
                rut,
                razSocial,
                address,
                email,
                contactNumber,
                credit,
                bornDate,
                beginDate,
                endDate,
                images,
                current
            },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: "CREATE_SUCCESS" });
            setValues(initialState);
            toast.success("Provider created successfully");
            navigate("/admin/providers");
        } catch (err) {
            dispatch({ type: "CREATE_FAIL", payload: getError(err) });
            toast.error(getError(error));
        }
    };

    return (
        <div className="grid md:grid-cols-8 md:gap-0 mt-2">
            <Helmet>
                <title>Tec Data - Create Provider</title>
            </Helmet>
            <div>
                <SideNavbar />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                <div className="grid md:grid-cols-3 md:gap-0">
                    <div className="p-0">
                        <FileUploadProviders
                            values={values}
                            setValues={setValues}
                        />
                    </div>

                    <div className="overflow-x-auto md:col-span-2">
                        <form className="mx-auto max-w-screen-lg" onSubmit={handleSubmit}>
                            <h1 className="mb-4 text-xl">{`Create Provider`}</h1>

                            <div className="flex flex-wrap mb-2">
                                <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                    <label htmlFor="rut">RUT</label><br />
                                    <InputRut
                                        type="text"
                                        required
                                        className="w-full h-8"
                                        name="rut"
                                        placeholder="RUT"
                                        autoFocus={true}
                                        value={rut}
                                        onChange={handleInputRUT}
                                    />
                                </div>
                                <div className="w-full md:w-2/3 px-1">
                                    <label htmlFor="razSocial">Business Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full h-8"
                                        name="razSocial"
                                        placeholder="Business Name"
                                        value={razSocial}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap mb-2">
                                <div className="w-full md:w-4/5 px-1 mb-2 md:mb-0">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full h-8"
                                        name="address"
                                        placeholder="Address"
                                        value={address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex items-center justify-center w-full md:w-1/5 px-1 mt-2">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            name="isCurrent"
                                            checked={vigente}
                                            value={vigente}
                                            onChange={(e) => setVigente(e.target.checked)}
                                            id="flexCheckIsCurrent" />
                                        <label className="form-check-label mt-1" htmlFor="flexCheckIsCurrent">Is Current?</label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap mb-2">
                                <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full h-8"
                                        name="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-1">
                                    <label htmlFor="contactNumber">Phone</label><br />
                                    <InputContactNumber
                                        type="text"
                                        required
                                        className="w-full h-8"
                                        name="contactNumber"
                                        placeholder="Phone"
                                        value={contactNumber}
                                        onChange={handleInputContactNumber}
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-1">
                                    <label htmlFor="credit">Credit</label>
                                    <input
                                        type="number"
                                        className="w-full text-right h-8"
                                        name="credit"
                                        placeholder="Credit"
                                        value={credit}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap mb-2">
                                <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                    <label htmlFor="bornDate">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        name="bornDate"
                                        placeholder="Fecha de Nacimiento ..."
                                        value={bornDate}
                                        onChange={handleChange}
                                    ></input>
                                </div>
                                <div className="w-full md:w-1/3 px-1">
                                    <label htmlFor="beginDate">Fecha de Inicio</label>
                                    <input
                                        type="date"
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        name="beginDate"
                                        placeholder="Fecha de Inicio ..."
                                        value={beginDate}
                                        onChange={handleChange}
                                    ></input>
                                </div>
                                <div className="w-full md:w-1/3 px-1">
                                    <label htmlFor="endDate">Fecha de Termino</label>
                                    <input
                                        type="date"
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        name="endDate"
                                        placeholder="Fecha de Termino ..."
                                        value={endDate}
                                        onChange={handleChange}
                                    ></input>
                                </div>
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
                                    <Link to={`/admin/providers`} className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center w-full rounded-md outline outline-offset-0 outline-1">
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
            </div>
        </div>
    )
}

export default ProviderCreateScreen