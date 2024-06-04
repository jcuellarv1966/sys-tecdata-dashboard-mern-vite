import { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../../utils/Store';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../../utils/error';
import { useForm } from "react-hook-form";
import { Helmet } from 'react-helmet-async';

export default function SigninScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const { state, dispatching: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo])

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const submitHandler = async ({ email, password }) => {
        try {
            const { data } = await Axios.post('http://localhost:5000/api/users/signin', {
                email,
                password,
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
        } catch (err) {
            toast.error(getError(err));
        }
    };

    return (
        <div className="max-w-2xl m-auto">
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <form onSubmit={handleSubmit(submitHandler)} className="mx-auto max-w-screen-md mt-4">
                <h1 className="text-2xl text-blue-900 font-bold my-3">Sign In Form</h1>
                <div className="mb-4">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="w-full"
                        autoFocus
                        id="email"
                        {...register("email", {
                            required: "Please enter email",
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                message: "Please enter valid email",
                            },
                        })}
                    ></input>
                    {errors.email && (
                        <div className="text-red-500">{errors.email.message}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="w-full"
                        id="password"
                        {...register("password", {
                            required: "Please enter password",
                            minLength: { value: 6, message: "password is more than 5 chars" },
                        })}
                    ></input>
                    {errors.password && (
                        <div className="text-red-500 ">{errors.password.message}</div>
                    )}
                </div>
                <div className="mb-4 ">
                    <button className="primary-button">Login</button>
                </div>
                <div className="mb-3">
                    New customer?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
                </div>
            </form>
        </div>
    );
}