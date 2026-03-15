import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const formatCategory = (str) =>
    str ? str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';

const RentWear = () => {
    const { gender, category, subcategory } = useParams();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJsonData = async () => {
            try {
                const path = `${import.meta.env.VITE_BACKEND_URL}/api/products/${gender}/${category}/${subcategory}`;
                const response = await fetch(path);
                if (!response.ok) throw new Error('File not found');
                const data = await response.json();
                setProducts(data);
                setError('');
            } catch (err) {
                console.error(err);
                setError('Unable to load product data');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJsonData();
    }, [gender, category, subcategory]);

    const handleCardClick = (item) => {
        navigate('/productdisplay', { state: { product: item } });
    };

    const firstItem = products[0];

    return (
        <>

            <Navbar />

            <div className="p-10 font-sans">

                {/* Breadcrumb */}
                {firstItem && (
                    <div className="flex items-center gap-2 mb-8 text-gray-600 text-base">
                        <Link to="/" className="font-medium hover:underline">Home</Link>
                        {' / '}
                        <Link
                            to={`/product/${gender}/${category}/${subcategory}`}
                            className="font-medium hover:underline"
                        >
                            {formatCategory(subcategory)}
                        </Link>
                    </div>
                )}



                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="flex flex-wrap justify-center gap-9">
                        {products.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleCardClick(item)}
                                className="w-72 cursor-pointer text-center transition-transform transform hover:scale-104 group"
                            >

                                <div className='mt-2'>
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/images/${gender}/${category}/${subcategory}/${item.imageUrl}`}
                                        alt={item.name}
                                        className="h-4/5 mx-auto rounded-md object-cover"
                                    />


                                    <h2 className="text-lg text-gray-800 mb-1">{item.name}</h2>
                                    <p className="text-gray-600 text-base underline mb-1">{item.ownerName}</p>
                                    <p className="text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"> Rs.{item.price}</p>
                                </div>

                            </div>
                        ))}
                    </div>
                )};

            </div>

            <Footer />

        </>

    );
};

export default RentWear;

