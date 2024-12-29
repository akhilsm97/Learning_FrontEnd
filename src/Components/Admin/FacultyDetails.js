import React, {useState, useEffect} from 'react'
import {toast} from 'react-toastify'
import axios from 'axios';
import Edit from './images/edit2.png';
import Cross from './images/cross.jpg';

function FacultyDetails() {
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


    // -----------------------------------------------Update ---------------------------------------------------
    const [update, setUpdate] = useState({})
    const [showModal, setShowModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const[formData, setFormData] = useState({})
    const updateDetails = (id)=>{

        console.log('Employee id', id)
        fetch(`http://127.0.0.1:8000/faculty_details/${id}/`)
        .then(response=>response.json())
        .then(res=>setUpdate(res))
    }
    const handleInputChange = (event, fieldName)=>{

        const value = event.target.value;

        setUpdate((prevUpdate) =>({
            ...prevUpdate,
            [fieldName] : value,
        }))

    }
    const handleInputImage = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            faculty_img: file,
        });
    };

    
    
    const handleSubmit = async (e, id) => {
        e.preventDefault();
        let facultyImgData = {};
        if (formData.faculty_img) {
            // If stud_img is not empty, include it in requestData
            facultyImgData = { faculty_img: formData.faculty_img };
        }else{
            facultyImgData = { faculty_img: '' }; 
        }
        
        // Compare updated data with original data and include only changed fields
        const changedData = {};
        for (const key in update) {
            if (update.hasOwnProperty(key) && originalData[key] !== update[key]) {
                changedData[key] = update[key];
            }
        }
    
        const requestData  = {
            id: update.id,
            ...changedData, // Include only the changed fields
            ...facultyImgData,
            reg_date: '', // Always include reg_date
        };
    
        console.log("Updated Data;", requestData);
    
        const response = await axios.put(`http://127.0.0.1:8000/faculty_update/${id}/`, requestData,{
            headers: {
                'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
            },
        });

        
         
    
        toast.success("Faculty Updated Successful", {
            position: toast.POSITION.TOP_CENTER,
            theme: 'colored',
        });
    }

    // ----------------------------------------------------Paginator-------------------------------------------------

    const[currentPage, setCurrentPage] = useState(1)
        const [searchItem, setSearchItem] = useState('');
        const recordPerPage = 6

        const filterData = data.filter((item) =>
            item.faculty_name.toLowerCase().includes(searchItem.toLowerCase())
        )

        
        const lastIndex = currentPage * recordPerPage;
        const firstIndex = lastIndex - recordPerPage;
        const records = filterData.slice(firstIndex, lastIndex);
        const npage = Math.ceil(data.length / recordPerPage);
        const numbers = [...Array(npage +1 ).keys()].slice(1)

        function prevPage(){
            if(currentPage !== firstIndex){
                setCurrentPage(currentPage - 1)
            }
        }

        function nextPage(){
            if(currentPage !== lastIndex){
                setCurrentPage(currentPage + 1)
            }
        }

        function changePage(id){
            setCurrentPage(id)
        }


        // ---------------------------------------------------------Delete -----------------------------------------

        const handleDelete=((id) =>{
            fetch(`http://127.0.0.1:8000/faculty/${id}/delete/ ` ,
                {method: 'DELETE'})
                .then(()=>{
                    console.log("Deleted")
    
                })
            
            }
    )
  return (
    <>
    <div className='container p-4 mt-2 ' style={{backgroundColor:'#F8F8FF', border:'solid 1px lightgrey'}}>
            <h2 className='font-weight-bolder'>Faculty Details</h2>
        </div>

        <div class="container " style={{padding: 20}}>
            <div className='row' style={{ marginLeft:850}}>
                <input type='text' className='form-control' placeholder='Search Here' style={{width:200}} value={searchItem}onChange={(e)=>{ setSearchItem(e.target.value);setCurrentPage(1);}}></input>
            </div>
                               
     <div class="row p-5">
        {
            records.map((items)=>(
                <div class="col-sm-4 mb-3 mb-sm-0">
            <div class="card mb-3 " style={{maxWidth: 340, height: 225}}>
                <div class="row g-0">
                  <div class="col-md-6">
                    <img src={items.faculty_img} class="img-fluid rounded-start" style={{height: 225}} alt="..." />
                  </div>
                  <div class="col-md-6" style={{marginLeft:-30}}>
                    <div class="card-body">
                      <h5 class="card-title font-weight-bolder"  style={{fontSize:17,}}>{items.faculty_name}</h5>
                      <p class="card-text mt-3" style={{fontSize:13,overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap'}}><b>{items.email}</b></p>
                      <p class="card-text mt-3" style={{overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap'}}><b>{items.qualification}</b></p>
                      <p class="card-text mt-3" style={{overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap'}}><b>{items.phone}</b></p>
                      <p class="card-text" style={{marginLeft: 40}}><a href="#" data-toggle="modal" data-target="#myModalEdit" onClick={()=>{updateDetails(items.id)}}><img src={Edit} style={{borderRadius: '50%', width: 20}} /></a>&emsp;
                    <a href="#" data-toggle="modal" data-target="#myModalDelete" onClick={()=>{updateDetails(items.id)}} ><img src={Cross} style={{borderRadius: '50%', width: 20}} /></a>
                    </p>
                    </div>
                  </div>
                </div>
              </div>
        </div>

            ))
        }
        
    
    
    </div>

                            <nav aria-label="..." style={{marginLeft:400}}>
                                <ul className="pagination">


                                    <li className="page-item">
                                    <a className="page-link"  onClick={prevPage}>Previous</a>
                                    </li>

                                    {
                                        numbers.map((n,i)=>(
                                            <li className={`page-item ${currentPage ===n ? 'active' : ''}`} key={i}>
                                                <a class="page-link" href="#" onClick={()=>changePage(n)}>{n}</a>
                                                </li>
                                        ))
                                    }
                                
                                    

                                    <li className="page-item">
                                    <a className="page-link" href="#" onClick={nextPage}>Next</a>
                                    </li>
                                </ul>
                            </nav>  

                            </div> 
    

<div class="modal fade" id="myModalEdit" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal Title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                    <div className='container-fluid'>
                      <form id="myForm" onSubmit={(e)=>handleSubmit(e, update.id )}>
                        <div className='row'>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Faculty Name</label>
                                <input type='text' className='form-control' name='Stud_name' value={update.faculty_name} onChange={(event)=>handleInputChange(event, 'faculty_name')} />
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Faculty Mail Id</label>
                                <input type='mail' className='form-control' name="email" value={update.email} onChange={(event)=>handleInputChange(event, 'email')}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Gender</label>
                                <select className='form-control font-weight-bolder' name="gender" value={update.gender} onChange={(event)=>handleInputChange(event, 'gender')}>
                                    <option value=''>----- Select Gender ------</option>
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                </select>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Faculty Contact No</label>
                                <input type='text' className='form-control' name="phone" value={update.phone} onChange={(event)=>handleInputChange(event, 'phone')}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>AddressLine 1</label>
                                <textarea className='form-control'  name="Address_line_1" value={update.Address_line_1} onChange={(event)=>handleInputChange(event, 'Address_line_1')} ></textarea>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>AddressLine 2</label>
                                <textarea className='form-control' name="Address_line_2" value={update.Address_line_2} onChange={(event)=>handleInputChange(event, 'Address_line_2')} ></textarea>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Qualification</label>
                                <input type='text' className='form-control' name="qualification" value={update.qualification} onChange={(event)=>handleInputChange(event, 'qualification')} />
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Department</label>
                                <input type='number' className='form-control' name="department" value={update.department} onChange={(event)=>handleInputChange(event, 'department')}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Username</label>
                                <input type='text' className='form-control' name="username" value={update.username}   onChange={(event)=>handleInputChange(event, 'username')}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Password</label>
                                <input type='password' className='form-control' name="password" value={update.password} onChange={(event)=>handleInputChange(event, 'password')}/>
                            </div>
                            <div className='col-md-6 pb-2'>
                                <label className='font-weight-bolder'>Student Image</label><br />
                                <img src={update.faculty_img} className='img-thumbnail'  style={{width:100, padding:10}}/>
                                <input type='file' className='form-control' name="faculty_img" onChange={handleInputImage} accept='image/*' />
                            </div>
                        </div>
                        <button type='submit' className='btn btn-success mt-3'  style={{marginBottom: 20, marginLeft: 300}}>Update Faculty</button>
                        </form>
                    </div>


                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>   
    


    {/* --------------------------------------------------------------Delete Modal ----------------------------------- */}
   
  

            <div class="modal fade" id="myModalDelete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Delete Student</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">

                            <p className='font-weight-bolder'> Are you want to delete {update.faculty_name}</p>
                            
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" onClick={()=>{handleDelete(update.id)}}>Delete</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>   
  




    </>
  )
}

export default FacultyDetails
