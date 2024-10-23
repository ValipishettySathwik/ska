import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ListDetail.css';

const ListDetail = () => {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchList = async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/lists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(data);
      setName(data.name);
    };
    fetchList();
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/lists/${id}`, { name, responseCodes: list.responseCodes }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate('/lists');
  };

  const handleDeleteList = async () => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/lists/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate('/lists');
  };

  const handleDeleteItem = (index) => {
    const updatedResponseCodes = list.responseCodes.filter((_, i) => i !== index);
    setList({ ...list, responseCodes: updatedResponseCodes });
  };

 

  if (!list) return <div>Loading...</div>;

  // Check if we are in edit mode
  const isEditMode = window.location.pathname.includes('/edit');

  return (
    <div className="list-detail-container">
      <h1>{name}</h1>
      <div className="images-container">
        {list.responseCodes.map((code, index) => (
          <div key={index} className="image-item">
            <img src={`https://http.dog/${code}.jpg`} alt={`Response code ${code}`} />
            {/* Show delete button for each code in edit mode */}
            {isEditMode && (
              <button onClick={() => handleDeleteItem(index)} className="delete-item-button">Delete</button>
            )}
          </div>
        ))}
      </div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      {isEditMode ? (
        <>
          <button onClick={handleSave}>Save Changes</button>
          <button onClick={handleDeleteList} className="delete-button">Delete List</button>
        </>
      ) : (
        <button onClick={() => navigate('/lists')} className="back-button">Back to Lists</button>
      )}
      
    </div>
  );
};

export default ListDetail;
