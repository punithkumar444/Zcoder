import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-gray-100 border-b">
      <Link to="/" className="text-lg font-bold">ZCoder</Link>

      <div className="flex gap-4 items-center">
        <Link to="/questions">Questions</Link>
        <Link to="/my-submissions">My Submissions</Link>

        {!user ? (
          <>
            <Link to="/signin" className="hover:underline">Sign In</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </>
        ) : (
          <>
            <button
              className="font-medium hover:underline"
              onClick={() => navigate("/profile")}
            >
              {user.firstName}
            </button>
            <button
              className="text-red-600 font-medium hover:underline"
              onClick={() => {
                logout();
                navigate("/signin");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
