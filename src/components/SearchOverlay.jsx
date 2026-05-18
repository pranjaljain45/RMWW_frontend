import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { FaTimes } from 'react-icons/fa';

const SearchOverlay = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();


    const inputRef = useRef(null);


    useEffect(() => {
        inputRef.current.focus();
    }, []);


    const handleSearch = async (searchTerm) => {
        if (!searchTerm || searchTerm.trim() === '') {
            setResults([]);
            return;
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/search/${encodeURIComponent(searchTerm)}`
            );
            setResults(response.data);
        } catch (error) {
            console.error('Error searching products:', error);
            setResults([]);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-95 z-[9999] flex flex-col items-center px-4 py-6">
            <div className="relative flex justify-center">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search..."

                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                    className="mt-4 text-xl border-0 border-b-2 border-solid border-black focus:outline-none px-2 py-2 w-[80rem] sm:w-[35rem] md:w-[65rem]"

                />



                <button
                    onClick={onClose}
                    className="cursor-pointer absolute right-4 top-4 text-4xl text-black"
                    aria-label="Close"
                >
                    <FaTimes />
                </button>

            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-5 overflow-y-auto w-full">
                {query && results.length === 0 && (
                    <p className="text-center text-xl font-bold text-purple-900 mt-10">
                        Woah! Looks like the weddingwear just ghosted you! <br />
                        Try searching again.
                    </p>
                )}

                {results.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            onClose();
                            navigate(`/product/${item._id}`);
                        }}
                        className="group w-[250px] cursor-pointer bg-white border border-gray-200 p-4 rounded-lg text-center hover:scale-[0.99] shadow-md hover:shadow-lg transition"
                    >
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full object-cover rounded-md mb-3"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Rs.{item.price}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchOverlay;