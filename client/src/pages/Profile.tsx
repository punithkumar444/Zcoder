// src/pages/Profile.tsx
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const { user } = useAuth();
  const [recentSolved, setRecentSolved] = useState<string[]>([]);
  const [updatedName, setUpdatedName] = useState({ firstName: "", lastName: "",password: ""});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSolved = async () => {
      const res = await fetch("/api/v1/user/solved", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setRecentSolved(data.solvedQuestions);
    };
    fetchSolved();
  }, []);

  const handleUpdate = async () => {
    await fetch("/api/v1/user/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedName),
    });
    alert("Updated!");
    navigate("/questions");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
      <p><strong>First Name:</strong> {user?.firstName}</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Update Info</h3>
        <input
          placeholder="First Name"
          value={updatedName.firstName}
          onChange={(e) => setUpdatedName({ ...updatedName, firstName: e.target.value })}
          className="w-full border p-2 mb-2"
        />
        <input
          placeholder="Last Name"
          value={updatedName.lastName}
          onChange={(e) => setUpdatedName({ ...updatedName, lastName: e.target.value })}
          className="w-full border p-2 mb-2"
        />
         <input
          placeholder="Password"
          value={updatedName.password}
          onChange={(e) => setUpdatedName({ ...updatedName, password: e.target.value })}
          className="w-full border p-2 mb-2"
        />
        <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </div>

      {/* <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Recently Solved Questions</h3>
        <ul className="list-disc ml-6">
          {recentSolved.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default Profile;
