import React, { useContext, useEffect, useReducer } from 'react';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import SideNavbarAdvisory from '../../components/SideNavbarAdvisory';
import Chart from 'react-google-charts';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Link } from 'react-router-dom';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                summary: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function DashboardAdvisoryScreen() {
    const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });
    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/summaries', {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        fetchData();
    }, [userInfo]);

    return (
        <div className="grid md:grid-cols-8 md:gap-1 mt-4">
            <div>
                <SideNavbarAdvisory />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                <h1>Dashboard Advisory Screen</h1>
                {loading ? (
                    <LoadingBox />
                ) : error ? (
                    <div className="alert-error">{error}</div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-3">
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.clientProforms && summary.clientProforms[0]
                                        ? summary.clientProforms[0].numClientProforms
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Proforms</p>
                                <Link to="/advisory/clientproforms" className="text-xs ml-2">View Proforms</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.clientContracts && summary.clientContracts[0]
                                        ? summary.clientContracts[0].numClientContracts
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Contracts</p>
                                <Link to="/advisory/clientcontracts" className="text-xs ml-2">View Contracts</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.clientContracts && summary.clientContracts[0]
                                        ? summary.clientContracts[0].numClientContracts
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Contract Types</p>
                                <Link to="/advisory/clientcontracttypes" className="text-xs ml-2">View Contract Types</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.clientContracts && summary.clientContracts[0]
                                        ? summary.clientContracts[0].numClientContracts
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Contract Clauses</p>
                                <Link to="/advisory/clientcontractclauses" className="text-xs ml-2">View Contract Clauses</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.clientAccounts && summary.clientAccounts[0]
                                        ? summary.clientAccounts[0].numClientAccounts
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Accounts</p>
                                <Link to="/advisory/clientaccounts" className="text-xs ml-2">View Accounts</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.Projects && summary.Projects[0]
                                        ? summary.Projects[0].numProjects
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Projects</p>
                                <Link to="/admin/orders" className="text-xs ml-2">View Projects</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.clientPays && summary.clientPays[0]
                                        ? summary.clientPays[0].numClientPays
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Collections</p>
                                <Link to="/admin/orders" className="text-xs ml-2">View Collections</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}