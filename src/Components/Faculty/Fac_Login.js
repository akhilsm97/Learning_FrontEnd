
import React,{useState} from 'react'
import { toast } from 'react-toastify';
import { Link , useNavigate} from 'react-router-dom';
import Brand from '../Students/images/brand2.png';
import Footer from '../HomePage/Footer';

function Fac_Login({ setAuthenticatedUser }) {
    const[formdata, setFormData] = useState({})
    const navigate=useNavigate()
    const handleInput = (e)=>{
        const{name, value} = e.target;
        setFormData({
            ...formdata,
            [name]:value,
        })
    }

    const checkValidation = ()=>{
      const requiredField = ['username', 'password']
      for(const field of requiredField){
          console.log(field)
          console.log(formdata[field])
          if(!formdata[field]){
              toast.warning(`${field.replace('_','')} is required`, {
                  position: toast.POSITION.TOP_CENTER,
                  theme: 'colored',
              });
              return false;
          }
      }
      return true;
  }

    const handleSubmit = async (e) =>{
        e.preventDefault();
  console.log(formdata);

  if(!checkValidation()){
    return;
}

  try {
    // Make an API request to validate user credentials
    const response = await fetch('http://127.0.0.1:8000/faculty_login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata), // Send the entire formdata object
    });

    console.log(response);
    
    const data = await response.json(); // Parse response JSON

    if (response.ok) {
      toast.success("You Logged in as " + formdata.username, {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
      });
      setAuthenticatedUser(formdata.username);
      navigate('/faculty_dashboard', { state: { username: formdata.username } });
      console.log('Login successful');
    } else {
      toast.error("Invalid Credentials!", {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
      });
      console.log('Invalid Credentials!');
      setTimeout(() => {
        window.location.reload(false);
      }, 5000); // 5000 milliseconds (5 seconds)
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
  return (
    <>
    
    <div className='container-fluid pl-3' style={{ marginBottom: 50, marginTop:50, width:'75%'}}>
        <div className='row' style={{border: 'solid 2px lightgrey', width:'100%'}}>
             <div className='col-md-6' >
                <img src={Brand} style={{width:300,margin:'40px 20px 20px 50px'}}></img>
            </div>
            <div className='col-md-6' style={{width:'100%',}}>
                    <h5 className='font-weight-bold pt-3'>Log in to your account</h5>
                    <div className='inner' style={{ width:'75%'}}>
                        <form onSubmit={handleSubmit}>
                        
                        <div className='form-group pt-5'>
                            <label>Email or Phone:</label>
                            <input type='text' name="username" className='form-control' onChange={handleInput}></input>
                        </div>
                        <div className='form-group '>
                            <label>Password</label>
                            <input type='password' name="password" className='form-control' onChange={handleInput}></input>
                        </div>
                        <div className='form-group pt-3'>
                            <button type='submit' className='btn btn-primary' style={{marginBottom: 20,  width:'100%'}}>Submit</button>
                        </div>
                    </form>
                    <p style={{paddingBottom:20, paddingLeft:60,}}>Don't have an account ?&nbsp;<Link to="/register" style={{color:'black'}}><b>Register Here</b></Link></p>
                    </div>
            </div>
        </div>
    </div>
    <Footer />
    </>
  )
}

export default Fac_Login

