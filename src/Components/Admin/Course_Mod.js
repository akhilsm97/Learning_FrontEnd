import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import Module_Details from './Module_Details';
import { useNavigate } from 'react-router-dom';

function Course_Mod() {

    
    const [course, setCourse] = useState([]);

    useEffect(() => {
        axios
            .get('http://127.0.0.1:8000/course-names/')
            .then((response) => {
                setCourse(response.data);
            })
            .catch((error) => {
                console.error("Error fetching course data:", error);
            });
    }, []); 

    const [data, setData]= useState([])
    useEffect(()=>{
        axios
        .get('http://127.0.0.1:8000/create_course/')
        .then((response)=>{
            setData(response.data)
        })
        .catch((error)=>{
            console.log("error")
        })
    }, [data])


    const [formData, setFormData] = useState({
        course_enrollment_id: '',
        module: '',
        topic_title: '',
        topic_details: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Entered Value is", formData);
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/create_topic/', formData);
    
            if (response.status === 201) {
                toast.success("Course Modules Added Successfully", {
                    position: toast.POSITION.TOP_CENTER,
                    theme: 'colored'
                });
            }
        } catch (error) {
            console.log('Error occurred:', error);
        }
    };


    const navigate = useNavigate()
    const [courses, setCourses] = useState({});

    const handleLinkClick = (id) => {
        fetch('http://127.0.0.1:8000/topic_details/' +id)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                setCourses(data); // Update courses state with fetched data
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
                // Optionally, you can handle the error state here
            });
            
    };
    

    // JSX for rendering your component


    
  return (
    <>
        <p>Data is</p>
        <Module_Details courses = {courses} />



      <h3 className='text-center p-3 font-weight-bolder'>Add Course Module Here</h3>

      
      


                <div className='container-fluid m-4 w-auto' >
                    <div className='container-fluid p-5'>
                      <form id="myForm" onSubmit={handleSubmit}>
                        <div className='row'>
                            
                            <div className='col-md-6 pb-2'>
                            <label htmlFor="course_enrollment_id" className='font-weight-bolder'>Course Name:</label>
                                <select name="course_enrollment_id" className='form-control font-weight-bolder' onChange={handleChange}>
                                    <option className='font-weight-bolder'>-----Select Course</option>
                                    {
                                        course.map((items)=>(
                                            
                                            <option className='font-weight-bold' value={items.course_enrollment_id}>{items.course_name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className='col-md-6 pb-2'>
                                
                                <label htmlFor="module" className='font-weight-bolder'>Module:</label>
                                <select id="module" name="module" onChange={handleChange} className='form-control font-weight-bolder' >
                                    <option className='font-weight-bold' value="">Select Module</option>
                                    <option className='font-weight-bold' value="1">Module 1</option>
                                    <option className='font-weight-bold' value="2">Module 2</option>
                                    <option className='font-weight-bold' value="3">Module 3</option>
                                    <option className='font-weight-bold' value="4">Module 4</option>
                                    <option className='font-weight-bold' value="5">Module 5</option>
                                    <option className='font-weight-bold' value="6">Module 6</option>
                                    <option className='font-weight-bold' value="7">Module 7</option>
                                    <option className='font-weight-bold' value="8">Module 8</option>
                                    <option className='font-weight-bold' value="9">Module 9</option>
                                    <option className='font-weight-bold' value="10">Module 10</option>
                                    {/* Add other module options */}
                                </select>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label htmlFor="topic_title" className='font-weight-bolder'>Topic Title:</label>
                                <input type="text" id="topic_title" name="topic_title" value={formData.topic_title} className='form-control font-weight-bolder' onChange={handleChange}  />
                            </div>
                            <div className='col-md-6 pb-2'>
                            <label htmlFor="topic_details" className='font-weight-bolder'>Topic Details:</label>
                            <input type="text" id="topic_details" name="topic_details" value={formData.topic_details} className='form-control font-weight-bolder' onChange={handleChange} />
                            </div>
                            
                            
                        </div>
                        <button type='submit' className='btn btn-success mt-3'  style={{marginBottom: 20, marginLeft: 480}}>Add Module</button>
                        </form>
                    </div>
                </div>





                <div className='container w-100'>
                    <div className="row">

                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Course Name</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Status</th>
                                <th scope="col">Price</th>
                                <th scope='col'>Modules</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((items)=>(
                                        <tr className='font-weight-bolder'>
                                            <th scope="col">{items.course_enrollment_id}</th>
                                            <td><img src={items.course_img} className='img-thumbnail' style={{width:50, borderRadius:'40%'}} />&nbsp;{items.course_name}</td>
                                            <td>{items.created_at}</td>
                                            {items.status === 'Active' ? (
                                            <td className="font-weight-bolder" style={{color:'green'}}>{items.status}</td>
                                            ): (
                                                <td className="font-weight-bolder" style={{color:'red'}}>{items.status}</td>
                                                )}
                                            <td>₹{items.price}</td>
                                            <td><a className='btn btn-warning font-weight-bold ' id="course_module-tab" data-toggle="tab" href="#course_module" role="tab" aria-controls="course_module" aria-selected="false"  onClick={() => handleLinkClick(items.course_enrollment_id)} >Modules</a></td>

                                                
                                            
                                            </tr>
                                    ))
                                }
                                
                                
                            </tbody>
                        </table>
                    </div>
                </div>

    
    </>
  )
}

export default Course_Mod