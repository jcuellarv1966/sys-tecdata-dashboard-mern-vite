import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';

export const Store = createContext();

const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,

    cart: Cookies.get('cart')
        ? JSON.parse(Cookies.get('cart'))
        : { cartItems: [], shippingAddress: {}, paymentMethod: "" },

    cartClauses: Cookies.get('cartClauses')
        ? JSON.parse(Cookies.get('cartClauses'))
        : { cartClausesItems: [] },

    accountTransactions: Cookies.get('accountTransactions')
        ? JSON.parse(Cookies.get('accountTransactions'))
        : { accountTransactionsItems: [] },
};

function reducer(state, action) {
    switch (action.type) {
        case 'CART_ADD_ITEM':
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(
                (item) => item.slug === newItem.slug
            );
            const cartItems = existItem
                ? state.cart.cartItems.map((item) =>
                    item.title === existItem.title ? newItem : item
                )
                : [...state.cart.cartItems, newItem];
            Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
            return { ...state, cart: { ...state.cart, cartItems } };

        case 'CART_REMOVE_ITEM': {
            const cartItems = state.cart.cartItems.filter(
                (item) => item._id !== action.payload._id
            );
            Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
            return { ...state, cart: { ...state.cart, cartItems } };
        }

        case 'CART_CLEAR_ITEMS':
            return { ...state, cart: { ...state.cart, cartItems: [] } };

        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };

        case 'USER_SIGNOUT':
            return {
                ...state, userInfo: null, cart: {
                    cartItems: [],
                    shippingAddress: {},
                    paymentMethod: '',
                },
            };

        case 'SAVE_SHIPPING_ADDRESS':
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shippingAddress: action.payload,
                },
            };

        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state,
                cart: { ...state.cart, paymentMethod: action.payload },
            };

        case 'CART_CLAUSE_ADD_ITEM':
            const newItemClause = action.payload;
            const existItemClause = state.cartClauses.cartClausesItems.find(
                (item) => item.slug === newItemClause.slug
            );
            const cartClausesItems = existItemClause
                ? state.cartClauses.cartClausesItems.map((item) =>
                    item.name === existItemClause.name ? newItemClause : item
                )
                : [...state.cartClauses.cartClausesItems, newItemClause];
            Cookies.set('cartClauses', JSON.stringify({ ...state.cartClauses, cartClausesItems }));
            return { ...state, cartClauses: { ...state.cartClauses, cartClausesItems } };

        case 'CART_CLAUSE_REMOVE_ITEM': {
            const cartClausesItems = state.cartClauses.cartClausesItems.filter(
                (item) => item._id !== action.payload._id
            );
            Cookies.set('cartClauses', JSON.stringify({ ...state.cartClauses, cartClausesItems }));
            return { ...state, cartClauses: { ...state.cartClauses, cartClausesItems } };
        }

        case 'CART_CLAUSE_CLEAR_ITEMS':
            return { ...state, cartClauses: { ...state.cartClauses, cartClausesItems: [] } };

        case 'ACCOUNTTRANSACTIONS_ADD_ITEM':
            const newItemAccountTransaction = action.payload;
            const existItemAccountTransaction = state.accountTransactions.accountTransactionsItems.find(
                (item) => item.name === newItemAccountTransaction.name
            );
            const accountTransactionsItems = existItemAccountTransaction
                ? state.accountTransactions.accountTransactionsItems.map((item) =>
                    item.name === existItemAccountTransaction.name ? newItemAccountTransaction : item
                )
                : [...state.accountTransactions.accountTransactionsItems, newItemAccountTransaction];
            // [...state.accountTransactions.accountTransactionsItems, newItemAccountTransaction]
            Cookies.set('accountTransactions', JSON.stringify({ ...state.accountTransactions, accountTransactionsItems }));
            return { ...state, accountTransactions: { ...state.accountTransactions, accountTransactionsItems } };

        case 'ACCOUNTTRANSACTIONS_REMOVE_ITEM': {
            const accountTransactionsItems = state.accountTransactions.accountTransactionsItems.filter(
                (item) => item._id !== action.payload._id
            );
            Cookies.set('accountTransactions', JSON.stringify({ ...state.accountTransactions, accountTransactionsItems }));
            return { ...state, accountTransactions: { ...state.accountTransactions, accountTransactionsItems } };
        }

        case 'ACCOUNTTRANSACTIONS_CLEAR_ITEMS':
            return { ...state, accountTransactions: { ...state.accountTransactions, accountTransactionsItems: [] } };

        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatching] = useReducer(reducer, initialState);
    const value = { state, dispatching };
    return <Store.Provider value={value}>{props.children} </Store.Provider>;
}