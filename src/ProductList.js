import React, { useEffect, useState } from "react";
import "./ProductList.css";

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [selectedSizes, setSelectedSizes] = useState({}); // To track selected sizes for products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setError("Failed to fetch products.");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error connecting to the server.");
      }
    };

    fetchProducts();
  }, []);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  return (
    <div className="product-list-container">
      <h2>Our Products</h2>
      {error && <p className="error">{error}</p>}
      {products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              {product.image && (
                <img
                  src={`http://localhost:3001${product.image}`}
                  alt={product.name}
                  className="product-image"
                />
              )}
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              {product.description && <p>{product.description}</p>}

              {/* Dropdown for sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="size-selector">
                  <label htmlFor={`size-${product._id}`}>Select Size:</label>
                  <select
                    id={`size-${product._id}`}
                    className="size-dropdown"
                    value={selectedSizes[product._id] || ""}
                    onChange={(e) => handleSizeChange(product._id, e.target.value)}
                  >
                    <option value="" disabled>
                      Choose a size
                    </option>
                    {product.sizes.map((size, index) => (
                      <option key={index} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => {
                  const selectedSize = selectedSizes[product._id];
                  if (!selectedSize) {
                    alert("Please select a size before adding to cart.");
                    return;
                  }
                  addToCart({ ...product, selectedSize });
                }}
                className="add-to-cart-button"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default ProductList;
