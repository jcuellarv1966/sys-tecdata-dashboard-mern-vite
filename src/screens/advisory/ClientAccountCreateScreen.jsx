import React, { useContext, useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../../utils/Store';
import axios from 'axios';
import { getError } from '../../../utils/error';
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';
import SideNavbarAdvisory from '../../components/SideNavbarAdvisory';
import { Link } from "react-router-dom";
import moment from "moment";
import "moment-timezone";
import { XCircleIcon } from '@heroicons/react/outline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true, error: "" };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false, error: action.payload };

    default:
      return state;
  }
}

const initialState = {
  numberAccount: "",
  accountType: "",
  accountTypes: [],
  accountTransactionTypes: [],
  client: "",
  numberContract: "",
  clients: [],
  razSocial: "",
  address: "",
  email: "",
  contactNumber: "",
  rut: "",
  worker: "",
  workers: [],
  observations: "",
  transactionDate: Date.now(),
  debitTransaction: 0,
  creditTransaction: 0,
  balance: 0,
  observationsTransaction: "Sin observaciones ...",
  debit: 0,
  credit: 0,
  countableBalance: 0,
  withHoldings: 0,
  cashBalance: 0,
  openDate: "",
  lockedDate: "",
  unlockedDate: "",
  closedDate: "",
  current: "No",
}

