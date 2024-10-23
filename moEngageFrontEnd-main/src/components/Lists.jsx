import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './lists.css'; // Make sure to import your CSS file

const Lists = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/lists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(data);
    };
    fetchLists();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/lists/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLists(lists.filter((list) => list._id !== id));
  };

  return (
    <div className="list-container">
      <h1>Saved Lists</h1>
      <ul className="list">
        {lists.map((list) => (
          <li key={list._id} className="list-item">
            <Link to={`/lists/${list._id}`} className="list-link">{list.name}</Link>
            <div className="list-actions">
              <Link
                to={`/lists/${list._id}/edit`}
                className="edit-button"
              >
                Edit
              </Link>
              <button onClick={() => handleDelete(list._id)} className="delete-button">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lists;
