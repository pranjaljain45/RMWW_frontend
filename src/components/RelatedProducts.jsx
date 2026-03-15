import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const RelatedProduct = ({ gender, category, subcategory }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!gender || !category || !subcategory) return;

    const fetchRelated = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${gender}/${category}/${subcategory}`
        );
        setRelated(res.data);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    fetchRelated();
  }, [gender, category, subcategory]);

  return (
    <div className="mt-15 mx-8 lg:mx-50" >
      <h2 className="text-3xl text-center pb-5 font-semibold">Related Products</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.length > 0 &&
          related.map((item) => (
            <div key={item.id} className="p-3 hover:shadow-md transition cursor-pointer">

              <Link
                key={item.id}
                to={`/${item.gender}/${item.category}/${item.subcategory}/${item.id}`}
                state={{ product: item }}
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/${item.gender}/${item.category}/${item.subcategory}/${item.imageUrl}`}
                  alt={item.name}
                  className="w-full hover:scale-98 transform ease-in-out"
                />
                <h4 className="pt-3 pb-1 font-medium text-sm">{item.name}</h4>
                <p className="text-gray-600 text-sm font-medium">Rs.{item.price}</p>
              </Link>

            </div>
          ))}

      </div>
    </div>
  );
};

export default RelatedProduct;
