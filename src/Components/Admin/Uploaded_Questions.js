
import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import Edit from './images/edit2.png';
import { toast } from 'react-toastify';
import Cross from './images/cross.jpg';
function Uploaded_Questions() {


    const [course, setCourse] = useState([]);
    const [mod, setMod] = useState([]);

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

    useEffect(() => {
        axios
            .get('http://127.0.0.1:8000/create_topic/')
            .then((response) => {
                setMod(response.data);
            })
            .catch((error) => {
                console.error("Error fetching course data:", error);
            });
    }, []); 
            const [selectedOptions, setSelectedOptions] = useState();
            const [selectedOption2, setSelectedOption2] = useState();
            const [fetchedDatas, setFetchedDatas] = useState([]);
            const [q_data, setQ_data] = useState({})
            const [q_datas, setQ_datas] = useState([])
            const [originalData, setOriginalData] = useState({});

            const handleDropdownQChange = (event) => {
                const data_selects = event.target.value;
                setSelectedOptions(data_selects);
                console.log('Selected Data',data_selects)
              };
              const handleDropdownQChanges = (event) => {
                const data_select2 = event.target.value;
                setSelectedOption2(data_select2);
                console.log('Selected Data',data_select2)
              };
              const fetchDataFromApis = async (selectedOptions,selectedOption2) => {
                console.log(selectedOptions)
                console.log(selectedOption2)
                try {
                  const response = await fetch(`http://127.0.0.1:8000/assessment_Q/${selectedOptions}/${selectedOption2}/`);
                  const data = await response.json();
                  console.log(data)
                  setFetchedDatas(data);
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
            }
            useEffect(() => {
                if (selectedOptions && selectedOption2) {
                    fetchDataFromApis(selectedOptions,selectedOption2);
                }
              }, [selectedOptions,selectedOption2]);



              const[questionUpdate, setQuestionUpdate] = useState({})
              const updateQuestion = async (id) => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/Assessment_update/${id}/`);
                    setQuestionUpdate(response.data);
                    console.log("RESPONSE DATA", response);
                } catch (error) {
                    console.error("Error fetching course materials:", error);
                }
            };

            useEffect(() => {
                fetchDataFromApis(selectedOptions, selectedOption2); // Fetch initial data
            }, []);

          
              const handleQuestionChange = (event, fieldName) => {
                const value = event.target.value;
                setQuestionUpdate(prevUpdate => ({
                  ...prevUpdate,
                  [fieldName]: value,
                }));
              }


              const handleQuestionUpdate = async (e, id) => {
                e.preventDefault();
                console.log('UPDATED ID', id)
                const requestData = {
                    ...questionUpdate, // Include only the changed fields
                    // Always include reg_date
                };
            
                console.log("Updated Data:", requestData);
            
                try {
                    // Send PUT request
                    const response = await axios.put(`http://127.0.0.1:8000/Assessment_update/${id}/`, requestData, {
                        headers: {
                            'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
                        },
                    });
            
                    // Handle response
                    console.log("Response:", response.data);
                    updateQuestion(id)
                    fetchDataFromApis(selectedOptions, selectedOption2);
            
                  
            
                    toast.success("Question Updated Successfully", {
                        position: toast.POSITION.TOP_CENTER,
                        theme: 'colored',
                    });
            
                } catch (error) {
                    console.error('Error updating material:', error);
                    // Handle error
                    toast.error("Failed to update material. Please try again later.", {
                        position: toast.POSITION.TOP_CENTER,
                        theme: 'colored',
                    });
                }
            };

            const handleDeleteQ = (id) =>{

                console.log("DELETED ID", id)
                fetch(`http://127.0.0.1:8000/Assessment/${id}/delete/ ` ,
                {method: 'DELETE'})
                .then(()=>{
                    console.log("Deleted")
                    fetchDataFromApis(selectedOptions, selectedOption2);
    
                })
            }
              



  return (
    <>
        <div className='container p-4 mt-2 ' style={{backgroundColor:'#F8F8FF', border:'solid 1px lightgrey'}}>
            <h2 className='font-weight-bolder'>Uploaded Questions</h2>
        </div>

        <div className='container p-3' style={{ border:'solid 1px lightgrey'}}>
            <div className='row'>
                <div className='col-md-2' >
                    <p className='font-weight-bold font-italic'>ASSESSMENTS QUESTIONS</p>
                </div>
                <div className='col-md-5'  >
                    <div className='inner' style={{  display: 'flex', alignItems: 'center',width:'80%'}}>

                        <label style={{width:'100%'}} >Select Course</label>
                        <select className='form-control font-weight-bold' name='course_name' value={selectedOptions} onChange={handleDropdownQChange} style={{width:'100%',marginLeft:-50}}>
                            <option className='font-weight-bold'>----Select Course-----</option>
                            {
                                course.map((items)=>(
                                                        
                                    <option className='font-weight-bold' value={items.course_enrollment_id}>{items.course_name}</option>
                            ))
                            }
                                                
                        </select> 
                    </div>
                </div>
                <div className='col-md-5'  >
                    <div className='inner' style={{  display: 'flex', alignItems: 'center',width:'80%'}}>

                        <label style={{width:'100%'}} >Select Course</label>
                        <select className='form-control font-weight-bold' name='module' value={selectedOption2} onChange={handleDropdownQChanges} style={{marginLeft:-50}} >
                            <option className='font-weight-bold'>-----Select Module-----</option>
                            {
                                mod.map((items)=>(
                                                        
                                    <option className='font-weight-bold' value={items.module}>Module {items.module}</option>
                            ))
                            }
                                                
                        </select> 
                    </div>
                </div>

            </div>
        </div>


        <div class="accordion accordion-flush" id="accordionFlushExample">
                        <div className='row'>
                            {fetchedDatas.map((data, index) => (
                                
                                    <div className='col-md-6 p-4' style={{width:'50%'}}>
                                    <div class="accordion-item p-3  card" key={index} style={{width:'95%',marginLeft:30}}>
                                        <h2 class="accordion-header">
                                            
                                            
                                           

                                                   

                                                            <p class="accordion-button collapsed text-center" data-bs-toggle="collapse" data-bs-target={`#flush-collapse-${index}`} aria-expanded="false" aria-controls={`flush-collapse-${index}`} style={{fontSize:20}}>Question # {data.question_no}</p>
                                                       
                                            
                                        </h2>
                                        <div id={`flush-collapse-${index}`} class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                            <div class="accordion-body  w-80 shadow-sm p-2 mb-5 bg-body-tertiary rounded font-weight-bold" style={{border: 'solid 1px lightgrey'}}>
                                                <div className='row p-3'>
                                                    
                                                   
                                                        <p>{data.question}</p>
                                                        <div className='container'>
                                                            <div className='row'>
                                                                <div className='col-md-6'>
                                                                    <p style={{fontSize:14, textAlign:'left'}}>a. {data.option_1}</p>
                                                                </div>
                                                                <div className='col-md-6'>
                                                                    <p style={{fontSize:14}}>b. {data.option_2}</p>
                                                                </div>
                                                                <div className='col-md-6'>
                                                                    <p style={{fontSize:14}}>c. {data.option_3}</p>
                                                                </div>
                                                                <div className='col-md-6'>
                                                                    <p style={{fontSize:14}}>d. {data.option_4}</p>
                                                                </div>
                                                                <Link to="#" style={{marginLeft:180}} data-toggle="modal" data-target="#myModalQuestion" onClick={()=>updateQuestion(data.id)}><img src={Edit} style={{width:20}}></img></Link>
                                                                <Link to="#" className='ml-3' data-toggle="modal" data-target="#myModalQuestionDelete" onClick={()=>updateQuestion(data.id)}><img src={Cross} style={{width:20}}></img></Link>
                                                            </div>
                                                        </div>
                                                        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                
                            ))}
                            </div>
                        </div>


                        <div  className="modal fade" id="myModalQuestion" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg" style={{width:750}}>
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title " id="exampleModalLabel">Update Question</h4>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                </div>
                                <form onSubmit={(e)=>handleQuestionUpdate(e,questionUpdate.id)}>
                                <div class="modal-body font-weight-bold">
                                
                                    <div className='container'>
                                        <div className='row'>
                                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Course Id:</label>
                                                    <input type='text' className='form-control' name="course_enrollment_id" value={questionUpdate.course_enrollment_id} onChange={(event)=>handleQuestionChange(event, 'course_enrollment_id')} ></input>
                                            </div>
                                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Module:</label>
                                                    <input type='text' className='form-control' name="module" value={questionUpdate.module} onChange={(event)=>handleQuestionChange(event, 'module')} ></input>
                                            </div>
                                            <div className='col-md-12' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Question:</label>
                                                    <textarea type='text' className='form-control' name="question" onChange={(event)=>handleQuestionChange(event, 'question')} value={questionUpdate.question}></textarea>
                                            </div>
                                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Option 1:</label>
                                                    <input type='text' className='form-control' name="option_1" value={questionUpdate.option_1} onChange={(event)=>handleQuestionChange(event, 'option_1')} ></input>
                                            </div>
                                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Option 2:</label>
                                                    <input type='text' className='form-control' name="option_2" value={questionUpdate.option_2}op onChange={(event)=>handleQuestionChange(event, 'option_2')}></input>
                                            </div>
                                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Option 3:</label>
                                                    <input type='text' className='form-control' name="option_3" value={questionUpdate.option_3} onChange={(event)=>handleQuestionChange(event, 'option_3')} ></input>
                                            </div>
                                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Option 4:</label>
                                                    <input type='text' className='form-control'  name="option_4" value={questionUpdate.option_4} onChange={(event)=>handleQuestionChange(event, 'option_4')}></input>
                                            </div>
                                            <div className='col-md-12' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Correct Answer:</label>
                                                    <input type='text' className='form-control' name="correct_answer" value={questionUpdate.correct_answer} onChange={(event)=>handleQuestionChange(event, 'correct_answer')}></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="submit" class="btn btn-primary" >Update Question</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    
                                </div>
                                </form>
                                </div>
                            </div>
                        </div>




                        
                        <div  className="modal fade" id="myModalQuestionDelete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog " >
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title " id="exampleModalLabel">Delete Question</h4>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                </div>
                                
                                <div class="modal-body font-weight-bold">

                                    <p className='font-weight-bolder'>Do you want to delete Question {questionUpdate.question_no} ?</p>
                                    
                                </div>
                                <div class="modal-footer">
                                    <button type="submit" class="btn btn-danger" onClick={()=>handleDeleteQ(questionUpdate.id)}>Delete Question</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    
                                </div>
                               
                                </div>
                            </div>
                        </div>

    </> 
  )
}

export default Uploaded_Questions