const ClientAccountCreateScreen = () => {
  const { state, dispatching } = useContext(Store);
  const { userInfo, accountTransactions } = state;
  const { accountTransactionsItems } = accountTransactions;

  const navigate = useNavigate();

  const [{ loading, loadingCreate, error }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [values, setValues] = useState(initialState);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [vigente, setVigente] = useState(false);
  const [flag, setFlag] = useState(0);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const {
    numberAccount,
    accountType,
    accountTypes,
    accountTransactionTypes,
    client,
    numberContract,
    clients,
    razSocial,
    address,
    email,
    contactNumber,
    rut,
    worker,
    workers,
    observations,
    transactionDate,
    debitTransaction,
    creditTransaction,
    balance,
    observationsTransaction,
    debit,
    credit,
    countableBalance,
    withHoldings,
    cashBalance,
    openDate,
    lockedDate,
    unlockedDate,
    closedDate,
    current
  } = values

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        loadClients();
        loadAccountTypes();
        loadAccountTransactionTypes();
        dispatching({ type: 'ACCOUNTTRANSACTIONS_CLEAR_ITEMS' });
        Cookies.set('accountTransactions', JSON.stringify({ ...accountTransactions, accountTransactionsItems: [], }));
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    }
    fetchData();
  }, [flag]);

  const loadClients = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/clients`);
    setValues({ ...values, clients: data });
    if (clients.length === 0) {
      setFlag(flag + 1);
    }
  };

  const loadAccountTypes = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/accounttypes`,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
    setValues({ ...values, accountTypes: data });
    if (accountTypes.length === 0) {
      setFlag(flag + 1);
    }
  };

  const loadAccountTransactionTypes = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/accounttransactiontypes`,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
    setValues({ ...values, accountTransactionTypes: data });
    if (accountTransactionTypes.length === 0) {
      setFlag(flag + 1);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClientChange = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(`http://localhost:5000/api/clients/${e.target.value}`);
    setValues({
      ...values,
      client: e.target.value,
      razSocial: data.razSocial,
      address: data.address,
      email: data.email,
      contactNumber: data.contactNumber,
      rut: data.rut
    });
    dispatching({ type: 'ACCOUNTTRANSACTIONS_CLEAR_ITEMS' });
    Cookies.set('accountTransactions', JSON.stringify({ ...accountTransactions, accountTransactionsItems: [], }));
  };

  const handleAccountTypeChange = async (e) => {
    e.preventDefault();
    setValues({ ...values, accountType: e.target.value });
  }

  const handleAccountTransactionType = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(`http://localhost:5000/api/accounttransactiontypes/${e.target.value}`);
    dispatching({
      type: 'ACCOUNTTRANSACTIONS_ADD_ITEM', payload: {
        ...data,
        transactionDate,
        numberAccount,
        numberContract,
        debitTransaction,
        creditTransaction,
        balance,
        observationsTransaction
      }
    });
  };

  const updateAccountTransactionTypeHandler = async (item, transactionDate,) => {
    dispatching({
      type: 'ACCOUNTTRANSACTIONS_ADD_ITEM', payload: { ...item, transactionDate, }
    });
  }

  const updateAccountTransactionTypeNameHandler = async (item, name,) => {
    dispatching({
      type: 'ACCOUNTTRANSACTIONS_ADD_ITEM', payload: { ...item, name, }
    });
  }

  const updateAccountTransactionTypeDebitHandler = async (item, e, index) => {
    if (index === 0) {
      values.balance = e - item.creditTransaction;
    } else if (index > 0 && index < accountTransactionsItems.length) {
      for (let i = 0; i < index - 1; i++) {
        totalDebit += accountTransactionsItems[i].debitTransaction;
      }
    }
    console.log(totalDebit);
    // values.balance = round2(accountTransactionsItems.reduce((a, c) => a + debitTransaction, 0));
    dispatching({
      type: 'ACCOUNTTRANSACTIONS_ADD_ITEM', payload: { ...item, debitTransaction: e, balance }
    });
  }

  const handleKeyDown = (event, item, debitTransaction) => {
    /* if (event.key === 'Enter') {
      setTotalDebit(round2(accountTransactionsItems.reduce((a, c) => a + c.debitTransaction, 0)));
      setTotalCredit(round2(accountTransactionsItems.reduce((a, c) => a + c.creditTransaction, 0)));
      values.balance = totalCredit - totalDebit;
      dispatching({
        type: 'ACCOUNTTRANSACTIONS_ADD_ITEM', payload: { ...item, debitTransaction, balance }
      });
    } */
  };

  const updateAccountTransactionTypeCreditHandler = async (item, creditTransaction,) => {
    // values.balance = round2(accountTransactionsItems.reduce((a, c) => a + c.debitTransaction, 0)) - parseFloat(creditTransaction);
    dispatching({
      type: 'ACCOUNTTRANSACTIONS_ADD_ITEM', payload: { ...item, creditTransaction, balance }
    });
  }

  const calcBalanceHandler = () => {
    values.balance = round2(accountTransactionsItems.reduce((a, c) => a + c.debitTransaction, 0))
    return balance;
  };

  const removeAccountTransactionTypeHandler = (item) => {
    dispatching({ type: 'ACCOUNTTRANSACTIONS_REMOVE_ITEM', payload: item });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="grid md:grid-cols-8 md:gap-0 mt-1">
      <Helmet>
        <title>Tec Data - Create Client Account</title>
      </Helmet>
      <div>
        <SideNavbarAdvisory />
      </div>
      <div className="overflow-x-auto md:col-span-7 ml-12">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="alert-error">{error}</div>
        ) : (
          <form className="mx-auto max-w-screen-lg overflow-y-hidden" onSubmit={handleSubmit}>
            <h1 className="mb-1 text-xl text-left">{`Create Client Account`}</h1>

            <div className="grid md:grid-cols-2 md:gap-2">
              <div>
                <div className="md:flex md:items-start mb-2">
                  <div className="md:w-1/3">
                    <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-2" htmlFor="inline-full-name">Client</label>
                  </div>
                  <div className="md:w-2/3">
                    <select
                      name="client"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-[36px]"
                      aria-label="Default select example"
                      required
                      onClick={handleClientChange}
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
                    <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">Address</label>
                  </div>
                  <div className="md:w-2/3">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-[30px] text-sm"
                      id="inline-full-name"
                      type="text"
                      value={address}
                      readOnly />
                  </div>
                </div>

                <div className="md:flex md:items-start mb-2">
                  <div className="md:w-1/3">
                    <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">eMail</label>
                  </div>
                  <div className="md:w-2/3">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-[30px] text-sm"
                      id="inline-full-name"
                      type="text"
                      value={email}
                      readOnly />
                  </div>
                </div>

                <div className="md:flex md:items-start mb-2">
                  <div className="md:w-1/3">
                    <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">contact Number</label>
                  </div>
                  <div className="md:w-2/3">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-[30px] text-sm"
                      id="inline-full-name"
                      type="text"
                      value={contactNumber}
                      readOnly />
                  </div>
                </div>

                <div className="md:flex md:items-start mb-2">
                  <div className="md:w-1/3">
                    <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">RUT</label>
                  </div>
                  <div className="md:w-2/3">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-[30px] text-sm"
                      id="inline-full-name"
                      type="text"
                      value={rut}
                      readOnly />
                  </div>
                </div>
              </div>

              <div>
                <div className="md:flex md:items-baseline mb-0 mr-2 px-0 ml-2">
                  <div className="w-full md:w-1/4 px-1 mb-1 md:mb-0">
                    <label htmlFor="debit" className='text-[12px]'>Account N#</label><br />
                    <input
                      type="text"
                      required
                      className="w-full h-6"
                      name="numberAccount"
                      autoFocus={false}
                      value={numberAccount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full md:w-1/4 px-1 mb-1 md:mb-0">
                    <label htmlFor="debit" className='text-[12px]'>Contract N#</label><br />
                    <input
                      type="text"
                      required
                      className="w-full h-6"
                      name="numberContract"
                      autoFocus={false}
                      value={numberContract}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full md:w-2/4 px-1 mb-1 md:mb-0">
                    <label htmlFor="debit" className='text-[12px]'>Type of Account</label><br />
                    <select
                      name="accountType"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-[2px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-6 ml-2"
                      aria-label="Default select example"
                      required
                      onClick={handleAccountTypeChange}
                      onChange={handleAccountTypeChange}
                    >
                      <option disabled>Please select</option>
                      {accountTypes.length > 0 &&
                        accountTypes.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="md:flex md:items-baseline mb-0 mr-2 px-0 ml-2">
                  <div className="w-full md:w-1/3 px-1 mb-1 md:mb-0">
                    <label htmlFor="debit" className='text-[12px]'>Debits</label><br />
                    <input
                      type="number"
                      required
                      className="w-full h-[22px] text-right"
                      name="debit"
                      autoFocus={false}
                      value={debit}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-1">
                    <label htmlFor="credit" className='text-[12px]'>Credits</label><br />
                    <input
                      type="number"
                      required
                      className="w-full h-[22px] text-right"
                      name="credit"
                      autoFocus={false}
                      value={credit}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-0 ml-1 sm:px-1">
                    <label htmlFor="countableBalance" className='text-[12px]'>Countable Balance</label><br />
                    <input
                      type="number"
                      required
                      className="w-full h-[22px] text-right"
                      name="countableBalance"
                      autoFocus={false}
                      value={countableBalance}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="md:flex md:items-baseline mb-0 mr-2 px-0 ml-2">
                  <div className="w-full md:w-1/3 px-1 mb-1 md:mb-0">
                    <label htmlFor="withHoldings" className='text-[12px]'>With Holdings</label><br />
                    <input
                      type="number"
                      required
                      className="w-full h-[22px] text-right"
                      name="withHoldings"
                      autoFocus={false}
                      value={withHoldings}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-1">
                    <label htmlFor="cashBalance" className='text-[12px]'>Cash Balance</label><br />
                    <input
                      type="number"
                      required
                      className="w-full h-[22px] text-right"
                      name="cashBalance"
                      autoFocus={false}
                      value={cashBalance}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-1">
                    <div className='text-white text-[12px]'>Aloha</div>
                    <div className="flex items-center justify-center mb-2">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="current"
                          checked={vigente}
                          value={vigente}
                          onChange={(e) => setVigente(e.target.checked)}
                          id="flexCheckCurrent" />
                        <label className="form-check-label mt-1" htmlFor="flexCheckCurrent">Is Current?</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:flex md:items-baseline mb-0 mr-2 px-0 ml-2">
                  <div className="w-full md:w-1/4 px-1 mb-1 md:mb-0">
                    <label htmlFor="openDate" className='text-[12px]'>Date of Open</label>
                    <input
                      type="date"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-[26px]"
                      name="openDate"
                      value={moment(openDate).add("hours", 4).format("yyyy-MM-DD")}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="w-full md:w-1/4 px-1 mb-1 md:mb-0">
                    <label htmlFor="lockedDate" className='text-[12px]'>Date of Locked</label>
                    <input
                      type="date"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-[26px]"
                      name="lockedDate"
                      value={moment(lockedDate).add("hours", 4).format("yyyy-MM-DD")}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="w-full md:w-1/4 px-1 mb-1 md:mb-0">
                    <label htmlFor="unlockedDate" className='text-[12px]'>Date of UnLocked</label>
                    <input
                      type="date"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-[26px]"
                      name="unlockedDate"
                      value={moment(unlockedDate).add("hours", 4).format("yyyy-MM-DD")}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="w-full md:w-1/4 px-1 mb-1 md:mb-0">
                    <label htmlFor="closedDate" className='text-[12px]'>Date of Close</label>
                    <input
                      type="date"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-[26px]"
                      name="closedDate"
                      value={moment(closedDate).add("hours", 4).format("yyyy-MM-DD")}
                      onChange={handleChange}
                    ></input>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="grid md:grid-cols-2 md:gap-2">
              <div>
                <div className="md:flex md:items-start mt-2 mb-2">
                  <div className="md:w-1/3">
                    <label className="block text-black md:text-left mb-1 md:mb-0 pr-4 mt-2" htmlFor="inline-full-name">Type of Transaction ...</label>
                  </div>
                  <div className="md:w-2/3">
                    <select
                      name="accountType"
                      className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                      aria-label="Default select example"
                      required
                      defaultValue={""}
                      onChange={handleAccountTransactionType}
                    >
                      <option disabled value="">Please select</option>
                      {accountTransactionTypes.length > 0 &&
                        accountTransactionTypes.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <div className="mt-2 mb-2 ml-2 mr-2">
                  <textarea
                    type="text"
                    rows="1"
                    className="block p-2 w-full text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 px-2 h-8"
                    name="observations"
                    placeholder="Observations ..."
                    value={observations}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <table className="min-w-full mt-1">
              <thead className="border-b bg-gray-200">
                <tr>
                  <th className="p-0 px-4 text-left w-[120px]">Date</th>
                  <th className="p-0 text-left w-72">Detail</th>
                  <th className="p-0 px-2 text-right w-32">Debit</th>
                  <th className="p-0 px-2 text-right w-32">Credit</th>
                  <th className="p-0 px-2 text-right w-32">Balance</th>
                  <th className="p-0 px-2 text-left">Observations</th>
                  <th className="p-0 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {accountTransactionsItems.map((item, index) => (
                  <tr key={item.name} className="border-b">
                    <td>
                      <input
                        type="date"
                        className="block p-2.5 w-[120px] text-[13px] text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                        name="transactionDate"
                        value={moment(item.transactionDate).add("hours", 4).format("yyyy-MM-DD")}
                        onChange={(e) => updateAccountTransactionTypeHandler(item, e.target.value)}
                      ></input>
                    </td>
                    <td className='px-0 w-72'>
                      <input
                        type="text"
                        required
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-6 text-[13px]"
                        name="name"
                        value={item.name}
                        onChange={(e) => updateAccountTransactionTypeNameHandler(item, e.target.value)}
                      />
                    </td>
                    <td className='p-0 px-2 text-right w-32'>{item.debit_credit == "Yes" ?
                      <input
                        type="number"
                        required
                        className="text-right w-full h-6 text-[13px]"
                        name="debitTransaction"
                        onChange={(e) => updateAccountTransactionTypeDebitHandler(item, e.target.value, index)}
                        onKeyDown={handleKeyDown(item, item.debitTransaction)}
                      />
                      : 0}</td>
                    <td className='p-0 px-2 text-right w-32'>{item.debit_credit == "No" ?
                      <input
                        type="number"
                        required
                        className="text-right w-full h-6 text-[13px]"
                        name="creditTransaction"
                        onChange={(e) => updateAccountTransactionTypeCreditHandler(item, e.target.value)}
                      />
                      : 0}</td>
                    <td className='p-0 px-2 text-right w-32'>
                      {index === 0 ?
                        item.debitTransaction - item.creditTransaction :
                        index > 0 && index < accountTransactionsItems.length ?
                          ((round2(accountTransactionsItems.reduce((a, c) => a + c.debitTransaction, 0)) / 10) - (round2(accountTransactionsItems.reduce((a, c) => a + c.creditTransaction, 0)) / 10)) + Number(item.debitTransaction) - Number(item.creditTransaction)
                          :
                          ((round2(accountTransactionsItems.reduce((a, c) => a + c.debitTransaction, 0)) / 10) - (round2(accountTransactionsItems.reduce((a, c) => a + c.creditTransaction, 0)) / 10)) + Number(item[accountTransactionsItems.length].debitTransaction) - Number(item[accountTransactionsItems.length].creditTransaction)
                      }
                    </td>
                    <td className='p-0 px-2 text-[13px]'>{item.observationsTransaction}</td>
                    <td className="p-0 text-center">
                      <button onClick={() => removeAccountTransactionTypeHandler(item)}>
                        <XCircleIcon className="h-5 w-5 text-red-700"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </form>
        )}
      </div>
    </div>
  )
}

export default ClientAccountCreateScreen