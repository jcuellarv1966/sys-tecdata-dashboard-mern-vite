import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import SideNavbar from "../../components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPencilAlt,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                users: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };

        default:
            return state;
    }
};
export default function UserListScreen() {
    const navigate = useNavigate();
    const [{ loading, error, users, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`http://localhost:5000/api/users`, {
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
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [userInfo, successDelete]);

    const deleteHandler = async (user) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`http://localhost:5000/api/users/${user._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                toast.success('user deleted successfully');
                dispatch({ type: 'DELETE_SUCCESS' });
            } catch (error) {
                toast.error(getError(error));
                dispatch({
                    type: 'DELETE_FAIL',
                });
            }
        }
    };

    return (
        <div className='grid md:grid-cols-8 md:gap-1 mt-4'>
            <Helmet>
                <title>Tec Data- List of Users</title>
            </Helmet>
            <div>
                <SideNavbar />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                <h1 className='text-2xl text-blue-900 text-bold'>List of Users</h1>
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
                                        <th className="px-3 p-1 text-left">Id</th>
                                        <th className='p-1 text-left'>Name</th>
                                        <th className='p-1'>eMail</th>
                                        <th className='p-1 text-center'>IS ADMIN</th>
                                        <th className="p-1 text-left">Edit</th>
                                        <th className="p-1 text-center">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td className="p-1">
                                                {user._id.substring(20, 24)}
                                            </td>
                                            <td className="p-1">{user.name}</td>
                                            <td className="p-1">{user.email}</td>
                                            <td className="p-1 text-center" >{user.isAdmin ? 'YES' : 'NO'}</td>
                                            <td className="p-1 px-2">
                                                <Link to={`/admin/user/${user._id}`}>
                                                    <FontAwesomeIcon
                                                        icon={faPencilAlt}
                                                        className="h-5 w-5 text-green-700"
                                                    />
                                                </Link>
                                            </td>
                                            <td className="p-1 text-center">
                                                <button onClick={() => deleteHandler(product)}>
                                                    <FontAwesomeIcon
                                                        icon={faTrashAlt}
                                                        className="h-5 w-5 text-red-700 cursor-pointer"
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}