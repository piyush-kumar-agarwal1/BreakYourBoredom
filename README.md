# 🎬 Break Your Boredom (BYB)

A modern entertainment recommendation platform to help you discover your next favorite movie, series, anime, or book.

![BYB Screenshot](https://placeholder-for-screenshot.png)

## 🚀 Overview

Break Your Boredom is a full-stack application designed to solve the eternal question: "What should I watch or read next?" The platform offers personalized recommendations across multiple entertainment categories, allowing users to discover content based on their preferences, mood, and past likes.

## ✨ Features

### For Users

- **Cross-media Recommendations**: Discover movies, TV series, anime, and books all in one place
- **Personalized Recommendations**: Get content suggestions based on your mood and preferences
- **"Vibe Pick"**: Our special recommendation engine for when you're feeling indecisive
- **Watchlist Management**: Save content to watch or read later
- **Watched History**: Keep track of what you've already consumed
- **Regional Content**: Toggle between global content and India-specific recommendations

### Technical Features

- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Modern Animations**: Smooth transitions and interactive elements using Framer Motion
- **REST API Integration**: Connects with multiple content APIs (TMDB, Google Books, etc.)
- **User Authentication**: Secure login/signup with JWT
- **Dark/Light Mode**: Automatic theme detection with manual override

## 🛠️ Tech Stack

### Frontend

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + ShadcnUI components
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Routing**: React Router
- **HTTP Client**: Axios

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **API Integration**: TMDB API, Google Books API

## 📁 Project Structure

### Frontend

- Located in `/byb-main`
- Includes React components, TypeScript files, and TailwindCSS styling.

### Backend

- Located in `/backend`
- Built with Node.js, Express.js, and MongoDB.

## ⚙️ Configuration

### Environment Variables

- **Frontend**: `.env` file with:
  - `VITE_TMDB_API_KEY`
  - `VITE_API_URL` (backend URL)
  - `VITE_BOOKS_API_KEY`
- **Backend**: `.env` file with:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `NODE_ENV=production`
  - `PORT=8080`

## 🚀 Running the Application

### Frontend

1. Navigate to the frontend directory: `cd byb-main`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. Access the app at: [http://localhost:8080](http://localhost:8080).

### Backend

1. Navigate to the backend directory: `cd backend`.
2. Install dependencies: `npm install`.
3. Start the server: `npm start`.
4. Backend will run at: [http://localhost:5000](http://localhost:5000).

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in an existing user.

### User Management

- `GET /api/user/profile`: Get user profile.
- `PUT /api/user/profile`: Update user profile.

### Media Content

- `GET /api/user/watchlist`: Get user's watchlist items.
- `POST /api/user/watchlist`: Add item to watchlist.
- `DELETE /api/user/watchlist/:id`: Remove item from watchlist.
- `GET /api/user/watched`: Get user's watched items.
- `POST /api/user/watched`: Add item to watched list.
- `DELETE /api/user/watched/:id`: Remove item from watched list.

## 🔥 Deployment

### Frontend Deployment (Vercel)

1. Create a Vercel account and connect your GitHub repository.
2. Configure environment variables:
   - `VITE_TMDB_API_KEY`
   - `VITE_API_URL` (deployed backend URL)
   - `VITE_BOOKS_API_KEY`
3. Deploy the frontend.

### Backend Deployment (Render)

1. Create a Render account and connect your GitHub repository.
2. Add a new Web Service and configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT=8080`
4. Deploy the backend.

## 🎯 Roadmap

- [ ] Implement user reviews and ratings.
- [ ] Add social features (share recommendations, follow friends).
- [ ] Integrate additional content APIs.
- [ ] Enhance recommendation algorithm with machine learning.
- [ ] Add personal statistics and activity history.

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m 'Add some amazing feature'`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- TMDB API for movie and TV series data.
- Google Books API for book data.

## 📸 Screenshots

_Add your application screenshots here._
