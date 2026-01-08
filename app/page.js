"use client";

import { useState } from "react";

import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    email: "pk@pk",
    password: "123456",
  });

  function handleChange(e) {
    const v = e.target.value;
    setFormData({ ...formData, [e.target.name]: v });
  }

  function handleLoginClick() {
    axios.postForm("https://pkotowski.pythonanywhere.com/login", formData).then(
      (response) => {
        let message = response.data.message;
        if (message === "OK") {
          setUser(response.data.user);
          setError(null);
        } else {
          setError("Login failed");
        }
      },
      (error) => {
        setError("Connection error: " + error.message);
      }
    );
  }


  async function handlePostsClick() {
    axios
      .get("https://jsonplaceholder.typicode.com//posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-900 mb-8 text-center">
          Ala ma kota
        </h1>

        {/* Formularz logowania */}
        {!user && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Password1:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleLoginClick}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-md"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {/* Wyświetlanie danych zalogowanego użytkownika */}
        {user && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Logged in User</h2>
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-700"><strong>Name:</strong> {user.name || 'N/A'}</p>
              {user.id && <p className="text-gray-700"><strong>ID:</strong> {user.id}</p>}
            </div>
            <button
              onClick={() => setUser(null)}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer shadow-md"
            >
              Logout
            </button>
          </div>
        )}
        
        <div className="flex gap-4 mb-8 justify-center">
          <Link 
            href="/login" 
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Move to Login page
          </Link>
          <button 
            onClick={handlePostsClick} 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer shadow-md"
          >
            Load Posts
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {posts.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Posts</h2>
            <ul className="space-y-3">
              {posts.map((post) => (
                <li 
                  key={post.id} 
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border-l-4 border-indigo-500"
                >
                  <span className="font-medium text-gray-700">{post.id}.</span> {post.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
