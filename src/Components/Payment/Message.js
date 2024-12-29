import React from 'react';
import { Link,  useParams, useNavigate } from 'react-router-dom';

const Message = ({setAuthenticatedUser }) => {

  const { username } = useParams();
  const navigate = useNavigate()

  console.log('Username', username);
  const backMessage=(username)=>{
    setAuthenticatedUser(username);
      navigate('/student_dashboard', { state: { username: username } });
  }

  return (
    <div className="container-fluid">
      <p className="success-message" style={{ padding: 180, fontSize: 25, marginLeft: 200, fontWeight: 'bold' }}>
        Payment Successful. You will receive a notification soon. <button className='btn btn-light' onClick={()=>{backMessage(username)}}>Redirect</button>
      </p>
    </div>
  );
};

export default Message;
