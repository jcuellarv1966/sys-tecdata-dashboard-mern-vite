import { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../../utils/Store';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../../utils/error';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';

export default function SignupScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const { state, dispatching: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = useForm();

    const submitHandler = async ({ name, email, password, confirmPassword }) => {
        try {
            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
            const { data } = await Axios.post('http://localhost:5000/api/users/signup', {
                name,
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

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    return (
        <div className="max-w-2xl m-auto">
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <form onSubmit={handleSubmit(submitHandler)} className="mx-auto max-w-screen-md mt-4">
                <h1 className="text-2xl text-blue-900 font-bold my-3">Sign Up</h1>

                <div className="mb-4">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="w-full"
                        id="name"
                        autoFocus
                        {...register('name', {
                            required: 'Please enter name',
                        })}
                    />
                    {errors.name && (
                        <div className="text-red-500">{errors.name.message}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="w-full"
                        id="email"
                        {...register('email', {
                            required: 'Please enter email',
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                message: 'Please enter valid email',
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
                        {...register('password', {
                            required: 'Please enter password',
                            minLength: { value: 6, message: 'password is more than 5 chars' },
                        })}
                    ></input>
                    {errors.password && (
                        <div className="text-red-500 ">{errors.password.message}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        className="w-full"
                        type="password"
                        id="confirmPassword"
                        {...register('confirmPassword', {
                            required: 'Please enter confirm password',
                            validate: (value) => value === getValues('password'),
                            minLength: {
                                value: 6,
                                message: 'confirm password is more than 5 chars',
                            },
                        })}
                    />
                    {errors.confirmPassword && (
                        <div className="text-red-500 ">
                            {errors.confirmPassword.message}
                        </div>
                    )}
                    {errors.confirmPassword &&
                        errors.confirmPassword.type === 'validate' && (
                            <div className="text-red-500 ">Password do not match</div>
                        )}
                </div>

                <div className="mb-4 ">
                    <button className="primary-button">Register</button>
                </div>
                <div className="mb-3">
                    Already have an account?{' '}
                    <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
                </div>
            </form>
        </div>
    );
}