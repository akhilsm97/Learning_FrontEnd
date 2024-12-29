import React,{useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { toast } from 'react-toastify';
function Stud_profile({ isOpen, username }) {
  function getDate() {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const date = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${date}`;
  }
  const [stud, setStud] = useState([])
  //   useEffect(()=>{
  //     axios
  //     .get(`http://127.0.0.1:8000/stud_details/${username}/`)
  //     .then((response)=>{
  //       setStud(response.data)
  //     })
  //     .catch((error)=>{
  //         console.log("error")
  //     })
  // }, [stud])

    const [datas, setDatas]= useState([])
    useEffect(()=>{
        axios
        .get('http://127.0.0.1:8000/create_course/')
        .then((response)=>{
            setDatas(response.data)
        })
        .catch((error)=>{
            console.log("error")
        })
    }, [datas])

    const [details, setDetails] = useState({});

    const handleAddCart = async (course_enrollment_id) => {
      console.log('Employee id', course_enrollment_id);
    
      try {
        const response = await fetch(`http://127.0.0.1:8000/course_details/${course_enrollment_id}`);
        const res = await response.json();
        setDetails(res);

        const responses = await fetch(`http://127.0.0.1:8000/stud_details/${username}`);
        const result = await responses.json();
        setStud(result);
    
        const formDataImage = new FormData();
        formDataImage.append("course_enrollment_id", res.course_enrollment_id);
        formDataImage.append("stud_reg", result.id);
        formDataImage.append("stud_name", result.Stud_name);
        formDataImage.append("course_name", res.course_name);
        formDataImage.append("price", res.price);
        formDataImage.append("status", res.status);
        formDataImage.append("created_at", getDate());
        formDataImage.append("course_img", res.course_img);
    
        // Displaying all details of formDataImage
        for (const pair of formDataImage.entries()) {
          console.log(pair[0], pair[1]);
        }
    
        const axiosResponse = await axios.post('http://127.0.0.1:8000/cart/', formDataImage);
    
        if (axiosResponse.status === 201) {
          toast.success("Add to Cart Successfully", {
            position: toast.POSITION.TOP_CENTER,
            theme: 'colored'
          });
        }
      } catch (error) {
        console.log('Error occurred:', error);
      }
    };
    const badgeColors = ['orange', 'blue', 'green', 'red'];
    const buttonColors = ['primary', 'secondary', 'success', 'danger'];
  return (
    <>
      <div className='container p-5'>
      <p className='font-weight-bolder'>Courses</p>
        <div className='row'>
            
            {datas.map((items, itemIndex)=>(
                <div className='col-md-4'>
                <div className="card shadow-sm p-3 mb-5 bg-white rounded">
                            <img className="img-fluid" alt="100%x280" src={items.course_img} style={{height:200}}/>
                            <div class="badge-overlay">
                                <span className={`top-left badge ${badgeColors[itemIndex]}`}>Now @  ₹{items.price}</span>
                            </div>
                            <div className="card-body">
                              <h5 className="card-title" style={{fontSize:18}}>{items.course_name}</h5>
                              <div className='row'>
                                <div className='col-md-6'>
                                    <p className="card-text"><Link to="#" className={`btn btn-${buttonColors[itemIndex]}`} onClick={()=>handleAddCart(items.course_enrollment_id)}>Add to Cart</Link></p>
                                </div>
                                <div className='col-md-6'>
                                    <p className="card-text"><Link to={`more_details/${items.course_enrollment_id}/`} className='text-secondary font-weight-bolder' style={{fontSize:14}}>For more details</Link></p>
                                    
                                </div>
                              </div>
                            </div>
                          </div>
            </div>
            ))}

            
            
        </div>
        
      </div>
      <p className='p-3 font-weight-bolder' style={{fontSize:20, marginLeft:130}}>Completed Courses</p>
      <div className='container'>
        <div className='row'>
            <div className='col-md-12'>
                <p className='font-weight-bolder text-center'>No Courses Found </p>
            </div>
        </div>
      </div>
                <Footer />
    </>
  );
}

export default Stud_profile;