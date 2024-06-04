import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '@heroicons/react/outline';

export default function SearchBox() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : '/search');
    };

    return (
        <form className="mx-auto hidden w-48 justify-center md:flex" onSubmit={submitHandler}>
            <input
                type="text"
                name="q"
                id="q"
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-tr-none rounded-br-none p-1 text-sm focus:ring-0"
                placeholder="search products..."
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