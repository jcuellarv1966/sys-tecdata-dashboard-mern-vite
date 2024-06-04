import React, { useContext, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from "../../../utils/error";
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Helmet } from 'react-helmet-async';
import SideNavbarAdvisory from "../../components/SideNavbarAdvisory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faPencilAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        contractclauses: action.payload,
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

const ClientContractClauseListScreen = () => {
  const [{ loading, error, contractclauses, loadingCreate, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      contractclauses: [],
      error: '',
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`http://localhost:5000/api/clientcontractclauses`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (contractclauseId) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`http://localhost:5000/api/clientcontractclauses/${contractclauseId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'DELETE_SUCCESS' });
        toast.success('Client Contract Clause deleted successfully');
      } catch (err) {
        dispatch({ type: "DELETE_FAIL" });
        toast.error(getError(error));
      }
    }
  };

  return (
    <div className='grid md:grid-cols-8 md:gap-1 mt-4'>
      <Helmet>
        <title>Tec Data - List of Client Contract Clauses</title>
      </Helmet>
      <div>
        <SideNavbarAdvisory />
      </div>
      <div className="overflow-x-auto md:col-span-7 ml-12">
        <div className="flex justify-between mb-4">
          <h1 className='text-2xl text-blue-900 text-bold'>List of Client Contract Clauses</h1>
          <div>
            <Link to="/advisory/clientcontractclausecreate" className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2">
              <FontAwesomeIcon
                icon={faFolderPlus}
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
          <table className="min-w-full">
            <thead className="border-b bg-gray-200">
              <tr>
                <th className="px-3 p-1 text-center">Id</th>
                <th className="p-1 text-left">Name</th>
                <th className="p-1 text-left">Description</th>
                <th className="p-1 text-left">Edit</th>
                <th className="p-1 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {contractclauses.map((contractclause) => (
                <tr key={contractclause._id} className="border-b">
                  <td className=" p-1 text-center">
                    {contractclause._id.substring(20, 24)}
                  </td>
                  <td className=" p-1 ">{contractclause.name}</td>
                  <td className=" p-1 ">{contractclause.description}</td>
                  <td className=" p-1 px-2 w-14">
                    <Link to={`/advisory/clientcontractclause/${contractclause._id}`}>
                      <FontAwesomeIcon
                        icon={faPencilAlt}
                        className="h-4 w-4 text-green-700"
                      />
                    </Link>
                  </td>
                  <td className=" p-1 text-center w-14">
                    <a className="cursor-pointer" onClick={() => deleteHandler(contractclause._id)}>
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="h-4 w-4 text-red-700 cursor-pointer"
                      />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ClientContractClauseListScreen;