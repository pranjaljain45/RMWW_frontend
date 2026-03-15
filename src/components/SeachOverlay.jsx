import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { FaTimes } from 'react-icons/fa';

const ProductImage = ({ product }) => {
    const base = import.meta.env.VITE_BACKEND_URL;
    const url1 = `${base}/images/${product.gender}/${product.category}/${product.subcategory}s/${product.imageUrl}`;
    const url2 = `${base}/images/${product.gender}/${product.category}/${product.subcategory}/${product.imageUrl}`;

    const [src, setSrc] = useState(url1);

    useEffect(() => {
        setSrc(url1);
    }, [product, url1]);

    return (
        <img
            src={src}
            alt={product.name}
            onError={(e) => {
                e.currentTarget.onerror = null;
                if (src !== url2) setSrc(url2);
                else e.currentTarget.src = '/placeholder.png';
            }}
            className="w-full object-cover rounded-md mb-3"
        />
    );
};

const SearchOverlay = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();


    const inputRef = useRef(null);


    useEffect(() => {
        inputRef.current.focus();
    }, []);


    const handleSearch = async (searchTerm) => {
        try {
            const paths = [
                'women/clothing/anarkalis',
                'women/clothing/gowns',
                'women/clothing/indowesterns',
                'women/clothing/lehengas',
                'women/clothing/sarees',
                'women/accessories/bags',
                'women/accessories/banglesbracelets',
                'women/accessories/earrings',
                'women/accessories/necklaces',
                'women/accessories/rings',
                'women/occasions/engagement',
                'women/occasions/mehendi',
                'women/occasions/haldi',
                'women/occasions/sangeet',
                'women/occasions/cocktail',
                'women/occasions/wedding',
                'women/occasions/reception',
                'men/clothing/bandhgalas',
                'men/clothing/kurtapajamas',
                'men/clothing/indowesterns',
                'men/clothing/suits',
                'men/accessories/tiesBowties',
                'men/accessories/necklaces',
                'men/occasions/engagement',
                'men/occasions/mehendi',
                'men/occasions/haldi',
                'men/occasions/sangeet',
                'men/occasions/cocktail',
                'men/occasions/wedding',
                'men/occasions/reception',
            ];

            const requests = paths.map(path =>
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/wear/${path}`)
            );

            const responses = await Promise.allSettled(requests);
            const allProducts = responses
                .filter(res => res.status === 'fulfilled')
                .flatMap(res => res.value.data);

            const filtered = allProducts.filter((item) => {
                const nameMatch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
                const subcategoryMatch = item.subcategory?.toLowerCase().includes(searchTerm.toLowerCase());
                return nameMatch || subcategoryMatch;
            });

            setResults(filtered);
        } catch (error) {
            console.error('Error fetching data:', error);
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
                        onClick={() => navigate('/productDisplay', { state: { product: item } })}
                        className="group w-[250px] cursor-pointer bg-white border border-gray-200 p-4 rounded-lg text-center hover:scale-[0.99] shadow-md hover:shadow-lg transition"
                    >
                        <ProductImage product={item} />
                        <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-2">{item.ownerName}</p>
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
