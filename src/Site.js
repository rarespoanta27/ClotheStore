import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import "./Site.css";

const Site = ({ isLoggedIn = false, userName = "", userEmail = "", onLogout, cart, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products for search
  const [error, setError] = useState("");
  const [selectedSizes, setSelectedSizes] = useState({}); // Store selected size for each product
  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data); // Initialize filtered products with all products
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      alert("Please enter a product name to search.");
      setFilteredProducts(products); // Reset to all products if search is empty
      return;
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const goToCart = () => {
    navigate("/cart");
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  return (
    <div className="site">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <h1>ClotheStore</h1>
          <nav className="navbar">
            <a href="#about">About Us</a>
            <a href="#products">Products</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact">Contact</a>
            {isLoggedIn && userEmail === "admin111@yahoo.com" && (
              <Link to="/add-product" className="add-product-link">
                Add Product
              </Link>
            )}
            {isLoggedIn ? (
              <div className="user-actions">
                <span>Welcome, {userName}</span>
                <div className="cart-container" onClick={goToCart}>
                  <FaShoppingCart className="icon" title="Shopping Cart" />
                  <span className="cart-count">{cart.length}</span>
                </div>
                <div className="user-icon-container" onClick={toggleDropdown}>
                  <FaUser className="icon" title="User Profile" />
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <button onClick={onLogout}>Logout</button>
                      <Link to="/account-details">Account Details</Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className="login-link">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Discover Your Style</h2>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>
        Welcome to ClotheStore, your go-to destination for stylish, high-quality, and affordable clothing. We are passionate about helping you express your unique style with our carefully curated collection of apparel for every occasion. At ClotheStore, we believe that fashion should be accessible to everyone. That’s why we offer a diverse range of sizes, from XS to XXL, ensuring the perfect fit for all. Our user-friendly website allows you to browse effortlessly, choose your favorite items, and enjoy a seamless shopping experience. Whether you’re searching for casual wear, formal attire, or the latest trends, we’ve got you covered. With our reliable delivery and excellent customer service, we’re committed to making your shopping journey smooth and enjoyable. ClotheStore – Redefining your wardrobe, one piece at a time.
        </p>
      </section>

      {/* Products Section */}
      <section id="products" className="products">
        <h2>Our Products</h2>
        {error && <p className="error">{error}</p>}
        {filteredProducts.length > 0 ? (
          <div className="product-list">
            {filteredProducts.map((product) => (
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
                {product.sizes && product.sizes.length > 0 && (
                  <div className="size-selector">
                    <label>Select Size:</label>
                    <select
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
                    if (!selectedSizes[product._id]) {
                      alert("Please select a size before adding to cart.");
                      return;
                    }
                    addToCart({ ...product, selectedSize: selectedSizes[product._id] });
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
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <h2>What Our Customers Say</h2>
        <blockquote>
          "The quality of the products is amazing, and the delivery was super
          fast!" - Ilie Pop
        </blockquote>
        <blockquote>
        "ClotheStore offers an amazing collection of clothing at reasonable prices. The product descriptions are accurate, and the images match exactly what you get. I’ve already recommended it to my friends!"-
        Diana Adamescu
        </blockquote>
        <blockquote>
        "The website is well-designed and very user-friendly. I appreciate how smooth the checkout process is and the fact that I can select sizes effortlessly. Shipping was also fast and reliable. Great job!"-
        Luca Bratu
        </blockquote>
        <blockquote>
        "I absolutely love shopping on ClotheStore! The products are of excellent quality, and the variety of sizes available is fantastic. The site is easy to navigate, and I always find what I need. Highly recommend!"-
        Mihai Mihalache
        </blockquote>
        <blockquote>
          "Absolutely love the variety and styles offered by ClotheStore!" -
          Cristian Roman
        </blockquote>
        <blockquote>
        "The site has everything you could want in an online clothing store: stylish options, intuitive navigation, and a seamless shopping experience. I especially love the size selection feature. Will definitely shop again!" -
          Popescu Andrei
        </blockquote>
        <blockquote>
        "I had an issue with my order, but the support team was quick to resolve it. They kept me updated throughout the process. This level of care makes me trust the store even more. Thank you!"-
          Andreea Zaharia
        </blockquote>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 ClotheStore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Site;
