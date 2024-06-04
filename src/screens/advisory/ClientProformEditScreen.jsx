import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';
import SideNavbarAdvisory from '../../components/SideNavbarAdvisory';
import { Link } from "react-router-dom";
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import moment from "moment";
import "moment-timezone";
import { XCircleIcon } from '@heroicons/react/outline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: "" };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, error: "" };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, error: action.payload };

    default:
      return state;
  }
};

const initialState = {
  numberProform: "",
  client: "",
  razSocial: "",
  address: "",
  email: "",
  contactNumber: "",
  proformItems: [],
  issueDate: "",
  receptionDate: "",
  acceptanceDate: "",
  acceptance: "",
  observations: "",
}

const ClientProformEditScreen = () => {
  const navigate = useNavigate();
  const params = useParams(); // /clientproform/:id
  const { id: clientProformId } = params;

  const { state, dispatching } = useContext(Store);
  const { userInfo } = state;
  const { cart } = state;
  const { cartItems } = cart;

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [values, setValues] = useState(initialState);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [products, setProducts] = useState([]);
  const [aceptacion, setAceptacion] = useState(false);
  const [flag, setFlag] = useState(0);

  const {
    numberProform,
    client,
    address,
    email,
    contactNumber,
    proformItems,
    issueDate,
    receptionDate,
    acceptanceDate,
    acceptance,
    observations,
  } = values;


  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`http://localhost:5000/api/clientproforms/${clientProformId}`);
        setValues({ ...values, ...data });
        if (acceptance === "Yes") {
          setAceptacion(true)
        } else {
          setAceptacion(false)
        }
        if (client !== "") {
          const { data } = await axios.get(`http://localhost:5000/api/clients/${client._id}`);
          setValues({ ...values, razSocial: data.razSocial, address: data.address, email: data.email, contactNumber: data.contactNumber });
        } else {
          setFlag(flag + 1);
        }
        dispatching({ type: 'CART_CLEAR_ITEMS' });
        Cookies.set(
          'cart',
          JSON.stringify({
            ...cart,
            cartItems: [],
          })
        );
        for (let i = 0; i < proformItems.length; i++) {
          const { data } = await axios.get(`http://localhost:5000/api/products/${proformItems[i]._id}`);
          const quantity = proformItems[i].quantity;
          dispatching({ type: 'CART_ADD_ITEM', payload: { ...data, quantity } });
        }
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
    loadClients();
    loadProducts();
  }, [flag]);

  const loadClients = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/clients`);
    setClients(data);
  }

  const loadProducts = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/products`);
    setProducts(data);
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClientChange = async (e) => {
    e.preventDefault();
    setSelectedClient(e.target.value);
    const { data } = await axios.get(`http://localhost:5000/api/clients/${e.target.value}`);
    setValues({ ...values, client: e.target.value, razSocial: data.razSocial, address: data.address, email: data.email, contactNumber: data.contactNumber });
  };

  const handleProductChange = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(`http://localhost:5000/api/products/${e.target.value}`);
    const existItem = cart.cartItems.find((x) => x.slug === data.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatching({ type: 'CART_ADD_ITEM', payload: { ...data, quantity } });
  }

  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`http://localhost:5000/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatching({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  }

  const removeItemHandler = (item) => {
    dispatching({ type: 'CART_REMOVE_ITEM', payload: item });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let arr = [];
    for (let i = 0; i < cartItems.length; i++) {
      arr.push({
        title: cartItems[i].title,
        slug: cartItems[i].slug,
        quantity: cartItems[i].quantity,
        price: cartItems[i].price,
        _id: cartItems[i]._id
      });
    }
    values.proformItems = arr;
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    values.subtotal = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
    values.igv = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0) * 0.19);
    values.total = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0) * 1.19)
    if (aceptacion == true) {
      values.acceptance = "Yes"
    } else {
      values.acceptance = "No"
    }
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`http://localhost:5000/api/clientproforms/${clientProformId}`, { values },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatching({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Client Proform updated successfully");
      navigate("/advisory/clientproforms");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      toast.error(getError(err));
    }
  }

  const formatoMexico = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1,';
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join('.') : arr[0];
  }

  return (
    <div className="grid md:grid-cols-8 md:gap-0 mt-2">
      <Helmet>
        <title>Tec Data - Edit Client Proform ${clientProformId}</title>
      </Helmet>
      <div>
        <SideNavbarAdvisory />
      </div>
      <div className="overflow-x-auto md:col-span-7 ml-12">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <form className="mx-auto max-w-screen-lg overflow-x-hidden overflow-y-hidden" onSubmit={handleSubmit}>
            <h1 className="mb-0 text-xl">{`Edit Client Proform ${clientProformId}`}</h1>

            <div className="grid md:grid-cols-2 md:gap-2">
              <div>
                <div className="md:flex md:items-start mb-2">
                  <div className="md:w-1/3">
                    <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 mt-2" htmlFor="inline-full-name">Client</label>
                  </div>
                  <div className="md:w-2/3">
                    <select
                      name="client"
                      className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                      aria-label="Default select example"
                      required
                      value={selectedClient ? selectedClient : client._id}
                      onChange={handleClientChange}
                    >
                      <option disabled>Please select</option>
                      {clients.length > 0 &&
                        clients.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.razSocial}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="md:flex md:items-start mb-2">
                  <div className="md:w-1/3">
                    <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 mt-2" htmlFor="inline-full-name">Address</label>
                  </div>
                  <div className="md:w-2/3">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8 text-sm"
                      id="inline-full-name"
                      type="text"
                      value={address}
                      readOnly />
                  </div>
                </div>

                <div className="md:flex md:items-start mb-2">
                  <div className="md:w-1/3">
                    <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 mt-2" htmlFor="inline-full-name">eMail</label>
                  </div>
                  <div className="md:w-2/3">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8 text-sm"
                      id="inline-full-name"
                      type="text"
                      value={email}
                      readOnly />
                  </div>
                </div>

                <div className="md:flex md:items-start mb-2">
                  <div className="md:w-1/3">
                    <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 mt-2" htmlFor="inline-full-name">contact Number</label>
                  </div>
                  <div className="md:w-2/3">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8 text-sm"
                      id="inline-full-name"
                      type="text"
                      value={contactNumber}
                      readOnly />
                  </div>
                </div>

                <hr />

                <div className="md:flex md:items-start mt-2 mb-2">
                  <div className="md:w-1/3">
                    <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 mt-2" htmlFor="inline-full-name">Select Product ...</label>
                  </div>
                  <div className="md:w-2/3">
                    <select
                      name="product"
                      className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                      aria-label="Default select example"
                      required
                      onChange={handleProductChange}
                    >
                      <option disabled>Please select</option>
                      {products.length > 0 &&
                        products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div className="md:flex md:items-start mb-1">
                  <div className="md:w-1/3">
                    <label className="block text-black md:text-left mb-1 md:mb-0 pr-4 mt-2" htmlFor="inline-full-name">Number of Proform:</label>
                  </div>
                  <div className="md:w-1/3">
                    <input
                      type="text"
                      required
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8"
                      name="numberProform"
                      value={numberProform}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:w-1/3 mt-1">
                    <div className="flex items-center justify-center mb-2">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="isFeatured"
                          checked={aceptacion}
                          value={aceptacion}
                          onChange={(e) => setAceptacion(e.target.checked)}
                          id="flexCheckIsAcceptance" />
                        <label className="form-check-label mt-1" htmlFor="flexCheckIsAcceptance">Is Acceptance?</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap mb-1 text-sm">
                  <div className="w-full md:w-1/3 px-0 mb-1 md:mb-0">
                    <label htmlFor="bornDate">Date of Issue</label>
                    <input
                      type="date"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                      name="issueDate"
                      placeholder="Fecha de Nacimiento ..."
                      value={moment(issueDate).add("hours", 4).format("yyyy-MM-DD")}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="w-full md:w-1/3 px-0">
                    <label htmlFor="beginDate">Date of Reception</label>
                    <input
                      type="date"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                      name="receptionDate"
                      placeholder="Fecha de Inicio ..."
                      value={moment(receptionDate).add("hours", 4).format("yyyy-MM-DD")}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="w-full md:w-1/3 px-0">
                    <label htmlFor="endDate">Date of Acceptance</label>
                    <input
                      type="date"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                      name="acceptanceDate"
                      placeholder="Fecha de Termino ..."
                      value={moment(acceptanceDate).add("hours", 4).format("yyyy-MM-DD")}
                      onChange={handleChange}
                    ></input>
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="observations">Observations</label>
                  <textarea
                    type="text"
                    rows="3"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 px-1"
                    name="observations"
                    placeholder="Observations ..."
                    value={observations}
                    onChange={handleChange}
                  ></textarea>
                </div>

              </div>
            </div>

            <table className="min-w-full mt-2">
              <thead className="border-b bg-gray-200">
                <tr>
                  <th className="p-0 px-4 text-left">Item</th>
                  <th className="p-0 text-center">Quantity</th>
                  <th className="p-0 text-right w-20">Price</th>
                  <th className="p-0 text-right">Sub Total</th>
                  <th className="p-0 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td className='p-0 px-4 text-left'>
                      <Link to={`/product/${item.slug}`} className="flex items-center">
                        {item.title}
                      </Link>
                    </td>
                    <td className="p-0 text-center">
                      <select
                        className='w-16 text-right h-9 text-sm'
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-0 text-right">${formatoMexico(parseFloat(item.price).toFixed(2))}</td>
                    <td className="p-0 text-right">${formatoMexico(parseFloat(item.quantity * item.price).toFixed(2))}</td>
                    <td className="p-0 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className="h-5 w-5 text-red-700"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-1 pb-0 text-md text-right px-2 font-bold">
              Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
              {formatoMexico(parseFloat(cartItems.reduce((a, c) => a + c.quantity * c.price, 0)).toFixed(2))}
            </div>

            <div className="pt-1 pb-0 text-md text-right px-2 font-bold">
              IGV : $
              {formatoMexico(parseFloat(cartItems.reduce((a, c) => a + c.quantity * c.price, 0) * 0.19).toFixed(2))}
            </div>

            <div className="pt-1 pb-0 text-md text-right px-2 font-bold">
              Total : $
              {formatoMexico(parseFloat(cartItems.reduce((a, c) => a + c.quantity * c.price, 0) * 1.19).toFixed(2))}
            </div>

            <div className="flex flex-wrap mt-2 mb-2">
              <div className="w-full md:w-1/2 px-1 mb-2 md:mb-0">
                <Link
                  to={`/advisory/clientproforms`}
                  className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center w-full rounded-md outline outline-offset-0 outline-1"
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="h-6 w-6 text-blue-500 mr-1"
                  />
                  Back
                </Link>
              </div>
              <div className="w-full md:w-1/2 px-1 mb-2 md:mb-0">
                <button
                  disabled={loadingUpdate}
                  className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2 w-full">
                  <FontAwesomeIcon
                    icon={faSave}
                    className="h-6 w-6 text-white hover:text-yellow-200"
                  />
                  {loadingUpdate ? "Loading" : "Update"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ClientProformEditScreen;