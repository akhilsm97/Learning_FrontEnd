import React, { useState, useEffect} from 'react'
import axios from 'axios';


function FetchNotify() {
    const[fetchNotify, setFetchNotify] = useState([])

    const FetchNotifys = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/create_notify/`);
            setFetchNotify(response.data);
            
        } catch (error) {
            console.error("Error fetching course materials:", error);
        }
    };

    useEffect(() => {
        FetchNotifys();
    }, []);

  return (
    <>
      <h3 className='font-weight-bolder text-center p-5'>Notification</h3>
      <div className='container-fluid'>
        {
            fetchNotify.map((items)=>(
                <div className='row shadow-sm p-3 mb-3 card' style={{textAlign: 'left'}}>
                    <div className='form-group'>
                        <p className='font-weight-bold' style={{marginLeft:100}}>&emsp;{items.content}</p>
                    </div>
                    <div className='form-group' >
                        <p className='text-muted' style={{marginLeft: 400}}>Recieved on : {items.created_at}</p>
                        </div>
            </div>
            ))
        }
           
        </div>
    </>
  )
}

export default FetchNotify
