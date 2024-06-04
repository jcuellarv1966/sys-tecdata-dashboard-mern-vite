import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '@heroicons/react/outline';

export default function SearchPartnerBox() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/searchpartner/?query=${query}` : '/searchpartner');
    };

    return (
        <form className="mx-auto hidden w-64 justify-center md:flex h-min mt-1" onSubmit={submitHandler}>
            <input
                type="text"
                name="q"
                id="q"
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-tr-none rounded-br-none p-1 text-sm focus:ring-0 px-2"
                placeholder="search partners..."
            ></input>
            <button
                className="rounded-tr-[4px] rounded-br-[4px] rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                type="submit"
                id="button-addon2"
            >
                <SearchIcon className="h-4 w-4"></SearchIcon>
            </button>
        </form>
    );
}