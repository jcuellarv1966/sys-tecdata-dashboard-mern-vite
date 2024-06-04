import React, { useContext, useEffect, useReducer } from 'react';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import SideNavbar from '../../components/SideNavbar';
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

export default function DashboardScreen() {
    const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });
    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/orders/summary', {
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
                <SideNavbar />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                <h1>Dashboard</h1>
                {loading ? (
                    <LoadingBox />
                ) : error ? (
                    <div className="alert-error">{error}</div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-3">
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    $
                                    {summary.orders && summary.orders[0]
                                        ? summary.orders[0].totalSales.toFixed(2)
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Total Sales</p>
                                <Link to="/admin/orders" className="text-xs ml-2">View Total Sales</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.orders && summary.orders[0]
                                        ? summary.orders[0].numOrders
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Orders</p>
                                <Link to="/admin/orders" className="text-xs ml-2">View Orders</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.products && summary.products[0]
                                        ? summary.products[0].numProducts
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Products</p>
                                <Link to="/admin/products" className="text-xs ml-2">View Products</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.productCategories && summary.productCategories[0]
                                        ? summary.productCategories[0].numProductCategories
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Product Categories</p>
                                <Link to="/admin/productscategories" className="text-xs ml-2">View Product Categories</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.clients && summary.clients[0]
                                        ? summary.clients[0].numClients
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Clients</p>
                                <Link to="/admin/clients" className="text-xs ml-2">View Clients</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.providers && summary.providers[0]
                                        ? summary.providers[0].numProviders
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Providers</p>
                                <Link to="/admin/providers" className="text-xs ml-2">View Providers</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.partners && summary.partners[0]
                                        ? summary.partners[0].numPartners
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Partners</p>
                                <Link to="/admin/partners" className="text-xs ml-2">View Partners</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.workers && summary.workers[0]
                                        ? summary.workers[0].numWorkers
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Workers</p>
                                <Link to="/admin/workers" className="text-xs ml-2">View Workers</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.workerCategories && summary.workerCategories[0]
                                        ? summary.workerCategories[0].numWorkerCategories
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Worker Categories</p>
                                <Link to="/admin/workerscategories" className="text-xs ml-2">View Worker Categories</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.workerPlaces && summary.workerPlaces[0]
                                        ? summary.workerPlaces[0].numWorkerPlaces
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Worker Positions</p>
                                <Link to="/admin/workerspositions" className="text-xs ml-2">View Worker Positions</Link>
                            </div>
                            <div className="card min-h-min bg-gray-100 mb-1">
                                <p className="text-lg mt-2 ml-2">
                                    {summary.users && summary.users[0]
                                        ? summary.users[0].numUsers
                                        : 0}
                                </p>
                                <p className="-mt-4 mb-2 ml-2"> Users</p>
                                <Link to="/admin/users" className="text-xs ml-2">View users</Link>
                            </div>
                        </div>
                        <div className="my-3">
                            <h2>Sales</h2>
                            {summary.dailyOrders.length === 0 ? (
                                <MessageBox>No Sale</MessageBox>
                            ) : (
                                <Chart
                                    width="100%"
                                    height="400px"
                                    chartType="AreaChart"
                                    loader={<div>Loading Chart...</div>}
                                    data={[
                                        ['Date', 'Sales'],
                                        ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                                    ]}
                                ></Chart>
                            )}
                        </div>
                        <div className="my-3">
                            <h2>Categories</h2>
                            {summary.countProductCategories.length === 0 ? (
                                <MessageBox>No Category</MessageBox>
                            ) : (
                                <Chart
                                    width="100%"
                                    height="400px"
                                    chartType="PieChart"
                                    loader={<div>Loading Chart...</div>}
                                    data={[
                                        ['Category', 'Products'],
                                        ...summary.countProductCategories.map((x) => [x._id, x.count]),
                                    ]}
                                ></Chart>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}