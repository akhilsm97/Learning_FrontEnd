import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Upload from './images/upload.png';

function Materials() {
    const { id, enroll_id } = useParams();
    console.log('MATERIAL ID', id)
    console.log('MATERIAL ENROLL ID', enroll_id)
    function getDate() {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        const date = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${date}`;
      }
    
    // --------------------------------Update Module -----------------------------------------------------

    const [up, setUp] = useState({}); // Initialize with proper initial state
    const [originalData, setOriginalData] = useState({});

    // Fetch initial data when component mounts
    useEffect(() => {
        // Fetch initial data
        updateModules();
    }, []);

    // Function to fetch initial data
    const updateModules = () => {
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

    const [ups, setUps] = useState({});
    

        const handleMaterials=()=>{
            console.log("Material Id", id)
            

                fetch(`http://127.0.0.1:8000/course_details/${enroll_id}/` )
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setUps(data); // Set initial state with fetched data
                    setOriginalData(data); // Set original data for comparison
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    // Handle error
                });
        };

        useEffect(() => {
            // Fetch initial data
            handleMaterials();
        }, []);

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
                const modalElement = document.getElementById('yourModalId'); // Replace 'yourModalId' with the actual ID of your modal

                
               
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
//     const handleDelete=((id) =>{
       
//         fetch(`http://127.0.0.1:8000/topic/${id}/delete/ ` ,
//             {method: 'DELETE'})
//             .then(()=>{
//                 console.log("Deleted")

//             })
        
//         }
// )

    

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
                fetch(`http://127.0.0.1:8000/material_details/${id}/`)
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
                formDataPdf.append("video_title",'Code Challenge 1');
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


            const handleDeleted=((id) =>{
       
                // fetch(`http://127.0.0.1:8000/course_material/${id}/delete/ ` ,
                //     {method: 'DELETE'})
                //     .then(()=>{
                //         console.log("Deleted")
        
                //     })

                    
                
                }
        )

           



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
                        <a class="dropdown-item" href="logout.php">Logout</a>
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
            
            

             {/* <--------------------------------------------------------------------Course Materials ---------------------------------------------------> */}

             <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
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
                                        <a className='btn btn-danger' href="#" data-toggle="modal" data-target="#myModalDelete" onClick={()=>updateMaterial(it.id)} >Delete</a></td>
                                    

                                    </tr>

                            ))
                        }
                        
                    </tbody>
                </table>
            </div>

            </div>

        </div>
    </div>
</div>


