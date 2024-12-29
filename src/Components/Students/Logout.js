import React,{useEffect} from 'react'
import { Navigate} from 'react-router-dom'

function Logout({ clearAuthenticatedUser }) {
    useEffect(() => {
        // Clear authenticated user state when component mounts
        clearAuthenticatedUser();
      }, [clearAuthenticatedUser]);
  return (
    <>
      <Navigate to="/login" />;
    </>
  )
}

export default Logout
