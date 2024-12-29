import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminLogin() {
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
        console.log(formdata)
        if(!checkValidation()){
            return;
        }

        try{
            const response = await fetch('http://127.0.0.1:8000/admin_login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(formdata)
            })
            if (response.ok){
                toast.success("Login Successful " + formdata.username, {
                    position: toast.POSITION.TOP_CENTER,
                    theme: 'colored'
                  })
                navigate('/admin_dash')
            }else{
                toast.error("Invalid Credentials", {
                    position: toast.POSITION.TOP_CENTER,
                    theme: 'colored'
                })
            }
        }catch(error){

        }
    }
  return (
    <>
        <h2 className='text-center' style={{marginTop:150}}>Admin Login</h2>
    <div className='container shadow' style={{width: '30%', marginBottom: 50, marginTop:50}}>
        <form onSubmit={handleSubmit}>
            
            <div className='form-group p-3'>
                <label>Username</label>
                <input type='text' name="username" className='form-control' onChange={handleInput}></input>
            </div>
            <div className='form-group p-3'>
                <label>Password</label>
                <input type='password' name="password" className='form-control' onChange={handleInput}></input>
            </div>
            <button type='submit' className='btn btn-primary' style={{marginBottom: 20, marginLeft: 100}}>submit</button>
        </form>
        <p style={{paddingBottom:20, paddingLeft:100,}}><b>Don't have an account</b><Link to="/register">Register Here</Link></p>
    </div>
    
    
    </>
  )
}

export default AdminLogin