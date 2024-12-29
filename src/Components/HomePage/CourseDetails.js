import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './css/car.css';
import { Link } from 'react-router-dom';

function CourseDetails() {
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

    const badgeColors = ['orange', 'blue', 'green', 'red'];
    const buttonColors = ['primary', 'secondary', 'success', 'danger'];

    const chunkArray = (arr, size) => {
        return arr.reduce((chunks, element, index) => {
          if (index % size === 0) {
            chunks.push([element]);
          } else {
            chunks[chunks.length - 1].push(element);
          }
          return chunks;
        }, []);
      };
    
      // Chunk the data array into smaller arrays of size 3
      const chunkedData = chunkArray(data, 3);
    
  return (
  <>
    <h3 className='text-center text-secondary ' style={{padding:'20px 0px 0px 0px', textFamily: 'cursive'}}>Course Details</h3>

    <section className="pt-5 pb-5">
      <div className="container">
        <div className="row">
          <div className="col-6">
            <h3 className="mb-3 text-secondary font-weight-bolder">Available Courses</h3>
          </div>
          <div className="col-6 text-right">
            <a className="btn btn-primary mb-3 mr-1" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <i className="fa fa-arrow-left"></i>
            </a>
            <a className="btn btn-primary mb-3" href="#carouselExampleIndicators" role="button" data-slide="next">
              <i className="fa fa-arrow-right"></i>
            </a>
          </div>
          <div className="col-12">
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">
                {chunkedData.map((_, index) => (
                  <li key={index} data-target="#carouselExampleIndicators" data-slide-to={index} className={index === 0 ? 'active' : ''}></li>
                ))}
              </ol>
              <div className="carousel-inner">
                {/* Map through chunkedData array and generate carousel items */}
                {chunkedData.map((chunk, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <div className="row">
                      {chunk.map((item, itemIndex) => (
                        <div key={itemIndex} className="col-md-4 mb-3">
                          <div className="card">
                            <img className="img-fluid" alt="100%x280" src={item.course_img} style={{height:200}}/>
                            <div class="badge-overlay">
                                <span className={`top-left badge ${badgeColors[itemIndex]}`}>Now @  ₹{item.price}</span>
                            </div>
                            <div className="card-body">
                              <h5 className="card-title">{item.course_name}</h5>
                              <div className='row'>
                                <div className='col-md-6'>
                                    <p className="card-text"><Link to="/login" className={`btn btn-${buttonColors[itemIndex]}`}>Enroll Now</Link></p>
                                </div>
                                <div className='col-md-6'>
                                    <p className="card-text"><Link to={`more_details/${item.course_enrollment_id}/`} className='text-secondary font-weight-bolder'>For more details</Link></p>
                                    
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>  </>
  )
}

export default CourseDetails
