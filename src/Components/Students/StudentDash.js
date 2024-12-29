import React, {useState, useEffect} from 'react'
import Logo from '../Students/images/Logosmall.jpg';
import { Link, useLocation , useNavigate} from 'react-router-dom';
import './css/dash.css';
import './css/assess.css';
import './css/progress.css';

import axios from 'axios';
import Stud_profile from '../HomePage/Stud_profile';
import Footer from '../HomePage/Footer';
import { toast } from 'react-toastify';
import { API_URL } from '../Payment/config';
import Course from '../Students/images/course.png';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function StudentDash({ username, clearAuthenticatedUser }) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle click event on "All Courses" link
  
 
    const [userData, setUserData] = useState({});
    const navigate = useNavigate()

  const handleLogout = () => {
    // Perform logout actions
    // Redirect to login page after logging out
    navigate('/logout');
  };
    useEffect(() => {
        // Define the first API URL with the username parameter
        const firstApiUrl = `http://127.0.0.1:8000/stud_detail/${username}/`;
      
        // Make the first API request
        fetch(firstApiUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data); // Add this line for debugging
            setUserData(data); // Store the first user data object in state
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
         
    },[]);
    
    useEffect(() => {
        console.log('VALID ID IS', userData.id);
    }, [userData.id]);

// ---------------------------------------------------------------------All Course ----------------------------------------------------------
function getDate() {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const date = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${date}`;
  }
  

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
    const [stud, setStud] = useState([])
    const handleAddCart = async (course_enrollment_id) => {
        console.log('Card id', course_enrollment_id);
      
        try {
          const response = await fetch(`http://127.0.0.1:8000/course_details/${course_enrollment_id}/`);
          const res = await response.json();
          setDetails(res);
          console.log('Course Details', res)

          const responses = await fetch(`http://127.0.0.1:8000/stud_detail/${username}/`);
          const result = await responses.json();
          setStud(res);
          console.log('Student Details', result)
  
          
      
          const formDataImage = new FormData();
          formDataImage.append("course_enrollment_id", res.course_enrollment_id);
          formDataImage.append("stud_reg", result.id);
          formDataImage.append("stud_name", result.Stud_name);
          formDataImage.append("username", result.username);
          formDataImage.append("course_name", res.course_name);
          formDataImage.append("price", res.price);
          formDataImage.append("status", 'Inactive');
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
            fetchData();
            CartCout();
            CartItems();
          }
        } catch (error) {
          console.log('Error occurred:', error);
        }
      };
    const badgeColors = ['orange', 'blue', 'green', 'red','violet'];
    const buttonColors = ['primary', 'secondary', 'success', 'danger','primary', 'secondary', 'success', 'danger'];
// --------------------------------------------------------------------------------Cart ------------------------------------------------------
  
const [cartItems, setCartItems]= useState({})
const CartItems = async () => {
  try {
      const response = await axios.get(`http://127.0.0.1:8000/cart_details/${userData.id}/`);
      setCartItems(response.data);
      console.log("RESPONSE DATA", response);
  } catch (error) {
      console.error("Error fetching course materials:", error);
  }
};

useEffect(() => {
  CartItems();
}, [userData.id]);

const [cartCount, setCartCount] = useState({});
const CartCout = async () => {
  try {
      const response = await axios.get(`http://127.0.0.1:8000/C_count/${userData.id}/`);
      setCartCount(response.data);
      console.log("RESPONSE DATA", response);
  } catch (error) {
      console.error("Error fetching course materials:", error);
  }
};

useEffect(() => {
  CartCout();
}, [userData.id]);

const [cartTotal, setCartTotal] = useState({});
const fetchData = async () => {
  try {
      const response = await axios.get(`http://127.0.0.1:8000/C_total/${userData.id}/`);
      setCartTotal(response.data);
      console.log("RESPONSE DATA", response);
  } catch (error) {
      console.error("Error fetching course materials:", error);
  }
};

useEffect(() => {
  fetchData();
}, [userData.id]);

const [getData, setGetData] = useState({})
const getDetails=(id)=>{
  console.log('Clicked ID',id)
fetch(`http://127.0.0.1:8000/Cart_Detail/${id}/`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        
    })
    .then(data => {
      setGetData(data); // Update courses state with fetched data
    })
    .catch(error => {
        console.log('Error fetching courses:', error);
        // Optionally, you can handle the error state here
    });
};

const handleDeleteCart = async (id) => {
  console.log('Deleted',id  )
  try {
      await fetch(`http://127.0.0.1:8000/Cart/${id}/delete/`, {
          method: 'DELETE'
      });
      console.log("Deleted");
      fetchData();
      CartCout();
      CartItems();
      WishItems(); // Update wish list items
  } catch (error) {
      console.error('Error handling delete and updating wishlist:', error);
      // Handle error
  }
}
const number = 35

const handleAddWishList = async (course_enrollment_id)=>{
  console.log('WISHLIST ID', course_enrollment_id)
  try {
    const response = await fetch(`http://127.0.0.1:8000/course_details/${course_enrollment_id}/`);
    const res = await response.json();
    setDetails(res);
    console.log('Course Details', res)

    const responses = await fetch(`http://127.0.0.1:8000/stud_detail/${username}/`);
    const result = await responses.json();
    setStud(res);
    console.log('Student Details', result)

    

    const formDataImage = new FormData();
    formDataImage.append("course_enrollment_id", res.course_enrollment_id);
    formDataImage.append("stud_reg", result.id);
    formDataImage.append("stud_name", result.Stud_name);
    formDataImage.append("course_name", res.course_name);
    formDataImage.append("price", res.price);
    formDataImage.append("status", res.status);
    formDataImage.append("wishlist_status", 0);
    formDataImage.append("created_at", getDate());
    formDataImage.append("course_img", res.course_img);

    // Displaying all details of formDataImage
    for (const pair of formDataImage.entries()) {
      console.log(pair[0], pair[1]);
    }

    const axiosResponse = await axios.post('http://127.0.0.1:8000/create_wishList/', formDataImage);

    if (axiosResponse.status === 201) {
      toast.success("Added to Wishlist", {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored'
      });
      WishItems();
    }
  } catch (error) {
    console.log('Error occurred:', error);
  }

}

const [wishItems, setWishItems]= useState({})
const WishItems = async () => {
  try {
      const response = await axios.get(`http://127.0.0.1:8000/wishlist_details/${userData.id}/`);
      setWishItems(response.data);
      console.log("RESPONSE DATA", response);
  } catch (error) {
      console.error("Error fetching course materials:", error);
  }
};

