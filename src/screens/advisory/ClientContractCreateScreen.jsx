import React, { useContext, useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';
import SideNavbarAdvisory from '../../components/SideNavbarAdvisory';
import { Link } from "react-router-dom";
import moment from "moment";
import "moment-timezone";
import { XCircleIcon } from '@heroicons/react/outline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Tab } from '@headlessui/react';

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return { ...state, loading: false };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };

        case "CREATE_REQUEST":
            return { ...state, loadingCreate: true, error: "" };
        case "CREATE_SUCCESS":
            return { ...state, loadingCreate: false };
        case "CREATE_FAIL":
            return { ...state, loadingCreate: false, error: action.payload };

        default:
            return state;
    }
}

const initialState = {
    numberContract: "",
    contractType: "",
    contractTypes: [],
    numberOrder: "",
    numberProject: "",
    client: "",
    clients: [],
    razSocial: "",
    address: "",
    email: "",
    contactNumber: "",
    rut: "",
    products: [],
    clauses: [],
    observations: "",
    signedDate: "",
    beginDate: "",
    endDate: "",
    cash_credit: "No",
    isValid: "No",
}

const ClientContractCreateScreen = () => {
    const { state, dispatching } = useContext(Store);
    const { userInfo, cart, cartClauses } = state;
    const { cartItems } = cart;
    const { cartClausesItems } = cartClauses;

    const navigate = useNavigate();

    const [{ loading, loadingCreate, error }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    const [values, setValues] = useState(initialState);
    const [contado_Credit, setContado_Credit] = useState(false);
    const [valido, setValido] = useState(false);
    const [flag, setFlag] = useState(0);

    const {
        numberContract,
        contractType,
        contractTypes,
        numberOrder,
        numberProject,
        client,
        clients,
        razSocial,
        address,
        email,
        contactNumber,
        rut,
        products,
        clauses,
        observations,
        signedDate,
        beginDate,
        endDate,
        cash_credit,
        isValid,
    } = values;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                loadClients();
                loadProducts();
                loadContractTypes();
                loadContractClauses();
                dispatching({ type: 'CART_CLEAR_ITEMS' });
                Cookies.set('cart', JSON.stringify({ ...cart, cartItems: [], }));
                dispatching({ type: 'CART_CLAUSE_CLEAR_ITEMS' });
                Cookies.set('cartClauses', JSON.stringify({ ...cartClauses, cartClausesItems: [], }));
                dispatch({ type: "FETCH_SUCCESS" });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };
        fetchData();
    }, [flag]);

    const loadClients = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/clients`);
        setValues({ ...values, clients: data });
        if (clients.length === 0) {
            setFlag(flag + 1);
        }
    };

    const loadProducts = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/products`);
        setValues({ ...values, products: data });
        if (products.length === 0) {
            setFlag(flag + 1);
        }
    };

    const loadContractTypes = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/clientcontracttypes`);
        setValues({ ...values, contractTypes: data });
        if (contractTypes.length === 0) {
            setFlag(flag + 1);
        }
    };

    const loadContractClauses = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/clientcontractclauses`);
        setValues({ ...values, clauses: data });
        if (clauses.length === 0) {
            setFlag(flag + 1);
        }
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleClientChange = async (e) => {
        e.preventDefault();
        const { data } = await axios.get(`http://localhost:5000/api/clients/${e.target.value}`);
        setValues({
            ...values, client: e.target.value,
            razSocial: data.razSocial,
            address: data.address,
            email: data.email,
            contactNumber: data.contactNumber,
            rut: data.rut,
        });
    };

    const handleProductChange = async (e) => {
        e.preventDefault();
        const { data } = await axios.get(`http://localhost:5000/api/products/${e.target.value}`);
        const existItem = cart.cartItems.find((x) => x.slug === data.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;

        if (data.countInStock < quantity) {
            return toast.error('Sorry. Product is out of stock');
        }
        dispatching({ type: 'CART_ADD_ITEM', payload: { ...data, quantity } });
    };

    const handleClientContractTypeChange = async (e) => {
        e.preventDefault();
        setValues({ ...values, contractType: e.target.value });
    };

    const updateCartHandler = async (item, qty) => {
        const quantity = Number(qty);
        const { data } = await axios.get(`http://localhost:5000/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            return toast.error('Sorry. Product is out of stock');
        }
        dispatching({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    };

    const removeItemHandler = (item) => {
        dispatching({ type: 'CART_REMOVE_ITEM', payload: item });
    };

    const handleClientContractClauseChange = async (e) => {
        e.preventDefault();
        const { data } = await axios.get(`http://localhost:5000/api/clientcontractclauses/${e.target.value}`);
        dispatching({ type: 'CART_CLAUSE_ADD_ITEM', payload: { ...data, } });
    }

    const updateCartClausesHandler = async (item, observations) => {
        dispatching({ type: 'CART_CLAUSE_ADD_ITEM', payload: { ...item, observations } });
    };

    const updateCartClausesDescriptionHandler = async (item, description) => {
        dispatching({ type: 'CART_CLAUSE_ADD_ITEM', payload: { ...item, description } });
    };

    const removeItemClauseHandler = (item) => {
        dispatching({ type: 'CART_CLAUSE_REMOVE_ITEM', payload: item });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: "UPDATE_REQUEST" });
            const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
            const subTotal = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
            const igv = round2(subTotal * 0.19);
            const total = round2(subTotal * 1.19);
            if (contado_Credit === true) {
                values.cash_credit = "Yes" 
            } else {
                values.cash_credit = "No" 
            }
            if (valido === true) {
                values.isValid = "Yes"
            } else {
                values.isValid = "No"
            }
            await axios.post(`http://localhost:5000/api/clientcontracts`, {
                numberContract,
                contractType,
                numberOrder,
                numberProject,
                client,
                razSocial,
                observations,
                contractItems: cartItems,
                subTotal,
                igv,
                total,
                signedDate,
                beginDate,
                endDate,
                contractClauses: cartClausesItems,
                cash_credit,
                isValid,
                worker: userInfo._id
            },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatching({ type: 'CART_CLEAR_ITEMS' });
            Cookies.set('cart', JSON.stringify({ ...cart, cartItems: [], }));
            dispatching({ type: 'CART_CLAUSE_CLEAR_ITEMS' });
            Cookies.set('cartClauses', JSON.stringify({ ...cartClauses, cartClausesItems: [], }));
            dispatch({ type: "UPDATE_SUCCESS" });
            setValues(initialState);
            toast.success("Client Contract created successfully");
            navigate("/advisory/clientcontracts");
        } catch (err) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
            toast.error(getError(err));
        }
    }

    const formatoMexico = (number) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        let arr = number.toString().split('.');
        arr[0] = arr[0].replace(exp, rep);
        return arr[1] ? arr.join('.') : arr[0];
    }

    return (
        <div className="grid md:grid-cols-8 md:gap-0 mt-1">
            <Helmet>
                <title>Tec Data - Create Client Contract</title>
            </Helmet>
            <div>
                <SideNavbarAdvisory />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="alert-error">{error}</div>
                ) : (
                    <form className="mx-auto max-w-screen-lg overflow-y-hidden" onSubmit={handleSubmit}>
                        <h1 className="mb-1 text-xl text-left">{`Create Client Contract`}</h1>

                        <div className="grid md:grid-cols-2 md:gap-2">
                            <div>
                                <div className="md:flex md:items-start mb-2">
                                    <div className="md:w-1/3">
                                        <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-2" htmlFor="inline-full-name">Client</label>
                                    </div>
                                    <div className="md:w-2/3">
                                        <select
                                            name="client"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                            aria-label="Default select example"
                                            required
                                            onClick={handleClientChange}
                                        >
                                            <option disabled>Please select</option>
                                            {clients.length > 0 &&
                                                clients.map((c) => (
                                                    <option key={c._id} value={c._id}>
                                                        {c.razSocial}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="md:flex md:items-start mb-2">
                                    <div className="md:w-1/3">
                                        <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">Address</label>
                                    </div>
                                    <div className="md:w-2/3">
                                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8 text-sm"
                                            id="inline-full-name"
                                            type="text"
                                            value={address}
                                            readOnly />
                                    </div>
                                </div>

                                <div className="md:flex md:items-start mb-2">
                                    <div className="md:w-1/3">
                                        <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">eMail</label>
                                    </div>
                                    <div className="md:w-2/3">
                                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8 text-sm"
                                            id="inline-full-name"
                                            type="text"
                                            value={email}
                                            readOnly />
                                    </div>
                                </div>

                                <div className="md:flex md:items-start mb-2">
                                    <div className="md:w-1/3">
                                        <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">contact Number</label>
                                    </div>
                                    <div className="md:w-2/3">
                                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8 text-sm"
                                            id="inline-full-name"
                                            type="text"
                                            value={contactNumber}
                                            readOnly />
                                    </div>
                                </div>

                                <div className="md:flex md:items-start mb-2">
                                    <div className="md:w-1/3">
                                        <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">RUT</label>
                                    </div>
                                    <div className="md:w-2/3">
                                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8 text-sm"
                                            id="inline-full-name"
                                            type="text"
                                            value={rut}
                                            readOnly />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="md:flex md:items-start mb-1 mr-2 px-2">
                                    <div className="md:w-1/4 mt-2">
                                        <label className="block text-black md:text-left mb-0 md:mb-0 pr-4" htmlFor="inline-full-name">N# Contract:</label>
                                    </div>
                                    <div className="md:w-1/4 mt-0">
                                        <input
                                            type="text"
                                            required
                                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8 text-[13px]"
                                            name="numberContract"
                                            value={numberContract}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="md:w-1/4 mt-1 ml-3">
                                        <div className="flex items-center justify-center mb-1">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="isCash_Credit"
                                                    checked={contado_Credit}
                                                    value={contado_Credit}
                                                    onChange={(e) => setContado_Credit(e.target.checked)}
                                                    id="flexCheckIsCash_Credit" />
                                                <label className="form-check-label mt-1" htmlFor="flexCheckIsCash_Credit">Cash/Credit?</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:w-1/4 mt-1">
                                        <div className="flex items-center justify-center mb-1">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="isValid"
                                                    checked={valido}
                                                    value={valido}
                                                    onChange={(e) => setValido(e.target.checked)}
                                                    id="flexCheckIsValid" />
                                                <label className="form-check-label mt-1" htmlFor="flexCheckIsValid">Is Valid?</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="md:flex md:items-start mb-1 mr-2 px-2">
                                        <div className="md:w-1/4 mt-1">
                                            <label className="block text-black md:text-left mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">N# of Project:</label>
                                        </div>
                                        <div className="md:w-1/4 mb-1">
                                            <input
                                                type="text"
                                                required
                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8 text-[13px]"
                                                name="numberProject"
                                                value={numberProject}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="md:w-2/4">
                                            <select
                                                name="contractType"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8 ml-2"
                                                aria-label="Default select example"
                                                required
                                                placeholder="Select Type of Client Contract ..."
                                                onClick={handleClientContractTypeChange}
                                                onChange={handleClientContractTypeChange}
                                            >
                                                <option disabled>Please select</option>
                                                {contractTypes.length > 0 &&
                                                    contractTypes.map((c) => (
                                                        <option key={c._id} value={c._id}>
                                                            {c.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap mb-1 text-sm ml-2">
                                    <div className="w-full md:w-1/3 px-0 mb-0 md:mb-0">
                                        <label htmlFor="bornDate">Date of Subscription</label>
                                        <input
                                            type="date"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                            name="signedDate"
                                            value={moment(signedDate).add("hours", 4).format("yyyy-MM-DD")}
                                            onChange={handleChange}
                                        ></input>
                                    </div>
                                    <div className="w-full md:w-1/3 px-0">
                                        <label htmlFor="beginDate">Date of Start</label>
                                        <input
                                            type="date"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                            name="beginDate"
                                            value={moment(beginDate).add("hours", 4).format("yyyy-MM-DD")}
                                            onChange={handleChange}
                                        ></input>
                                    </div>
                                    <div className="w-full md:w-1/3 px-0">
                                        <label htmlFor="endDate">Date of End</label>
                                        <input
                                            type="date"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                            name="endDate"
                                            value={moment(endDate).add("hours", 4).format("yyyy-MM-DD")}
                                            onChange={handleChange}
                                        ></input>
                                    </div>
                                </div>

                                <div className="mb-0 ml-2">
                                    <label htmlFor="observations">Observations</label>
                                    <textarea
                                        type="text"
                                        rows="1"
                                        className="block p-1.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 px-2 h-11"
                                        name="observations"
                                        placeholder="Observations ..."
                                        value={observations}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                            </div>
                        </div>

                        <div className="w-full max-w-full px-0 py-0 sm:px-0">
                            <Tab.Group >
                                <Tab.List className="flex space-x-1 rounded-md bg-blue-900/20 p-1">
                                    <Tab className="w-full rounded-md py-0 text-sm font-medium leading-3 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-0 ring-offset-blue-400 focus:outline-none focus:ring-2">Products</Tab>
                                    <Tab className="w-full rounded-md py-0 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-0 ring-offset-blue-400 focus:outline-none focus:ring-2">Clauses</Tab>
                                    <Tab className="w-full rounded-md py-0 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-0 ring-offset-blue-400 focus:outline-none focus:ring-2">Incidents</Tab>
                                </Tab.List>
                                <Tab.Panels>
                                    <Tab.Panel>
                                        <div className="md:flex md:items-start mt-2 mb-2">
                                            <div className="md:w-1/3">
                                                <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-2" htmlFor="inline-full-name">Select Product ...</label>
                                            </div>
                                            <div className="md:w-2/3">
                                                <select
                                                    name="product"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                    aria-label="Default select example"
                                                    required={false}
                                                    defaultValue={""}
                                                    onChange={handleProductChange}
                                                >
                                                    <option disabled value="">Please select</option>
                                                    {products.length > 0 &&
                                                        products.map((p) => (
                                                            <option key={p._id} value={p._id}>
                                                                {p.title}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>

                                        <table className="min-w-full mt-2">
                                            <thead className="border-b bg-gray-200">
                                                <tr>
                                                    <th className="p-0 px-4 text-left">Item</th>
                                                    <th className="p-0 text-center">Quantity</th>
                                                    <th className="p-0 text-right">Price</th>
                                                    <th className="p-0 text-right">Sub Total</th>
                                                    <th className="p-0 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map((item) => (
                                                    <tr key={item.slug} className="border-b">
                                                        <td>
                                                            <Link to={`/product/${item.slug}`} className="flex items-center">
                                                                {item.title}
                                                            </Link>
                                                        </td>
                                                        <td className="p-0 text-right h-9 text-sm">
                                                            <select
                                                                className="h-9"
                                                                value={item.quantity}
                                                                onChange={(e) =>
                                                                    updateCartHandler(item, e.target.value)
                                                                }
                                                            >
                                                                {[...Array(item.countInStock).keys()].map((x) => (
                                                                    <option key={x + 1} value={x + 1}>
                                                                        {x + 1}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="p-0 text-right">${formatoMexico(parseFloat(item.price).toFixed(2))}</td>
                                                        <td className="p-0 text-right">${formatoMexico(parseFloat(item.quantity * item.price).toFixed(2))}</td>
                                                        <td className="p-0 text-center">
                                                            <button onClick={() => removeItemHandler(item)}>
                                                                <XCircleIcon className="h-5 w-5 text-red-700"></XCircleIcon>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="pt-2 pb-1 text-sm text-right px-3 font-bold">
                                            Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                                            {formatoMexico(parseFloat(cartItems.reduce((a, c) => a + c.quantity * c.price, 0)).toFixed(2))}
                                        </div>
                                        <div className="pb-1 text-sm text-right px-3 font-bold">
                                            IGV : $
                                            {formatoMexico(parseFloat(cartItems.reduce((a, c) => a + c.quantity * c.price, 0) * 0.19).toFixed(2))}
                                        </div>
                                        <div className="pb-1 text-sm text-right px-3 font-bold">
                                            Total : $
                                            {formatoMexico(parseFloat(cartItems.reduce((a, c) => a + c.quantity * c.price, 0) * 1.19).toFixed(2))}
                                        </div>

                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <div className="md:flex md:items-start mt-2 mb-2">
                                            <div className="md:w-1/3">
                                                <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-2" htmlFor="inline-full-name">Select Clause ...</label>
                                            </div>
                                            <div className="md:w-2/3">
                                                <select
                                                    name="clause"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                    aria-label="Default select example"
                                                    required
                                                    defaultValue={""}
                                                    onChange={handleClientContractClauseChange}
                                                >
                                                    <option disabled value="">Please select</option>
                                                    {clauses.length > 0 &&
                                                        clauses.map((p) => (
                                                            <option key={p._id} value={p._id}>
                                                                {p.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>

                                        <table className="min-w-full mt-2">
                                            <thead className="border-b bg-gray-200">
                                                <tr>
                                                    <th className="p-0 px-3 text-left">Item</th>
                                                    <th className="p-0 text-left">Name</th>
                                                    <th className="p-0 text-left">Content</th>
                                                    <th className="p-0 text-left">Observations</th>
                                                    <th className="p-0 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartClausesItems.map((item) => (
                                                    <tr key={item.slug} className="border-b">
                                                        <td className=" px-3 p-1 w-6">{item._id.substring(20, 24)}</td>
                                                        <td>{item.name}</td>
                                                        <td>
                                                            <textarea
                                                                type="text"
                                                                rows="1"
                                                                className="block p-1.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 px-1"
                                                                name="description"
                                                                value={item.description}
                                                                onChange={(e) => updateCartClausesDescriptionHandler(item, e.target.value)}
                                                            ></textarea>
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                type="text"
                                                                rows="1"
                                                                className="block p-1.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 px-1"
                                                                name="observations"
                                                                value={item.observations}
                                                                onChange={(e) => updateCartClausesHandler(item, e.target.value)}
                                                            ></textarea>
                                                        </td>
                                                        <td className="p-0 text-center">
                                                            <button onClick={() => removeItemClauseHandler(item)}>
                                                                <XCircleIcon className="h-5 w-5 text-red-700"></XCircleIcon>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Tab.Panel>
                                    <Tab.Panel>Content 3</Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>

                            <div className="flex flex-wrap mt-2 mb-1 gap-0">
                                <div className="w-full md:w-1/2 px-1 mb-2 md:mb-0">
                                    <Link
                                        to={`/advisory/clientcontracts`}
                                        className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center w-full rounded-md outline outline-offset-0 outline-1"
                                    >
                                        <FontAwesomeIcon
                                            icon={faArrowLeft}
                                            className="h-6 w-6 text-blue-500 mr-1"
                                        />
                                        Back
                                    </Link>
                                </div>
                                <div className="w-full md:w-1/2 px-2 mb-2 md:mb-0">
                                    <button
                                        disabled={loadingCreate}
                                        className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2 w-full">
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="h-6 w-6 text-white hover:text-yellow-200 mr-2"
                                        />
                                        {loadingCreate ? "Loading" : "Save"}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </form>
                )}
            </div>
        </div>

    )
}

export default ClientContractCreateScreen;