import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Slider, Checkbox } from "antd";
import SearchProviderBox from '../../components/SearchProviderBox';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPencilAlt, faTrashAlt, } from "@fortawesome/free-solid-svg-icons";
import dateFormat from "dateformat";
import LinkContainer from 'react-router-bootstrap/LinkContainer';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                providers: action.payload.providers,
                page: action.payload.page,
                pages: action.payload.pages,
                countProviders: action.payload.countProviders,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default function ClientSearchScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const query = sp.get('query') || 'all';
    const credit = sp.get('credit') || 'all';
    const current = sp.get('current') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || 1;

    const [{ loading, error, providers, pages, countProviders }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    const [Credits, setCredits] = useState([0, 0]);
    const [vigente, setVigente] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:5000/api/providers/search?page=${page}&query=${query}&credit=${credit}&current=${current}&order=${order}`
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(error),
                });
            }
        };
        fetchData();
    }, [error, order, page, current, credit, query]);

    useEffect(() => {
        if (credit == 'all') {
            setCredits([0, 20000]);
        }
        if (current == 'all') {
            setVigente("");
        }
    }, [credit, current]);

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterQuery = filter.query || query;
        const filterCredit = filter.credit || credit;
        const filterCurrent = filter.current || current;
        const sortOrder = filter.order || order;
        return `/searchprovider?query=${filterQuery}&credit=${filterCredit}&current=${filterCurrent}&order=${sortOrder}&page=${filterPage}`;
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
        <div className='grid md:grid-cols-8 md:gap-[2px] mt-2'>
            <Helmet>
                <title>Search Providers</title>
            </Helmet>
            <div className='flex flex-col mt-[46px]'>
                <h3 className='text-lg text-blue-600 font-bold'>Range of Credits</h3>
                <Slider
                    className="w-full mr-2 px-2"
                    range
                    value={Credits}
                    onChange={(value) => { getFilterUrl({ credit: setCredits(value) }) }}
                    max="20000"
                />
                <div className="flex space-x-4 items-center">
                    <Link
                        to={getFilterUrl({ credit: 'all' })}
                        className={'bg-green-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
                    >
                        All
                    </Link>
                    <Link
                        to={getFilterUrl({ credit: Credits })}
                        className={'bg-blue-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
                    >
                        Filter
                    </Link>
                </div>
                <hr />
                <h3 className='text-md text-blue-600 font-bold mt-2'>Current</h3>
                <div className="md:flex md:items-stretch mb-1">
                    <Checkbox
                        className="pb-2 pl-2 pr-2"
                        onChange={(e) => { setVigente(e.target.value) }}
                        value="Yes"
                        checked={vigente === "Yes"}
                    >
                        Yes
                    </Checkbox>

                    <Checkbox
                        className="pb-2 pl-2 pr-2"
                        onChange={(e) => { setVigente(e.target.value) }}
                        value="No"
                        checked={vigente === "No"}
                    >
                        No
                    </Checkbox>
                </div>
                <div className="flex space-x-4 items-center">
                    <Link
                        to={getFilterUrl({ current: 'all' })}
                        className={'bg-green-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
                    >
                        All
                    </Link>
                    <Link
                        to={getFilterUrl({ current: vigente })}
                        className={'bg-blue-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
                    >
                        Filter
                    </Link>
                </div>
            </div>
            <div className="overflow-x-hidden md:col-span-7 ml-4">
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                        <h1 className='text-2xl text-blue-900 text-bold'>Search Provider(s) ...</h1>
                        <div className="flex justify-between md:grid-cols-7 md:gap-1 mb-3">
                            <div className='md:col-span-4'>
                                <div className='mt-2'>
                                    {countProviders === 0 ? 'No' : countProviders} Results
                                    {query !== 'all' && ' : ' + query}
                                    {credit !== 'all' && ' : Credit ' + credit}
                                    {current !== 'all' && ' : Current ' + current}
                                    {query !== 'all' ||
                                        credit !== 'all' ||
                                        current !== 'all' ? (
                                        <a className="cursor-pointer" onClick={() => navigate('/searchprovider')}>
                                            <FontAwesomeIcon
                                                icon={faTimesCircle}
                                                className="ml-2 h-4 w-4 text-black"
                                            />
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <SearchProviderBox />
                            </div>
                            <div className="md:col-span-1">
                                Sort by{' '}
                                <select
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[168px] p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                    value={order}
                                    onChange={(e) => {
                                        navigate(getFilterUrl({ order: e.target.value }));
                                    }}
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="razSocialAsc">razSocial: Ascending</option>
                                    <option value="razSocialDesc">razSocial: Descending</option>
                                    <option value="lowest">Credit: Low to High</option>
                                    <option value="highest">Credit: High to Low</option>
                                </select>
                            </div>
                        </div>
                        {providers.length === 0 && (
                            <MessageBox>No Provider(s) Found</MessageBox>
                        )}
                        <div>
                            <table className="min-w-full">
                                <thead className="border-b bg-gray-200">
                                    <tr>
                                        <th className="px-0 text-center">Id</th>
                                        <th className="p-0 text-left">Business Name</th>
                                        <th className="p-0 text-left">Address</th>
                                        <th className="p-0 text-left">Phone</th>
                                        <th className="p-0 text-left">Email</th>
                                        <th className="px-1 p-0 text-right">Credit</th>
                                        <th className="px-2 p-0 text-right w-3">Issue Date</th>
                                        <th className="px-2 p-0 text-left w-3">Edit</th>
                                        <th className="p-0 text-left">Delete</th>
                                    </tr>
                                </thead>
                                {
                                    <tbody>
                                        {providers.map((provider) => (
                                            <tr key={provider._id} className="border-b text-[13px]">
                                                <td className=" p-1 ">
                                                    {provider._id.substring(20, 24)}
                                                </td>
                                                <td className=" p-1 ">{provider.razSocial}</td>
                                                <td className=" p-1 ">{provider.address}</td>
                                                <td className=" p-1 ">{provider.contactNumber}</td>
                                                <td className=" p-1 ">{provider.email}</td>
                                                <td className=" p-1 text-right">{formatoMexico(parseFloat(provider.credit).toFixed(2))}</td>

                                                <td className=" px-0 p-1 text-center w-3">
                                                    {dateFormat(addHoursToDate(provider.beginDate, 4), "dd-mm-yy")}
                                                </td>
                                                <td className=" p-1 text-center w-3">
                                                    <Link to={`/admin/provider/${provider._id}`}>
                                                        <FontAwesomeIcon
                                                            icon={faPencilAlt}
                                                            className="h-4 w-4 text-green-700"
                                                        />
                                                    </Link>
                                                </td>
                                                <td className=" p-1 text-center">
                                                    <a className="cursor-pointer" onClick={() => deleteHandler(provider._id, provider.images)}>
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

                        <div className='mt-2'>
                            {[...Array(pages).keys()].map((x) => (
                                <LinkContainer
                                    key={x + 1}
                                    className="mx-1"
                                    to={getFilterUrl({ page: x + 1 })}
                                >
                                    <Button
                                        className={Number(page) === x + 1 ? 'text-bold' : ''}
                                        variant="light"
                                    >
                                        {x + 1}
                                    </Button>
                                </LinkContainer>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
