# Travel Planner

A full‑stack AI travel planning application where users can create accounts, log in securely, browse destinations, generate personalized trip plans with AI, save trips to favourites, and book trips from their wishlist. Built with a React frontend, Express/Node backend, and MongoDB database.

---

## Demo Link

[Live Demo](https://travel-frontend-rose.vercel.app/)

---

## Login

> **Guest** <br>
> Username: `vicky` <br>
> Password: `vicky`

---

## Quick Start

```
git clone <https://github.com/vickykumar3510/travelFrontend.git>
cd travelFrontend
npm install
npm run dev
```
---

## Technologies

- React JS
- React Router
- Node JS
- Express
- MongoDB
- JWT
- bcryptjs
- openai

---

## Demo Video

Watch a walkthrough (2-3 minutes) of all the major features of this app: [Google Drive Link](https://drive.google.com/file/d/16Iy4EPF03UrQy38bGSxnXu0wK0WZB8ES/view?usp=sharing)

---

## Features

**Login**

- User login form with username and password fields
- Error toast shown on incorrect credentials
- Successful login stores JWT token and redirects to home page
- Protected routes require authentication

**Sign Up**

- User account creation form with username and password
- Success toast shown on account creation
- Navigation link back to Login page
- Redirects to login after successful signup

**Home**

- Welcome section describing AI‑powered travel planning
- Navigation to all major app sections via header

**Destinations**

- Displays list of all travel destinations from the backend
- Each card shows destination name, city, country, duration, and estimated budget
- View full details: top attractions, day‑wise itinerary, and local tips
- Add destinations to favourites directly from list or detail panel

**AI Planner**

- Text prompt input to describe a dream trip (destination, days, budget, preferences)
- Generates a complete travel plan via AI (destination, itinerary, attractions, tips, budget)
- Loading state while plan is being generated
- Add AI‑generated plans to favourites for later booking

**Favourites**

- Displays all saved trips (from destinations or AI planner)
- Per‑user favourites stored in localStorage
- View full trip details in detail panel
- Remove trips from favourites
- Buy Now moves trip to orders and removes from favourites

**My Orders**

- Displays all booked trips with order date
- Per‑user orders stored in localStorage
- View complete trip details including itinerary and local tips
- Empty state when no trips have been booked yet

**Header & Navigation**

- Shows signed‑in username greeting
- Live counts for favourites and orders in navigation
- Logout clears session and redirects to login

---

## API Reference

**POST /auth/signup**<br>
Register new user<br>

Sample Response:

```
{ message }
```

**POST /auth/login**<br>
Login user<br>

Sample Response:

```
{ token, username }
```

**GET /destinations**<br>
List all travel destinations<br>

Sample Response:

```
[{ _id, destination, city, country, days, budget: { estimated }, topAttractions, itinerary: [{ day, activities }], localTips }]
```

**POST /api/ai/travel-plan**<br>
Generate AI travel plan from user prompt<br>

Sample Response:

```
{
  answer: "{ destination, city, country, days, budget, topAttractions, itinerary, localTips }"
}
```
---

## Contact

For bugs or feature requests, please reach out to vicky.kumar3510@gmail.com
