import React, { useState, useEffect } from 'react';
import './index.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState({});
  const usersPerPage = 3;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://userbck.onrender.com/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
        setShowDetails(Object.fromEntries(data.map(user => [user.id, false])));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleDetails = (userId) => {
    setShowDetails((prevShowDetails) => ({
      ...prevShowDetails,
      [userId]: !prevShowDetails[userId],
    }));
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    if (pageNumber < 1) {
      setCurrentPage(Math.ceil(users.length / usersPerPage));
    } else if (pageNumber > Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(1);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="user-list ">
      <h1 className='userl'>User List</h1>
      {loading ? (
        <div className='loaderr'>Loading...</div>
      ) : users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <ul>
          {currentUsers.map((user) => (
            <div className="user-card shadow p-3 mb-4 bg-body-tertiary rounded" key={user.id}>
              <div className="box1 shadow p-3 mb-3 bg-body-tertiary rounded">
              <div className="box"><span className='head'><strong>NAME</strong>{user.name}</span></div>
              <div className="box nw1"><span className='head'><strong>USERNAME</strong>{user.username}</span></div>
              <div className="box"><span className='head'><strong>Email</strong>{user.email}</span></div>
              <div className="box n1">
              <button onClick={() => toggleDetails(user.id)}>
                {showDetails[user.id] ? 'Hide Details' : 'Show Details'}
              </button></div>
              </div>

              {showDetails[user.id] && (
                <div className="details-dropdown">
                  <hr />
                <table className='shadow p-3 mb-5 bg-body-tertiary rounded'>
                  <tr>
                  <th>Address:</th>
                  <td>{user.address.city}, {user.address.street}</td>
                  </tr>
                  <tr>
                  <th>ZIPCODE:</th>
                  <td>{user.address.zipcode}</td>
                  </tr>
                  <tr>
                  <th>Phone:</th>
                  <td>{user.phone}</td>
                  </tr>
                  <tr>
                  <th>website:</th>
                  <td>{user.website}</td>
                  </tr>
                  <tr>
                  <th>Company:</th>
                  <td>{user.company.name}</td>
                  </tr>
                  <tr>
                  <th>Catch Phrase:</th>
                  <td>{user.company.catchPhrase}</td>
                  </tr>
                </table>
                </div>
              )}
            </div>
          ))}
        </ul>
      )}
      <div className="pagen">
      <nav aria-label="Page navigation example ">
        <ul className="pagination shadow-lg p-3 mb-5 bg-body-tertiary rounded">
          <li className="page-item">
            <nav className="page-link" href="/" onClick={() => paginate(currentPage - 1)}>
              Previous
            </nav>
          </li>
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
              <nav className="page-link" href="/" onClick={() => paginate(i + 1)}>
                {i + 1}
              </nav>
            </li>
          ))}
          <li className="page-item">
            <nav className="page-link" href="/" onClick={() => paginate(currentPage + 1)}>
              Next
            </nav>
          </li>
        </ul>
      </nav>
      </div>
    </div>
  );
}

export default UserList;