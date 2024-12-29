import Admin from "./Components/Admin/Admin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import AdminLogin from "./Components/Credentials/Admin/AdminLogin";
import Student from "./Components/Students/Student";
import Register from "./Components/Students/Register";
import Login from "./Components/Students/Login";
import React, {useState} from 'react';
import MoreDetails from "./Components/HomePage/MoreDetails";
import Message from "./Components/Payment/Message";
import StudentDash from "./Components/Students/StudentDash";
import Logout from "./Components/Students/Logout";
import Fac_Login from "./Components/Faculty/Fac_Login";
import FacultyDashboard from "./Components/Faculty/FacultyDashboard";
import Materials from "./Components/Admin/Materials";




function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // Function to clear the authenticated user (logout)
  const clearAuthenticatedUser = () => {
    setAuthenticatedUser(null);
  };
  return (
    <>
    
    <BrowserRouter>
          <Routes>
          <Route
          path="/"
          element={<HomePage  />}
        />
        {!authenticatedUser ? (
          <>
        <Route
          path="/login"
          element={<Login  setAuthenticatedUser={setAuthenticatedUser} />}
          

        />

    <Route
          path="/fac_login"
          element={<Fac_Login  setAuthenticatedUser={setAuthenticatedUser} />}
          

        />
        </>
        ) : (
          <>
          <Route path="student_dashboard/" element={<StudentDash  username={authenticatedUser}
          clearAuthenticatedUser={clearAuthenticatedUser}/>} />
          <Route path="faculty_dashboard/" element={<FacultyDashboard  username={authenticatedUser}
          clearAuthenticatedUser={clearAuthenticatedUser}/>} />
          </>
          )}
            <Route path="admin/" element={<AdminLogin />} />
            <Route path="register/" element={<Register />} />

            <Route path="admin_dash/" element={<Admin />} />
            <Route path="materials/:id/:enroll_id/" element={<Materials />} />

            <Route path="student_dash/:username" element={<Student />} />
            <Route path="more_details/:course_id/" element={<MoreDetails />} />
            <Route path='success/:username' element={<Message setAuthenticatedUser={setAuthenticatedUser}/>} />
            <Route path="/logout" element={<Logout clearAuthenticatedUser={clearAuthenticatedUser} />} />
           

          </Routes>
        </BrowserRouter>
    
    </>
  );
}

export default App;
