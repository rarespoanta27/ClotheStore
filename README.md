# ClotheStore - Online Clothing Store

ClotheStore is a full-stack web application designed to provide a seamless online shopping experience. Users can browse, search, and view products, while administrators can manage products and users effortlessly. The application is built using **React** for the frontend, **Node.js** for the backend, and **MongoDB** as the database.

---

## Features

### General Features
- Browse and view a wide range of products.
- Search for products by name.
- Responsive and user-friendly interface.

### User Features
- Register and log in for personalized access.
- View and update account details.
- Change password securely.

### Admin Features
- Add, update, and delete products.
- Manage product images using `Multer`.

---

## Tech Stack

### Frontend
- **React**: For building reusable components and dynamic UI.
- **CSS Modules**: For modular and scoped styles.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing user and product data.

### Additional Tools
- **Multer**: Middleware for file uploads (e.g., product images).
- **Bcrypt**: Library for secure password hashing.
- **CORS**: Middleware for handling cross-origin requests.
- **Fetch API**: For asynchronous client-server communication.

---

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v14+)
- MongoDB (local or cloud-based)
- npm or yarn

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/clothestore.git
   cd clothestore
2. **Install dependencies**
   ```bash
   npm install
3. **Setup MongoDB:** Make sure MongoDB is running. Update the MONGO_URI in the server.js file if necessary:
   ```JavaScript
   const MONGO_URI = "your_mongo_uri_here";
4. **Start the backend server**
   ```bash
   node server.js
5. **Start the frontend**
   ```bash
   npm start
6. **Access the application:** Open http://localhost:3000 in your browser.

## Usage 

### For users
- Register at /register to create an account.
- Log in at /login to access the platform.
- View and update account details on /account-details

### For admins
- Log in with the email admin111@yahoo.com for admin privileges.
- Access /add-product to add or manage products.

## File Structure

### Backend
The server.js file handles:
- User registration and authentication.
- CRUD operations for products.
- Password updates and validations.

### Frontend
- **Pages:** React components like Site, Login, Register, AddProduct, and AccountDetails.
- **Styles:** Modular CSS for component-specific styling.

## Contact
For questions or issues, please contact:

- Name: Poanta Rares
- Email: rarespoanta10@gmail.com
