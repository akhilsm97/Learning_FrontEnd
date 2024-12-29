import React, {useState, useEffect} from 'react'
import Logo from './Students/images/Logosmall.jpg';
import { Link, useLocation } from 'react-router-dom';
import Banner from './HomePage/Banner';
import CourseDetails from './HomePage/CourseDetails';
import axios from 'axios';

function NavBar({ isAuthenticated ,onLogout, handleLinkClick, activeLink}) {
    const { state } = useLocation();
    const username = state && state.username;
    const [userData, setUserData] = useState({});
    useEffect(() => {
        // Define the first API URL with the username parameter
        const firstApiUrl = `http://127.0.0.1:8000/stud_detail/${username}`;
      
        // Make the first API request
        fetch(firstApiUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data); // Add this line for debugging
            setUserData(data); // Store the first user data object in state
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
          
        // Define the second API URL (replace 'secondUsername' with the actual parameter)
        
          
         
         
      
          // Make the second API request
          
      
      }, [username]);
      console.log('VALID ID IS',userData.id)

      const [cartCount, setCartCount] = useState({});
  useEffect(()=>{
    axios
    .get(`http://127.0.0.1:8000/C_count/${userData.id}`)
    .then((response)=>{
      setCartCount(response.data)
    })
    .catch((error)=>{
        console.log("error")
    })
},)
  return (
    <>
        <nav class="navbar navbar-expand-lg bg-light" style={{height:80}}> 
    <div class="container-fluid">
        <Link class="navbar-brand" href="#"><img src={Logo} style={{width:80}}/></Link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown" style={{marginLeft:300}}>
            <ul class="navbar-nav">
              
                {isAuthenticated ? (
                  <>
                  <li class="nav-item pl-2">
                    <Link className={`nav-link active  ml-3 text-info font-weight-bold ${activeLink === 'home' ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
                    
                </li>
                <li class="nav-item pl-2">
                    <Link class="nav-link active  ml-3 text-info font-weight-bold" aria-current="page"  to="#" onClick={() => handleLinkClick('all-courses', userData.id)}>All Courses</Link>
                </li>
                    <li class="nav-item dropdown pl-2 ">
                      <Link class="nav-link dropdown-toggle ml-3 text-info font-weight-bold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                          My Courses
                      </Link>
                      <ul class="dropdown-menu">
                          <li><Link class="dropdown-item" href="#">Action</Link></li>
                          <li><Link class="dropdown-item" href="#">Another action</Link></li>
                          <li><Link class="dropdown-item" href="#">Something else here</Link></li>
                      </ul>
                  </li>
                  <li class="nav-item pl-2">
                  <Link class="nav-link active  ml-3 text-info font-weight-bold" aria-current="page"  to="#" onClick={() => handleLinkClick('wish')}>Wishlist</Link>
                </li>
                <li class="nav-item pl-2">
                    <Link class="nav-link   ml-3 text-info font-weight-bold" aria-current="page" href="#" onClick={() => handleLinkClick('cart', userData.id)}><i class="fa fa-shopping-cart" aria-hidden="true"></i> <span class="badge">{cartCount.C_count}</span></Link>
                </li>
                
              {/* <span className="navbar-text" style={{marginLeft:100}}>Welcome, {userData.Stud_name} </span> */}
                <li class="nav-item dropdown" style={{marginLeft:100}}>
                        <Link class="nav-link dropdown-toggle ml-3 text-info font-weight-bold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                          Welcome, {userData.Stud_name}
                        </Link>
                        <ul class="dropdown-menu">
                            <li><Link class="dropdown-item" to={`/student_dash/${userData.Stud_name}`}>My Account</Link></li>
                            <li><Link class="dropdown-item" href="#">Another action</Link></li>
                            <li><Link class="dropdown-item" onClick={onLogout}>Logout</Link></li>
                        </ul>
                    </li>
            
            </>
        ) : (
          <>
            <li class="nav-item pl-2">
                    <Link class="nav-link active  ml-3 text-info font-weight-bold" aria-current="page" href="#">Home</Link>
                </li>
                <li class="nav-item pl-2">
                    <Link class="nav-link text-info  ml-3 font-weight-bold" href="#" >Features</Link>
                </li>
                <li class="nav-item pl-2">
                    <Link class="nav-link ml-3 text-info font-weight-bold" href="#">Pricing</Link>
                </li>
            <li className="nav-item pl-2 " >
              <Link className="nav-link ml-3 text-info font-weight-bold" to="/register">Register</Link>
            </li>
            <li className="nav-item pl-2">
              <Link className="nav-link ml-3 text-info font-weight-bold" to="/login">Login</Link>
            </li>
          </>
        )}

            </ul>
        </div>
    </div>
</nav>

    
    </>
  )
}

export default NavBar
