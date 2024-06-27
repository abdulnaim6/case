"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        "http://103.164.54.252:8000/api/auth/login",
        {
          username,
          password,
        }
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.access);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have successfully logged in!",
        }).then(() => {
          router.push("/adminview");
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid username or password. Please try again.",
      });
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/adminview");
    }
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <h2 className="text-center">Username</h2>
        <input
          className="w-80 h-11 border border-black rounded-md my-2"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
        />
        <h2 className="text-center">Password</h2>
        <input
          className="w-80 h-11 border border-black rounded-md my-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button
          className="bg-gray-700 w-80 h-11 rounded-md mt-4"
          onClick={handleSignIn}
        >
          Sign in
        </button>
      </div>
    </main>
  );
}