useEffect(() => {
  WishItems();
}, [userData.id]);


const[wishListToCart, setWishListToCart] = useState({})
const WishListToCart = async (id)=>{
  console.log('WISHLIST ID', id)
  fetch(`http://127.0.0.1:8000/wishList/${id}/` )
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                      setWishListToCart(data); // Set initial state with fetched data
                      console.log(data)
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        // Handle error
                    });

                    


                    const requestData = {
                      ...wishListToCart, // Include only the changed fields
                      wishlist_status: 1, // Always include reg_date
                  };
                 

                  try {
                    // Send PUT request
                    const response = await axios.put(`http://127.0.0.1:8000/wishList_update/${id}/`, requestData, {
                        headers: {
                            'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
                        },
                    });
                    WishItems();
                  } catch (error) {
                    console.error('ERROR IN CHANGING WISHLIST STATUS', error);
                    // Handle error
                    
                }
                console.log('TYPE',typeof(wishListToCart.course_enrollment_id))
                try {

                  const formDataImage = new FormData();
                  formDataImage.append("course_enrollment_id", wishListToCart.course_enrollment_id);
                  formDataImage.append("stud_reg", wishListToCart.stud_reg);
                  formDataImage.append("stud_name", wishListToCart.Stud_name);
                  formDataImage.append("username", wishListToCart.username);
                  formDataImage.append("course_name", wishListToCart.course_name);
                  formDataImage.append("price", wishListToCart.price);
                  formDataImage.append("status", 'Inactive');
                  formDataImage.append("created_at", getDate());
                  formDataImage.append("course_img", wishListToCart.course_img);
              
                  // Displaying all details of formDataImage
                  for (const pair of formDataImage.entries()) {
                    console.log(pair[0], pair[1]);
                  }
              
                  const axiosResponse = await axios.post('http://127.0.0.1:8000/cart/', formDataImage);
              
                  if (axiosResponse.status === 201) {
                    toast.success("Added to Cart", {
                      position: toast.POSITION.TOP_CENTER,
                      theme: 'colored'
                    });
                    
                    fetchData();
                    CartCout();
                    CartItems();
                  }
                } catch (error) {
                  console.log('Cart Error occurred:', error);
                }


                

            };

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

            const [course, setCourse] = useState({});
            const [moduleDetails, setModuleDetails] = useState([]);
            const[classCount, setClassCount] = useState([])
            const[totalClass, setTotalClass] = useState({})
            const[totalWatchedClass, setTotalWatchedClass] = useState({})

            const handleCourseDetails = (id) => {
              console.log("COURSE ENROLL ID", id);
              setIsLoggedIn(true)

              fetch(`http://127.0.0.1:8000/totalVideo_count/${id}/`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Set course details state
                      setTotalClass(data);
                      fetchClass();
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                  });

                  fetch(`http://127.0.0.1:8000/totalWatch/${userData.id}/${id}/`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Set course details state
                      setTotalWatchedClass(data);
                      fetchClass();
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                  });
              
          
              // Fetch course details
              fetch(`http://127.0.0.1:8000/course_details/${id}/`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Set course details state
                      setCourse(data);
                      fetchClass();
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                  });


                  fetch(`http://127.0.0.1:8000/topic_details/${id}/`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Set course details state
                      setModuleDetails(data);
          
                      // Fetch module details after setting course details
          
                      // Fetch class count after setting course details
                      fetchClass();
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                  });

                  
          };
          const percent = ((totalWatchedClass.watch_total / totalClass.total) * 100).toFixed(2);
          
          
          const fetchClass = async () => {
              try {
                  const response = await axios.get(`http://127.0.0.1:8000/course-materials/count/`);
                  setClassCount(response.data);
              } catch (error) {
                  console.error("Error fetching class count:", error);
              }
          };


            // ------------------------------------------------------------------------------------------Module Details---------------------------------------------------
            const[moduleContent, setModuleContent] = useState([])

            const videoContent = (course_enrollment_id, module)=>{
              console.log('Course Enroll Id', course_enrollment_id )
              console.log('Module', module)

              fetch(`http://127.0.0.1:8000/course_materials/${course_enrollment_id}/${module}/`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Set course details state
                      setModuleContent(data);
                      fetchClass();
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                  });
            }
            
            const[link,setLInk] = useState(false)
            const[videoContents, setVideoContents] = useState([])
            const[singleVideo, setSingleVideo] = useState([])
            const[courseModule, setCourseModule] = useState([])
            const [AssessmentFound, setAssessmentFound] = useState();
           

            const watchVideo = (course_enrollment_id, module,id)=>{
              console.log('Course Enroll Id', course_enrollment_id)
              console.log('Module', module)
              fetch(`http://127.0.0.1:8000/course_materials/${course_enrollment_id}/${module}/`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Set course details state
                      setVideoContents(data);
                      setLInk(true)
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                  });

                  fetch(`http://127.0.0.1:8000/course_mat_video/${course_enrollment_id}/${module}/${id}/`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Set course details state
                      setSingleVideo(data);
                      fetchClass();
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                  });
                  console.log('VIDEO CONTENT',singleVideo)  


                  fetch(`http://127.0.0.1:8000/course_module/${course_enrollment_id}/${module}/`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Set course details state
                      setCourseModule(data);
                      setLInk(true)
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                  });

                  fetch(`http://127.0.0.1:8000/found/${course_enrollment_id}/${module}/${username}/`)
                    .then(response => response.json())
                    .then(res => {
                        setAssessmentFound(res.assess_found); // Update state with fetched data
                        console.log(res); // Log the fetched response
                        console.log('ASSESSMENT FOUND DATA is', res.assess_found); // Log the fetched data
                    })
                    .catch(error => console.error('Error fetching question count data:', error));

                   
            } 
            
           
          
            const[fetchVideo, setFetchVideo] = useState([])
            const[watchStatus, setWatchStatus] = useState([])
            const [firstVideoWatched, setFirstVideoWatched] = useState(false);
            const videoPlay= async(course_enrollment_id,module, id)=>{

             

              console.log('Course Enroll Id', course_enrollment_id)
              console.log('Module', module)
              console.log('Video Id', id)

              fetch(`http://127.0.0.1:8000/course_mat_video/${course_enrollment_id}/${module}/${id}/`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Set course details state
                      setFetchVideo(data);
                      setLInk(false)
                      const enrolll = fetchVideo.course_enrollment_id
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                  });
                  const response = await fetch(`http://127.0.0.1:8000/course_details/${course_enrollment_id}/`);
                  const res = await response.json();
                  setDetails(res);
                  console.log('Course Details', res)
              
                  const responses = await fetch(`http://127.0.0.1:8000/stud_detail/${username}/`);
                  const result = await responses.json();
                  setStud(res);
                  console.log('Student Details', result)

                  try {
                    
                    const formDataImage = new FormData();
                    formDataImage.append("course_enrollment_id", res.course_enrollment_id);
                    formDataImage.append("stud_id", result.id);
                    formDataImage.append("username", result.username);
                    formDataImage.append("video_id", id);
                    formDataImage.append("module", module);
                    formDataImage.append("status", 1);
                   
                
                    // Displaying all details of formDataImage
                    for (const pair of formDataImage.entries()) {
                      console.log(pair[0], pair[1]);
                    }
                
                    const axiosResponse = await axios.post('http://127.0.0.1:8000/create_completedVideos/', formDataImage);
                    console.log(axiosResponse)
                    FullyWatched()
                    handleCourseDetails()
                    setFirstVideoWatched(true)
                    

                  } catch (error) {
                    console.log('Error occurred:', error);
                  }



                  fetch(`http://127.0.0.1:8000/WatchedDetail/${result.id}/${course_enrollment_id}/${module}/${id}/`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Set course details state
                      setWatchStatus(data);
                      console.log('VEDIO WATCHED')
                      console.log('VEDIO WATCHED DETAILS',watchStatus)
                      setLInk(false)
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                  });
              

            }
            const [fullWatchedVideo, setFullWatchedVideo] = useState([]);
                  
                const FullyWatched = async () => {
                  try {
                      const response = await axios.get(`http://127.0.0.1:8000/create_completedVideos/`);
                      setFullWatchedVideo(response.data);
                      console.log("PURCHAESD DATA", response.data);
                  } catch (error) {
                      console.error("Error fetching course materials:", error);
                  }
                };
                
                useEffect(() => {
                  FullyWatched();
                  
                }, [userData.id]); 

                const[fetchQuestion, setFetchQuestion] = useState([])
                const takeAssessment = (course_enrollment_id, module)=>{
                  setStartTimer(true);
                  setMinutes(5); // Set initial minutes
                  setSeconds(0);

                  console.log('ASSESSMENT EMROLL ID', course_enrollment_id, module)

                  fetch(`http://127.0.0.1:8000/assessment_Q/${course_enrollment_id}/${module}/`)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json();
                  })
                  .then(data => {
                      // Set course details state
                      setFetchQuestion(data);
                      console.log('VEDIO WATCHED')
                      console.log('VEDIO WATCHED DETAILS',watchStatus)
                      setLInk(false)
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                  });
                }


                const[eachQuestion, setEachQuestion] = useState([])
                
                const EachQuestions = (course_enrollment_id, module, question_no) => {
               // Empty dependency array ensures effect runs only once
                  fetch(`http://127.0.0.1:8000/assessment_wise/${course_enrollment_id}/${module}/${question_no}/`)
                    .then(response => {
                      if (!response.ok) {
                        throw new Error('Network response was not ok');
                      }
                      return response.json();
                    })
                    .then(data => {
                      setEachQuestion(data);
                    })
                    .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                    });
                };

                const [startTimer, setStartTimer] = useState(false);
                const[seconds, setSeconds] = useState(0)
                const[minutes, setMinutes] = useState(5)
                const [timerExpired, setTimerExpired] = useState(false); // State to track whether timer has expired

    useEffect(() => {
        if (startTimer) {
            const timer = setInterval(() => {
                if (minutes === 0 && seconds === 0) {
                    clearInterval(timer);
                    setTimerExpired(true); // Set timerExpired to true when timer reaches 0
                } else {
                    if (seconds === 0) {
                        setMinutes(prevMinutes => prevMinutes - 1);
                        setSeconds(59);
                    } else {
                        setSeconds(prevSeconds => prevSeconds - 1);
                    }
                }
            }, 1000);

            return () => clearInterval(timer); // Cleanup function
        }
    }, [startTimer, minutes, seconds]);

    // Function to handle starting the timer
    const handleStartTimer = () => {
        setStartTimer(true);
    };

    
    
