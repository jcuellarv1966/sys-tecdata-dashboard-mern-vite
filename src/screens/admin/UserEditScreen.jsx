import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import SideNavbar from '../../components/SideNavbar';
import Form from 'react-bootstrap/Form';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };
        default:
            return state;
    }
};

export default function UserEditScreen() {
    const params = useParams();
    const { id: userId } = params;
    const navigate = useNavigate();

    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                dispatch({ type: 'FETCH_SUCCESS' });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        fetchData();
    }, [userId, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `http://localhost:5000/api/users/${userId}`,
                { _id: userId, name, email, isAdmin },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
            });
            toast.success('User updated successfully');
            navigate('/admin/users');
        } catch (error) {
            toast.error(getError(error));
            dispatch({ type: 'UPDATE_FAIL' });
        }
    };

    return (
        <div className="grid md:grid-cols-8 md:gap-0 mt-2">
            <Helmet>
                <title>Tec Data - Edit User ${userId}</title>
            </Helmet>
            <div>
                <SideNavbar />
            </div>
            <div className="overflow-x-auto md:col-span-7 ml-12">
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <form className="mx-auto max-w-screen-sm" onSubmit={submitHandler}>
                        <h1 className='text-xl font-bold text-blue-600'>Edit User {userId}</h1>

                        <div className="flex flex-wrap mt-4 mb-2">
                            <div className="w-full md:w-3/3 px-1 mb-4 md:mb-4">
                                <label htmlFor="title">Name</label>
                                <input
                                    type="text"
                                    className="w-full h-8"
                                    name="name"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="w-full md:w-3/3 px-1 mb-4 md:mb-4">
                                <label htmlFor="title">Email</label>
                                <input
                                    type="email"
                                    className="w-full h-8"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center w-full md:w-3/3 px-1 mb-4 md:mb-4">
                                <Form.Check
                                    className="mb-3"
                                    type="checkbox"
                                    id="isAdmin"
                                    label="isAdmin"
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                />

                            </div>
                        </div>

                        <div className="flex flex-wrap mt-1 mb-1 overflow-x-hidden">
                            {/* <div className="w-full md:w-1/2 px-1 mb-2 md:mb-0">
                                <button
                                    href={`/admin/users`}
                                    className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center w-full rounded-md outline outline-offset-0 outline-1"
                                >
                                    <FontAwesomeIcon
                                        icon={faArrowLeft}
                                        className="h-4 w-4 text-blue-700 mr-2"
                                    />
                                    Back
                                </button>
                            </div> */}
                            <div className="w-full md:w-2/2 px-1 mb-2 md:mb-0">
                                <button
                                    className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2 w-full"
                                >
                                    <FontAwesomeIcon
                                        icon={faSave}
                                        className="h-5 w-5 text-white hover:text-yellow-200 mr-2"
                                    />
                                    {"Update"}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

        </div>
    );
}