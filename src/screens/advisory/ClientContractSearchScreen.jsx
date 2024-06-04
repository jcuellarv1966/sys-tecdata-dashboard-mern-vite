import React, { useContext, useReducer, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Slider, Checkbox } from "antd";
import SearchClientContractBox from '../../components/SearchClientContractBox';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPencilAlt, faTrashAlt, } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle, faCircle } from "@fortawesome/free-regular-svg-icons";
import dateFormat from "dateformat";
import LinkContainer from 'react-router-bootstrap/LinkContainer';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                contracts: action.payload.contracts,
                page: action.payload.page,
                pages: action.payload.pages,
                countContracts: action.payload.countContracts,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

const ClientContractSearchScreen = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const query = sp.get('query') || 'all';
    const numberProject = sp.get('numberProject') || 'all';
    const worker = sp.get('worker') || 'all';
    const category = sp.get('category') || 'all';
    const total = sp.get('total') || 'all';
    const cash_credit = sp.get('cash_credit') || 'all';
    const isValid = sp.get('isValid') || 'all';
    const finished = sp.get('finished') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || 1;

    const [queryNumberProject, setQueryNumberProject] = useState("");
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState("");
    const [selectedNameWorker, setSelectedNameWorker] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [matriz, setMatriz] = useState([]);
    const [totales, setTotales] = useState([0, 0]);
    const [contado_credito, setContado_credito] = useState("");
    const [valido, setValido] = useState("");
    const [realizado, setRealizado] = useState("");

    const [{ loading, error, contracts, pages, countContracts }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:5000/api/clientcontracts/search?page=${page}&query=${query}&numberProject=${numberProject}&worker=${worker}&category=${category}&total=${total}&cash_credit=${cash_credit}&isValid=${isValid}&finished=${finished}&order=${order}`
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
    }, [error, order, page, numberProject, worker, category, total, cash_credit, isValid, finished, query]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/clientcontracttypes`);
                setCategories(data);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchCategories();
    }, [dispatch]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/users`,
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                setWorkers(data);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchCategories();
    }, [dispatch]);

    useEffect(() => {
        async function fetchData() {
            if (numberProject == 'all') {
                setQueryNumberProject("");
            }
            if (worker == 'all') {
                setSelectedWorker("");
                setSelectedNameWorker("");
            } else {
                const { data } = await axios.get(`http://localhost:5000/api/users/${worker}`,
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                setSelectedNameWorker(data.name);
            }
            if (category == 'all') {
                setCategoryIds([]);
            }
            if (total == 'all') {
                setTotales([0, 200000]);
            }
            if (cash_credit == 'all') {
                setContado_credito("");
            }
            if (isValid == 'all') {
                setValido("");
            }
            if (finished == 'all') {
                setRealizado("");
            }
        }
        fetchData();
    }, [numberProject, worker, category, total, cash_credit, isValid, finished]);

    const handleCheck = (e) => {
        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked); // index or -1

        // indexOf method ?? if not found returns -1 else return index [1,2,3,4,5]
        if (foundInTheState === -1) {
            inTheState.push(justChecked);
        } else {
            // if found pull out one item from index
            inTheState.splice(foundInTheState, 1);
        }

        setCategoryIds(inTheState);
        setMatriz(inTheState);
    };

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterQuery = filter.query || query;
        const filterNumberProject = filter.numberProject || numberProject;
        const filterWorker = filter.worker || worker;
        const filterCategory = filter.category || category;
        const filterTotal = filter.total || total;
        const filterCash_credit = filter.cash_credit || cash_credit;
        const filterIsValid = filter.isValid || isValid;
        const filterFinished = filter.finished || finished;
        const sortOrder = filter.order || order;
        return `/advisory/clientcontractsearch?query=${filterQuery}&category=${filterCategory}&numberProject=${filterNumberProject}&worker=${filterWorker}&total=${filterTotal}&cash_credit=${filterCash_credit}&isValid=${filterIsValid}&finished=${filterFinished}&order=${sortOrder}&page=${filterPage}`;
    };

    const formatoMexico = (number) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        let arr = number.toString().split('.');
        arr[0] = arr[0].replace(exp, rep);
        return arr[1] ? arr.join('.') : arr[0];
    };

    function addHoursToDate(objDateStr, intHours) {
        var objDate = new Date(objDateStr);
        var numberOfMlSeconds = objDate.getTime();
        var addMlSeconds = (intHours * 60) * 60000;
        var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
        return newDateObj;
    }

    return (
        <div className='grid md:grid-cols-11 md:gap-[4px] mt-0'>
            <Helmet>
                <title>Search Client Contracts</title>
            </Helmet>
            <div className='flex flex-col mt-[0px] md:col-span-2'>
                <h3 className='text-base text-blue-600 font-bold mb-1'>Search by Number Project</h3>
                <input
                    type="text"
                    name="q"
                    id="q"
                    value={queryNumberProject}
                    onChange={(e) => setQueryNumberProject(e.target.value)}
                    className="rounded-tr-none rounded-br-none p-1 text-sm focus:ring-0 px-2 h-8"
                    placeholder="search by number project..."
                ></input>
                <div className="flex space-x-4 items-center mt-2">
                    <Link
                        to={getFilterUrl({ numberProject: 'all' })}
                        className={'bg-green-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                    >
                        All
                    </Link>
                    <Link
                        to={getFilterUrl({ numberProject: queryNumberProject })}
                        className={'bg-blue-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                    >
                        Filter
                    </Link>
                </div>
                <hr />
                <h3 className='text-base text-blue-600 font-bold mb-1'>Search by Contract Signatory</h3>
                <div>
                    <select
                        name="worker"
                        className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                        aria-label="Default select example"
                        required
                        value={selectedWorker ? selectedWorker : worker}
                        onClick={(e) => { setSelectedWorker(e.target.value) }}
                        onChange={(e) => { setSelectedWorker(e.target.value) }}
                    >
                        <option disabled value="">
                            Please select
                        </option>
                        {workers.length > 0 &&
                            workers.map((w) => (
                                <option key={w._id} value={w._id}>
                                    {w.name}
                                </option>
                            ))}
                    </select>
                    <div className="flex space-x-4 items-center mt-2">
                        <Link
                            to={getFilterUrl({ worker: 'all' })}
                            className={'bg-green-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                        >
                            All
                        </Link>
                        <Link
                            to={getFilterUrl({ worker: selectedWorker })}
                            className={'bg-blue-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                        >
                            Filter
                        </Link>
                    </div>
                </div>
                <hr />
                <h3 className='text-base text-blue-600 font-bold -mb-1'>Contract Types</h3>
                <div>
                    {categories.map((c) => (
                        <div key={c._id}>
                            <Checkbox
                                onChange={handleCheck}
                                className="pb-0 pl-0 pr-0"
                                value={c._id}
                                name="category"
                                checked={categoryIds.includes(c._id)}
                            >
                                {c.name}
                            </Checkbox>
                            <br />
                        </div>
                    ))}
                    <div className="flex space-x-4 items-center mt-2">
                        <Link
                            to={getFilterUrl({ category: 'all' })}
                            className={'bg-green-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                        >
                            All
                        </Link>
                        <Link
                            to={getFilterUrl({ category: matriz })}
                            className={'bg-blue-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                        >
                            Filter
                        </Link>
                    </div>
                </div>
                <hr />
                <h3 className='text-base text-blue-600 font-bold -mb-1.5'>Range of Total Sales</h3>
                <Slider
                    className="w-full px-2"
                    range
                    value={totales}
                    onChange={(value) => { getFilterUrl({ total: setTotales(value) }) }}
                    max="200000"
                />
                <div className="flex space-x-4 items-center -mt-1">
                    <Link
                        to={getFilterUrl({ total: 'all' })}
                        className={'bg-green-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                    >
                        All
                    </Link>
                    <Link
                        to={getFilterUrl({ total: totales })}
                        className={'bg-blue-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                    >
                        Filter
                    </Link>
                </div>
                <hr />
                <h3 className='text-base text-blue-600 font-bold -mb-1'>Cash or Credit?</h3>
                <div className="md:flex md:items-stretch mb-0">
                    <Checkbox
                        className="pb-2 pl-2 pr-2"
                        onChange={(e) => { setContado_credito(e.target.value) }}
                        value="Yes"
                        checked={contado_credito === "Yes"}
                    >
                        Yes
                    </Checkbox>

                    <Checkbox
                        className="pb-2 pl-2 pr-2"
                        onChange={(e) => { setContado_credito(e.target.value) }}
                        value="No"
                        checked={contado_credito === "No"}
                    >
                        No
                    </Checkbox>
                </div>
                <div className="flex space-x-4 items-center -mt-1">
                    <Link
                        to={getFilterUrl({ cash_credit: 'all' })}
                        className={'bg-green-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                    >
                        All
                    </Link>
                    <Link
                        to={getFilterUrl({ cash_credit: contado_credito })}
                        className={'bg-blue-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                    >
                        Filter
                    </Link>
                </div>
                <hr />
                <h3 className='text-base text-blue-600 font-bold -mb-1'>isValid?</h3>
                <div className="md:flex md:items-stretch mb-0">
                    <Checkbox
                        className="pb-2 pl-2 pr-2"
                        onChange={(e) => { setValido(e.target.value) }}
                        value="Yes"
                        checked={valido === "Yes"}
                    >
                        Yes
                    </Checkbox>

                    <Checkbox
                        className="pb-2 pl-2 pr-2"
                        onChange={(e) => { setValido(e.target.value) }}
                        value="No"
                        checked={valido === "No"}
                    >
                        No
                    </Checkbox>
                </div>
                <div className="flex space-x-4 items-center -mt-1">
                    <Link
                        to={getFilterUrl({ isValid: 'all' })}
                        className={'bg-green-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                    >
                        All
                    </Link>
                    <Link
                        to={getFilterUrl({ isValid: valido })}
                        className={'bg-blue-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                    >
                        Filter
                    </Link>
                </div>
                <hr />
                <h3 className='text-base text-blue-600 font-bold -mb-1'>Finished?</h3>
                <div className="md:flex md:items-stretch mb-0">
                    <Checkbox
                        className="pb-2 pl-2 pr-2"
                        onChange={(e) => { setRealizado(e.target.value) }}
                        value="Yes"
                        checked={realizado === "Yes"}
                    >
                        Yes
                    </Checkbox>

                    <Checkbox
                        className="pb-2 pl-2 pr-2"
                        onChange={(e) => { setRealizado(e.target.value) }}
                        value="No"
                        checked={realizado === "No"}
                    >
                        No
                    </Checkbox>
                </div>
                <div className="flex space-x-4 items-center -mt-1">
                    <Link
                        to={getFilterUrl({ finished: 'all' })}
                        className={'bg-green-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                    >
                        All
                    </Link>
                    <Link
                        to={getFilterUrl({ finished: realizado })}
                        className={'bg-blue-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
                    >
                        Filter
                    </Link>
                </div>
            </div>
            <div className="overflow-x-hidden md:col-span-9 ml-2">
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                        <h1 className='text-2xl text-blue-900 text-bold'>Search Client Contract(s) ...</h1>
                        <div className="flex justify-between md:grid-cols-7 md:gap-1 mb-3">
                            <div className='md:col-span-4 mt-2'>
                                {countContracts === 0 ? 'No' : countContracts} Results
                                {numberProject !== 'all' && ' : Number Project ' + numberProject}
                                {worker !== 'all' && ' : Signatory ' + selectedNameWorker}
                                {total !== 'all' && ' : Total Sales ' + total}
                                {cash_credit !== 'all' && ' : Cash or Credit ' + cash_credit}
                                {isValid !== 'all' && ' : is Valid? ' + isValid}
                                {finished !== 'all' && ' : is Finished? ' + finished}
                                {query !== 'all' ||
                                    numberProject !== 'all' ||
                                    worker !== 'all' ||
                                    total !== 'all' ||
                                    cash_credit !== 'all' ||
                                    isValid !== 'all' ||
                                    finished !== 'all' ? (
                                    <a className="cursor-pointer" onClick={() => navigate('/advisory/clientcontractsearch')}>
                                        <FontAwesomeIcon
                                            icon={faTimesCircle}
                                            className="ml-2 h-4 w-4 text-black"
                                        />
                                    </a>
                                ) : null}
                            </div>
                            <div className="md:col-span-2">
                                <SearchClientContractBox />
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
                                    <option value="newest">Newest Signed</option>
                                    <option value="razSocialAsc">RazSocial Asc</option>
                                    <option value="razSocialDesc">RazSocial Desc</option>
                                    <option value="lowest">Total Sales: Low to High</option>
                                    <option value="highest">Total Sales: High to Low</option>
                                </select>
                            </div>
                        </div>
                        {contracts.length === 0 && (
                            <MessageBox>No Client Contract(s) Found</MessageBox>
                        )}
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b bg-gray-200">
                                    <tr className='text-sm'>
                                        <th className="px-0 p-0 text-right">Signed Date</th>
                                        <th className="px-3 text-right">Id</th>
                                        <th className="p-0 text-left">Client</th>
                                        <th className="p-0 px-1 text-left">Type</th>
                                        <th className="px-1 p-0 text-right">Sub Total</th>
                                        <th className="px-1 p-0 text-right">IGV</th>
                                        <th className="px-1 p-0 text-right">Total</th>
                                        <th className="px-1 p-0 text-right">Charges</th>
                                        <th className="px-1 p-0 text-right">Outstanding</th>
                                        <th className="px-1 p-0 text-center">Valid</th>
                                        <th className="p-0 text-center">Edit</th>
                                        <th className="p-0 text-center">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contracts.map((contract) => (
                                        <tr key={contract._id} className="border-b">
                                            <td className=" px-0 p-1 text-center w-[68px]">
                                                {dateFormat(addHoursToDate(contract.signedDate, 4), "dd-mm-yy")}
                                            </td>
                                            <td className=" px-2 p-1 w-8">
                                                {contract._id.substring(20, 24)}
                                            </td>
                                            <td className=" p-1 ">{contract.razSocial ? contract.razSocial : contract.client.razSocial}</td>
                                            <td className=" p-1 ">{contract.contractType?.name}</td>
                                            <td className="p-1 text-right">${formatoMexico(parseFloat(contract.subTotal).toFixed(2))}</td>
                                            <td className="p-1 text-right">${formatoMexico(parseFloat(contract.igv).toFixed(2))}</td>
                                            <td className="p-1 text-right">${formatoMexico(parseFloat(contract.total).toFixed(2))}</td>
                                            <td className="p-1 text-right">${formatoMexico(parseFloat(contract.charges).toFixed(2))}</td>
                                            <td className="p-1 text-right">${formatoMexico(parseFloat(contract.balanceOutstanding).toFixed(2))}</td>
                                            <td className=" p-1 text-center">
                                                {
                                                    contract.isValid == "Yes" ? (<>
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
                                                <Link to={`/advisory/clientcontract/${contract._id}`}>
                                                    <FontAwesomeIcon
                                                        icon={faPencilAlt}
                                                        className="h-4 w-4 text-green-700"
                                                    />
                                                </Link>
                                            </td>
                                            <td className="p-0 text-center">
                                                <a className="cursor-pointer" onClick={() => deleteHandler(contract._id)}>
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

export default ClientContractSearchScreen