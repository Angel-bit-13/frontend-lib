import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./user/Home";
import Login from "./user/Login";
import SignupPage from "./user/SignupPage";
import Profile from "./user/Profile";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProfile from "./admin/AdminProfile";
import ManageBooks from "./admin/ManageBooks";
import ManageUsers from "./admin/ManageUsers";
import AdminRentals from "./admin/AdminRentals";
import SingleBook from "./user/SingleBook";
import Books from "./user/Books";

const App = () => {
  return (
    <Router>
      <Routes>

       
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/books" element={<Books />} />

        <Route path="/profile" element={<Profile />} />
       <Route path="/book/:id" element={<SingleBook />} />

        {/* ADMIN ROUTE */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<ManageBooks />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/rentals" element={<AdminRentals />} />
        <Route path="/admin/profile" element={<AdminProfile />} />

        {/* FALLBACK ROUTE */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-3xl">
              404 | Page Not Found 😢
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