const [handleAnswers, setHandleAnswer] = useState({})
    const handleRadio = (e) => {
      const { name, value } = e.target;
      setHandleAnswer({
          ...handleAnswers,
          [name]: value,
          
      });
      console.log('Before',handleAnswers)
  };
  const[modDetails, setModDeatils] = useState([])
  const[buttonsubmit, setButtonSubmit] = useState(false);
  const[correctAnswer, setCorrectAnswer] = useState()
  const[wrongAnswer, setWrongAnswer] = useState()
  const[unAnswers, setUnAnswer] = useState()
  const [showModal, setShowModal] = useState(false);
  const handleAnswer = async(event, course_enrollment_id, module) => {
    event.preventDefault();
    let correctAnswerCount = 0;
    let wrongAnswerCount = 0;
    let unansweredCount = 0;

    fetch(`http://127.0.0.1:8000/assessment_Q/${course_enrollment_id}/${module}/`)
                    .then(response => {
                      if (!response.ok) {
                        throw new Error('Network response was not ok');
                      }
                      return response.json();
                    })
                    .then(data => {
                      setModDeatils(data);
                      
                      data.forEach((question, index) => {
                        const selectedAnswer = handleAnswers[`flexRadioDefault_${index}`];
                        
                        // Perform comparison for each question
                        if (selectedAnswer === undefined || selectedAnswer === null || selectedAnswer === '') {
                          unansweredCount++; // Increment counter for unanswered questions
                          console.log(`Question ${index + 1} is unanswered`);
                      } else if (question.correct_answer === selectedAnswer) {
                          correctAnswerCount++; // Increment counter for correct answer
                          console.log(`Question ${index + 1} is correct`);
                      } else {
                        wrongAnswerCount++; // Increment counter for incorrect answer
                          console.log(`Question ${index + 1} is wrong`);
                      }
                      setCorrectAnswer(correctAnswerCount)
                      setWrongAnswer(wrongAnswerCount)
                      setUnAnswer(unansweredCount)
                    });
                    })
                    .catch(error => {
                      console.error('Error fetching data:', error);
                      // Handle error
                    });
                    
                    console.log('Number of correct answer:', correctAnswer)
                    console.log('Number of wrong answer:', wrongAnswer)
                    console.log('Number of not attended answer:', unAnswers)
                    console.log(course_enrollment_id)
                    console.log(module)
                    console.log(username)
                    console.log(userData.id)

                    const total_per = (correctAnswer/25)*100
                    console.log('TOTAL PERCENT',total_per)


                    const formDataImage = new FormData();

                    formDataImage.append("stud_id", userData.id);
                    formDataImage.append("course_enrollment_id", course_enrollment_id);
                    formDataImage.append("module", module);
                    formDataImage.append("correct_answer", correctAnswer);
                    formDataImage.append("wrong_answer", wrongAnswer);
                    formDataImage.append("unattend", unAnswers);
                    formDataImage.append("final_score", correctAnswer);
                    formDataImage.append("status", 1);
                    formDataImage.append("username", username);
                    formDataImage.append('asess_date', getDate())
                    formDataImage.append("percent",total_per );

                    
                    try {
                      const response = await axios.post('http://127.0.0.1:8000/final_score/ ', formDataImage);
              
                      if (response.status === 201) {
                          toast.success("Assessment Submitted Successfully", {
                              position: toast.POSITION.TOP_CENTER,
                              theme: 'colored'
                              
                          });

                          event.target.reset();
                          setButtonSubmit(true)
                          setSeconds(0);
                          setMinutes(0);
                      }
                  } catch (error) {
                      console.log('Error occurred:', error);
                  }
                    
};

