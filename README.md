# 📚 Library Management System - Frontend

A complete **frontend** for a Library Management System built with **vanilla JavaScript, HTML, and CSS**.  
This project interacts with a **RESTful API** to provide students with a seamless experience for browsing books, borrowing, returning, and managing their loans.

---

## ✨ Features

### 🔐 Authentication

- User login with email and password
- JWT token storage in cookies
- Protected routes (authentication required)
- Automatic redirect to login if token is missing or expired
- Logout functionality with token cleanup

### 📊 Dashboard

- Display of user profile (name, avatar)
- Statistics: active loans and available books
- Quick access buttons to key sections
- Data caching for better performance

### 📚 Books Management

- Browse all available books in a grid layout
- Book details: title, author, ISBN, category, available copies
- Borrow functionality for available books
- Smart caching (5-minute cache duration)
- Responsive design for all devices

### 📋 My Loans

- List of all user's book loans
- Loan status: active/returned
- Return book functionality
- Client-side pagination (10 items per page)
- Statistics based on all loans (not just current page)

### 📱 Responsive Design

- Hamburger menu for mobile/tablet devices
- Smooth animations and transitions
- Mobile-friendly navigation
- Adaptive layout for different screen sizes

### ⚡ Performance Optimizations

- LocalStorage caching for API responses
- Efficient re-rendering with pagination
- Debounced event handlers
- Fallback to cached data when API fails

---

## 🛠️ Technical Implementation

### Architecture

- Modular JavaScript (ES6+)
- RESTful API integration
- Client-side routing protection
- Centralized error handling

### API Integration

- **Base URL:** `https://karyar-library-management-system.liara.run/api`
- Authentication with JWT tokens
- Comprehensive error handling
- Loading states for better UX

### Key Functions

- `loginUser()` → Handle user authentication
- `getBooks()` → Fetch all books with caching
- `borrowBook()` → Handle book borrowing
- `getMyLoans()` → Fetch user's loans
- `returnBook()` → Handle book return
- `checkAuthAndRedirect()` → Route protection

### Cache System

- 5-minute cache duration for books data
- Automatic cache invalidation on data changes
- Fallback to cached data when API fails
- Efficient cache management utilities

### Responsive Features

- Mobile-first design approach
- Hamburger menu with smooth animations
- Adaptive grid layouts
- Touch-friendly interface elements

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser with JavaScript enabled
- Access to the backend API

### Installation

1. Clone the repository
2. Open `index.html` in a web browser
3. Use provided credentials to login

### Project Structure

project/

├── css/

│ └── style.css # Main stylesheet

├── js/

│ ├── api.js # API communication

│ ├── auth.js # Authentication utilities

│ ├── utils.js # Helper functions

│ ├── navigation.js # Mobile menu handling

│ ├── dashboard.js # Dashboard functionality

│ ├── books.js # Books page functionality

│ └── my-loans.js # My Loans functionality

├── index.html # Landing page

├── login.html # Login page

├── dashboard.html # Student dashboard

├── books.html # Books browsing page

└── my-loans.html # User loans management

---

## 🎯 Usage

- **Login** → Enter your credentials on the login page
- **Dashboard** → View your statistics and quick access options
- **Browse Books** → Explore available books and borrow them
- **Manage Loans** → View and return your borrowed books
- **Responsive** → Use on desktop, tablet, or mobile devices

---

## 🔧 Technical Details

### Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

### Performance Features

- Efficient DOM manipulation
- Minimal re-renders
- Smart event delegation
- Optimized API calls

### Security Features

- JWT token validation
- Route protection
- XSS prevention
- Secure cookie handling

---

## 📞 Support

For issues or questions regarding the frontend implementation:

- Check the browser console for error messages
- Ensure you have a stable internet connection to access the API

> ⚠️ **Note:** This is a frontend-only implementation that requires a functioning backend API to work properly.
