import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Edit from './images/edit2.png';
import Cross from './images/cross.jpg';
import { toast } from 'react-toastify';

function Course_Details() {
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

    // ----------------------------------------------------Paginator-------------------------------------------------

    const[currentPage, setCurrentPage] = useState(1)
        const [searchItem, setSearchItem] = useState('');
        const recordPerPage = 6

        const filterData = data.filter((item) =>
            item.course_name.toLowerCase().includes(searchItem.toLowerCase())
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

        // -----------------------------------------------------------Update ---------------------------------------
        const [update, setUpdate] = useState({})
       
        const [originalData, setOriginalData] = useState({});
        const[formData, setFormData] = useState({})

        const updateDetails = (course_enrollment_id)=>{
        
    
            console.log('Employee id', course_enrollment_id)
            fetch(`http://127.0.0.1:8000/course_details/${course_enrollment_id}/`)
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
                course_img: file,
            });
        };
    
        
        
        const handleSubmit = async (e, id) => {
            e.preventDefault();
            let studImgData = {};
            if (formData.course_img) {
                // If stud_img is not empty, include it in requestData
                studImgData = { course_img: formData.course_img };
            }else{
                studImgData = { course_img: '' }; 
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
                ...studImgData,
                created_at: '', // Always include reg_date
            };
        
            console.log("Updated Data;", requestData);
        
            const response = await axios.put(`http://127.0.0.1:8000/course_update/${id}/`, requestData,{
                headers: {
                    'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
                },
            });
    
          
             
        
            toast.success("Course Updated Successful", {
                position: toast.POSITION.TOP_CENTER,
                theme: 'colored',
            });
        }
    
    // ---------------------------------------------------------Delete -----------------------------------------

    const handleDelete=((id) =>{
        
        fetch(`http://127.0.0.1:8000/course/${id}/delete/ ` ,
            {method: 'DELETE'})
            .then(()=>{
                console.log("Deleted")

            })
        
        }
)

  return (
    <>
        <h3 className='text-center font-weight-bolder p-3'>Course Details</h3>
        

        <div class="container-fluid" >
            <div className='row' style={{ marginLeft:850}}>
                <input type='text' className='form-control' placeholder='Search Here' style={{width:200}} value={searchItem}onChange={(e)=>{ setSearchItem(e.target.value);setCurrentPage(1);}}></input>
            </div>
        </div> 
                               
                <div className='container-fluid mt-3'>
                    <div class="row">
                        {
                            records.map((items)=>(
                                <div class="col-md-4 animate__animated animate__fadeInDown" style={{paddingLeft:10, paddingBottom:15}}>
                                    <div class="card" style={{width:400, height: 245}}>
                                        <div class="row g-0">
                                            <div class="col-md-6">
                                                <img src={items.course_img} class="img-fluid rounded-start img-thumbnail shadow-lg" style={{height:245}} alt="..." />
                                            </div>
                                            <div class="col-md-6" style={{marginLeft:-30}}>
                                                <div class="card-body">
                                                    {}
                                                <h5 class="card-title font-weight-bolder"  style={{fontSize:17,overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap'}}>{items.course_name}</h5>
                                                <p class="card-text mt-3" style={{fontSize:13,overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap'}}><b>Difficulty: {items.level} </b></p>
                                                <p class="card-text mt-3" style={{fontSize:13,overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap'}}><b>Duration: {items.duration} Months</b></p>
                                                <p class="card-text mt-3" style={{overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap'}}><b>Price: ₹{items.price}</b></p>
                                                {items.status === 'Active' ? (
                                                    <>
                                                     <p style={{ display: 'inline', marginRight: '10px' }} className='font-weight-bolder'>Status:</p>
                                                    <p style={{ color: 'green', display: 'inline' }} className='font-weight-bolder'>Active</p>
                                                    
                                                    </>
                                                        
                                                        ): (
                                                            <>
                                                            <p style={{ display: 'inline', marginRight: '10px'  }} className='font-weight-bolder'>Status:</p>
                                                            <p style={{color: 'red', display: 'inline'}} className='font-weight-bolder'>In Active</p>
                                                            </>
                                                    )}
                                                <p class="card-text mt-2" style={{marginLeft: 90}}>
                                                    <a href="#" data-toggle="modal" data-target="#myModalz" onClick={()=>{updateDetails(items.course_enrollment_id)}}><img src={Edit} style={{borderRadius: '50%', width: 20}} /></a>&emsp;
                                                    <a href="#" data-toggle="modal" data-target="#myModalss" onClick={()=>{updateDetails(items.course_enrollment_id)}} ><img src={Cross} style={{borderRadius: '50%', width: 20}} /></a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>

                            ))
                        }
                    </div>

                </div>
                            <nav aria-label="..." className='mt-5' style={{marginLeft:400}}>
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





                            {/* --------------------------------------------------Update Modal---------------- */}

                         

                                                    <div class="modal fade" id="myModalz" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                            <form id="myForm" onSubmit={(e)=>handleSubmit(e, update.course_enrollment_id )}>
                                                                <div className='row'>
                                                                    <div className='col-md-6 pb-2'>
                                                                        <label className='font-weight-bolder'>Course Id</label>
                                                                            <input type='text' className='form-control' name='course_enrollment_id' value={update.course_enrollment_id} onChange={(event)=>handleInputChange(event, 'course_enrollment_id')} />
                                                                                                    </div>
                                                                            <div className='col-md-6 pb-2'>
                                                                                <label className='font-weight-bolder'>Course Name</label>
                                                                                <input type='text' className='form-control' name='course_name' value={update.course_name} onChange={(event)=>handleInputChange(event, 'course_name')} />
                                                                            </div>
                                                                            <div className='col-md-6 pb-2'>
                                                                                <label className='font-weight-bolder'>Course Duration</label>
                                                                                <input type='number' className='form-control' name='duration' value={update.duration} onChange={(event)=>handleInputChange(event, 'duration')} />
                                                                            </div>
                                                                            <div className='col-md-6 pb-2'>
                                                                                <label className='font-weight-bolder'>Course Instructor</label>
                                                                                <input type='text' className='form-control' name="course_instructor" value={update.course_instructor} onChange={(event)=>handleInputChange(event, 'course_instructor')}/>
                                                                            </div>
                                                                            <div className='col-md-6 pb-2'>
                                                                                <label className='font-weight-bolder'>Start Date</label>
                                                                                <input type='date' className='form-control' name="start_date" value={update.start_date} onChange={(event)=>handleInputChange(event, 'start_date')}/>
                                                                            </div>
                                                                            <div className='col-md-6 pb-2'>
                                                                                <label className='font-weight-bolder'>End Date</label>
                                                                                <input type='date' className='form-control' name="end_date" value={update.end_date} onChange={(event)=>handleInputChange(event, 'end_date')}/>
                                                                            </div>

                                                                            <div className='col-md-6 pb-2'>
                                                                                <label className='font-weight-bolder'>Level</label>
                                                                                <select className='form-control font-weight-bolder' name="level" value={update.level} onChange={(event)=>handleInputChange(event, 'level')}>
                                                                                    
                                                                                    <option className='font-weight-bolder' value='Beginner'>Beginner</option>
                                                                                    <option className='font-weight-bolder' value='Intermediate'>Intermediate</option>
                                                                                    <option className='font-weight-bolder' value='Advanced'>Advanced</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className='col-md-6 pb-2'>
                                                                                <label className='font-weight-bolder'>Price</label>
                                                                                <input type='number' className='form-control' name="price" value={update.price} onChange={(event)=>handleInputChange(event, 'price')}/>
                                                                            </div>
                                                                            <div className='col-md-6 pb-2'>
                                                                                <label className='font-weight-bolder'>Course Status</label>
                                                                                <select className='form-control font-weight-bolder' name="status" value={update.status} onChange={(event)=>handleInputChange(event, 'status')}>
                                                                                    
                                                                                    <option className='font-weight-bolder' value='Active'>Active</option>
                                                                                    <option className='font-weight-bolder' value='Inactive'>Inactive</option>
                                                                                </select>
                                                                            </div>

                                                                            <div className='col-md-6 pb-2'>
                                                                                <label className='font-weight-bolder'>Course Image</label><br />
                                                                                <img src={update.course_img} className='img-thumbnail'  style={{width:100, padding:10}}/>
                                                                                <input type='file' className='form-control' name="course_img"    accept='image/*' />
                                                                            </div>
                                                                        </div>
                                                                        <button type='submit' className='btn btn-success mt-3'  style={{marginBottom: 20, marginLeft: 300}}>Update Course</button>
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
   

                                <div class="modal fade" id="myModalss" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Modal Title</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                                <div class="modal-body">

                                                    <p className='font-weight-bolder'> Are you want to delete {update.course_name}</p>
                                                    
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-danger" onClick={()=>{handleDelete(update.course_enrollment_id)}}>Delete</button>
                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>   
                            


        






        

    </>
    
  )
}

export default Course_Details