const [purchaseFound, setPurchaseFound] = useState(false); // Initialized with false

const fetchPurchaseData = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/purchase_found/${userData.id}/${username}/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setPurchaseFound(data.purchase_found);
    console.log(data); // Log the fetched response
    console.log('PURCHASE FOUND DATA is', data.purchase_found); // Log the fetched data
  } catch (error) {
    console.error('Error fetching purchase data:', error);
    // Optionally handle error state here
  }
};

useEffect(() => {
  fetchPurchaseData();
}, [userData.id, username]); 



return (
    <>



        <nav class="navbar navbar-expand-lg bg-light" style={{height:80}}> 
            <div class="container-fluid">
                <Link class="navbar-brand" href="#"><img src={Logo} style={{width:80}}/></Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown" style={{marginLeft:300}}>
                    <ul class="navbar-nav">
                    
                        
                        <>
                        <li class="nav-item pl-2">
                            <a className="nav-link ml-3 text-info font-weight-bold"
              href="#all-course" onClick={()=>setIsLoggedIn(false)}
              >Home</a>
                        </li>
                        
                        <li class="nav-item pl-2">
                            <a className="nav-link ml-3 text-info font-weight-bold"
              href="#all-course" onClick={()=>setIsLoggedIn(true)}
              >All Courses</a>
                        </li>
                            <li class="nav-item dropdown pl-2 ">
                            <Link class="nav-link dropdown-toggle ml-3 text-info font-weight-bold" href="#"  role="button"  data-bs-toggle="dropdown" aria-expanded="false">
                                My Courses
                            </Link>
                            <ul class="dropdown-menu">
                                {Array.isArray(purchased) && purchased.length > 0 ? (
                                   purchased.map((dataItem, index) => (

                                      <li><a class="dropdown-item font-weight-bold" href="#CourseDetails" onClick={()=>{handleCourseDetails(dataItem.course_enrollment_id)}}>{dataItem.course_name}</a></li>
                                    
                                ))
                                ) : (
                                    <p className='font-weight-bolder' style={{fontSize:20, margin: '100px 0 0 400px'}}>No Courses Found</p>
                                )}
                            
                            </ul>
                        </li>
                        <li class="nav-item pl-2">
                        <a class="nav-link active  ml-3 text-info font-weight-bold" href="#wishlist" onClick={()=>setIsLoggedIn(true)}>Wishlist</a>
                        </li>
                        <li class="nav-item pl-2">
                            <a class="nav-link   ml-3 text-info font-weight-bold" href="#cart"><i class="fa fa-shopping-cart" onClick={()=>setIsLoggedIn(true)} aria-hidden="true"></i> <span style={{backgroundColor:'red', padding:5, borderRadius:'100%', color:'white'}}>{cartCount.C_count}</span></a>
                        </li>
                        
                    
                        <li class="nav-item dropdown" style={{marginLeft:100}}>
                                <Link class="nav-link dropdown-toggle ml-3 text-info font-weight-bold"  href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Welcome, {userData.Stud_name}
                                </Link>
                                <ul class="dropdown-menu">
                                    <li><Link class="dropdown-item" to={`/student_dash/${username}/`}><i class="fa fa-user" aria-hidden="true"></i>&nbsp;My Account</Link></li>
                                    <li><a class="dropdown-item" href="#purchase"><i class="fa fa-shopping-cart" aria-hidden="true"></i>&nbsp;Purchased Courses</a></li>
                                    <li><button  class="dropdown-item" onClick={handleLogout}><i class="fa fa-sign-out" aria-hidden="true"></i>&nbsp;Logout</button></li>
                                </ul>
                            </li>
                    
                    </>
                

                    </ul>
                </div>
            </div>
        </nav>
                              
                                 
                                 
                                 
                                  
        

  {!isLoggedIn ? (
    
   <div className='container p-4 mt-4 animate__animated animate__fadeInUp'>
    
      <h1>Welcome {userData.Stud_name}, continue learning</h1>
       
      {purchaseFound ? (
        <div className='no_courses' style={{height:200, width:1000,marginTop:50}}>
          <p className='' style={{fontSize:28}}>My Enrolled Courses</p>
          <div className='row'>
              {Array.isArray(purchased) && purchased.length > 0 ? (
              purchased.map((dataItem, index) => (
                <div className='col-md-4' key={index}>
                  <div class="card mb-3" style={{width: '18rem' }}>
                    <img src={dataItem.course_img}  class="img-fluid d-none d-md-block rounded mb-2 shadow "  style={{height:170}} />
                    
                    <div class="card-body">
                      
                      <p class="card-text font-weight-bold">{dataItem.course_name}</p>
                      <p class="card-text font-weight-bold text-muted font-italic fs-6"><a href='#CourseDetails' onClick={()=>{handleCourseDetails(dataItem.course_enrollment_id)}}>Resume <i class="fa fa-chevron-right" aria-hidden="true" style={{marginLeft:170, textDecoration: 'none'}}></i></a></p>
                      
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='font-weight-bolder' style={{fontSize:20, margin: '100px 0 0 400px'}}>No Courses on your wishlist found</p>
            )}
          </div>
        </div>
      ) : (
        <div className='no_courses shadow-sm p-5 bg-light animate__animated animate__fadeInUp' style={{height:200, width:1000,marginTop:50}}>
          <div className='row'>
            <div className='col-xl-3'>
                <img src={Course} style={{width:550, marginTop:-30}} />
            </div>
            <div className='col-xl-8'>
              <p style={{fontSize:20}}>You don't have any active course right now!</p>
              <p style={{fontSize:14}}>Browse through our library of courses and enroll in the course of your choice.</p>
              <p></p>
            </div>
            <div className='text-center' style={{marginLeft:400}}><a href="#all-course" className='btn btn-primary'>Browse Now</a></div>
          </div>
        </div>
       
      )}
      
        
      
    
   </div>
     ):(
     <>    

<div id="all-course" class="content">
      <div className='container p-5'>
        <p className='font-weight-bolder'>Courses</p>
        <div className='row'>
          {datas.map((items, itemIndex) => (
            <div className='col-md-4 animate__animated animate__fadeInUp' key={itemIndex}>
              <div className="card shadow-sm p-3 mb-5 bg-white rounded">
                <Link to={`/more_details/${items.course_enrollment_id}/`}>
                  <img className="img-fluid" alt="100%x280" src={items.course_img} style={{ height: 200 }} />
                </Link>
                <div className="badge-overlay">
                  <span className={`top-left badge ${badgeColors[itemIndex]}`}>Now @ ₹{items.price}</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title" style={{ fontSize: 18 }}>{items.course_name}</h5>
                  <div className='container' style={{ width: 350}}>
                    <div className='row'>
                      <div className='col-md-6' style={{marginLeft:-47}}>
                        <p className="card-text">
                          <button
                            type="button"
                            className={`btn btn-outline-${buttonColors[itemIndex]}`}
                            onClick={() => handleAddCart(items.course_enrollment_id)}
                            style={{ width: '100%' }}>
                            <i className="fa fa-shopping-cart" aria-hidden="true"></i>&nbsp;Add to Cart
                          </button>
                        </p>
                      </div>
                      <div className='col-md-6' >
                        <p className="card-text">
                          <button
                            type="button"
                            className={`btn btn-outline-${buttonColors[itemIndex]}`}
                            onClick={() => handleAddWishList(items.course_enrollment_id)}
                            style={{ width: '100%' }}>
                            <i class="fa fa-heart" aria-hidden="true"></i>&nbsp;Wishlist
                          </button>
                        </p>
                      </div>
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
</div>

{/* --------------------------------------------------------------------------------------WishList ------------------------------------------------------------------------- */}



<div id="wishlist" class="content">
  <div className='container' style={{marginBottom:200}}>
    <div className='row'>
      {Array.isArray(wishItems) && wishItems.length > 0 ? (
          wishItems.map((dataItem, index) => (
            <div className='col-md-4 animate__animated animate__fadeIn' key={index}>
              <div class="card mb-3" style={{width: '18rem' }}>
                <img src={dataItem.course_img}  class="img-fluid d-none d-md-block rounded mb-2 shadow "  style={{height:170}}/>
                <div className="badge-overlay">
                  <span className={`top-left badge ${badgeColors[index]}`}>Now @ ₹{dataItem.price}</span>
                </div>
                <div class="card-body">
                  <div className='container' style={{marginTop:-10}}>
                    <div className='row'>
                      <div className='col-md-10'>

                      </div>
                      <div className='col-md-2'>
                      <i class="fa fa-heart" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                  <p class="card-text font-weight-bold">{dataItem.course_name}</p>
                  <button
                            type="button"
                            className={`btn btn-outline-${buttonColors[index]}`}
                            onClick={() => WishListToCart(dataItem.id)}
                            style={{ width: '100%' }}>
                            <i className="fa fa-shopping-cart" aria-hidden="true"></i>&nbsp;Add to Cart
                          </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='font-weight-bolder' style={{fontSize:20, margin: '100px 0 0 400px'}}>No Courses on your wishlist found</p>
        )}
    </div>
  </div>
  <Footer />
</div>

{/* --------------------------------------------------------------------------------------Cart ------------------------------------------------------------------------- */}


<div id="cart" class="content">
<section class="pt-5 pb-5">
  <div class="container animate__animated animate__fadeInUp">
    <div class="row w-100">
        <div class="col-lg-12 col-md-12 col-12">
            <h3 class="display-5 mb-2 text-center">Cart Details</h3>
            <p class="mb-5 text-center">
                <i class="text-info font-weight-bold">{cartCount.C_count}</i> courses in your cart</p>
            <table id="shoppingCart" class="table table-condensed table-responsive" style={{width:1000}}>
                <thead>
                    <tr>
                        <th style={{width:"60%"}}>Course</th>
                        <th style={{width:"12%"}}>Price</th>
                        <th style={{width:"10%"}}>Quantity</th>
                        <th style={{width:"100%"}}></th>
                    </tr>
                </thead>
                <tbody>
                
                {Array.isArray(cartItems) && cartItems.map((dataItem, index) => (

                        <tr >
                          <td data-th="Product">
                              <div class="row">
                                  <div class="col-md-3 text-left">
                                      <img src={dataItem.course_img} alt="" class="img-fluid d-none d-md-block rounded mb-2 shadow " />
                                  </div>
                                  <div class="col-md-9 text-left mt-sm-2">
                                      <h4>{dataItem.course_name}</h4>
                                      <p class="font-weight-light">Status - {dataItem.status}</p>
                                  </div>
                              </div>
                          </td>
                          <td data-th="Price">₹{dataItem.price}</td>
                          <td data-th="Quantity">
                              <input type="number" class="form-control form-control-lg text-center" value="1"  readOnly/>
                          </td>
                          <td style={{  display: 'flex', alignItems: 'center',width:'80%'}}>
                             
                                  <form action={`${API_URL}/create-checkout-session/${dataItem.id}/`} method='POST'>
                                    <button type='submit' className={`btn btn-outline-${buttonColors[index]}`}>Checkout</button>
                                  </form> &nbsp;
                                  <button class="btn btn-white border-secondary bg-white btn-md mt-2 mb-2" data-toggle="modal" data-target="#myModalzz"  onClick={()=>getDetails(dataItem.id)}>
                                  <i class="fa fa-trash-o" aria-hidden="true"></i>
                                  </button>
                              
                          </td>
                        </tr>

))}
                    
                    
                </tbody>
            </table>
            <div class="float-right text-right">
                <h4>Subtotal:</h4>
                <h1>₹{cartTotal.total_pieces}</h1>
            </div>
        </div>
    </div>
    
    <div class="row mt-4 d-flex align-items-center">
        <div class="col-sm-6 order-md-2 text-right">
        
        </div>
        <div class="col-sm-6 mb-3 mb-m-1 order-md-1 text-md-left">
            <a href="catalog.html">
                <i class="fas fa-arrow-left mr-2"></i> Continue Shopping</a>
        </div>
    </div>
</div>
</section>

<div  className="modal fade" id="myModalzz" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog " >
            <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title " id="exampleModalLabel">Module Update</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
            </div>
            <div class="modal-body">
              
            <p className='font-weight-bolder'> Are you want to delete {getData.course_name} !</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" onClick={()=>handleDeleteCart(getData.id)}>Delete</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                
            </div>
            </div>
        </div>
    </div>  


   <Footer />
</div>

<div id="purchase" class="content">
<h5 className='font-weight-bolder ml-5 ' style={{fontFamily:'monospace'}}>Purchased Course</h5>
<hr />
<div className='container mt-5' style={{marginBottom:200}}>

    <div className='row'>
      {Array.isArray(purchased) && purchased.length > 0 ? (
          purchased.map((dataItem, index) => (
            <div className='col-md-4 animate__animated animate__slideInDown' key={index}>
              <div class="card mb-3" style={{width: '18rem' }}>
                <img src={dataItem.course_img}  class="img-fluid d-none d-md-block rounded mb-2 shadow "  style={{height:170}}/>
                
                <div class="card-body">
                  
                  <p class="card-text font-weight-bold">{dataItem.course_name}</p>
                  <p class="card-text font-weight-bold text-muted font-italic fs-6">Purchased on: {dataItem.created_at}</p>
                  
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='font-weight-bolder' style={{fontSize:20, margin: '100px 0 0 400px'}}>No Courses on your wishlist found</p>
        )}
    </div>
  </div>
  <Footer />
</div>


          
<div id="CourseDetails" class="content">
  
  <div className='container-fluid  shadow-sm p-3 mb-5 bg-body-tertiary rounded' style={{ 
         backgroundImage: `url('${course.course_img}')`, // Replace 'background-image.jpg' with the actual path to your image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height:300,
      }}>
    <h2 className='font-weight-bolder text-center' style={{marginTop:100, fontFamily:'monospace', fontSize:40,color:'white'}}>{course.course_name}</h2>
  </div>
  <div className='div_2 shadow-sm p-5 text-left'  style={{marginTop:-150, backgroundColor:'white', width:'30%', height:'80%', marginLeft:1000, border: 'solid 1px lightgrey'}}>
      
      <div className='row'>
        <div className='col-md-3'style={{marginLeft:-20}}>
            <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar value={percent} text={`${percent}%`} />
            </div>
        </div>
        <div className='col-md-9' style={{marginLeft:20}}>
          <p className=' font-weight-bold ml-2'>{course.course_name}</p>
          <p className=' font-weight-bold ml-2'>By</p>
          <p className=' font-weight-bold ml-2'>{course.course_instructor}</p>
          </div>
      </div>
    
    
    

  </div>

    
      <div className='container-fluid m-5'>
                        <div className='row'>
                            {
                                moduleDetails.map((itemsss)=>(
                                    <div className='col-md-4 mb-5 rounded-top'>
                                        <div class="card shadow" style={{width:330, borderRadius:30}}>
                                          <a href='#videoContent' style={{textDecoration: 'none'}} onClick={()=>{videoContent(itemsss.course_enrollment_id, itemsss.module)}}>
                                            <div className='card-header' style={{height:220,backgroundColor: '#042224',borderRadius:'30px 30px 0px 0px'}}>
                                                
                                                <p className='text-center ' style={{fontSize:48, fontWeight:700, color:'rgba(51, 143, 51, 0.969)',marginBlock:-20, marginTop:10}}>MODULE</p> <p className='text-center ' style={{fontSize:58, fontWeight:700, color:'rgba(51, 143, 51, 0.969)',}}>0{itemsss.module}</p>
                                                <p style={{fontSize:18, fontWeight:900, color:'grey',marginTop:20, textTransform:'uppercase'}}>{itemsss.topic_title}</p>                                            
                                            </div>
                                            </a>
                                            <div class="card-body">
                                                
                                                <p class="card-text" style={{overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap'}}>{itemsss.topic_details}</p>
                                                <div className='row'>
                                                    <div className='col-md-5'>

                                                        {classCount.map((items) => (
                                                            <div>
                                                            {itemsss.course_enrollment_id === items.course_enrollment_id && itemsss.module === items.module && items.type==='Video' ? (
                                                                <p style={{ color:'rgba(51, 143, 51, 0.969)', fontWeight: 900, fontSize:22 }}>{items.total_count} classes</p>
                                                            ) : null}
                                                        </div>
                                                        ))}

                                                    </div>
                                                    <div className='col-md-7'>
                                                        {classCount.map((items) => (
                                                            <div>
                                                            {itemsss.course_enrollment_id === items.course_enrollment_id && itemsss.module === items.module && items.type==='PDF' ? (
                                                                <p style={{ color:'rgba(51, 143, 51, 0.969)', fontWeight: 900, fontSize:22 }}>{items.total_count} Challenges</p>
                                                            ) : null}
                                                        </div>
                                                        ))}

                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>

                                    </div>

                                ))
                            }
                            
                            
                        </div>
                    </div>

                   
     

</div>


<div id="videoContent" class="content">

   <div className='container'>
                      <div class="accordion accordion-flush" id="accordionFlushExample">
                            <div className='row '>
                              <div className='col-md-4'>
                                <h6 className='text-center font-weight-bolder' style={{color:'lightgrey'}}>Title</h6>
                              </div>
                              <div className='col-md-4'>
                                <h6 className='text-center font-weight-bolder' style={{color:'lightgrey'}}>Thumbnail</h6>
                              </div>
                              <div className='col-md-4'>
                                <h6 className='text-center font-weight-bolder' style={{color:'lightgrey'}}>Type</h6>
                              </div>
                            </div>
                            {moduleContent.map((data, index) => (
                                
                                    
                                    <div class="accordion-header " key={index} >
                                        <div className='card'>
                                        <div class="accordion-button collapsed p-3 shadow-sm" data-bs-toggle="collapse" data-bs-target={`#flush-collapse-${index}`} aria-expanded="false" aria-controls={`flush-collapse-${index}`} >
                                           <div className='row'>
                                              <div className='col-md-4'>
                                                <h5  style={{fontSize:20}} >{data.video_title}</h5>
                                              </div>
                                              <div className='col-md-4 text-center'>
                                                <h6  style={{fontSize:20}} ><img src={data.Thumbnail}  className='img-thumbnail' style={{width:80}} /></h6>
                                              </div>
                                              <div className='col-md-4 text-center'>
                                                <h6  style={{fontSize:20}} >{data.type}</h6>
                                              </div>
                                           </div>
                                        </div>
                                        </div>
                                        <div id={`flush-collapse-${index}`} class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                            <div class="accordion-body  w-80 shadow-sm p-3 mb-5 bg-body-tertiary rounded font-weight-bold" >
                                                <div className='row'>
                                                  <div className='col-md-4 text-center'>
                                                    <h5  style={{fontSize:20}} >{data.video_title}</h5>
                                                  </div>
                                                  <div className='col-md-4 text-center'>
                                                   
                                                  </div>
                                                  <div className='col-md-4 text-center'>
                                                    {
                                                      data.type === 'Video' ?(
                                                        <a className='btn btn-success p-2' onClick={()=>{watchVideo(data.course_enrollment_id, data.module,data.id)}} href='#watchVideo'><i class="fa fa-play" aria-hidden="true"></i>&emsp;Watch Video</a>
                                                      ):(
                                                        <button className='btn btn-warning'><i class="fa fa-download" aria-hidden="true"></i>&emsp;Download</button>
                                                      )
                                                    }
                                                   
                                                  </div>
                                                    
                                                
                                              </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                
                            ))}
                            
                      </div>                      
    </div>                   

</div>
<div id="watchVideo" class="content">
  

  
  <p>Home&emsp;/&emsp;<a href='#CourseDetails'>Course Details</a>&emsp;/&emsp;<a href="#videoContent">Video Content</a>&emsp;/</p>
    <div className='container-fluid shadow-sm  bg-body-tertiary rounded'>
      <div className='row'>
        <div className='col-md-3 shadow  bg-body-tertiary rounded'>
          <div className='header p-4'>
            <h5> Module Content</h5>
          </div>
          <div className='moduleContent p-3' style={{backgroundColor:'#F3FEFF'}}>
          {videoContents.map((data, index) => (
        <React.Fragment key={index}>
          {data.type === 'Video' ? (
            // Check if the video is in the list of watched videos
            fullWatchedVideo.some(item =>
              item.course_enrollment_id === data.course_enrollment_id &&
              item.module === data.module &&
              item.username === username &&
              item.video_id === data.id &&
              item.status === 1
            ) ? (
              // Display "Watched" if the video has been watched
              <p key={index}>
                <button
                  className='btn btn-none'
                  style={{ color: 'black', textDecoration: 'none', border: 'none', background: 'none' }}
                  onClick={() => {
                    videoPlay(data.course_enrollment_id, data.module, data.id);
                  }}>
                  <i className="fa fa-play-circle-o" aria-hidden="true" style={{ color: 'blue' }}></i>&nbsp;{data.video_title}
                  <span className='p-1 ml-3 font-weight-bold' style={{ background: 'green', color: 'white', fontSize: 10, borderRadius: 5 }}>Watched</span>
                </button>
              </p>
            ) : (
              // Display "Not Watched" if the video has not been watched
              <p key={index}>
                <button
                  style={{ color: 'black', textDecoration: 'none', border: 'none', background: 'none' }}
                  onClick={() => {
                    videoPlay(data.course_enrollment_id, data.module, data.id);
                  }} >
                  <i className="fa fa-play-circle-o" aria-hidden="true" style={{ color: 'blue' }}></i>&nbsp;{data.video_title}
                  <span className='p-1 ml-3 font-weight-bold' style={{ background: 'red', color: 'white', fontSize: 10, borderRadius: 5 }}>Not Watched</span>
                </button>
              </p>
            )
          ) : (
            // If it's not a video, display the title with a link
            <p key={index}>
              <Link to='#' style={{ color: firstVideoWatched ? 'black' : 'grey', textDecoration: 'none' }} onClick={() => { videoPlay(data.course_enrollment_id, data.module, data.id) }}>
                <i className="fa fa-file-text" aria-hidden="true"></i>&nbsp;{data.video_title}
              </Link>
            </p>
          )}
        </React.Fragment>
      ))}

          <h4>Assessment</h4>
          
          {AssessmentFound === true ? (
        <>
          
              <button style={{color:'black', textDecoration:'none', border:'none', background:'none'}} disabled>Assessment Taken Already</button>
              
            
        </>
      ) : (
        <>
         {
            courseModule.map((items)=>(
         <a href="#Assessment" style={{color:'black', textDecoration:'none', border:'none', background:'none'}}  onClick={()=>takeAssessment(items.course_enrollment_id, items.module)}>Take Assessment</a>
         ))
        }
         </>
       
      )}
            
              
            
         
           
          </div>
        </div>
        <div className='col-md-8'>
        {fetchVideo.map((items) => (
          <p className='font-weight-bolder ml-4' style={{fontSize:25}}>{items.video_title}</p>
        ))}

        {link ? (
            singleVideo.map((items) => (
              <video key={items.id} controls style={{ width: '100%', maxWidth: 900, display: 'block', margin: '0px auto' }}>
                <source src={items.video_url} type="video/mp4" />
              </video>
            ))
          ) : (
            fetchVideo.map((items) => (
              <video key={items.id} controls style={{ width: '100%', maxWidth: 900, display: 'block', margin: '0px auto' }}>
                <source src={items.video_url} type="video/mp4" />
              </video>
            ))
          )}
        
        </div>
      </div>
    </div>
</div>


<div id="Assessment" class="content">
<div id="layoutSidenav">
        <div id="layoutSidenav_nav">
        <nav class="sb-sidenav accordion shadow-sm" style={{backgroundColor: '#F3FEFF', width:300,}} id="sidenavAccordion">
                <div class="sb-sidenav-menu">
                    <div class="nav">
                        <div class="sb-sidenav-menu-heading">Core</div>
                        
                        <a class="nav-link font-weight-bold" style={{ color:'black'}} id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home"  aria-selected="true">
                            <div class="sb-nav-link-icon"><i class="fa fa-tachometer" aria-hidden="true"></i></div>
                            Dashboard
                        </a>
                        <a class="nav-link font-weight-bold" style={{ color:'black'}} id="social-tab" data-toggle="tab" href="#social" role="tab" aria-controls="social"  aria-selected="true">
                            <div class="sb-nav-link-icon"><i class="fa fa-tachometer" aria-hidden="true"></i></div>
                            Start Assessment
                        </a>
                        
                        
                        

                    </div>
                </div>
                
            </nav>
        </div>
        <div id="layoutSidenav_content">
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane  show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    
                  <h4 className='text-center'>Assessment Rules & regulations</h4>

                  <div class="container mt-5">
                    <p class="question" style={{fontWeight:'bold'}}>Examination rules: MCQ Examinations</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>1.&nbsp;Total 25 questions.Each questions carry 1 point each.</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>2.&nbsp; Note that the PQ48.4048 examination is a fully online examination. Students are provided one (1) submission opportunities for their MCQ examinations within the allowable examination duration. No additional time will be added for resubmissions.</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>3.&nbsp; Students are advised that the examination time starts as soon as the students start writing their responses. The examination time is not added as the students start writing their responses.</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>4.&nbsp; If utilizing your cellphone to respond to your MCQ examination, update your cellphone operating system before commencing your exam. Also clear the cache and cookies memory prior to starting your exam. NOTE THE USE OF CELLPHONES IS NOT RECOMMENDED FOR ONLINE MCQ EXAMS.</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>5.&nbsp; DO NOT OPEN your examination in multiple browser windows or tabs at the same time. If you do so, the system will automatically submit responses on behalf of you without your knowledge. Marks awarded for academic submissions will be final marks. No additional markoff for subsequent responses will be given until your second examination click your browser's back button while taking your examination. Students are at risk of losing previous responses should they utilize browser navigation buttons.</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>6.&nbsp; Students are advised to always use SageNavigaton to move the previous and (if allowed) previous question to the next page.</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>7.&nbsp; The system will automatically save your responses should one question be displayed per page as you click next to move on to the next question.</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>8.&nbsp; Students who have not utilised invigilation or proctoring tools will be subjected to discreet processes.</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>9.&nbsp; a. Personal questions: Students should not conduct any examination during the examinations.</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>10.&nbsp; b. Questions related to personal space: Lorem ipsum</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>11.&nbsp; c. Loading/unloading: Crashed computer</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>12.&nbsp; d. Unwillingness to use blackboard: Access to my site (firewall unchallenged)</p>
                    <p style={{fontSize: 16,lineHeight: 1.5,marginBottom: 20,fontWeight:'bold'}}>13.&nbsp; e. Software challenges: Students should contact the SQC 0800.800.EXAMINES@unsw.edu.au or refer to <a href="help.html">Get-Help</a> for the list of additional</p>
                </div>
                
                </div>
                <div class="tab-pane fade  " id="social" role="tabpanel" aria-labelledby="social-tab">
                    
                    <div className='container p-4 m-4 '>
                    <h4>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</h4>
                    {
            courseModule.map((itemss)=>(
              <form onSubmit={(event)=>handleAnswer(event, itemss.course_enrollment_id, itemss.module)}>    
            
        
                      {fetchQuestion.map((items, index) => (
                            <div className='inner p-4 m-4 shadow-sm' style={{ width: 800 }}>
                                <div className='question m-3'>
                                    <label className='font-weight-bold' style={{ fontSize: 20 }}>#{items.question_no}. {items.question}</label>
                                    <div className='row p-3'>
                                        <div className='col-md-6 mt-3'>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name={`flexRadioDefault_${index}`} value={items.option_1} id={`flexRadioDefault_${index}_1`} onChange={handleRadio} disabled={timerExpired} />
                                                <label className="form-check-label" htmlFor={`flexRadioDefault_${index}_1`}>
                                                    {items.option_1}
                                                </label>
                                            </div>
                                        </div>
                                        <div className='col-md-6 mt-3'>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name={`flexRadioDefault_${index}`}  value={items.option_2} id={`flexRadioDefault_${index}_2`} onChange={handleRadio} disabled={timerExpired}/>
                                                <label className="form-check-label" htmlFor={`flexRadioDefault_${index}_2`}>
                                                    {items.option_2}
                                                </label>
                                            </div>
                                        </div>
                                        <div className='col-md-6 mt-3'>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name={`flexRadioDefault_${index}`} value={items.option_3} id={`flexRadioDefault_${index}_3`} onChange={handleRadio} disabled={timerExpired} />
                                                <label className="form-check-label" htmlFor={`flexRadioDefault_${index}_3`}>
                                                    {items.option_3}
                                                </label>
                                            </div>
                                        </div>
                                        <div className='col-md-6 mt-3'>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name={`flexRadioDefault_${index}`} value={items.option_4} id={`flexRadioDefault_${index}_4`} onChange={handleRadio} disabled={timerExpired}/>
                                                <label className="form-check-label" htmlFor={`flexRadioDefault_${index}_4`}>
                                                    {items.option_4}
                                                </label> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
))}

 
                      
                     <div className='' style={{marginLeft:400}}>
                      {!buttonsubmit ?(
                           <button className='btn btn-primary ' type='submit'>Submit Assessment </button>
                      ):(
                        <>
                        <button className='btn btn-primary ' type='submit' disabled>Assessment Submitted </button>&emsp;
                        <a className='btn btn-warning' href='#CourseDetails'>Back To Module</a>
                        </>
                      )}
                        
                      
                    
                     </div>
                     </form>
                     ))
                    }
                    </div>
              
                    
                </div>
                <div class="tab-pane fade" id="enrolled" role="tabpanel" aria-labelledby="enrolled-tab">
                    
                    <p>Content 3</p>
                    
                </div>
                
                
                
    
            </div>
        </div>
    </div>
</div>
</>
 )}


{showModal && (
    <div className="modal fade" id="myModalzz" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title" id="exampleModalLabel">Module Update</h4>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <p className='font-weight-bolder'>Are you sure you want to delete?</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" >Delete</button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
)}
    </>
  )
}

export default StudentDash
