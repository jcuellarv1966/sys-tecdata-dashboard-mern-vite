import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../../utils/error';
import { Helmet } from 'react-helmet-async';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Slider, Checkbox } from "antd";
import SearchBox from '../components/SearchBox';
import Button from 'react-bootstrap/Button';
import Product from '../components/Product';
import LinkContainer from 'react-router-bootstrap/LinkContainer';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                countProducts: action.payload.countProducts,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export const ratings = [
    {
        name: '4stars & up',
        rating: 4,
    },

    {
        name: '3stars & up',
        rating: 3,
    },

    {
        name: '2stars & up',
        rating: 2,
    },

    {
        name: '1stars & up',
        rating: 1,
    },
];

const SearchScreen = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search); // /search?category=Shirts
    const category = sp.get('category') || 'all';
    const query = sp.get('query') || 'all';
    const price = sp.get('price') || 'all';
    const rating = sp.get('rating') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || 1;

    const [{ loading, error, products, pages, countProducts }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [matriz, setMatriz] = useState([]);
    const [precios, setPrecios] = useState([0, 0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:5000/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
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
    }, [category, error, order, page, price, query, rating]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/productscategories`);
                setCategories(data);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchCategories();
    }, [dispatch]);

    useEffect(() => {
        if (category == 'all') {
            setCategoryIds([]);
        }
        if (price == 'all') {
            setPrecios([0, 1000]);
        }
    }, [category, price]);

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
        const filterCategory = filter.category || category;
        const filterRating = filter.rating || rating;
        const filterPrice = filter.price || price;
        const sortOrder = filter.order || order;
        return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
    };

    return (
        <div className='grid md:grid-cols-10 md:gap-[2px] mt-2'>
            <Helmet>
                <title>Search Products</title>
            </Helmet>
            <div className='flex flex-col mt-[0px] md:col-span-2'>
                <h3 className='text-lg text-blue-600 font-bold'>Categories</h3>
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
                            className={'bg-green-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
                        >
                            All
                        </Link>
                        <Link
                            to={getFilterUrl({ category: matriz })}
                            className={'bg-blue-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
                        >
                            Filter
                        </Link>
                    </div>
                </div>
                <hr />
                <div>
                    <h3 className='text-lg text-blue-600 font-bold mt-2'>Range of Prices</h3>
                    <Slider
                        className="w-[234px] mr-0 px-0"
                        range
                        value={precios}
                        onChange={(value) => { getFilterUrl({ price: setPrecios(value) }) }}
                        max="1000"
                    />
                    <div className="flex space-x-4 items-center">
                        <Link
                            to={getFilterUrl({ price: 'all' })}
                            className={'bg-green-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
                        >
                            All
                        </Link>
                        <Link
                            to={getFilterUrl({ price: precios })}
                            className={'bg-blue-700 text-white text-sm text-center w-20 px-2 mb-2 rounded-[4px]'}
                        >
                            Filter
                        </Link>
                    </div>
                </div>
                <hr />
                <div>
                    <h3 className='text-lg text-blue-600 font-bold mt-2'>Avg. Customer Review</h3>
                    <ul>
                        {ratings.map((r) => (
                            <li key={r.name}>
                                <Link
                                    to={getFilterUrl({ rating: r.rating })}
                                    className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                                >
                                    <Rating caption={' & up'} rating={r.rating}></Rating>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link
                                to={getFilterUrl({ rating: 'all' })}
                                className={rating === 'all' ? 'text-bold' : ''}
                            >
                                <Rating caption={' & up'} rating={0}></Rating>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="overflow-x-hidden md:col-span-8 ml-2">
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                        <h1 className='text-2xl text-blue-900 text-bold'>Search Product(s) ...</h1>
                        <div className="flex justify-between md:grid-cols-7 md:gap-1 mb-3">
                            <div>
                                {countProducts === 0 ? 'No' : countProducts} Results
                                {query !== 'all' && ' : ' + query}
                                {/* {category !== 'all' && ' : ' + category} */}
                                {price !== 'all' && ' : Price ' + price}
                                {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                                {query !== 'all' ||
                                    category !== 'all' ||
                                    rating !== 'all' ||
                                    price !== 'all' ? (
                                    <Button
                                        variant="light"
                                        onClick={() => navigate('/search')}
                                    >
                                        <i className="fas fa-times-circle"></i>
                                    </Button>
                                ) : null}
                            </div>
                            <div className="md:col-span-2">
                                <SearchBox />
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
                                    <option value="titleAsc">Title: Ascending</option>
                                    <option value="titleDesc">Title: Descending</option>
                                    <option value="lowest">Price: Low to High</option>
                                    <option value="highest">Price: High to Low</option>
                                    <option value="toprated">Avg. Customer Reviews</option>
                                </select>
                            </div>
                        </div>
                        {products.length === 0 && (
                            <MessageBox>No Product(s) Found</MessageBox>
                        )}
                        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2" >
                            {products.map((product) => (
                                <div key={product._id}>
                                    <Product product={product}></Product>
                                </div>
                            ))}
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
};

export default SearchScreen