import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Slider, Checkbox } from "antd";
import SearchClientProformBox from '../../components/SearchClientProformBox';
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
        proforms: action.payload.proforms,
        page: action.payload.page,
        pages: action.payload.pages,
        countProforms: action.payload.countProforms,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ClientProformSearchScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const query = sp.get('query') || 'all';
  const total = sp.get('total') || 'all';
  const acceptance = sp.get('acceptance') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [totales, setTotales] = useState([0, 0]);
  const [aceptacion, setAceptacion] = useState("");

  const [{ loading, error, proforms, pages, countProforms }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/clientproforms/search?page=${page}&query=${query}&total=${total}&acceptance=${acceptance}&order=${order}`
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
  }, [error, order, page, total, acceptance, query]);

  useEffect(() => {
    if (total == 'all') {
      setTotales([0, 200000]);
    }
    if (acceptance == 'all') {
      setAceptacion("");
    }
  }, [total, acceptance]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterQuery = filter.query || query;
    const filterTotal = filter.total || total;
    const filterAcceptance = filter.acceptance || acceptance;
    const sortOrder = filter.order || order;
    return `/advisory/clientproformsearch?query=${filterQuery}&total=${filterTotal}&acceptance=${filterAcceptance}&order=${sortOrder}&page=${filterPage}`;
  };

  const formatoMexico = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1,';
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join('.') : arr[0];
  };

  return (
    <div className='grid md:grid-cols-8 md:gap-[8px] mt-2'>
      <Helmet>
        <title>Search Client Proforms</title>
      </Helmet>
      <div className='flex flex-col mt-[46px]'>
        <h3 className='text-md text-blue-600 font-bold'>Range of Total Sales</h3>
        <Slider
          className="w-full mr-2"
          range
          value={totales}
          onChange={(value) => { getFilterUrl({ total: setTotales(value) }) }}
          max="200000"
        />
        <div className="flex space-x-4 items-center">
          <Link
            to={getFilterUrl({ total: 'all' })}
            className={'bg-green-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
          >
            All
          </Link>
          <Link
            to={getFilterUrl({ total: totales })}
            className={'bg-blue-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
          >
            Filter
          </Link>
        </div>
        <hr />
        <h3 className='text-md text-blue-600 font-bold mt-2'>Acceptance</h3>
        <div className="md:flex md:items-stretch mb-1">
          <Checkbox
            className="pb-2 pl-2 pr-2"
            onChange={(e) => { setAceptacion(e.target.value) }}
            value="Yes"
            checked={aceptacion === "Yes"}
          >
            Yes
          </Checkbox>

          <Checkbox
            className="pb-2 pl-2 pr-2"
            onChange={(e) => { setAceptacion(e.target.value) }}
            value="No"
            checked={aceptacion === "No"}
          >
            No
          </Checkbox>
        </div>
        <div className="flex space-x-4 items-center">
          <Link
            to={getFilterUrl({ acceptance: 'all' })}
            className={'bg-green-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
          >
            All
          </Link>
          <Link
            to={getFilterUrl({ acceptance: aceptacion })}
            className={'bg-blue-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
          >
            Filter
          </Link>
        </div>

      </div>
      <div className="overflow-x-hidden md:col-span-7 ml-2">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <h1 className='text-2xl text-blue-900 text-bold'>Search Client Proform(s) ...</h1>
            <div className="flex justify-between md:grid-cols-7 md:gap-1 mb-3">
              <div className='md:col-span-4 mt-2'>
                {countProforms === 0 ? 'No' : countProforms} Results
                {query !== 'all' && ' : ' + query}
                {total !== 'all' && ' : Total Sales ' + total}
                {query !== 'all' ||
                  total !== 'all' ||
                  acceptance !== 'all' ? (
                  <a className="cursor-pointer" onClick={() => navigate('/advisory/clientproformsearch')}>
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="ml-2 h-4 w-4 text-black"
                    />
                  </a>
                ) : null}
              </div>
              <div className="md:col-span-2">
                <SearchClientProformBox />
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
                  <option value="razSocialAsc">RazSocial Asc</option>
                  <option value="razSocialDesc">RazSocial Desc</option>
                  <option value="lowest">Total Sales: Low to High</option>
                  <option value="highest">Total Sales: High to Low</option>
                </select>
              </div>
            </div>
            {proforms.length === 0 && (
              <MessageBox>No Client Proform(s) Found</MessageBox>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b bg-gray-200">
                  <tr>
                    <th className="px-0 p-0 text-right w-[68px]">Issue Date</th>
                    <th className="px-0 text-center w-2">Id</th>
                    <th className="p-0 text-left">Client</th>
                    <th className="px-1 p-0 text-right">Sub Total</th>
                    <th className="px-1 p-0 text-right">IGV</th>
                    <th className="px-1 p-0 text-right">Total</th>
                    <th className="px-1 p-0 text-center">Accepted</th>
                    <th className="p-0 text-center">Edit</th>
                    <th className="p-0 text-center">Delete</th>
                  </tr>
                </thead>
                {
                  <tbody>
                    {proforms.map((proform) => (
                      <tr key={proform._id} className="border-b">
                        <td className=" px-0 p-1 text-center w-[68px]">
                          {dateFormat(proform.issueDate, "dd-mm-yy")}
                        </td>
                        <td className=" px-2 p-1 w-8">
                          {proform._id.substring(20, 24)}
                        </td>
                        <td className=" p-1 ">{proform.razSocial}</td>
                        <td className="p-1 text-right">${formatoMexico(parseFloat(proform.subtotal).toFixed(2))}</td>
                        <td className="p-1 text-right">${formatoMexico(parseFloat(proform.igv).toFixed(2))}</td>
                        <td className="p-1 text-right">${formatoMexico(parseFloat(proform.total).toFixed(2))}</td>
                        <td className=" p-1 text-center">
                          {
                            proform.acceptance == "Yes" ? (<>
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
                          <Link to={`/advisory/clientproform/${proform._id}`}>
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                              className="h-4 w-4 text-green-700"
                            />
                          </Link>
                        </td>
                        <td className="p-0 text-center">
                          <a className="cursor-pointer" onClick={() => deleteHandler(proform._id)}>
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
    </div >
  )
}

export default ClientProformSearchScreen;