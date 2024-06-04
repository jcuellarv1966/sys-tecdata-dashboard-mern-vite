import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Slider, Checkbox } from "antd";
import SearchWorkerBox from '../../components/SearchWorkerBox';
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
        workers: action.payload.workers,
        page: action.payload.page,
        pages: action.payload.pages,
        countWorkers: action.payload.countWorkers,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const WorkerSearchScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const workerCategory = sp.get('workerCategory') || 'all';
  const workerPlace = sp.get('workerPlace') || 'all';
  const query = sp.get('query') || 'all';
  const basicSalary = sp.get('basicSalary') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, workers, pages, countWorkers }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [workerCategories, setWorkerCategories] = useState([]);
  const [workerPlaces, setWorkerPlaces] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [matriz, setMatriz] = useState([]);
  const [basicSalaries, setBasicSalaries] = useState([0, 2000000]);
  const [selectedPlace, setSelectedPlace] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/workers/search?page=${page}&query=${query}&workerCategory=${workerCategory}&workerPlace=${workerPlace}&basicSalary=${basicSalary}&order=${order}`
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
  }, [workerCategory, workerPlace, error, order, page, basicSalary, query]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/workerscategories`);
        setWorkerCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/workersplaces`);
        setWorkerPlaces(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    async function fetchData() {
      if (workerCategory == 'all') {
        setCategoryIds([]);
      };
      if (workerPlace == 'all') {
        setSelectedPlace("");
      } else {
        const { data } = await axios.get(`http://localhost:5000/api/workersplaces/${workerPlace}`);
        setSelectedPlace(data.name);
      };
      if (basicSalary == 'all') {
        setBasicSalaries([0, 2000000]);
      };
    }
    fetchData();
  }, [workerCategory, workerPlace, basicSalary]);

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
    const filterWorkerCategory = filter.workerCategory || workerCategory;
    const filterWorkerPlace = filter.workerPlace || workerPlace;
    const filterQuery = filter.query || query;
    const filterBasicSalary = filter.basicSalary || basicSalary;
    const sortOrder = filter.order || order;
    return `/searchworker?workerCategory=${filterWorkerCategory}&workerPlace=${filterWorkerPlace}&query=${filterQuery}&basicSalary=${filterBasicSalary}&order=${sortOrder}&page=${filterPage}`;
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
    <div className='grid md:grid-cols-8 md:gap-[2px] mt-2'>
      <Helmet>
        <title>Search Workers</title>
      </Helmet>
      <div className='flex flex-col mt-[50px]'>
        <h3 className='text-md text-blue-600 font-bold'>Worker Categories</h3>
        <div>
          {workerCategories.map((c) => (
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
              to={getFilterUrl({ workerCategory: 'all' })}
              className={'bg-green-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
            >
              All
            </Link>
            <Link
              to={getFilterUrl({ workerCategory: matriz })}
              className={'bg-blue-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
            >
              Filter
            </Link>
          </div>
        </div>
        <hr />
        <h3 className='text-md text-blue-600 font-bold'>Worker Places</h3>
        <div>
          {workerPlaces.map((c) => (
            <span key={c._id}>
              <Link className='inline-block whitespace-nowrap rounded-[0.27rem] bg-neutral-600 px-[0.65em] pt-[0.25em] pb-[0.25em] text-center align-baseline text-[0.75em] font-semibold leading-none text-neutral-100 dark:bg-neutral-90 mb-1 hover:text-yellow-300'
                to={getFilterUrl({ workerPlace: c._id })}
              >
                {c.name}
              </Link>
            </span>
          ))}
          <div className="flex space-x-4 items-center mt-1">
            <Link
              to={getFilterUrl({ workerPlace: 'all' })}
              className={'bg-green-700 text-white text-sm text-center w-full px-2 mb-2 rounded-[4px]'}
            >
              All
            </Link>
          </div>
        </div>
        <hr />
        <div>
          <h3 className='text-md text-blue-600 font-bold'>Basic Salaries</h3>
          <Slider
            className="w-full mr-2 px-2"
            range
            value={basicSalaries}
            onChange={(value) => { getFilterUrl({ basicSalary: setBasicSalaries(value) }) }}
            max="2000000"
          />
          <div className="flex space-x-4 items-center">
            <Link
              to={getFilterUrl({ basicSalary: 'all' })}
              className={'bg-green-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
            >
              All
            </Link>
            <Link
              to={getFilterUrl({ basicSalary: basicSalaries })}
              className={'bg-blue-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
            >
              Filter
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-x-hidden md:col-span-7 ml-2">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <h1 className='text-2xl text-blue-900 text-bold'>Search Worker(s) ...</h1>
            <div className="flex justify-between md:grid-cols-7 md:gap-1 mb-3">
              <div className='md:col-span-4'>
                <div className='mt-2'>
                  {countWorkers === 0 ? 'No' : countWorkers} Results
                  {query !== 'all' && ' : ' + query}
                  {workerPlace !== 'all' && ' : ' + selectedPlace}
                  {basicSalary !== 'all' && ' : Basic Salary ' + basicSalary}
                  {query !== 'all' ||
                    workerCategory !== 'all' ||
                    workerPlace !== 'all' ||
                    basicSalary !== 'all' ? (
                    <a className="cursor-pointer" onClick={() => navigate('/searchworker')}>
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="ml-2 h-4 w-4 text-black"
                      />
                    </a>
                  ) : null}
                </div>
              </div>
              <div className="md:col-span-2">
                <SearchWorkerBox />
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
                  <option value="lastNameAsc">lastName: Ascending</option>
                  <option value="lastNameDesc">lastName: Descending</option>
                  <option value="lowest">basicSalary: Low to High</option>
                  <option value="highest">basicSalary: High to Low</option>
                </select>
              </div>
            </div>
            {workers.length === 0 && (
              <MessageBox>No Worker(s) Found</MessageBox>
            )}
            <div className='mb-2'>
              <table className="min-w-full">
                <thead className="border-b bg-gray-200">
                  <tr>
                    <th className="px-3 text-left w-3">Id</th>
                    <th className="px-1 text-left">RUT</th>
                    <th className="px-1 p-0 text-left">LastName</th>
                    <th className="px-1 p-0 text-left">FirstName</th>
                    <th className="px-1 p-0 text-left">Phone</th>
                    <th className="px-1 p-0 text-left">Email</th>
                    <th className="px-1 p-0 text-left">Category</th>
                    <th className="px-1 p-0 text-left">Place</th>
                    <th className="px-1 p-0 text-right">Basic Salary</th>
                    <th className="px-2 p-0 text-right">Begin Date</th>
                    <th className="p-0 text-left">Edit</th>
                    <th className="p-0 text-left">Delete</th>
                  </tr>
                </thead>
                {
                  <tbody>
                    {workers.map((worker) => (
                      <tr key={worker._id} className="border-b text-xs">
                        <td className=" p-1 ">
                          {worker._id.substring(20, 24)}
                        </td>
                        <td className=" p-1 w-3">{worker.rut}</td>
                        <td className=" p-1 ">{worker.lastName}</td>
                        <td className=" p-1 ">{worker.firstName}</td>
                        <td className=" p-1 ">{worker.contactNumber}</td>
                        <td className=" p-1 ">{worker.email}</td>
                        <td className=" p-1 ">{worker.workerCategory.name}</td>
                        <td className=" p-1 ">{worker.workerPlace.name}</td>
                        <td className=" p-1 text-right">{formatoMexico(parseFloat(worker.basicSalary).toFixed(2))}</td>
                        <td className=" px-0 p-1 text-center w-1">
                          {dateFormat(addHoursToDate(worker.beginDate, 4), "dd-mm-yy")}
                        </td>
                        <td className=" p-1 ">
                          <Link to={`/admin/worker/${worker._id}`}>
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                              className="h-4 w-4 text-green-700"
                            />
                          </Link>
                        </td>
                        <td className=" p-1 text-center">
                          <a className="cursor-pointer" onClick={() => deleteHandler(worker._id, worker.image)}>
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

            <div>
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

export default WorkerSearchScreen;