import React, {useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

function Add_Course() {
    function getDate() {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        const date = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${date}`;
      }

      const [data, setData]= useState([])
    useEffect(()=>{
        axios
        .get('http://127.0.0.1:8000/create_faculty/')
        .then((response)=>{
            setData(response.data)
        })
        .catch((error)=>{
            console.log("error")
        })
    }, [data])


    //   -------------------------------------------------------------Count of Course ----------------------------------

    const [totalCount, setTotalCount] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Update the URL with your Django server's address
                const response = await axios.get('http://127.0.0.1:8000/counts/');
                setTotalCount(response.data.course_count);
               
                console.log('Total Course Count',totalCount)
                
            } catch (error) {
                console.error('Error fetching total count:', error);
            }
        };

        fetchData();
    }, []);


    // ----------------------------------------------------------------------Add Course ------------------------------


    const[formData, setFormData] = useState({})
    const [showModal, setShowModal] = useState(false);
    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
            
        });
        console.log('Before'+formData)
    };
    
    const handleInputImage = (e) => {
        const file = e.target.files[0];
        const formDataImage = new FormData();

        formDataImage.append("course_enrollment_id", formData.course_enrollment_id);
        formDataImage.append("course_name", formData.course_name);
        formDataImage.append("course_instructor", formData.course_instructor);
        formDataImage.append("start_date", formData.start_date);
        formDataImage.append("end_date", formData.end_date);
        formDataImage.append("duration", formData.duration);
        formDataImage.append("level", formData.level);
        formDataImage.append("price", formData.price);
        formDataImage.append("status", formData.status);
        formDataImage.append("created_at", getDate());
        formDataImage.append("course_img", file);
    
        setFormData(formDataImage);
        console.log('entered value is '+ formData)
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Entered Value is", formData);
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/create_course/', formData);
    
            if (response.status === 201) {
                toast.success("Course Created Successfully", {
                    position: toast.POSITION.TOP_CENTER,
                    theme: 'colored'
                });
            }
        } catch (error) {
            console.log('Error occurred:', error);
        }
    };
  return (
    <>
     <h3 className='text-center font-weight-bolder p-4'>Add Course Here </h3>
    
    <div className='container-fluid m-4 w-auto' >
                    <div className='container-fluid p-5 animate__animated animate__fadeIn'>
                      <form id="myForm" onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Course Id</label>
                                <input type='text' className='form-control font-weight-bolder' name='course_enrollment_id' value={totalCount + 1} readOnly onChange={handleInput} />
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Course Name</label>
                                <input type='text' className='form-control font-weight-bolder' name='course_name' onChange={handleInput} />
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Course Instructor</label>
                                <select className='form-control font-weight-bolder' name="course_instructor" onChange={handleInput}>
                                    <option className='font-weight-bolder'>----Select Instructor----</option>
                                    {
                                        data.map((item)=>(
                                            <option className='font-weight-bolder' value={item.faculty_name}>{item.faculty_name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Course Duration</label>
                                <input type='number' className='form-control font-weight-bolder' name="duration" onChange={handleInput}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Start Date</label>
                                <input type='date' className='form-control font-weight-bolder' name="start_date" onChange={handleInput}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>End Date</label>
                                <input type='date' className='form-control font-weight-bolder' name="end_date" onChange={handleInput}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Course Level</label>
                                <select className='form-control font-weight-bolder' name="level" onChange={handleInput}>
                                    <option className='font-weight-bolder' value=''>----- Select Level ------</option>
                                    <option className='font-weight-bolder' value='Beginner'>Beginner</option>
                                    <option className='font-weight-bolder' value='Intermediate'>Intermediate</option>
                                    <option className='font-weight-bolder' value='Advanced'>Advanced</option>
                                </select>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Course Price</label>
                                <input type='number' className='form-control font-weight-bolder' name="price" onChange={handleInput}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Course Status</label>
                                <select className='form-control font-weight-bolder' name="status" onChange={handleInput}>
                                    <option className='font-weight-bolder' value=''>----- Select Status ------</option>
                                    <option className='font-weight-bolder' value='Active'>Active</option>
                                    <option className='font-weight-bolder' value='Inactive'>Inactive</option>
                                </select>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Course Image</label>
                                <input type='file' className='form-control font-weight-bolder' name="course_img" accept='image/*' onChange={handleInputImage}/>
                            </div>
                        </div>
                        <button type='submit' className='btn btn-success mt-3'  style={{marginBottom: 20, marginLeft: 300}}>Add Course</button>
                        </form>
                    </div>

    </div>
    
    </>
  )
}

export default Add_Course