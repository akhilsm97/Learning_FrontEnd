import React, {useEffect, useState} from 'react'
import './css/stud_styles.css';
import Logo from './images/LogoE.png';
import './css/progress.css';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import FetchNotify from './FetchNotify';

function Student(props) {
    const { username } = useParams();
    const [userData, setUserData] = useState({});
    console.log('USERNAME', username)
    const navigate = useNavigate()
    const handleLogout = () => {
        // Perform logout actions
        // Redirect to login page after logging out
        navigate('/logout');
      };

    const backMessage=(username)=>{
        
          navigate('/student_dashboard', { state: { username: username } });
      }
    

      const StudDetails = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/stud_detail/${username}/`);
            setUserData(response.data);
            console.log("RESPONSE DATA", response);
        } catch (error) {
            console.error("Error fetching course materials:", error);
        }
        };
        

        useEffect(() => {
        StudDetails();
        }, [username]);
    
    

    useEffect(() => {
        function percentageToDegrees(percentage) {
          return percentage / 100 * 360;
        }
    
        document.querySelectorAll(".progress").forEach(progress => {
          const value = parseFloat(progress.getAttribute('data-value'));
          const left = progress.querySelector('.progress-left .progress-bar');
          const right = progress.querySelector('.progress-right .progress-bar');
    
          if (value > 0) {
            if (value <= 50) {
              right.style.transform = `rotate(${percentageToDegrees(value)}deg)`;
            } else {
              right.style.transform = 'rotate(180deg)';
              left.style.transform = `rotate(${percentageToDegrees(value - 50)}deg)`;
            }
          }
        });
      }, []);

      console.log('STUD ID', userData.id)

      const [purchaseCount, setPurchaseCount] = useState({});
        const CartCout = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/Purchase_count/${userData.id}/`);
            setPurchaseCount(response.data);
            console.log("RESPONSE DATA", response);
        } catch (error) {
            console.error("Error fetching course materials:", error);
        }
        };
        console.log('EXACT COUNT',purchaseCount.purchase_count)

        useEffect(() => {
        CartCout();
        }, [userData.id]);

        const[purchased, setPurchased] = useState({})

            const Purchase = async () => {
              try {
                  const response = await axios.get(`http://127.0.0.1:8000/course_purchased/${userData.id}/`);
                  setPurchased(response.data);
                  console.log("PURCHAESD DATA", response.data);
              } catch (error) {
                  console.error("Error fetching course materials:", error);
              }
            };
            
            useEffect(() => {
              Purchase();
            }, [userData.id]);

            const [selectedOptions, setSelectedOptions] = useState();
            const [selectedOption2, setSelectedOption2] = useState();
            const [mod, setMod] = useState([]);
            const [fetchedDatas, setFetchedDatas] = useState([]);
            const[course, setCourse] = useState([])
            const[course_name, setCourseName] = useState([])
            const[course_module, setCourseModule] = useState([])
            const[course_question, setCourseQuestion] = useState([])
            const Purchased = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/course_purchased/${userData.id}/`);
                    setCourse(response.data);
                    console.log("PURCHAESD DATA", response.data);
                } catch (error) {
                    console.error("Error fetching course materials:", error);
                }
              };
              
              useEffect(() => {
                Purchased();
              }, [userData.id]); 

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
                  const response = await fetch(`http://127.0.0.1:8000/each_score/${selectedOptions}/${selectedOption2}/${userData.id}/`);
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


              const fetchDataCourse = async (selectedOptions) => {
                
                console.log(selectedOptions)
                try {
                  const response = await fetch(`http://127.0.0.1:8000/course_details/${selectedOptions}/`);
                  const data = await response.json();
                  console.log(data)
                  setCourseName(data);
                  console.log('COURSE DETAILS', course_name)
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
            }
            useEffect(() => {
                if (selectedOptions) {
                    fetchDataCourse(selectedOptions);
                }
              }, [selectedOptions]);

              const fetchDataModule = async (selectedOptions,selectedOption2) => {
                
                console.log(selectedOptions)
                try {
                  const response = await fetch(`http://127.0.0.1:8000/topic_each/${selectedOptions}/${selectedOption2}/`);
                  const data = await response.json();
                  console.log(data)
                  setCourseModule(data);
                  console.log('COURSE Module', course_module)
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
            }
            useEffect(() => {
                if (selectedOptions && selectedOption2) {
                    fetchDataModule(selectedOptions,selectedOption2);
                }
              }, [selectedOptions,selectedOption2]);


              const fetchDataQuestion = async (selectedOptions,selectedOption2) => {
                
                console.log(selectedOptions)
                try {
                  const response = await fetch(`http://127.0.0.1:8000/each_assessment/${selectedOptions}/${selectedOption2}/`);
                  const data = await response.json();
                  console.log(data)
                  setCourseQuestion(data);
                  console.log('COURSE Module', course_module)
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
            }
            useEffect(() => {
                if (selectedOption2) {
                    fetchDataQuestion(selectedOptions,selectedOption2);
                }
              }, [selectedOptions,selectedOption2]);

              


  return (
    <>
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-light shadow-sm " style={{height:90}}>
            <a class="navbar-brand font-weight-bolder" style={{color:'black'}} href="index.html">E-LEARNING</a>
            <button class="btn btn-link btn-sm order-1 order-lg-0" id="sidebarToggle" href="#"><i class="fas fa-bars"></i></button>
         
            <form class="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">
                <div class="input-group">
                    <input class="form-control" type="text" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button"><i class="fas fa-search"></i></button>
                    </div>
                </div>
            </form>
            
            <ul class="navbar-nav ml-auto ml-md-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="userDropdown" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-user fa-fw" style={{color:"white"}}></i></a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" onClick={handleLogout}>Logout</a>
                    </div>
                </li>
            </ul>
        </nav>
    
        <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
            <nav class="sb-sidenav accordion sb-sidenav-light" id="sidenavAccordion">
                <div class="sb-sidenav-menu">
                    <div className='Logo' style={{marginTop:-10}}>
                        <img src={Logo} style={{width:200}}></img>
                        <h5 style={{margin:'-50px 10px 20px 20px'}}>{userData.Stud_name}</h5>
                        <div className='container-fluid'>
                            <div className='row text-center' style={{color:'grey'}}>
                                <div className='col-md-5    '>
                                    <p>{purchaseCount.purchase_count}</p>
                                    <p>Programs</p>
                                </div>
                                <div className='col-md-5'>
                                    <p className='font-weight-bold'>0</p>
                                    <p>Task</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="nav" style={{fontSize:14}}>
                        
                    <a class="nav-link " id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home"  aria-selected="true">
                            <div class="sb-nav-link-icon"><i class="fa fa-tachometer" aria-hidden="true"></i></div>
                            Dashboard
                        </a>

                       

                        <a class="nav-link ml-2 " id="MyCourse-tab" data-toggle="tab" href="#MyCourse" role="tab" aria-controls="MyCourse" aria-selected="false" >
                            <div class="sb-nav-link-icon"><i class="fa fa-tasks" aria-hidden="true"></i></div>
                                My Courses
                        </a>

                        

                        <a class="nav-link ml-2" id="assesTest-tab" data-toggle="tab" href="#assesTest" role="tab" aria-controls="assesTest" aria-selected="false" style={{marginTop:-5}}>
                            <div class="sb-nav-link-icon"><i class="fa fa-tasks" aria-hidden="true"></i></div>
                                Assessment Test
                        </a>
                    
                        
                        

                        


                        <a class="nav-link collapsed" id="notification-tab" data-toggle="tab" href="#notification" role="tab" aria-controls="notification" aria-selected="false" style={{marginTop:-5}}>
                            <div class="sb-nav-link-icon"><i class="fas fa-book-open"></i></div>
                                <p > <i class="fa fa-bell" aria-hidden="true"></i>&nbsp; Notifications</p>
                         
                        </a>

                        
                        


                    

                       
                        <a class="nav-link"  id="assessment-tab" data-toggle="tab" href="#assessment" role="tab" aria-controls="assessment" aria-selected="false">
                                    <div class="sb-nav-link-icon"><i class="fa fa-unlock-alt" aria-hidden="true"></i></div>
                                    Reset Password
                        </a>

                        



                    

                        <a class="nav-link collapsed" href="#" onClick={handleLogout} style={{marginTop:-15}}>
                            <div class="sb-nav-link-icon"><i class="fas fa-book-open"></i></div>
                            <p> <i class="fa fa-sign-out" aria-hidden="true"></i>&nbsp; Logout</p>
                            
                        </a>
                                           
                    </div>
                </div>
                    <div class="sb-sidenav-footer">
                        <div class="small">Logged in as:</div>
                        Adminzzz
                    </div>
            </nav>
        </div>
            <div id="layoutSidenav_content">
            <div class="tab-content" id="myTabContent">
            
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab"> 
                    <h6 className='p-4'>Dashboard</h6>

                    <p className='ml-4 ' style={{fontWeight:900, fontSize:25, color:'#66ccff',fontFamily:'monospace'}}>Haii, E-Learning Certified Intern</p>
                    <div className='container' >
                    <div className='row' >
                        <div className='col-md-4'>
                            <div class="card shadow" style={{width: '18rem' ,borderRadius:20}}>
                                <div class="card-body">
                                    <h3 class="card-title text-center font-weight-bolder" style={{color:'grey'}}>Programs</h3>
                                    <div class="row d-flex justify-content-center ">

                                        <div class="col-md-6">


                                            <h1 className='font-weight-bolder text-center' style={{fontSize:75,color:'grey'}}>{purchaseCount.purchase_count}</h1>
                                           
                                            <hr style={{width:250, marginLeft:-70}} />
                                            <div style={{  display: 'flex', alignItems: 'center' }}>
                                          
                                            <h6>Program Name</h6>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-8' style={{marginLeft:-50}}>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-md-6 p-2'>
                                        
                                        <div class="card shadow" style={{borderRadius:20}} >
                                            <div class="card-body">
                                                <h5 class="card-title" style={{color:'grey'}}>Active : <small><b>{userData.reg_date}</b></small> </h5>
                                             
                                                
                                              
                                            </div>
                                        </div>




                                      
                                    </div>
                                    <div className='col-md-6 p-2'>
                                        <div class="card shadow" style={{borderRadius:20}} >
                                            <div class="card-body">
                                                <h5 class="card-title">Card title</h5>
                                                <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
                                               
                                            </div>
                                        </div>

                                    </div>
                                    <div className='col-md-6 p-2'>
                                        <div class="card shadow" style={{borderRadius:20}} >
                                            <div class="card-body">
                                                <h5 class="card-title">Card title</h5>
                                                <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
                                           
                                            </div>
                                        </div>

                                    </div>
                                    <div className='col-md-6 p-2'>
                                        <div class="card shadow" style={{borderRadius:20}} >
                                            <div class="card-body">
                                                <h5 class="card-title">Card title</h5>
                                                <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
                                           
                                            </div>
                                        </div>
                                    </div>
                                </div>    
                            </div>    
                        </div>
                    </div>
                </div>
                </div>

                <div class="tab-pane fade" id="MyCourse" role="tabpanel" aria-labelledby="MyCourse-tab">
                    <h5 className='font-weight-bolder ml-5 mt-3' style={{fontFamily:'monospace'}}>My Course</h5>
                    <hr />
                    <div className='container mt-5' style={{marginBottom:200}}>

                        <div className='row'>
                        {Array.isArray(purchased) && purchased.length > 0 ? (
                            purchased.map((dataItem, index) => (
                                <div className='col-md-4' key={index}>
                                <div class="card mb-3" style={{width: '18rem' }}>
                                    <img src={dataItem.course_img}  class="img-fluid d-none d-md-block rounded mb-2 shadow "  style={{height:170}}/>
                                    
                                    <div class="card-body">
                                    
                                    <p class="card-text font-weight-bold">{dataItem.course_name}</p>
                                    <p class="card-text font-weight-bold text-muted font-italic fs-6">Purchased on: {dataItem.created_at}</p>
                                    <button className='btn btn-light' onClick={()=>{backMessage(username)}}>Go to course</button>
                                    </div>
                                </div>
                                </div>
                            ))
                            ) : (
                            <p className='font-weight-bolder' style={{fontSize:20, margin: '100px 0 0 400px'}}>No Courses on your wishlist found</p>
                            )}
                        </div>
                    </div>
                </div>


                <div class="tab-pane fade" id="assesTest" role="tabpanel" aria-labelledby="assesTest-tab">
                    <div className='container-fluid p-4' style={{backgroundColor:'#F8F8FF', border:'solid 1px lightgrey'}}>
                        <h2 className='font-weight-bolder'>Assessment Result</h2>
                     </div>

                       <div className='container-fluid p-3 mt-2' style={{ border:'solid 1px lightgrey'}}>
                            <div className='row'>
                                
                                <div className='col-md-6'  >
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
                                <div className='col-md-6'  >
                                    <div className='inner' style={{  display: 'flex', alignItems: 'center',width:'80%'}}>

                                        <label style={{width:'100%'}} >Select Module</label>
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

                        {
                            fetchedDatas.length > 0 ?(
                                <div className='container' style={{width:'70%', marginTop:50}}>
                            
                                  
                           
                            <div className='row shadow-sm p-4' style={{width:'60%', border: 'solid 3px lightgrey'}}>
                                {fetchedDatas.map((item)=>(
                                    <>
                                    <div className='col-xl-12 p-2'>
                                        <h6 className='font-weight-bold'>Course Name&nbsp;: &emsp;{course_name.course_name}</h6>
                                    </div>
                                    <div className='col-xl-12 p-2'>
                                        {
                                            course_module.map((it)=>(
                                                <h6 className='font-weight-bold'>Course Module&nbsp;: &emsp;{it.topic_title}</h6>
                                            ))
                                        }
                                    </div>
                                    <br />
                                    <div className='col-xl-12 p-2'>
                                    {
                                        course_question.map((its)=>(
                                            <h6 className='font-weight-bold'>Total Question&nbsp;: &emsp;{its.total_question}</h6>
                                        ))
                                    }
                                    </div>
                                    
                                    
                                    <div className='col-xl-12 p-2'>
                                        <h6 className='font-weight-bold'>Correct Answer&nbsp;: &emsp;{item.correct_answer}</h6>
                                    </div>
                                    <div className='col-xl-12 p-2'>
                                        <h6 className='font-weight-bold'>Not Attempted&nbsp;: &emsp;{item.unattend}</h6>
                                    </div>
                                    <div className='col-xl-12 p-2'>
                                        <h6 className='font-weight-bold'>Wrong Answer&nbsp;: &emsp;{item.wrong_answer}</h6>
                                    </div>
                                    <div className='col-md-6 p-2'>
                                        <h6 className='font-weight-bolder'>Final Score&nbsp;: &emsp;{item.final_score}</h6>
                                    </div>
                                    <div className='col-md-6 p-2' >
                                        {
                                            item.percent >= 50 ?(
                                                <h6 className='font-weight-bolder' style={{display: 'flex'}}>Result&nbsp;: &emsp;<p className='font-weight-bolder' style={{color:'green'}}>Pass</p></h6>
                                            ):(
                                                <h6 className='font-weight-bolder'>Result&nbsp;: &emsp;<p className='font-weight-bolder' style={{color:'red'}}>Failed</p></h6>
                                            )
                                        }
                                        
                                    </div>
                                    
                                    </>
                                ))}
                            </div>
                        </div>

                            ):(
                                <h4 className='text-center' style={{marginTop:100}}>Assessment Not Yet Taken</h4>
                            )
                        }

                        
                </div>
                <div class="tab-pane fade" id="notification" role="tabpanel" aria-labelledby="notification-tab">
                    <FetchNotify />

                </div>
            </div>
        </div>
    </div>





        


    </>
  )
}

export default Student
