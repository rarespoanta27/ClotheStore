import React, { useState } from "react";
import "./AddProduct.css";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState([]);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setSizes((prevSizes) =>
      prevSizes.includes(value)
        ? prevSizes.filter((size) => size !== value)
        : [...prevSizes, value]
    );
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("sizes", JSON.stringify(sizes));
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Product added successfully!");
        setName("");
        setPrice("");
        setDescription("");
        setSizes([]);
        setImage(null);
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to add product.");
      }
    } catch (err) {
      setMessage("Error connecting to the server. Please try again.");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="sizes-selector">
          <label>
            <input
              type="checkbox"
              value="XS"
              checked={sizes.includes("XS")}
              onChange={handleSizeChange}
            />
            XS
          </label>
          <label>
            <input
              type="checkbox"
              value="S"
              checked={sizes.includes("S")}
              onChange={handleSizeChange}
            />
            S
          </label>
          <label>
            <input
              type="checkbox"
              value="M"
              checked={sizes.includes("M")}
              onChange={handleSizeChange}
            />
            M
          </label>
          <label>
            <input
              type="checkbox"
              value="L"
              checked={sizes.includes("L")}
              onChange={handleSizeChange}
            />
            L
          </label>
          <label>
            <input
              type="checkbox"
              value="XL"
              checked={sizes.includes("XL")}
              onChange={handleSizeChange}
            />
            XL
          </label>
          <label>
            <input
              type="checkbox"
              value="XXL"
              checked={sizes.includes("XXL")}
              onChange={handleSizeChange}
            />
            XXL
          </label>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit">Add Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;
