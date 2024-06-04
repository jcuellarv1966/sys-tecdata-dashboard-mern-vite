import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from "../../../utils/error";
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Helmet } from 'react-helmet-async';
import SideNavbarAdvisory from '../../components/SideNavbarAdvisory';
import SearchClientAccountBox from "../../components/SearchClientAccountBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileMedical,
    faPencilAlt,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle, faCircle } from "@fortawesome/free-regular-svg-icons";
import dateFormat from "dateformat";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                accounts: action.payload.accounts,
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

const ClientAccountListScreen = () => {
    const [{ loading, error, accounts, pages, loadingCreate, loadingDelete, successDelete }, dispatch] =
        useReducer(reducer, {
            loading: true,
            accounts: [],
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
                const { data } = await axios.get(`http://localhost:5000/api/clientaccounts/admin?page=${page} `, {
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

    const deleteHandler = async (accountId) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        try {
            dispatch({ type: "DELETE_REQUEST" });
            await axios.delete(`http://localhost:5000/api/clientaccounts/${accountId}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: "DELETE_SUCCESS" });
            toast.success("Client Account deleted successfully");
        } catch (err) {
            dispatch({ type: "DELETE_FAIL" });
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

    function addHoursToDate(objDateStr, intHours) {
        var objDate = new Date(objDateStr);
        var numberOfMlSeconds = objDate.getTime();
        var addMlSeconds = (intHours * 60) * 60000;
        var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
        return newDateObj;
    }

    return (
        <div className="grid md:grid-cols-8 md:gap-1 mt-4">
            <Helmet>
                <title>Tec Data - List of Client Accounts</title>
            </Helmet>
            <div>
                <SideNavbarAdvisory />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                <div className="flex justify-between mb-4">
                    <h1 className='text-2xl text-blue-900 text-bold'>List of Client Accounts</h1>
                    <SearchClientAccountBox />
                    <div>
                        <Link to="/advisory/clientaccountcreate" className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2">
                            <FontAwesomeIcon
                                icon={faFileMedical}
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
                                        <th className="px-0 p-0 text-right">openDate</th>
                                        <th className="px-3 text-right">Id</th>
                                        <th className="p-0 text-left">Client</th>
                                        <th className="p-0 px-1 text-left">accountType</th>
                                        <th className="px-1 p-0 text-right">Debit</th>
                                        <th className="px-1 p-0 text-right">Account</th>
                                        <th className="px-1 p-0 text-right">countableBalance</th>
                                        <th className="px-1 p-0 text-right">withHoldings</th>
                                        <th className="px-1 p-0 text-right">cashBalance</th>
                                        <th className="px-1 p-0 text-center">Current</th>
                                        <th className="p-0 text-center">Edit</th>
                                        <th className="p-0 text-center">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts.map((account) => (
                                        <tr key={account._id} className="border-b">
                                            <td className=" px-0 p-1 text-center w-[68px]">
                                                {dateFormat(addHoursToDate(account.openDate, 4), "dd-mm-yy")}
                                            </td>
                                            <td className=" px-2 p-1 w-8">
                                                {account._id.substring(20, 24)}
                                            </td>
                                            <td className=" p-1 ">{account.razSocial ? account.razSocial : account.client.razSocial}</td>
                                            <td className=" p-1 ">{account.accountType?.name}</td>
                                            <td className="p-1 text-right">${formatoMexico(parseFloat(account.debit).toFixed(2))}</td>
                                            <td className="p-1 text-right">${formatoMexico(parseFloat(account.account).toFixed(2))}</td>
                                            <td className="p-1 text-right">${formatoMexico(parseFloat(account.countableBalance).toFixed(2))}</td>
                                            <td className="p-1 text-right">${formatoMexico(parseFloat(account.withHoldings).toFixed(2))}</td>
                                            <td className="p-1 text-right">${formatoMexico(parseFloat(account.cashBalance).toFixed(2))}</td>
                                            <td className=" p-1 text-center">
                                                {
                                                    account.current == "Yes" ? (<>
                                                        <FontAwesomeIcon
                                                            icon={faCheckCircle}
                                                            className="h-4 w-4 text-black"
                                                        />
                                                    </>) : (<>
                                                        <FontAwesomeIcon
                                                            icon={faCircle}
                                                            className="h-4 w-4 text-black"
                                                        />
                                                    </>)
                                                }
                                            </td>
                                            <td className="p-0 text-center">
                                                <Link to={`/advisory/clientaccount/${account._id}`}>
                                                    <FontAwesomeIcon
                                                        icon={faPencilAlt}
                                                        className="h-4 w-4 text-green-700"
                                                    />
                                                </Link>
                                            </td>
                                            <td className="p-0 text-center">
                                                <a className="cursor-pointer" onClick={() => deleteHandler(account._id)}>
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
                        <div>
                            {[...Array(pages).keys()].map((x) => (
                                <Link
                                    className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                    key={x + 1}
                                    to={`/advisory/clientaccounts?page=${x + 1}`}
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

export default ClientAccountListScreen;