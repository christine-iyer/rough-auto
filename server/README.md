# Next Steps

2/20/26
I am going to get the complete service requesrt function going. `api/service-request/id/complete`
is the route given but that did not work. I'll need to go back and look at the route again. 

2/24/26. I spent 35 minutes trying to make all of the conversions necessary to get react-animated to work with expo-go or at least the browser on the phone. I thought it was important to get the app compatible with the phone so that we can showcase the app on the intended device. But I have spent at least an hour troubleshooting...uninstalling, changing versions, and clearing the cache to no avail. I want to ask Zali if it's worth troubleshooting for her client. If it is then there are 2 potential routes.

1. Look for the most recent version that works on expo-go, and then reverese engineer. 

2. Continue troubleshooting iterations. 


`{
    "actualCost": 250,
    "actualDuration": 3,
    "completionMessage": "Fully passed inspection and stickered as of today."
}`

but 


it looks like the reply from the customer to the mechanic works from the backend postman. 
working with Zali. 
ran through the admin routes on the back end...they all work. i thing summary stats should be calculated from the front end. 
**And now the conversations is in mikes**
will review with mike later. 
**ok now get the survey to get to customer for completion, send back to admin and mechanic for review...**
list all customers and mechanics profiles for better review. accept pending users completed. 
signif progress on conversation. currently working on the rating. 
checking the route and returning unauth.
fixed the backend...now i have to get the conversations to show up on the front side. 
the conversation piece is going strong as far as the mechanic is converned. If the gtoup meets in the next couple days I'll let Zali add to it, otherwise, I'll check myself. 
We got the connection going!

It appears that the customer side is not working. when i create a service request from the UI. it's not syncing. Will discuss with Zali tomorrow. 
Added location settings for mechanic.
today I started work on the appointements page. I want to expand the conversation in accepted services requests so that it is easily readible to the mechanic. I think this might need some research. 
adding profile picture
I debugged over and over...despite Claude suggestions that the supabase project did not exist, i refused to accept it. Turns out the project will auto pause due to inactivity.
service location is its own section now.
added a collapsible section for business information fields in profile.
Today, I'll see if more fields need to be added and will see if the style matches to the static file.
made first and last names editable on the profile page.
translate style im progress
ok. I'm starting to translate the styling. 
need to incorporate mikes code . 
upload page edited and profile corrected. 
lets get the start and end times to work. 
added some pricing data to the profile.
url generator added.
image upload into database working. is only gathering a single image. if a new one is added, the previous one is replaced. 
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
