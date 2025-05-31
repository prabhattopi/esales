# eCommerce Checkout Flow Simulation

This project simulates a 3-page mini eCommerce product purchase journey, including a Landing Page, Checkout Page, and Thank You Page. It demonstrates frontend/backend interactions, dynamic form validations, database operations, transaction handling, and email notification flows.

---

## Live Demo

**(Optional but Preferred)**
* **Hosted Frontend:** [https://esales-fe-gotn.vercel.app/]


## Features

* **Landing Page:** Displays product details, variant and quantity selectors, and a "Buy Now" button.
* **Checkout Page:**
    * Collects customer shipping and payment information.
    * Client-side form validation for all inputs (name, email, phone, address, card details).
    * Dynamic order summary reflecting selections from the landing page.
    * Transaction simulation (Approved, Declined, Gateway Error) based on CVV input.
* **Thank You Page:**
    * Displays unique order number, full order summary, and customer data fetched from the database.
    * Shows different messages based on transaction success or failure.
* **Backend API:** Handles product data retrieval, order creation, and order fetching.
* **Database Integration:** Stores order details in MongoDB. Updates product inventory (mocked).
* **Email Notifications:** Sends order confirmation or transaction failure emails via Mailtrap.io.
* **Responsive Design:** Basic responsiveness with Tailwind CSS.

---

## Tech Stack

* **Frontend:**
    * Vite
    * React.js
    * Tailwind CSS
    * React Router DOM (for routing)
    * Axios (for API calls)
* **Backend:**
    * Node.js
    * Express.js
    * Mongoose (for MongoDB ODM)
    * Nodemailer (for sending emails)
    * CORS, dotenv, uuid
* **Database:**
    * MongoDB (local or Atlas)
* **Email Testing Service:**
    * Mailtrap.io

---
Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18.x or later recommended) & npm (or yarn)
* [Git](https://git-scm.com/)
* [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)
* A [Mailtrap.io](https://mailtrap.io/) account for email testing.

---

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/prabhattopi/esales.git
    cd esales
    ```

2.  **Backend Setup (`backend/`):**
    * Navigate to the server directory:
        ```bash
        cd backend
        ```
    * Create a `.env` file in the `backend/` directory and populate it with your credentials. You can copy `backend/.env.example` if you create one, or use the template below:
        ```env
        # server/.env
        PORT=5001
        MONGO_URI=your_mongodb_connection_string # e.g., mongodb://localhost:27017/ecommerce_db or Atlas string
        MAILTRAP_HOST=sandbox.smtp.mailtrap.io
        MAILTRAP_PORT=2525 # Or other port provided by Mailtrap
        MAILTRAP_USER=your_mailtrap_username
        MAILTRAP_PASS=your_mailtrap_password
        CLIENT_URL=http://localhost:5173 # Default Vite frontend URL
        MAIL_PASS=API_token_pass_key
        ```
    * Install dependencies:
        ```bash
        npm install
        ```

3.  **Frontend Setup (`frontend/`):**
    * Navigate to the client directory (from the root project folder):
        ```bash
        cd client
        ```
    * Create a `.env` file in the `frontend/` directory for the API base URL:
        ```env
        # client/.env
        VITE_API_BASE_URL=http://localhost:5001/api
        ```
        *(This is the default backend URL if running locally. Adjust if your backend runs on a different port or is deployed).*
    * Install dependencies:
        ```bash
        npm install
        ```

---

## Running the Application

1.  **Start the Backend Server:**
    * Open a terminal in the `backend/` directory.
    * Run:
        ```bash
        npm run dev
        ```
    * The backend server should start on the port specified in `backend/.env` (default: `5001`). You should see "MongoDB Connected Successfully" and "Server running on port 5001".

2.  **Start the Frontend Development Server:**
    * Open another terminal in the `frontend/` directory.
    * Run:
        ```bash
        npm run dev
        ```
    * The frontend development server will start, typically on `http://localhost:5173`. Your browser might open automatically.

3.  **Access the Application:**
    Open your web browser and go to `http://localhost:5173` (or the port shown in your client terminal).

---

## Transaction Simulation

To simulate different transaction outcomes on the Checkout Page, use the following logic for the **CVV** field:

* **CVV ending with `1`**: Simulates an **Approved Transaction**.
    * Example CVVs: `121`, `341`, `991`
* **CVV ending with `2`**: Simulates a **Declined Transaction**.
    * Example CVVs: `452`, `672`, `002`
* **CVV ending with `3`**: Simulates a **Gateway Error / Failure**.
    * Example CVVs: `783`, `113`, `553`
* **Any other 3-digit CVV**: Will likely be treated as a Declined or Failed transaction by default as per backend logic.

All other payment fields (Card Number, Expiry Date) need to pass their respective format validations.

---

## Email Testing

* Emails (order confirmation, transaction failure) are sent using **Mailtrap.io**.
---

## API Endpoints (Main)

The backend exposes the following main API endpoints (prefixed with `/api`):

* `GET /product/details`: Fetches mock product information.
* `POST /orders`: Creates a new order, processes payment simulation, and sends an email.
* `GET /orders/:orderNumber`: Fetches details for a specific order (used for the Thank You page).

---

## Contributing

This project is primarily for assessment purposes. Contributions are not expected but feel free to fork and experiment.

---

*This README provides a guide to setting up and running the eCommerce Checkout Flow Simulation. For detailed code comments, please refer to the source files.*
