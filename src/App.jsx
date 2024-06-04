import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import 'antd/dist/reset.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { Menu } from "@headlessui/react";
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from '../utils/Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { getError } from './../utils/error';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/admin/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductCreateScreen from './screens/admin/ProductCreateScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import ProductCategoryListScreen from "./screens/admin/ProductCategoryListScreen";
import ProductCategoryCreateScreen from './screens/admin/ProductCategoryCreateScreen';
import ProductCategoryEditScreen from './screens/admin/ProductCategoryEditScreen';
import ClientListScreen from "./screens/admin/ClientListScreen";
import ClientCreateScreen from "./screens/admin/ClientCreateScreen";
import ClientEditScreen from "./screens/admin/ClientEditScreen";
import ClientSearchScreen from './screens/admin/ClientSearchScreen';
import ProviderListScreen from "./screens/admin/ProviderListScreen";
import ProviderCreateScreen from "./screens/admin/ProviderCreateScreen";
import ProviderEditScreen from "./screens/admin/ProviderEditScreen";
import ProviderSearchScreen from './screens/admin/ProviderSearchScreen';
import PartnerListScreen from "./screens/admin/PartnerListScreen";
import PartnerCreateScreen from "./screens/admin/PartnerCreateScreen";
import PartnerEditScreen from "./screens/admin/PartnerEditScreen";
import PartnerSearchScreen from './screens/admin/PartnerSearchScreen';
import WorkerListScreen from "./screens/admin/WorkerListScreen";
import WorkerCreateScreen from "./screens/admin/WorkerCreateScreen";
import WorkerEditScreen from "./screens/admin/WorkerEditScreen";
import WorkerSearchScreen from './screens/admin/WorkerSearchScreen';
import WorkerCategoryListScreen from "./screens/admin/WorkerCategoryListScreen";
import WorkerCategoryCreateScreen from './screens/admin/WorkerCategoryCreateScreen';
import WorkerCategoryEditScreen from './screens/admin/WorkerCategoryEditScreen';
import WorkerPositionListScreen from "./screens/admin/WorkerPositionListScreen";
import WorkerPositionCreateScreen from './screens/admin/WorkerPositionCreateScreen';
import WorkerPositionEditScreen from './screens/admin/WorkerPositionEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import DashboardAdvisoryScreen from './screens/advisory/DashboardScreen';
import ClientProformListScreen from "./screens/advisory/ClientProformListScreen";
import ClientProformCreateScreen from "./screens/advisory/ClientProformCreateScreen";
import ClientProformEditScreen from "./screens/advisory/ClientProformEditScreen";
import ClientProformSearchScreen from "./screens/advisory/ClientProformSearchScreen";
import ClientContractListScreen from "./screens/advisory/ClientContractListScreen";
import ClientContractCreateScreen from "./screens/advisory/ClientContractCreateScreen";
import ClientContractCreateBasedProformsScreen from "./screens/advisory/ClientContractCreateBasedProformsScreen";
import ClientContractEditScreen from "./screens/advisory/ClientContractEditScreen";
import ClientContractSearchScreen from "./screens/advisory/ClientContractSearchScreen";
import ClientContractTypeListScreen from "./screens/advisory/ClientContractTypeListScreen";
import ClientContractTypeCreateScreen from "./screens/advisory/ClientContractTypeCreateScreen";
import ClientContractTypeEditScreen from "./screens/advisory/ClientContractTypeEditScreen";
import ClientContractClauseListScreen from "./screens/advisory/ClientContractClauseListScreen";
import ClientContractClauseCreateScreen from "./screens/advisory/ClientContractClauseCreateScreen";
import ClientContractClauseEditScreen from "./screens/advisory/ClientContractClauseEditScreen";
import ClientAccountListScreen from "./screens/advisory/ClientAccountListScreen";
import ClientAccountCreateScreen from "./screens/advisory/ClientAccountCreateScreen";