<div  className="modal fade" id="myModalmat" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" >
            <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title font-weight-bolder font-italic " id="exampleModalLabel">Material Upload</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
            </div>
            <div class="modal-body">
                <div className='container-fluid'>
                 <form onSubmit={handleMaterialSubmit}> 
                        <div className='row'>
                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                <label className='font-weight-bold'>Course Id:</label>
                                <input type='text' className='form-control' name='course_enrollment_id' value={ups.course_enrollment_id}  onChange={handleMaterialss} readOnly></input>
                            </div>
                            <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                <label className='font-weight-bold' >Module:</label>
                                <input type='text' name='module' value={up.module} className='form-control ml-1' onChange={handleMaterialss} readOnly></input>
                            </div>
                            <div className='col-md-6 mt-2' style={{  display: 'flex', alignItems: 'center' }}>
                                <label className='font-weight-bold' >Video Title:</label>
                                <input type='text' name='video_title' className='form-control ml-1 text-center' placeholder='Video Title' onChange={handleMaterialss}></input>
                            </div>
                            <div className='col-md-6 mt-2' style={{  display: 'flex', alignItems: 'center' }}>
                                <label className='font-weight-bold' >Video Url:</label>
                                <input type='text' name='video_url' className='form-control ml-1 text-center' placeholder='Enter Video Url' onChange={handleMaterialss}></input>
                            </div>
                            <div className='col-md-6 mt-2' >
                            <div className="container con">
                                {imageSrc && (
                                    <img
                                    id="file-ip-1-preview"
                                    src={imageSrc}
                                    style={{ width: 150, height: 220 }}
                                    />
                                )}
                                <label htmlFor="file-ip-1" className="up_label">
                                    <img src={Upload} className="up_img" style={{ width: 30 }} />
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    id="file-ip-1"
                                    name="Thumbnail"
                                    accept="image/*"
                                    onChange={(event) => showPreview(event)}
                                    hidden
                                />
                                </div>
                            </div>
                            <div className='col-md-6 mt-2' style={{  display: 'flex', alignItems: 'center' }}>
                            
                            </div>
                        </div>

                        <button type='submit' className='btn btn-success' style={{marginLeft:300, marginTop:20}}>Upload Details</button>
                    </form>    
                </div>
              
            <p className='font-weight-bolder'></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary"  data-dismiss="modal" aria-label="Close">Close</button>
            </div>
            </div>
        </div>
    </div> 


    <div  className="modal fade" id="myModalTask" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg " style={{ width: '600px' }}>
                    <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title font-weight-bolder font-italic" id="exampleModalLabel">Challenge Upload</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>
                    <form onSubmit={handleMaterialPdf}>
                    <div class="modal-body">

                        <div className='container-fluid'>
                            <div className='row'>
                                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                        <label className='font-weight-bold'>Course Id:</label>
                                        <input type='text' className='form-control' name='course_enrollment_id' value={ups.course_enrollment_id} readOnly onChange={handleMaterialss} ></input>
                                    </div>
                                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                        <label className='font-weight-bold'>Module:</label>
                                        <input type='text' className='form-control' name='module' value={up.module} readOnly  onChange={handleMaterialss}></input>
                                    </div>
                                    
                                        <label className='font-weight-bold pt-2'>Document Title:</label>
                                        <input type='text' className='form-control' name='video_title' onChange={handleMaterialss}></input>

                                        <label className='font-weight-bold pt-2'>Thumbnail:</label>
                                        <input type='file' className='form-control' name='Thumbnail' id='fileInput1' onChange={showPdf}></input>


                                        
                                        <label className='font-weight-bold'>Select a file...</label>
                                        <input type='file' className='form-control' name='pdf' id="fileInput2" style={{border: 'solid 0px black'}} onChange={showPdf}></input>

                                    
                            </div>
                        </div>
                    
                    
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-success">Save</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        
                    </div>
                    </form>
                    </div>
                </div>
            </div>  

            <div  className="modal fade" id="myModalEdit" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" style={{ width: '700px' }}>
                    <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title " id="exampleModalLabel">Material Update</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>
                    <div class="modal-body">
                        <div className='container-fluid'>
                            <form onSubmit={(e)=>handleMaterialSubmits(e, materialUpdate.id )}  > 
                                <div className='row'>
                                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                        <label className='font-weight-bold'>Course Id:</label>
                                        <input type='text' className='form-control' name='course_enrollment_id' value={materialUpdate.course_enrollment_id} onChange={(event)=>handleMaterialUpdate(event, 'course_enrollment_id')} ></input>
                                    </div>
                                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                        <label className='font-weight-bold'>Module:</label>
                                        <input type='text' className='form-control' name='module' value={materialUpdate.module} onChange={(event)=>handleMaterialUpdate(event, 'module')}></input>
                                    </div>
                                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                        <label className='font-weight-bold'>Video Title:</label>
                                        <input type='text' className='form-control' name='video_title' value={materialUpdate.video_title} onChange={(event)=>handleMaterialUpdate(event, 'video_title')}></input>
                                    </div>
                                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                        <label className='font-weight-bold'>Video URL:</label>
                                        <input type='text' className='form-control' name='video_url' value={materialUpdate.video_url} onChange={(event)=>handleMaterialUpdate(event, 'video_url')}></input>
                                    </div>
                                    <div className='col-md-6' style={{  display: 'flex', alignItems: 'center' }}>
                                        <label className='font-weight-bold'>Video Thumbnail:</label>
                                        <img src={materialUpdate.Thumbnail} style={{width:50}} className='img-thumbnail'></img>
                                        <input type='file' className='form-control' name='Thumbnail' onChange={handleThumbnail} ></input>
                                    </div>
                                </div>    
                                <button type='submit' className='btn btn-primary' style={{margin:'20px 0px 0px 220px'}}>Update Materials</button>
                            </form>   
                        </div>     
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" aria-label="Close">Close</button>
                        
                    </div>
                    </div>
                </div>
            </div>


            <div  className="modal fade" id="myModalDelete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" style={{ width: '500px' }}>
                    <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title " id="exampleModalLabel">Material Delete</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>
                    <div class="modal-body">
                            <p className='font-weight-bolder'> Are you want to delete {materialUpdate.video_title} </p>     
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-danger" onClick={handleDeleted(materialUpdate.id)} >Delete</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" aria-label="Close">Close</button>
                        
                    </div>
                    </div>
                </div>
            </div> 
                        
 
      
    </>
  )
}

export default Materials
