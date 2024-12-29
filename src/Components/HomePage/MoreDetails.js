import React,{useState, useEffect} from 'react'
import NavBar from '../NavBar'
import './css/moreDetails.css';
import Ban  from './images/Image1.jpg';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MoreDetails() {
    let { course_id } = useParams();
    const [data, setData]= useState([])
    useEffect(()=>{
        axios
        .get(`http://127.0.0.1:8000/course_details/${course_id}/`)
        .then((response)=>{
            setData(response.data)
        })
        .catch((error)=>{
            console.log("error")
        })
    }, [data])

    const[module, setModule] = useState([])
    fetch(`http://127.0.0.1:8000/topic_details/${course_id}/`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        setModule(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    const buttonColors = ['primary', 'secondary', 'success', 'danger','info','warning'];

  return (
    <>
    <NavBar />
    <div className="container-fluid" style={{ width: '100%', height:250, position: 'relative', zIndex: 0 , backgroundColor:'#010101',opacity: 0.5}}>
      
      <div className="centered" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
        <h2 className='font-weight-bolder' style={{fontFamily:'Courier, monospace'}}>{data.course_name}</h2>
        <p>Created by: {data.course_instructor}</p>
      </div>
    </div>


    <div className='container-fluid m-2 p-3'>

        <div className='inner_div' >

            <div className='row' >
                <div className='col-md-6 p-3' style={{border:'solid 2px lightgrey'}}>
                    <p className='font-weight-bold' style={{fontSize:18}}>This course includes:</p>
                    <div className='row p-3'>
                        <div className='col-md-6 p-2'>
                            <p><i class="fa fa-desktop" aria-hidden="true"></i>&nbsp; 26 Video Classes</p>
                        </div>
                        <div className='col-md-6 p-2'>
                            <p><i class="fa fa-download" aria-hidden="true"></i>&nbsp; 194 downloadable resources</p>
                        </div>

                        <div className='col-md-6 p-2'>
                            <p><i class="fa fa-code" aria-hidden="true"></i>&nbsp; 7 Coding Excercise</p>
                        </div>
                        <div className='col-md-6 p-2'>
                            <p><i class="fa fa-mobile" aria-hidden="true"></i>&nbsp; Access on mobile and TV</p>
                        </div>
                        <div className='col-md-6 p-2'>
                            <p><i class="fa fa-file" aria-hidden="true"></i>&nbsp; 65 articles</p>
                        </div>
                        <div className='col-md-6 p-2'>
                            <p><i class="fa fa-trophy" aria-hidden="true"></i>&nbsp; Certificate of completion</p>
                        </div>
                    </div>
                </div>
                
                <div className='col-md-6 p-2 '>
                <p className='font-weight-bold mt-3 ml-5' style={{fontSize:18}}>Module Offered:</p>

                    <div className='row ml-5'>
                    {
                    module.map((items, itemIndex)=>(
                        <div className='col-md-6 p-2' style={{  display: 'flex', alignItems: 'center' }} key={itemIndex}>
                            <p className={`bg-${buttonColors[itemIndex]} text-white text-center p-2`} style={{ width:40, borderRadius:40}}>{items.module} </p>
                            <p className='ml-2 font-weight-bolder'>{items.topic_title}</p>
                        </div>
                        ))
                    }
                        
                    </div>
                </div>

                    
                
            </div>

        </div>

    </div>
    
   
    </>
  )
}

export default MoreDetails