function App() {
  const { state, dispatching: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [navbar, setNavbar] = useState(false);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

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
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col justify-between">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <nav className="fixed w-full bg-blue-900 shadow-lg h-[56px] z-20 py-0">
            <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
              <div>
                <div className="flex items-left justify-between py-0 md:py-0 md:block">
                  <div className="flex items-center">
                    <LinkContainer to="/">
                      <a href="#" className="flex items-center py-3 lg:px-4 md:px-2 sm:px-0 mr-2">
                        <img src="/LogotipoWeb_FondoAzul.png"
                          alt="Logo"
                          className="h-7 w-48 mr-8 xs:h-7 xs:w-48 xs:mr-4" />
                      </a>
                    </LinkContainer>
                  </div>
                  <div className="md:hidden">
                    <button
                      className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border mt-2"
                      onClick={() => setNavbar(!navbar)}
                    >
                      {navbar ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={`flex-1 justify-self-center pb-2 mt-6 md:block md:pb-0 md:mt-0 z-20 mr-8 ${navbar ? 'block' : 'hidden'
                    } `}
                >
                  <ul className="bg-blue-900 items-center justify-content space-y-2 md:flex md:space-x-1 md:space-y-0 mt-3">
                    <li className="mx-2">
                      <LinkContainer to="/admin/dashboard">
                        <a className="text-yellow-50 hover:text-blue-200 text-[13px]">Maintenance</a>
                      </LinkContainer>
                    </li>
                    <li className="mx-2">
                      <LinkContainer to="/advisory/dashboard">
                        <a className="text-yellow-50 hover:text-blue-200 text-[13px]">Advisory</a>
                      </LinkContainer>
                    </li>
                    <li className="mx-2">
                      <LinkContainer to="/blogs">
                        <a className="text-yellow-50 hover:text-blue-200 text-[13px]">Database</a>
                      </LinkContainer>
                    </li>
                    <li className="mx-2">
                      <LinkContainer to="/about">
                        <a className="text-yellow-50 hover:text-blue-200 text-[13px]">Logistics</a>
                      </LinkContainer>
                    </li>
                    <li className="mx-2">
                      <LinkContainer to="/contact">
                        <a className="text-yellow-50 hover:text-blue-200 text-xs">Personal</a>
                      </LinkContainer>
                    </li>
                    <li className="mx-2">
                      <LinkContainer to="/contact">
                        <a className="text-yellow-50 hover:text-blue-200 text-[13px]">Box and Banks</a>
                      </LinkContainer>
                    </li>
                    <li className="mx-2">
                      <LinkContainer to="/contact">
                        <a className="text-yellow-50 hover:text-blue-200 text-[13px]">Accounting</a>
                      </LinkContainer>
                    </li>
                  </ul>
                </div>
              </div>
              <SearchBox />
              {userInfo ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-white">
                    {userInfo.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg ">
                    <Menu.Item>
                      <a className="dropdown-link" href="/profile">
                        Profile
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a className="dropdown-link" href="/orderhistory">
                        Order History
                      </a>
                    </Menu.Item>
                    {userInfo.isAdmin && (
                      <Menu.Item>
                        <a className="dropdown-link" href="/admin/dashboard">
                          Admin Dashboard
                        </a>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={signoutHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <LinkContainer to="/signin">
                  <a className="p-2 text-white">Login</a>
                </LinkContainer>
              )}
            </div>
          </nav>
        </header>
        <main className="container mt-16 py-2">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />}></Route>
            <Route path="/shipping" element={<ProtectedRoute><ShippingAddressScreen /></ProtectedRoute>}></Route>
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<ProtectedRoute><OrderScreen /></ProtectedRoute>}></Route>
            <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>}></Route>
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen /></AdminRoute>}></Route>
            <Route path="/admin/products" element={<AdminRoute><ProductListScreen /></AdminRoute>}></Route>
            <Route path="/admin/productcreate" element={<AdminRoute><ProductCreateScreen /></AdminRoute>}></Route>
            <Route path="/admin/product/:id" element={<AdminRoute><ProductEditScreen /></AdminRoute>}></Route>
            <Route path="/admin/productscategories" element={<AdminRoute><ProductCategoryListScreen /></AdminRoute>}></Route>
            <Route path="/admin/productcategorycreate" element={<AdminRoute><ProductCategoryCreateScreen /></AdminRoute>}></Route>
            <Route path="/admin/productcategory/:id" element={<AdminRoute><ProductCategoryEditScreen /></AdminRoute>}></Route>
            <Route path="/admin/clients" element={<AdminRoute><ClientListScreen /></AdminRoute>}></Route>
            <Route path="/admin/clientcreate" element={<AdminRoute><ClientCreateScreen /></AdminRoute>}></Route>
            <Route path="/admin/client/:id" element={<AdminRoute><ClientEditScreen /></AdminRoute>}></Route>
            <Route path="/searchclient" element={<AdminRoute><ClientSearchScreen /></AdminRoute>}></Route>
            <Route path="/admin/providers" element={<AdminRoute><ProviderListScreen /></AdminRoute>}></Route>
            <Route path="/admin/providercreate" element={<AdminRoute><ProviderCreateScreen /></AdminRoute>}></Route>
            <Route path="/admin/provider/:id" element={<AdminRoute><ProviderEditScreen /></AdminRoute>}></Route>
            <Route path="/searchprovider" element={<AdminRoute><ProviderSearchScreen /></AdminRoute>}></Route>
            <Route path="/admin/partners" element={<AdminRoute><PartnerListScreen /></AdminRoute>}></Route>
            <Route path="/admin/partnercreate" element={<AdminRoute><PartnerCreateScreen /></AdminRoute>}></Route>
            <Route path="/admin/partner/:id" element={<AdminRoute><PartnerEditScreen /></AdminRoute>}></Route>
            <Route path="/searchpartner" element={<AdminRoute><PartnerSearchScreen /></AdminRoute>}></Route>
            <Route path="/admin/workers" element={<AdminRoute><WorkerListScreen /></AdminRoute>}></Route>
            <Route path="/admin/workercreate" element={<AdminRoute><WorkerCreateScreen /></AdminRoute>}></Route>
            <Route path="/admin/worker/:id" element={<AdminRoute><WorkerEditScreen /></AdminRoute>}></Route>
            <Route path="/searchworker" element={<AdminRoute><WorkerSearchScreen /></AdminRoute>}></Route>
            <Route path="/admin/workerscategories" element={<AdminRoute><WorkerCategoryListScreen /></AdminRoute>}></Route>
            <Route path="/admin/workercategorycreate" element={<AdminRoute><WorkerCategoryCreateScreen /></AdminRoute>}></Route>
            <Route path="/admin/workercategory/:id" element={<AdminRoute><WorkerCategoryEditScreen /></AdminRoute>}></Route>
            <Route path="/admin/workerspositions" element={<AdminRoute><WorkerPositionListScreen /></AdminRoute>}></Route>
            <Route path="/admin/workerpositioncreate" element={<AdminRoute><WorkerPositionCreateScreen /></AdminRoute>}></Route>
            <Route path="/admin/workerposition/:id" element={<AdminRoute><WorkerPositionEditScreen /></AdminRoute>}></Route>
            <Route path="/admin/orders" element={<AdminRoute><OrderListScreen /></AdminRoute>}></Route>
            <Route path="/admin/users" element={<AdminRoute><UserListScreen /></AdminRoute>}></Route>
            <Route path="/admin/user/:id" element={<AdminRoute><UserEditScreen /></AdminRoute>}></Route>
            {/* Advisory Routes */}
            <Route path="/advisory/dashboard" element={<AdminRoute><DashboardAdvisoryScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientproforms" element={<AdminRoute><ClientProformListScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientproformcreate" element={<AdminRoute><ClientProformCreateScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientproform/:id" element={<AdminRoute><ClientProformEditScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientproformsearch" element={<AdminRoute><ClientProformSearchScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientcontracts" element={<AdminRoute><ClientContractListScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientcontractcreate" element={<AdminRoute><ClientContractCreateScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientcontractcreatebasedproform" element={<AdminRoute><ClientContractCreateBasedProformsScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientcontract/:id" element={<AdminRoute><ClientContractEditScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientcontractsearch" element={<AdminRoute><ClientContractSearchScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientcontracttypes" element={<AdminRoute><ClientContractTypeListScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientcontracttypecreate" element={<AdminRoute><ClientContractTypeCreateScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientcontracttype/:id" element={<AdminRoute><ClientContractTypeEditScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientcontractclauses" element={<AdminRoute><ClientContractClauseListScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientcontractclausecreate" element={<AdminRoute><ClientContractClauseCreateScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientcontractclause/:id" element={<AdminRoute><ClientContractClauseEditScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientaccounts" element={<AdminRoute><ClientAccountListScreen /></AdminRoute>}></Route>
            <Route path="/advisory/clientaccountcreate" element={<AdminRoute><ClientAccountCreateScreen /></AdminRoute>}></Route>

          </Routes>
        </main>
        <footer className="flex h-10 z-30 justify-center items-center shadow-inner">
          <p className="font-bold mt-2">
            Copyright © 2022 Tec Data - Alta Tecnologia en Inversiones Rentables
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App;
