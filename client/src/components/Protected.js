import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Protected() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/protected", {
          withCredentials: true,
        });
        setMessage(response.data);
      } catch (error) {
        if (error.response.status === 403) {
          navigate("/login");
        } else {
          console.error("Error fetching protected data:", error);
        }
      }
    };
    fetchProtectedData();
  }, [navigate]);

  return (
    <div>
      <h2>Protected Route</h2>
      <p>{message}</p>
    </div>
  );
}

export default Protected;
