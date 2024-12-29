import React ,{useState, useEffect} from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

function AddFaculty() {

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

    function getDate() {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        const date = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${date}`;
      }
    const [formData, setFormData] = useState({});

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

    formDataImage.append("faculty_name", formData.faculty_name);
    formDataImage.append("email", formData.email);
    formDataImage.append("gender", formData.gender);
    formDataImage.append("phone", formData.phone);
    formDataImage.append("Address_line_1", formData.Address_line_1);
    formDataImage.append("Address_line_2", formData.Address_line_2);
    formDataImage.append("qualification", formData.qualification);
    formDataImage.append("department", formData.department);
    formDataImage.append("username", formData.username);
    formDataImage.append("password", formData.password);
    formDataImage.append('reg_date', getDate())
    formDataImage.append("faculty_img", file);

    setFormData(formDataImage);
    console.log('entered value is '+ formData)
};

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Entered Value is", formData);

    try {
        const response = await axios.post('http://127.0.0.1:8000/create_faculty/', formData);

        if (response.status === 201) {
            toast.success("Faculty Registered Successfully", {
                position: toast.POSITION.TOP_CENTER,
                theme: 'colored'
            });
            e.target.reset();
        }
    } catch (error) {
        console.log('Error occurred:', error);
    }
};

  return (
   <>
    <h2 className='text-center m-2 pb-2 font-weight-bolder'>Add Faculty Here</h2>

                    <div className='container m-3 animate__animated animate__fadeInDown '>
                      <form id="myForm" onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Faculty Name</label>
                                <input type='text' className='form-control font-weight-bolder' name='faculty_name' onChange={handleInput} />
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Faculty Mail Id</label>
                                <input type='mail' className='form-control font-weight-bolder' name="email" onChange={handleInput}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Gender</label>
                                <select className='form-control font-weight-bolder' name="gender" onChange={handleInput}>
                                    <option className='font-weight-bolder' value=''>----- Select Gender ------</option>
                                    <option className='font-weight-bolder' value='Male'>Male</option>
                                    <option className='font-weight-bolder' value='Female'>Female</option>
                                </select>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Faculty Contact No</label>
                                <input type='text' className='form-control font-weight-bolder' name="phone" onChange={handleInput}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>AddressLine 1</label>
                                <textarea className='form-control font-weight-bolder'  name="Address_line_1" onChange={handleInput} ></textarea>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder font-weight-bolder'>AddressLine 2</label>
                                <textarea className='form-control font-weight-bolder' name="Address_line_2" onChange={handleInput} ></textarea>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Qualification</label>
                                <input type='text' className='form-control font-weight-bolder' name="qualification" onChange={handleInput} />
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Department</label>
                                <select className='form-control font-weight-bolder' name="department" onChange={handleInput}>
                                    <option>----Choose Department----</option>
                                    {
                                        data.map((item)=>(
                                            <option value={item.course_enrollment_id}>{item.course_name}</option>
                                        ))
                                    }

                                </select>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Username</label>
                                <input type='text' className='form-control font-weight-bolder' name="username"  onChange={handleInput}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Password</label>
                                <input type='password' className='form-control font-weight-bolder' name="password" onChange={handleInput}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Faculty Image</label>
                                <input type='file' className='form-control font-weight-bolder' name="faculty_img" accept='image/*' onChange={handleInputImage}/>
                            </div>
                        </div>
                        <button type='submit' className='btn btn-primary mt-3'  style={{marginBottom: 20, marginLeft: 480}}>Register Faculty</button>
                        </form>
                    </div>

   </>
  )
}

export default AddFaculty
