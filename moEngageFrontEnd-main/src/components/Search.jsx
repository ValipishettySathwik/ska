import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [filter, setFilter] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const value = e.target.value.trim();
    setFilter(value);

    if (value === '') {
      setFilteredImages([]);
      return;
    }

    let regexPattern = '';
    if (value === '203') {
      regexPattern = '^203$';
    } else if (value === '2xx') {
      regexPattern = '^2\\d\\d$';
    } else if (value === '20x') {
      regexPattern = '^20\\d$';
    } else if (value === '3xx') {
      regexPattern = '^3\\d\\d$';
    } else if (value === '21x') {
      regexPattern = '^21\\d$';
    } else {
      
      regexPattern = `^${value}$`;
    }

    const httpStatusCodes = [
      
      100,101,102,103,200,201,202,203,204,205,206,207,208,218,226,300,301,302,303,304,305,306,307,308,400,401,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,428,429,430,431,440,444,449,450,451,460,463,464,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,520,521,522,523,524,525,526,527,529,530,561,598,599,999
    ];

    const codes = httpStatusCodes.filter(code => new RegExp(regexPattern).test(code.toString()));
    const images = codes.map(code => ({ code, image: `https://http.dog/${code}.jpg` }));
    setFilteredImages(images);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const list = {
      name: filter,
      responseCodes: filteredImages.map(img => img.code),
      images: filteredImages.map(img => img.image)
    };
    try {
      await axios.post('http://localhost:5000/lists', list, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/lists'); 
    } catch (error) {
      console.error('Error saving list:', error);
    }
  };

  return (
    <div className="container">
      <input type="text" value={filter} onChange={handleFilterChange} placeholder="Filter by response code (e.g., 2xx, 20x,30x)" />
      <div className="images-container">
        {filteredImages.map(img => (
          <img key={img.code} src={img.image} alt={`Response code ${img.code}`} />
        ))}
      </div>
      <button onClick={handleSave}>Save List</button>
    </div>
  );
};

export default Search;
