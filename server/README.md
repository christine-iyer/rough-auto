# Next Steps

match model variables to front end form fields. 
matched the fields, but still getting 500 error. will discuss with girls tonight.
time to revisit
and again.
Ok so Zalicreated a functioning logout. My first step is going to be to get this as part of the router and tabs. Next I'm going to narrate the mechanic flow once they have an account. So the question will come up...and I think i have to decide if there is an override option. 

11/9 mechanic can comm with client.

will need to rewrite routes in new app.
# List of Mechanics and Mechanic Dashboard FrontEnd

## Features

# To DO. Move front end to newest backend version.

- Mechanic signup and login
- List of mechanics and their services **for customer shopping**, ie, everyone has access.
- Mechanic Dashboard
   - View job requests (pending customer requests. Consider best practices for job bidding requests)
   - Change settings. (Turn notifications on and off)
   - Edit profile. (Change pricing, services, etc)
   - Analytics. (Time from job request to decision, missed jobs, ratings)


# AutoApp Backend

This is the backend for the AutoApp MERN stack project. It provides RESTful API endpoints for user authentication and management using MongoDB Atlas, Express, JWT, and bcrypt.

## Features
- User authentication (signup & login) for three user types: Customer, Mechanic, Admin
- Passwords securely hashed with bcrypt
- JWT-based authentication for protected routes
- MongoDB Atlas cloud database connection
- Separate signup endpoints for each user type

## Endpoints

### Signup
- `POST /api/auth/signup/customer` — Register a new customer
- `POST /api/auth/signup/mechanic` — Register a new mechanic
- `POST /api/auth/signup/admin` — Register a new admin

### Login
- `POST /api/auth/login` — Login for any user type

## User Models
- **Customer:** `customerName`, `email`, `password`, `userType`, `serviceRequests`
- **Mechanic:** `mechanicName`, `email`, `password`, `userType`, `serviceRequests`
- **Admin:** `adminUserName`, `email`, `password`, `userType`

## Setup
1. Clone the repository
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `server` directory with:
   ```env
   MONGO_URI=your-mongodb-atlas-connection-string
   PORT=5001
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```sh
   npx nodemon server.js
   ```

## Testing Endpoints
- Use the provided `AutoApp.postman_collection.json` to test endpoints in Postman.
- Make sure your MongoDB Atlas cluster is running and your IP is whitelisted.
- If you want to run the entire Postman collection, simply run :
```sh
npm install -g newman
```
 and then 

 ```sh
 newman run AutoApp.postman_collectionjson
 ```              

## Notes
- All passwords are hashed before storage.
- JWT tokens are returned on successful signup and login.
- The backend is ready for integration with a React frontend.

---
For any issues, check your MongoDB connection string, ensure your IP is whitelisted in Atlas, and review server logs for errors.
