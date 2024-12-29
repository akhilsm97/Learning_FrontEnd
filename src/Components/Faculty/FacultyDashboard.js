import { toast } from 'react-toastify';
import '../Admin/css/styles.css';
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import EnrolledStudents from '../Admin/EnrolledStudents';
import Add_Course from '../Admin/Add_Course';
import Course_Details from '../Admin/Course_Details';
import Course_Mod from '../Admin/Course_Mod';
import Module_Details from '../Admin/Module_Details';
import { Modal } from 'bootstrap';
import Upload from '../Admin/images/upload.png';
import { Link, useNavigate } from 'react-router-dom';
import Edit from '../Admin/images/edit2.png';
import Uploaded_Questions from '../Admin/Uploaded_Questions';
import AddFaculty from '../Admin/AddFaculty';
import FacultyDetails from '../Admin/FacultyDetails';
import Cross from '../Admin/images/cross.jpg';
import Edit1 from './images/edit.png'
import Edit2 from './images/edit2.png';
import Edit3 from './images/edit3.png';


function FacultyDashboard({ username, clearAuthenticatedUser }) {

    const handleLogout = () => {
        // Perform logout actions
        // Redirect to login page after logging out
        navigate('/logout');
      };
    function getDate() {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        const date = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${date}`;
      }

    const [userData, setUserData] = useState({});
    useEffect(() => {
        // Define the first API URL with the username parameter
        const firstApiUrl = `http://127.0.0.1:8000/faculty_detail/${username}/`;
      
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


    const [facultyAssign, setFacultyAssign]= useState([])
const CartItems = async () => {
  try {
      const response = await axios.get(`http://127.0.0.1:8000/faculty_assign/${userData.faculty_name}/`);
      setFacultyAssign(response.data);
      console.log("RESPONSE DATA", response);
  } catch (error) {
      console.error("Error fetching course materials:", error);
  }
};

useEffect(() => {
  CartItems();
}, [userData.id]);

const [facultyStud, setFacultyStud]= useState([])
const FacultyStuds = async () => {
  try {
      const response = await axios.get(`http://127.0.0.1:8000/faculty_stud/${userData.department}/`);
      setFacultyStud(response.data);
      console.log("RESPONSE DATA", response);
  } catch (error) {
      console.error("Error fetching course materials:", error);
  }
};



useEffect(() => {
    FacultyStuds();
}, [userData.department]);





useEffect(() => {
    FacultyStuds();
}, [userData.department]);


  
    const [totalCount, setTotalCount] = useState({});

    
const PurchaseCount = async () => {
  try {
      const response = await axios.get(`http://127.0.0.1:8000/Faculty_Stud_count/${userData.department}/`);
      setTotalCount(response.data);
      console.log("RESPONSE DATA", response);
  } catch (error) {
      console.error("Error fetching course materials:", error);
  }
};

useEffect(() => {
    PurchaseCount();
}, [userData.id]);

    const [data, setData]= useState([])
    useEffect(()=>{
        axios
        .get('http://127.0.0.1:8000/create_stud/')
        .then((response)=>{
            setData(response.data)
        })
        .catch((error)=>{
            console.log("error")
        })
    }, [data])
        const[currentPage, setCurrentPage] = useState(1)
        const [searchItem, setSearchItem] = useState('');
        const recordPerPage = 5

        const filterData = facultyStud.filter((item) =>
            item.stud_name.toLowerCase().includes(searchItem.toLowerCase())
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


        // Add Student to API


        const [formData, setFormData] = useState({});
        const [showModal, setShowModal] = useState(true);

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

    formDataImage.append("Stud_name", formData.Stud_name);
    formDataImage.append("email", formData.email);
    formDataImage.append("gender", formData.gender);
    formDataImage.append("phone", formData.phone);
    formDataImage.append("Address_line_1", formData.Address_line_1);
    formDataImage.append("Address_line_2", formData.Address_line_2);
    formDataImage.append("qualification", formData.qualification);
    formDataImage.append("percent_mark", formData.percent_mark);
    formDataImage.append("username", formData.username);
    formDataImage.append("password", formData.password);
    formDataImage.append('reg_date', getDate())
    formDataImage.append("stud_img", file);

    setFormData(formDataImage);
    console.log('entered value is '+ formData)
};

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Entered Value is", formData);

    try {
        const response = await axios.post('http://127.0.0.1:8000/create_stud/', formData);

        if (response.status === 201) {
            setShowModal(false); 
            toast.success("Student Enrolled Successfully", {
                position: toast.POSITION.TOP_CENTER,
                theme: 'colored'
            });
            e.target.reset();
        }
    } catch (error) {
        console.log('Error occurred:', error);
    }
};

// ------------------------------------------------------------Course Module ----------------------------------------------------------------


const [course, setCourse] = useState([]);
    
const PerCourse = async () => {
  try {
      const response = await axios.get(`http://127.0.0.1:8000/course_per/${userData.department}/`);
      setCourse(response.data);
      console.log("RESPONSE DATA", response);
  } catch (error) {
      console.error("Error fetching course materials:", error);
  }
};

useEffect(() => {
    PerCourse ();
}, [userData.department]);

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


const [formDatas, setFormDatas] = useState({
    course_enrollment_id: '',
    module: '',
    topic_title: '',
    topic_details: ''
});
const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormDatas({ ...formDatas, [name]: value });
};

const handleSubmits = async (e) => {
    e.preventDefault();
    console.log("Entered Value is", formDatas);

    try {
        const response = await axios.post('http://127.0.0.1:8000/create_topic/', formDatas);

        if (response.status === 201) {
            toast.success("Course Modules Added Successfully", {
                position: toast.POSITION.TOP_CENTER,
                theme: 'colored'
            });
            e.target.reset();
        }
    } catch (error) {
        console.log('Error occurred:', error);
    }
};




const [courses, setCourses] = useState([]);


    

const handleLinkClick = (id) => {
    fetch(`http://127.0.0.1:8000/topic_details/${id}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setCourses(data); // Update courses state with fetched data
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
            // Optionally, you can handle the error state here
        });
};

    // --------------------------------Update Module -----------------------------------------------------

    const [up, setUp] = useState({}); // Initialize with proper initial state
    const [originalData, setOriginalData] = useState({});

    // Fetch initial data when component mounts
    useEffect(() => {
        // Fetch initial data
        updateModules();
    }, []);

    // Function to fetch initial data
    const updateModules = (id) => {
        fetch(`http://127.0.0.1:8000/topic_update/${id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUp(data); // Set initial state with fetched data
                setOriginalData(data); // Set original data for comparison
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // Handle error
            });
    };

    // Function to handle input changes
    const handleInputModule = (event, fieldName) => {
        const value = event.target.value;
        setUp(prevUpdate => ({
            ...prevUpdate,
            [fieldName]: value,
           
        }));
    };

    // Function to update module data
    const updateMod = async (e, id) => {
        e.preventDefault();

   
        console.log("ID is"+ id)
        console.log(up)
       

        const requestData = {
            "id": up.id,
            "module": up.module,
            "topic_title": up.topic_title,
            "topic_details": up.topic_details,
            "course_enrollment_id": up.course_enrollment_id,

        };
        console.log("Updated data is" , requestData)
        try{
            const response = await axios.put(`http://127.0.0.1:8000/topic_update/${id}/`, requestData,{
            headers: {
                'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
            },
        });
        console.log(response)
            if (response.status === 200){

                toast.success("Module Updated Successful", {
                    position: toast.POSITION.TOP_CENTER,
                    theme: 'colored',
                });
                e.target.reset();
            }
        }catch(error){
            console.log(error)

        }
        
    };
    const handleDelete=((id) =>{
        fetch(`http://127.0.0.1:8000/topic/${id}/delete/ ` ,
            {method: 'DELETE'})
            .then(()=>{
                console.log("Deleted")

            })
        
        }
)

    const [ups, setUps] = useState({});
    

        


        // fetch(`http://127.0.0.1:8000/course_materials/${ups.course_enrollment_id}/${up.module}/`)
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error('Error on display');
        //     }
        //     return response.json();
        // })
        // .then(data => {
        //     setDisplay(data); // Set initial state with fetched data
        //     setOriginalData(data); // Set original data for comparison
        // })
        // .catch(error => {
        //     console.error('Error fetching data:', error);
        //     // Handle error
        // });


        const navigate = useNavigate()

        const handleMaterials=(id, enroll_id)=>{
            navigate(`/materials/${id}/${enroll_id}/`) 

               

        };
        const[display, setDisplay] = useState([])
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/course_materials/${ups.course_enrollment_id}/${up.module}/`);
                setDisplay(response.data);
                console.log("RESPONSE DATA", response);
            } catch (error) {
                console.error("Error fetching course materials:", error);
            }
        };
    
        useEffect(() => {
            fetchData();
        }, [ups.course_enrollment_id, up.module]);


        




        // ---------------------------------------------------------Image Preview-----------------------------------

        

            const[formDatass, setFormDatass] = useState({})
            const handleMaterialss = (e) => {
                const { name, value } = e.target;
                setFormDatass({
                    ...formDatass,
                    [name]: value,
                    
                });
                console.log('Before'+formDatass.course_enrollment_id)
            };
            const [imageSrc, setImageSrc] = useState(null);

            const showPreview = (event) => {
                if (event.target.files.length > 0) {
                const src = URL.createObjectURL(event.target.files[0]);
                setImageSrc(src);
                }
                const file = event.target.files[0];
                const formDataImage = new FormData();

                formDataImage.append("course_enrollment_id", ups.course_enrollment_id);
                
                formDataImage.append("module", up.module);
               
                formDataImage.append("video_title", formDatass.video_title);
                console.log('ENTERED',formDatass.video_title)
                formDataImage.append("type", 'Video');
                formDataImage.append("Thumbnail", file);
                formDataImage.append("created_at", getDate());
                formDataImage.append("video_url", formDatass.video_url);
                formDataImage.append("pdf", '');
                setFormDatass(formDataImage);
                console.log('entered value is '+ formDatass)
            };

            const handleMaterialSubmit = async (e) => {
                e.preventDefault();
                console.log("Entered Value is", JSON.stringify(formDatass.video_title));
            
                try {
                    const response = await axios.post('http://127.0.0.1:8000/Course_Materials/', formDatass);
                    console.log(response.data)

                    fetchData();
                    
            
                    if (response.status === 201) {
                        toast.success("Material Added Successfully", {
                            position: toast.POSITION.TOP_CENTER,
                            theme: 'colored'
                        });
                        e.target.reset();
                    }
                } catch (error) {
                    console.log('Error occurred:', error);
                }
            };

            // --------------------------------------------------------------------Update Material -----------------------------------------
            const[materialUpdate, setmaterialUpdate] = useState({})
            const updateMaterial = (id) => {
                fetch('http://127.0.0.1:8000/material_details/' + id)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        setmaterialUpdate(data); // Set initial state with fetched data
                        setOriginalData(data); // Set original data for comparison
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        // Handle error
                    });
            };

            const[formDataz, setFormDataz] = useState({})

            const handleMaterialUpdate = (event, fieldName) => {
                const value = event.target.value;
                setmaterialUpdate(prevUpdate => ({
                    ...prevUpdate,
                    [fieldName]: value,
                   
                }));
                console.log('CHANGING DATA', materialUpdate)
            };

            const handleThumbnail = (e) => {
                const file = e.target.files[0];
                setFormDataz({
                    ...formDataz,
                    Thumbnail: file,
                });
                console.log('CHANGED DATA', materialUpdate)
            };

            const handleMaterialSubmits = async (e, id) => {
                e.preventDefault();
                console.log("CLICKED ID IS", id);
            
                // Prepare Thumbnail data
                let ThumbnailData = {};
                if (formDataz.Thumbnail) {
                    ThumbnailData = { Thumbnail: formDataz.Thumbnail };
                } else {
                    ThumbnailData = { Thumbnail: '' }; 
                }

                console.log('THUMBNAIL DATA', ThumbnailData)
            
                // Compare updated data with original data and include only changed fields
                
            
                // Prepare request data
                const requestData = {
                    ...materialUpdate, // Include only the changed fields
                    ...ThumbnailData,
                    created_at: '', // Always include reg_date
                };
            
                console.log("Updated Data:", requestData);
            
                try {
                    // Send PUT request
                    const response = await axios.put(`http://127.0.0.1:8000/material_update/${id}/`, requestData, {
                        headers: {
                            'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
                        },
                    });
            
                    // Handle response
                    console.log("Response:", response.data);
                    setShowModal(false);
                    toast.success("Material Updated Successfully", {
                        position: toast.POSITION.TOP_CENTER,
                        theme: 'colored',
                    });
                    fetchData();
                    
                } catch (error) {
                    console.error('Error updating material:', error);
                    // Handle error
                    toast.error("Failed to update material. Please try again later.", {
                        position: toast.POSITION.TOP_CENTER,
                        theme: 'colored',
                    });
                }
            };

            


            const showPdf = (e)=>{
                
                const fileInput1 = document.getElementById('fileInput1');
                const fileInput2 = document.getElementById('fileInput2');
            
                const file1 = fileInput1.files[0]; // File from first input
                const file2 = fileInput2.files[0]; // File from second input
               
                const formDataPdf = new FormData();

                formDataPdf.append("course_enrollment_id", ups.course_enrollment_id);
                formDataPdf.append("module", up.module);
                formDataPdf.append("video_title","Code Challenge 1");
                console.log('ENTERED',formDatass.video_title)
                formDataPdf.append('Thumbnail', file1)
                console.log('THUMBNAIL DATA', file1)
                formDataPdf.append("type", 'PDF');
                formDataPdf.append('pdf', file2)
                console.log('PDF DATA', file2)
                formDataPdf.append("created_at", getDate());
                formDataPdf.append("video_url", '');
                setFormDatass(formDataPdf);
            }
            


            const handleMaterialPdf = async (e) => {
                e.preventDefault();
                console.log("Entered Value is", JSON.stringify(formDatass.video_title));
                
            
                try {
                    console.log('entered value is '+ formDatass)


                    const response = await axios.post('http://127.0.0.1:8000/Course_Materials/', formDatass);
                    console.log(response.data)

                    fetchData();
                    
            
                    if (response.status === 201) {
                        toast.success("Material Added Successfully", {
                            position: toast.POSITION.TOP_CENTER,
                            theme: 'colored'
                        });
                        e.target.reset();
                    }
                } catch (error) {
                    console.log('Error occurred:', error);
                }
            };



            // ---------------------------------------------------------------------------Count Class ----------------------------------------

            const[classCount, setClassCount] = useState([])
            const fetchClass = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/course-materials/count/`);
                    setClassCount(response.data);
                    
                } catch (error) {
                    console.error("Error fetching course materials:", error);
                }
            };
        
            useEffect(() => {
                fetchClass();
            }, [classCount]);


            const [selectedOption, setSelectedOption] = useState();
            const [fetchedData, setFetchedData] = useState([]);

            const handleDropdownChange = (event) => {
                const data_select = event.target.value;
                setSelectedOption(data_select);
                console.log('Selected Data',data_select)
              };
              const fetchDataFromApi = async (selectedOption) => {
                try {
                  const response = await fetch(`http://127.0.0.1:8000/topic_details/${selectedOption}/`);
                  const data = await response.json();
                  console.log(data)
                  setFetchedData(data);
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
              };
            
              // Trigger the API call when the dropdown selection changes
              useEffect(() => {
                if (selectedOption) {
                  fetchDataFromApi(selectedOption);
                }
              }, [selectedOption]);

              const [assessmentData, setAssessmentData] = useState({
                course_enrollment_id:'',
                module:'',
                exam_level: '',
                total_question: '',
                total_points:'',
                pass_mark:''

            });


              const handleAssessment=(e)=>{
                const { name, value } = e.target;
                setAssessmentData({ ...assessmentData, [name]: value });
                console.log(assessmentData)
              }

              const handleSubmitAss = async (e) => {
                e.preventDefault();
                console.log("Entered Value is", assessmentData);

                const formDataAssess = new FormData();

                formDataAssess.append("course_enrollment_id", up.course_enrollment_id);
                formDataAssess.append("module", up.module);
                formDataAssess.append("exam_level", assessmentData.exam_level)
                formDataAssess.append("total_question", assessmentData.total_question);
                formDataAssess.append("total_points", assessmentData.total_points);
                formDataAssess.append("pass_mark", assessmentData.pass_mark);
            
                try {
                    const response = await axios.post('http://127.0.0.1:8000/assessment/', formDataAssess);
            
                    if (response.status === 201) {
                        toast.success("Assessment Data Added Successfully", {
                            position: toast.POSITION.TOP_CENTER,
                            theme: 'colored'
                        });
                        fetchDataFromApi()
                        e.target.reset();
                        
                    }
                } catch (error) {
                    console.log('Error occurred:', error);
                }
            };


            const [selectedOptions, setSelectedOptions] = useState();
            const [fetchedDatas, setFetchedDatas] = useState([]);
            const [q_data, setQ_data] = useState({})
            const [q_datas, setQ_datas] = useState([])

            const handleDropdownQChange = (event) => {
                const data_selects = event.target.value;
                setSelectedOptions(data_selects);
                console.log('Selected Data',data_selects)
              };
              const fetchDataFromApis = async (selectedOptions) => {
                try {
                  const response = await fetch(`http://127.0.0.1:8000/assessmentQ/${selectedOptions}/`);
                  const data = await response.json();
                  console.log(data)
                  setFetchedDatas(data);
                } catch (error) {
                  console.error('Error fetching data:', error);
                }

                fetch(`http://127.0.0.1:8000/course_details/${selectedOptions}/` )
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setQ_data(data); // Set initial state with fetched data
                    setOriginalData(data); // Set original data for comparison
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    // Handle error
                });



                fetch(`http://127.0.0.1:8000/topic_details/${selectedOptions}/` )
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                    
                })
                .then(data => {
                    console.log(data)
                    setQ_datas(data); // Set initial state with fetched data
                    setOriginalData(data); // Set original data for comparison
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    // Handle error
                });

              };
            
              // Trigger the API call when the dropdown selection changes
              useEffect(() => {
                if (selectedOptions) {
                  fetchDataFromApis(selectedOptions);
                }
              }, [selectedOptions]);

              const [question, setQuestion] = useState([]);
              const [newValue, setNewValue] = useState({
                course_enroll_id: '',
                module: '',
              });


              const [q_questionCount, setQ_QuestionCount] = useState();
                
              const uploadQuestions = (course_id, module_id) => {
                setNewValue({
                    course_enroll_id: course_id,
                    module: module_id,
                });
            
                fetch(`http://127.0.0.1:8000/course_module/${course_id}/${module_id}/`)
                    .then(response => response.json())
                    .then(res => setQuestion(res))
                    .catch(error => console.error('Error fetching questions data:', error));
            
                fetch(`http://127.0.0.1:8000/Q_count/${course_id}/${module_id}/`)
                    .then(response => response.json())
                    .then(res => setQ_QuestionCount(res.Q_count))
                    .catch(error => console.error('Error fetching question count data:', error));
            };
            
            const [handleQuestions, setHandleQuestions] = useState({
                question: '',
                option_1: '',
                option_2: '',
                option_3: '',
                option_4: '',
                correct_answer: ''
            });

              const handleQuestionChange = (event, fieldName) => {
                const value = event.target.value;
                setHandleQuestions(prevUpdate => ({
                  ...prevUpdate,
                  [fieldName]: value,
                }));
              }

              const [dataAsses, setDataAsses]= useState([])
    useEffect(()=>{
        axios
        .get('http://127.0.0.1:8000/assessment/')
        .then((response)=>{
            setDataAsses(response.data)
        })
        .catch((error)=>{
            console.log("error")
        })
    }, [data])


            
              const submitQuestion = async (e) => {
                e.preventDefault();
                console.log('Current handleQuestions state:', handleQuestions);
              
                // Assuming question is defined somewhere
                console.log('Question:', question);
              
                // Assuming handleQuestions state is properly updated, log each field to verify
                console.log('Question:', handleQuestions.question);
                console.log('Option 1:', handleQuestions.option_1);
                console.log('Option 2:', handleQuestions.option_2);
                console.log('Option 3:', handleQuestions.option_3);
                console.log('Option 4:', handleQuestions.option_4);
                console.log('Correct Answer:', handleQuestions.correct_answer);

                console.log('Course ID:', newValue.course_enroll_id);
                console.log('Module', newValue.module);

              
                // Construct FormData object as before
                const questionData = new FormData();
                questionData.append('course_enrollment_id', newValue.course_enroll_id);
                questionData.append('module', newValue.module);
                questionData.append('assessment_name', 'Module Assessment');
                questionData.append('question', handleQuestions.question);
                questionData.append('option_1', handleQuestions.option_1);
                questionData.append('option_2', handleQuestions.option_2);
                questionData.append('option_3', handleQuestions.option_3);
                questionData.append('option_4', handleQuestions.option_4);
                questionData.append('correct_answer', handleQuestions.correct_answer);
                questionData.append('status', 'Inactive');
                questionData.append('submission_method', 'Online');
                questionData.append('question_no',q_questionCount +1)
              
                console.log('After Submission', questionData.course_enrollment_id);
                try {
                   


                    const response = await axios.post('http://127.0.0.1:8000/create_assessment/', questionData);
                    console.log(response.data)

                    fetchData();
                    
            
                    if (response.status === 201) {
                        toast.success("Question Added Successfully", {
                            position: toast.POSITION.TOP_CENTER,
                            theme: 'colored'
                        });
                        e.target.reset();
                    }
                } catch (error) {
                    console.log('Error occurred:', error);
                }
            };
              
            const[questionCount, setQuestionCount] = useState([])
            const fetchQuest = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/course-question/count/`);
                    setQuestionCount(response.data);
                    
                } catch (error) {
                    console.error("Error fetching course materials:", error);
                }
            };
        
            useEffect(() => {
                fetchQuest();
            }, [questionCount]);

            const [mod, setMod] = useState([]);
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


            const [selectedOption2, setSelectedOption2] = useState();
            const handleDropdownQChanges = (event) => {
                const data_select2 = event.target.value;
                setSelectedOption2(data_select2);
                console.log('Selected Data',data_select2)
              };
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

            const [fetched, setFetched] = useState([]);
            const fetchDataFrom = async (selectedOptions,selectedOption2) => {
                console.log(selectedOptions)
                console.log(selectedOption2)
                try {
                  const response = await fetch(`http://127.0.0.1:8000/assessment_Q/${selectedOptions}/${selectedOption2}/`);
                  const data = await response.json();
                  console.log(data)
                  setFetched(data);
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
            }
            useEffect(() => {
                if (selectedOptions && selectedOption2) {
                    fetchDataFrom(selectedOptions,selectedOption2);
                }
              }, [selectedOptions,selectedOption2]);

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

            const handleQuestionChanges = (event, fieldName) => {
                const value = event.target.value;
                setQuestionUpdate(prevUpdate => ({
                  ...prevUpdate,
                  [fieldName]: value,
                }));
              }
              const[score, setScore] = useState([])
              const handleScoreDetails  = async(course_enrollment_id, stud_id)=>{
                console.log('COURSE ID VALE:',course_enrollment_id )
                console.log('STUDENT ID', stud_id)
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/score_details/${course_enrollment_id}/${stud_id}/`);
                    setScore(response.data);
                    console.log("RESPONSE DATA", response);
                } catch (error) {
                    console.error("Error fetching course materials:", error);
                }
              }


              const[totalClass, setTotalClass] = useState({})
              const[totalWatchedClass, setTotalWatchedClass] = useState({})
        const videoCount = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/totalVideo_count/${facultyAssign.course_enrollment_id}/`);
                setTotalClass(response.data);
                console.log("RESPONSE DATA", response);
            } catch (error) {
                console.error("Error fetching course materials:", error);
            }
        };
    
        useEffect(() => {
            videoCount();
        }, [ups.course_enrollment_id, up.module]);



            
  return (
    <>
      <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <a class="navbar-brand font-weight-bolder" href="index.html">E-LEARNING</a>
            <button class="btn btn-link btn-sm order-1 order-lg-0" id="sidebarToggle" href="#"><i class="fa fa-bars" aria-hidden="true"></i></button>
         
            <form class="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">
                <div class="input-group">
                    <input class="form-control" type="text" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button"><i class="fa fa-search" aria-hidden="true"></i></button>
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
        <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div class="sb-sidenav-menu">
                <div class="nav">
                    <div class="sb-sidenav-menu-heading">Core</div>
                    <a class="nav-link " id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home"  aria-selected="true">
                        <div class="sb-nav-link-icon"><i class="fa fa-tachometer" aria-hidden="true"></i></div>
                        Dashboard
                    </a>
                   
                   

                    


                    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePagess" aria-expanded="false" aria-controls="collapsePagess">
                        <div class="sb-nav-link-icon"><i class="fas fa-book-open"></i></div>
                              <p className='font-weight-bolder'> <i class="fa fa-crosshairs" aria-hidden="true"></i> &nbsp;Course Enrollments</p>
                        <div class="sb-sidenav-collapse-arrow"><i class="fa fa-sort-desc" aria-hidden="true"></i></div>
                    </a>
                    <div class="collapse" id="collapsePagess" aria-labelledby="headingTwo" data-parent="#sidenavAccordion">
                        <nav class="sb-sidenav-menu-nested nav">
                            
                           

                            {
                                course.map((items)=>(
                                    <a class="nav-link font-weight-bolder" id="course_mods-tab" data-toggle="tab" href="#course_mods" role="tab" aria-controls="course_mods" aria-selected="false" onClick={()=>handleLinkClick(items.course_enrollment_id)}>
                                        <div class="sb-nav-link-icon"><i class="fa fa-book" aria-hidden="true"></i></div>
                                        {items.course_name}
                                    </a>
                                ))
                            }
                                          
                        </nav>
                    </div>


                   

                    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseAssess" aria-expanded="false" aria-controls="collapseAssess">
                        <div class="sb-nav-link-icon"><i class="fas fa-book-open"></i></div>
                        <p className='font-weight-bolder'><i class="fa fa-book" aria-hidden="true"></i> &nbsp;Course Assessments</p>
                        <div class="sb-sidenav-collapse-arrow"><i class="fa fa-sort-desc" aria-hidden="true"></i></div>
                    </a>
                    <div class="collapse" id="collapseAssess" aria-labelledby="headingTwo" data-parent="#sidenavAccordion">
                        <nav class="sb-sidenav-menu-nested nav">
                            <a class="nav-link"  id="assessment-tab" data-toggle="tab" href="#assessment" role="tab" aria-controls="assessment" aria-selected="false">
                                <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                                Create Assessments
                            </a>
                             <a class="nav-link"  id="assess_quest-tab" data-toggle="tab" href="#assess_quest" role="tab" aria-controls="assess_quest" aria-selected="false">
                                <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                                Add Questions
                            </a>
                             <a class="nav-link" id="questions-tab" data-toggle="tab" href="#questions" role="tab" aria-controls="questions" aria-selected="false">
                                <div class="sb-nav-link-icon"><i class="fas fa-table"></i></div>
                                Questions
                            </a> 
                                          
                        </nav>
                    </div>



                   

                    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseFaculty" aria-expanded="false" aria-controls="collapseAssess">
                        <div class="sb-nav-link-icon"><i class="fas fa-book-open"></i></div>
                        <p className='font-weight-bolder'><i class="fa fa-users" aria-hidden="true"></i> &nbsp; Assessment Test</p>
                        <div class="sb-sidenav-collapse-arrow"><i class="fa fa-sort-desc" aria-hidden="true"></i></div>
                    </a>
                    <div class="collapse" id="collapseFaculty" aria-labelledby="headingTwo" data-parent="#sidenavAccordion">
                        <nav class="sb-sidenav-menu-nested nav">
                            <a class="nav-link"  id="faculty-tab" data-toggle="tab" href="#faculty" role="tab" aria-controls="faculty" aria-selected="false">
                                <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                                Assessment result
                            </a>
                              
                                          
                        </nav>
                    </div>




                    
                    
                    
                    
                    
                   

                        

                           
                            
                                
                                    
                </div>
            </div>
            <div class="sb-sidenav-footer">
                <div class="small">Logged in as:</div>
                {userData.faculty_name} {totalClass.total}
            </div>
        </nav>
    </div>
    <div id="layoutSidenav_content">
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <div class="container" style={{padding: 30}}>
                        
                            <div class="row">
                                    <div class="col-md-4" >
                                        <div class="card border-primary mb-3 shadow" style={{ maxWidth: '18rem' }}>
                                            <div class="card-header" style={{fontWeight: "bold"}}>STUDENTS</div>
                                            <div class="card-body text-primary">
                                                <h5 class="card-title">Registered Students</h5>
                                                <p class="card-text text-center"  style={{ fontSize: 50, fontWeight: 'bolder' }}>{totalCount.purchase_count}</p>
                                            </div>
                                        </div>
                                    </div>
                                <div class="col-md-8" >
                                    <div class="card border-primary mb-3 shadow" style={{ maxWidth: '28rem', height:200 }}>
                                        <div class="card-header" style={{fontWeight: "bold"}}>COURSES</div>
                                        <div class="card-body text-primary">
                                          <h5 class="card-title">Department </h5>
                                          <p class="card-text text-center pt-3"  style={{ fontSize: 23, fontWeight: 'bolder' }}>{facultyAssign.course_name}</p>
                                        </div>
                                      </div>

                                </div>
                            </div>
                        </div>

                        <div class="container shadow" style={{padding: 20}}>
                            <div className='row' style={{marginBottom:20, marginLeft:850}}>
                                <input type='text' className='form-control' placeholder='Search Here' style={{width:200}} value={searchItem}
                                
                                onChange={(e)=>{
                                    setSearchItem(e.target.value);
                                    setCurrentPage(1);

                                }}
                                ></input>
                            </div>
                            <table class="table table-hover table-striped">
                                <thead>
                                  <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Student Name</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">Mail Id</th>
                                    <th scope="col">Phone No</th>
                                    <th scope='col'>Registration</th>
                                    <th scope="col">Qualification</th>
                                  
                                  </tr>
                                </thead>
                                <tbody>
                                {
                                    records.map((item) => (
                                        
                                        data.map((it) => (
                                            (item.stud_reg === it.id) && (
                                                <tr key={it.id}>
                                                    <th scope="col">{it.id}</th>
                                                    <th scope="col"><img src={it.stud_img} style={{ width: 30, borderRadius: '50%' }} />&nbsp;{it.Stud_name}</th>
                                                    <th scope="col">{it.gender}</th>
                                                    <th scope="col">{it.email}</th>
                                                    <th scope="col">{it.phone}</th>
                                                    <th scope='col'>{it.reg_date}</th>
                                                    <th scope="col">{it.qualification}</th>
                                                </tr>
                                            )
                                        ))
                                    ))
                                }

                                 
                                </tbody>
                            </table>

                            
                            <nav aria-label="...">
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

                            <br />
                        </div>
            </div>
            <div class="tab-pane fade" id="social" role="tabpanel" aria-labelledby="social-tab">
                <h3 className='text-center font-weight-bolder pt-5'>Enrolled Students</h3>
                    <div class="container shadow" style={{padding: 20, marginTop:50}}>
                            <div className='row' style={{marginBottom:20, marginLeft:850}}>
                                <div className='col-md-2'>

                                </div>
                                <div className="col-md-2">

                                </div>
                                <div className='col-md-8'>
                                <button type="button" class="btn btn-success font-weight-bolder" data-toggle="modal" data-target="#myModal" onClick={() => setShowModal(true)}>Add Students</button>
                                </div>
                            </div>
                            <table class="table table-hover table-striped">
                                <thead>
                                  <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Student Name</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">Mail Id</th>
                                    <th scope="col">Phone No</th>
                                    <th scope='col'>Registration</th>
                                    <th scope="col">Qualification</th>
                                  
                                  </tr>
                                </thead>
                                <tbody>
                                    {
                                        records.map((item)=>(
                                            <tr>
                                                <td scope="col">{item.id}</td>
                                                <td scope="col"><img src={item.stud_img} style={{width:30, borderRadius:'50%'}} />&nbsp;{item.Stud_name}</td>
                                                <td scope="col">{item.gender}</td>
                                                <td scope="col">{item.email}</td>
                                                <td scope="col">{item.phone}</td>
                                                <td scope='col'>{item.reg_date}</td>
                                                <td scope="col">{item.qualification}</td>
                                            
                                            </tr>
                                            
                                        ))
                                    }
                                
                                 
                                </tbody>
                            </table>

                            
                            <nav aria-label="...">
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

                            <br />
                         </div>
            </div>

            <div class="tab-pane fade" id="course_mods" role="tabpanel" aria-labelledby="course_mods-tab">
                
                <div className='container-fluid mt-5'>
                        <div className='row'>
                            {
                                courses.map((itemsss)=>(
                                    <div className='col-md-4 mb-5 rounded-top'>
                                        <div class="card shadow" style={{width:330, borderRadius:30}}>
                                            <div className='card-header' style={{height:220,backgroundColor: '#042224',borderRadius:'30px 30px 0px 0px'}}>
                                                
                                                <p className='text-center ' style={{fontSize:48, fontWeight:700, color:'rgba(51, 143, 51, 0.969)',marginBlock:-20, marginTop:10}}>MODULE</p> <p className='text-center ' style={{fontSize:58, fontWeight:700, color:'rgba(51, 143, 51, 0.969)',}}>0{itemsss.module}</p>
                                                <p style={{fontSize:18, fontWeight:900, color:'grey',marginTop:20, textTransform:'uppercase'}}>{itemsss.topic_title}</p>                                            
                                            </div>
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
                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <button className='btn btn-warning text-white'  onClick={() => handleMaterials(itemsss.id, itemsss.course_enrollment_id)} >Materials</button>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <a className='btn btn-success font-weight-bold ml-1 w-100' href="#" data-toggle="modal" data-target="#myModalq" onClick={()=>updateModules(itemsss.id)}>Edit</a>
                                                    </div>
                                                    <div className='col-md-4'>
                                                    <a className='btn btn-danger font-weight-bold ml-1 w-100' href="#" data-toggle="modal" data-target="#myModalzz" onClick={()=>updateModules(itemsss.id)}>Delete</a>
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

            <div class="tab-pane fade" id="enrolled" role="tabpanel" aria-labelledby="enrolled-tab">
                                    
                                    <EnrolledStudents />
            </div>
            <div class="tab-pane fade" id="course_add" role="tabpanel" aria-labelledby="course_add-tab">
                                    
                                   <Add_Course />
            </div>
            <div class="tab-pane fade" id="course_det" role="tabpanel" aria-labelledby="course_det-tab">
                                    
                                   <Course_Details />
            </div>

{/* --------------------------------------------------------------Course Modules -------------------------------------------------------------*/}



            <div class="tab-pane fade" id="course_mod" role="tabpanel" aria-labelledby="course_mod-tab">
                                    
                                   


                <h3 className='text-center p-3 font-weight-bolder'>Add Course Module Here</h3>

      
      


                <div className='container-fluid m-4 w-auto' >
                    <div className='container-fluid p-5'>
                    <form id="myForm" onSubmit={handleSubmits}>
                        <div className='row'>
                            
                            <div className='col-md-6 pb-2'>
                            <label htmlFor="course_enrollment_id" className='font-weight-bolder'>Course Name:</label>
                                <select name="course_enrollment_id" className='form-control font-weight-bolder' onChange={handleChanges}>
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
                                <select id="module" name="module" onChange={handleChanges} className='form-control font-weight-bolder' >
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
                                <input type="text" id="topic_title" name="topic_title" value={formDatas.topic_title} className='form-control font-weight-bolder' onChange={handleChanges}  />
                            </div>
                            <div className='col-md-6 pb-2'>
                            <label htmlFor="topic_details" className='font-weight-bolder'>Topic Details:</label>
                            <input type="text" id="topic_details" name="topic_details" value={formDatas.topic_details} className='form-control font-weight-bolder' onChange={handleChanges} />
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
                                <th scope="col">Start Date</th>
                                <th scope="col">Status</th>
                                <th scope="col">Price</th>
                                <th scope='col'>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas.map((items)=>(
                                        <tr className='font-weight-bolder'>
                                            <th scope="col">{items.course_enrollment_id}</th>
                                            <td><img src={items.course_img} className='img-thumbnail' style={{width:50, borderRadius:'40%'}} />&nbsp;{items.course_name}</td>
                                            <td>{items.created_at}</td>
                                            <td>{items.start_date}</td>
                                            {items.status === 'Active' ? (
                                            <td className="font-weight-bolder" style={{color:'green'}}>{items.status}</td>
                                            ): (
                                                <td className="font-weight-bolder" style={{color:'red'}}>{items.status}</td>
                                                )}
                                            <td>₹{items.price}</td>
                                            <td>
                                                
                                                
                                                <button className='btn btn-danger  font-weight-bold ml-1'  >Delete</button>
                                                </td>

                                                
                                            
                                            </tr>
                                    ))
                                }
                                
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>












{/* --------------------------------------------------------------Modules Details  -------------------------------------------------------------*/}





            
            <div class="tab-pane fade" id="course_module" role="tabpanel" aria-labelledby="course_module-tab">

                
                                    
                     
                    <div className='container-fluid mt-5'>
                        <div className='row'>
                            {
                                courses.map((itemsss)=>(
                                    <div className='col-md-4 mb-5 rounded-top'>
                                        <div class="card shadow" style={{width:330, borderRadius:30}}>
                                            <div className='card-header' style={{height:220,backgroundColor: '#042224',borderRadius:'30px 30px 0px 0px'}}>
                                                
                                                <p className='text-center ' style={{fontSize:48, fontWeight:700, color:'rgba(51, 143, 51, 0.969)',marginBlock:-20, marginTop:10}}>MODULE</p> <p className='text-center ' style={{fontSize:58, fontWeight:700, color:'rgba(51, 143, 51, 0.969)',}}>0{itemsss.module}</p>
                                                <p style={{fontSize:20, fontWeight:900, color:'grey',marginTop:20, textTransform:'uppercase'}}>{itemsss.topic_title}</p>                                            
                                            </div>
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
                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <button className='btn btn-warning text-white' id="course_mat-tab" data-toggle="tab" href="#course_mat" role="tab" aria-controls="course_mat" aria-selected="false" onClick={() => handleMaterials(itemsss.id, itemsss.course_enrollment_id)} >Materials</button>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <a className='btn btn-success font-weight-bold ml-1 w-100' href="#" data-toggle="modal" data-target="#myModalz" onClick={()=>updateModules(itemsss.id)}>Edit</a>
                                                    </div>
                                                    <div className='col-md-4'>
                                                    <a className='btn btn-danger font-weight-bold ml-1 w-100' href="#" data-toggle="modal" data-target="#myModalzz" onClick={()=>updateModules(itemsss.id)}>Delete</a>
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

            {/* <--------------------------------------------------------------------Course Materials ---------------------------------------------------> */}

            <div class="tab-pane fade" id="course_mat" role="tabpanel" aria-labelledby="course_mat-tab">

                            <div className='container p-4 mt-3 ' style={{backgroundColor:'#F8F8FF', border:'solid 1px lightgrey'}}>
                                <h2>{ups.course_name}({up.topic_title})</h2>
                            </div>
                            <div className='container p-3' style={{ border:'solid 1px lightgrey'}}>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <p>Module Contents</p>
                                    </div>
                                    <div className='col-md-8 ' >
                                        <div className='inner' style={{ marginLeft:200}}>
                                            <a className='btn btn-success ' href="#" data-toggle="modal" data-target="#myModalmat">+ Create New Video</a>
                                            <a className='btn btn-warning ml-2 text-dark' href="#" data-toggle="modal" data-target="#myModalTask"> + Upload PDF/ Task</a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='container p-3' style={{ border:'solid 1px lightgrey'}}>
                                <table class="table table-striped mt-5">
                                    <thead>
                                        <tr>
                                        <th scope="col">#Module</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Thumbnail</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Opeartions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        

                                        {
                                            display.map((it)=>(
                                                <tr className='font-weight-bold'>
                                                    <th scope="row">{it.module}</th>
                                                    <td>{it.video_title}</td>
                                                    <td> <img src={it.Thumbnail} style={{width:65}} className='img-thumbnail'></img></td>
                                                        {it.type ==='Video' ?(
                                                                <td className='btn btn-success' style={{padding:2, marginTop:25, borderRadius:5}}>{it.type}</td>
                                                        ):(
                                                            <td className='btn btn-info' style={{padding:2, marginTop:25, borderRadius:5}}>{it.type}</td>
                                                        )}
                                                    
                                                    <td>{it.created_at}</td>
                                                    <td>
                                                        <a className='btn btn-success' href="#" data-toggle="modal" data-target="#myModalEdit" onClick={()=>updateMaterial(it.id)}>Edit</a>&emsp;
                                                        <a className='btn btn-danger' >Delete</a></td>
                                                    

                                                    </tr>

                                            ))
                                        }
                                        
                                    </tbody>
                                </table>
                            </div>

            </div>

            <div class="tab-pane fade" id="assessment" role="tabpanel" aria-labelledby="assessment-tab">

                         <div className='container p-4 mt-3 ' style={{backgroundColor:'#F8F8FF', border:'solid 1px lightgrey'}}>
                                <h2 className='font-weight-bolder'>Create Assessment Here</h2>
                            </div>
                            <div className='container p-3' style={{ border:'solid 1px lightgrey'}}>
                                <div className='row'>
                                    <div className='col-md-4' >
                                        <p className='font-weight-bold font-italic'>ASSESSMENTS</p>
                                    </div>
                                    <div className='col-md-8 '  >
                                        <div className='inner' style={{  display: 'flex', alignItems: 'center',width:'80%'}}>

                                            <label style={{width:'50%',marginLeft:200}} >Select Course</label>
                                            <select className='form-control font-weight-bold' name='course_name' value={selectedOption} onChange={handleDropdownChange} style={{width:'100%'}}>
                                                <option className='font-weight-bold'>-------Select Course-------</option>

                                                {
                                                    course.map((item)=>(
                                                        <option className='font-weight-bold' value={item.course_enrollment_id}>{item.course_name}</option>
                                                    ))
                                                }
                                                        
                                                               
                                                           
                                                   
                                                
                                            </select> 
                                        </div>
                                    </div>

                                </div>
                        </div>

                        <div className='container'>
                            
                            
                                <div className='row'>
                                
                                {fetchedData.map((it) => (
    <div className='col-md-4 p-4' key={it.id}>   
        <div class="card border-primary mb-3" style={{maxWidth: '18rem'}}>
            <div class="card-header font-weight-bold">#Module {it.module}</div>
            <div class="card-body">
                <h5 class="card-title font-italic">{it.topic_title}</h5>
                {dataAsses.map((items) => {
                    if (it.course_enrollment_id === items.course_enrollment_id && it.module === items.module) {
                        return (
                            <p class="card-text p-2" key={items.id}>
                               
                                <button className='btn btn-primary font-weight-bold' data-toggle="modal" data-target="#myModalAssess" disabled onClick={() => updateModules(it.id)}>Create Assessment Already</button>
                            </p>
                        );
                    }
                    return null;
                })}
                {/* Render the "Create Assessment" button outside the dataAsses.map() */}
                {!dataAsses.some((items) => it.course_enrollment_id === items.course_enrollment_id && it.module === items.module) && (
                    <Link to="#" className='btn btn-primary font-weight-bold' data-toggle="modal" data-target="#myModalAssess" onClick={() => updateModules(it.id)}>Create Assessment</Link>
                )}
            </div>
        </div>
    </div>
))} 
                            </div>
                        </div>

            </div>
            <div class="tab-pane fade" id="assess_quest" role="tabpanel" aria-labelledby="assess_quest-tab">


                            <div className='container p-4 mt-3 ' style={{backgroundColor:'#F8F8FF', border:'solid 1px lightgrey'}}>
                                    <h2 className='font-weight-bolder'>Create Question Here</h2>
                            </div>
                            <div className='container p-3' style={{ border:'solid 1px lightgrey'}}>
                                <div className='row'>
                                    <div className='col-md-4' >
                                        <p className='font-weight-bold font-italic'>ASSESSMENTS OUESTIONS</p>
                                    </div>
                                    <div className='col-md-8 '  >
                                        <div className='inner' style={{  display: 'flex', alignItems: 'center',width:'80%'}}>

                                            <label style={{width:'50%',marginLeft:200}} >Select Course</label>
                                            <select className='form-control font-weight-bold' name='course_name' value={selectedOptions} onChange={handleDropdownQChange} style={{width:'100%'}}>
                                                <option className='font-weight-bold'>-------Select Course-------</option>
                                                {
                                                    course.map((items)=>(
                                                        
                                                        <option className='font-weight-bold' value={items.course_enrollment_id}>{items.course_name}</option>
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
                                            
                                            
                                            {
                                                q_datas.map((itemz)=>(


                                                    <>
                                                    
                                                    {
                                                        data.module === itemz.module ? (

                                                            <p class="accordion-button collapsed text-center" data-bs-toggle="collapse" data-bs-target={`#flush-collapse-${index}`} aria-expanded="false" aria-controls={`flush-collapse-${index}`} style={{fontSize:20}}>Assessment # {itemz.topic_title}</p>
                                                        ):null
                                                    }
                                                    </>
                                                ))
                                            }
                                            
                                            
                                        </h2>
                                        <div id={`flush-collapse-${index}`} class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                            <div class="accordion-body  w-80 shadow-sm p-2 mb-5 bg-body-tertiary rounded font-weight-bold" style={{border: 'solid 1px lightgrey'}}>
                                                <div className='row'>
                                                    <div className='col-md-8' style={{textAlign: 'left',borderRight:'solid 2px lightgrey'}}>
                                                        <p>Assessment Level: &emsp;&emsp;&emsp;{data.exam_level}</p>
                                                        <p>Total Questions:  &emsp;&emsp;&emsp;&emsp; {data.total_question}</p>

                                                        
                                                        {questionCount.map((items) => (
                                                            <div>
                                                            {data.course_enrollment_id === items.course_enrollment_id && data.module === items.module  ? (
                                                                <>
                                                                <p>Uploaded Questions:&emsp;&emsp; {items.total_count} </p>
                                                                <div>
                                                                    {data.total_question === items.total_count   ? (
                                                                        <p className='text-muted' style={{color:'green'}}>Status: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Upload Completed</p>
                                                                        
                                                                    ) : null}
                                                                </div>

                                                                </>
                                                                
                                                            ) : null}
                                                        </div>
                                                        ))}

                                                        {/* {questionCount.map((item) => (
                                                            <div>
                                                            {data.total_question === item.total_count   ? (
                                                                <p>Status: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Upload Completed</p>
                                                                
                                                            ) : null}
                                                        </div>
                                                        ))} */}

                                                        


                                                        
                                                    </div>
                                                    <div className='col-md-4 p-4' >
                                                        <p>Add Question</p>
                                                        <Link to="#" className='pl-4' data-toggle="modal" data-target="#myModalQ" onClick={()=>uploadQuestions(data.course_enrollment_id,data.module)}><img src={Edit} style={{width:30}}></img></Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                
                            ))}
                            </div>
                        </div>

                        
                    

                    
            </div>
            <div class="tab-pane fade" id="questions" role="tabpanel" aria-labelledby="questions-tab">
                <div className='container p-4 mt-2 ' style={{backgroundColor:'#F8F8FF', border:'solid 1px lightgrey'}}>
            <h2 className='font-weight-bolder'>Uploaded Questions</h2>
        </div>

        <div className='container p-3' style={{ border:'solid 1px lightgrey'}}>
            <div className='row'>
                <div className='col-md-2' >
                    <p className='font-weight-bold font-italic'>ASSESSMENTS OUESTIONS</p>
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
                            {fetched.map((data, index) => (
                                
                                    <div className='col-md-6'>
                                    <div class="accordion-item p-3" key={index}>
                                        <h2 class="accordion-header">
                                            
                                            
                                           

                                                   

                                                            <p class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target={`#flush-collapse-${index}`} aria-expanded="false" aria-controls={`flush-collapse-${index}`} style={{fontSize:20}}>Question # {data.question_no}</p>
                                                       
                                            
                                        </h2>
                                        <div id={`flush-collapse-${index}`} class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                            <div class="accordion-body  w-80 shadow-sm p-2 mb-5 bg-body-tertiary rounded font-weight-bold" style={{border: 'solid 1px lightgrey'}}>
                                                <div className='row p-3'>
                                                    
                                                   
                                                        <p>{data.question}</p>
                                                        <div className='container'>
                                                            <div className='row'>
                                                                <div className='col-md-6'>
                                                                    <p style={{fontSize:14, textAlign:'left'}}>1. {data.option_1}</p>
                                                                </div>
                                                                <div className='col-md-6'>
                                                                    <p style={{fontSize:14}}>2. {data.option_2}</p>
                                                                </div>
                                                                <div className='col-md-6'>
                                                                    <p style={{fontSize:14}}>3. {data.option_3}</p>
                                                                </div>
                                                                <div className='col-md-6'>
                                                                    <p style={{fontSize:14}}>4. {data.option_4}</p>
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
            </div>

            <div class="tab-pane fade" id="faculty" role="tabpanel" aria-labelledby="faculty-tab">
                <div className='container p-4 mt-3 ' style={{backgroundColor:'#F8F8FF', border:'solid 1px lightgrey'}}>
                    <h2 className='font-weight-bolder'>Assessment Taken Details...</h2>
                </div>
                <div className="container" style={{marginTop: 20,marginLeft:40 }}>
                <h3 style={{padding:20}}><b>ASSESSMENT STAT</b></h3>
                <div className="row shadow " style={{padding:20,width:1100, backgroundColor: 'white'}}>
                    <div className='search' style={{padding:20, marginLeft:30}}>
                        <div className='row'>
                            <div className='col-md-6'>

                            </div>
                            <div className='col-md-6'style={{width:'30%'}}>
                                <input type='text' className='form-control' placeholder='Search Here'  />
                            </div>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table className='table  table-hover  '  style={{fontFamily: 'century',}}>
                            <thead style={{fontSize:12}}>
                                <tr>
                                <th style={{fontSize:18, fontWeight: 'bold', padding: 20}}>ID</th>
                                <th style={{fontSize:18, fontWeight: 'bold',padding: 20}}>Student Name</th>
                                <th style={{fontSize:18, fontWeight: 'bold',padding: 20}}>Contact No</th>
                                <th style={{fontSize:18, fontWeight: 'bold',padding: 20}}>Mail Id</th>
                                <th style={{fontSize:18, fontWeight: 'bold',padding: 20}}>Test result</th>
                                
                                {/* Add more table headers here */}
                                </tr>
                            </thead>
                            <tbody>
                            {
                                    records.map((item) => (
                                        
                                        data.map((it) => (
                                            (item.stud_reg === it.id) && (
                                    
                                <tr key={item.id}>
                                    <td>{it.id}</td>
                                    <td style={{textAlign:'left', paddingLeft: 20}}>
                                    <img src={it.stud_img} class="img-rounded" alt={item.stud_name} style={{width:50, height:50, borderRadius:50}}/>&emsp;
                                        {it.Stud_name} &nbsp;{item.last_name}
                                    </td>
                                    <td>{it.phone}</td>
                                    <td>{it.email}</td>
                                        
                                    {/* Add more table cells here */}
                                    <td>
                                    <Link to="#" className='text-center' data-toggle="modal" data-target="#myModalTest" onClick={()=>handleScoreDetails(facultyAssign.course_enrollment_id,it.id)} ><img src={Edit1} alt='dgfhdg' style={{width:25, height:25,}} /></Link>&emsp;
                                    </td>
                                    
                                </tr>
                                     )
                                     ))
                                 ))
                             }
                            
                            </tbody>
                        </table>

                    </div>        
                        
                </div>
            </div>

            </div>
            <div class="tab-pane fade" id="facultyAdd" role="tabpanel" aria-labelledby="facultyAdd-tab">
                <AddFaculty />
            </div>
            
            
            

        </div>
    </div>
</div>

<div  className="modal fade" id="myModalAssess" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" style={{width:680}} >
            <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title font-italic" id="exampleModalLabel">Create Assessment</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
            </div>
            <form onSubmit={handleSubmitAss}>
            <div class="modal-body">

                <div className='container'>
                 
                    <div className='row'>
                        
                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }} >
                            <label className='font-weight-bold'>Course Id:</label>
                            <input type='number' className='form-control' name="course_enrollment_id" value={up.course_enrollment_id} onChange={handleAssessment} readOnly></input>
                        </div>
                        <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }} >
                            <label className='font-weight-bold'>Module:</label>
                            <input type='number' className='form-control ml-2' name="module" value={up.module} onChange={handleAssessment} readOnly></input>
                        </div>
                        <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                            <label className='font-weight-bold'>Exam Level:</label>
                            <select className='form-control ml-2' name="exam_level" onChange={handleAssessment} >
                                <option>--Assessment Level--</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium"> Medium</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                            <label className='font-weight-bold'>Total Questions:</label>
                            <input type='number' className='form-control ml-2' name="total_question" onChange={handleAssessment}></input>
                        </div>
                        <div className='col-md-12' style={{  display: 'flex', alignItems: 'center' }}>
                            <label className='font-weight-bold'>Total Marks:</label>
                            <input type='number' className='form-control ml-2' name="total_points" onChange={handleAssessment} ></input>
                        </div>
                        <div className='col-md-12' style={{  display: 'flex', alignItems: 'center' }}>
                            <label className='font-weight-bold'>Pass Mark:</label>
                            <input type='number' className='form-control ml-2' name="pass_mark" onChange={handleAssessment}></input>
                        </div>
                    </div>
                     
                </div>
              
            
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary" >Save Changes</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                
            </div>
            </form>
            </div>
        </div>
    </div>

    <div  className="modal fade" id="myModalQ" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" style={{width:700}} >
            <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title " id="exampleModalLabel">Upload Questions</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
            </div>
            <form onSubmit={submitQuestion}>
            <div class="modal-body">

                {}
                <p className='font-weight-bold ml-4' >Question: #{q_questionCount +1}</p>

                {/* {questionCount.map((item)=>(
                        <>
                        {
                            q.course_enrollment_id === item.course_enrollment_id && q.module === item.module ?(
                                <p>Question: {item.total_count}</p>
                            ):null
                        }
                        </>
                    ))
                } */}

            

            <div className='container'>
                <div className='row'>
                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                      
                            <label>Course Id:</label>
                            {question.map((q, index) => (<input type='text' className='form-control' name="course_enrollment_id" value={q.course_enrollment_id} onChange={(event)=>handleQuestionChange(event, 'course_enrollment_id')} ></input>))}
                    </div>
                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                      
                            <label>Module:</label>
                            {question.map((q, index) => (<input type='text' className='form-control' name="module" value={q.module} onChange={(event)=>handleQuestionChange(event, 'module')} ></input>))}
                    </div>
                    <div className='col-md-12' style={{  display: 'flex', alignItems: 'center' }}>
                      
                            <label>Question:</label>
                            <textarea type='text' className='form-control' name="question" onChange={(event)=>handleQuestionChange(event, 'question')}></textarea>
                    </div>
                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                      
                            <label>Option 1:</label>
                            <input type='text' className='form-control' name="option_1" onChange={(event)=>handleQuestionChange(event, 'option_1')} ></input>
                    </div>
                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                      
                            <label>Option 2:</label>
                            <input type='text' className='form-control' name="option_2" onChange={(event)=>handleQuestionChange(event, 'option_2')}></input>
                    </div>
                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                      
                            <label>Option 3:</label>
                            <input type='text' className='form-control' name="option_3" onChange={(event)=>handleQuestionChange(event, 'option_3')} ></input>
                    </div>
                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                      
                            <label>Option 4:</label>
                            <input type='text' className='form-control'  name="option_4" onChange={(event)=>handleQuestionChange(event, 'option_4')}></input>
                    </div>
                    <div className='col-md-12' style={{  display: 'flex', alignItems: 'center' }}>
                      
                            <label>Correct Answer:</label>
                            <input type='text' className='form-control' name="correct_answer" onChange={(event)=>handleQuestionChange(event, 'correct_answer')}></input>
                    </div>
                </div>
            </div>

              
            
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary" >Save Changes</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                
            </div>
            </form> 
            </div>
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
                                                    <input type='text' className='form-control' name="module" value={questionUpdate.module} onChange={(event)=>handleQuestionChanges(event, 'module')} ></input>
                                            </div>
                                            <div className='col-md-12' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Question:</label>
                                                    <textarea type='text' className='form-control' name="question" onChange={(event)=>handleQuestionChanges(event, 'question')} value={questionUpdate.question}></textarea>
                                            </div>
                                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Option 1:</label>
                                                    <input type='text' className='form-control' name="option_1" value={questionUpdate.option_1} onChange={(event)=>handleQuestionChanges(event, 'option_1')} ></input>
                                            </div>
                                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Option 2:</label>
                                                    <input type='text' className='form-control' name="option_2" value={questionUpdate.option_2}op onChange={(event)=>handleQuestionChanges(event, 'option_2')}></input>
                                            </div>
                                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Option 3:</label>
                                                    <input type='text' className='form-control' name="option_3" value={questionUpdate.option_3} onChange={(event)=>handleQuestionChanges(event, 'option_3')} ></input>
                                            </div>
                                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Option 4:</label>
                                                    <input type='text' className='form-control'  name="option_4" value={questionUpdate.option_4} onChange={(event)=>handleQuestionChanges(event, 'option_4')}></input>
                                            </div>
                                            <div className='col-md-12' style={{  display: 'flex', alignItems: 'center' }}>
                                            
                                                    <label>Correct Answer:</label>
                                                    <input type='text' className='form-control' name="correct_answer" value={questionUpdate.correct_answer} onChange={(event)=>handleQuestionChanges(event, 'correct_answer')}></input>
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



                        <div  className="modal fade" id="myModalTest" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg" style={{width:550}}>
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title " id="exampleModalLabel">Assessment Result</h4>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                </div>
                                <form onSubmit={(e)=>handleQuestionUpdate(e,questionUpdate.id)}>
                                <div class="modal-body font-weight-bold">
                                
                                    <div className='container'>
                                        <div className='row'>
                                            {
                                                score.map((items)=>(
                                                    <>
                                                    <div className='col-xl-12'>
                                                        <p>Course&emsp;&emsp;&emsp;&emsp;&nbsp;: &emsp;&emsp;&emsp;{facultyAssign.course_name}</p>        
                                                    </div>
                                                    <div className='col-xl-12'>
                                                        <p>Module&emsp;&emsp;&emsp;&emsp;: &emsp;&emsp;&emsp; {items.module}</p>
                                                    </div>
                                                    <div className='col-xl-12'>
                                                        <p>Correct&emsp;&emsp; &emsp;&emsp;: &emsp;&emsp; &emsp;{items.correct_answer}</p>
                                                    </div>
                                                    <div className='col-xl-12'>
                                                        <p>Wrong&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;:&emsp; &emsp;&emsp; {items.wrong_answer}</p>
                                                    </div>
                                                    <div className='col-xl-12'>
                                                        <p>Not attend&emsp;&emsp;&nbsp;&nbsp;: &emsp;&emsp;&emsp; {items.unattend}</p>
                                                    </div>
                                                    <div className='col-xl-6'>
                                                        <p>Final Score&emsp;&emsp;&nbsp;&nbsp;: &emsp;&emsp;&emsp; {items.final_score}</p>
                                                    </div>
                                                    <div className='col-xl-6'>
                                                        {
                                                            items.percent >= 50 ?(
                                                                <h6 className='font-weight-bolder' style={{display: 'flex'}}>Result&nbsp;: &emsp;<p className='font-weight-bolder' style={{color:'green'}}>Pass</p></h6>
                                                            ):(
                                                                <h6 className='font-weight-bolder'>Result&nbsp;: &emsp;<p className='font-weight-bolder' style={{color:'red'}}>Failed</p></h6>
                                                            )
                                                        }
                                                    </div>
                                                    </>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    
                                </div>
                                </form>
                                </div>
                            </div>
                        </div>

                        {/* <div  className="modal fade" id="myModalq" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" style={{ width: 750 }}>
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Module Update</h1>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>
                    <div class="modal-body">
                      
                        <div className='container'>
                        
                        <form onSubmit={(e) => updateMod(e, up.id)}>
                            <div className='row'>
                                <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                    <label className='mr-2'>Course Name:</label>
                                    <input type='text' className='form-control' name='course_enrollment_id' value={up.course_enrollment_id} onChange={(event)=>handleInputModule(event, 'course_enrollment_id')} readOnly />
                                </div>
                                <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                    <label className='mr-2'>Module:</label>
                                    <select name='module' className='form-control' value={up.module} onChange={(event)=>handleInputModule(event, 'module')}>
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

                                    </select>
                                </div>
                                <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                    <label className='mr-2'>Topic Title:</label>
                                    <input type='text' className='form-control' name='topic_title' value={up.topic_title} onChange={(event)=>handleInputModule(event, 'topic_title')} />
                                </div>
                                <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                    <label className='mr-2'>Topic Details:</label>
                                    <input type='text' className='form-control' name='topic_details' value={up.topic_details} onChange={(event)=>handleInputModule(event, 'topic_details')} />
                                </div>
                            </div>
                            <button type="submit" className='btn btn-primary ' style={{margin:'20px 20px 20px 270px'}}>Update Module</button>
                            </form>
                        </div>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" >Close</button>
                        
                    </div>
                    </div>
                </div>
            </div>  
       
    




{/* -------------------------------------------------------------------------Delete Module  Modals ----------------------------------------- */}


    
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
              
            <p className='font-weight-bolder'> Are you want to delete {up.topic_title} </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" >Delete</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                
            </div>
            </div>
        </div>
    </div>   */}



  
        
    </>
  )
}

export default FacultyDashboard
