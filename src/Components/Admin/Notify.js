import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Notify() {

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
        .get('http://127.0.0.1:8000/create_notify/')
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

        const filterData = data.filter((item) =>
            item.content.toLowerCase().includes(searchItem.toLowerCase())
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
        const [formData, setFormData] = useState({});
        const handleInput = (e) => {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
                
            });
            console.log('Before'+formData)
        };

        const handleNotify = async(e)=>{
            e.preventDefault()
            const formDataImage = new FormData();

            formDataImage.append("content", formData.content);
            formDataImage.append("created_at", getDate());
            try {
                const response = await axios.post('http://127.0.0.1:8000/create_notify/', formDataImage);
        
                if (response.status === 201) {
                   
                    toast.success("Notification Added Successfully", {
                        position: toast.POSITION.TOP_CENTER,
                        theme: 'colored'
                    });
                    e.target.reset();
                }
            } catch (error) {
                console.log('Error occurred:', error);
            }
        };
        
        
  return (
    <>
       <div className='container p-4 mt-3 animate__animated animate__zoomIn animate__delay-1s ' style={{backgroundColor:'#F8F8FF', border:'solid 1px lightgrey'}}>
            <h2 className='font-weight-bolder'>Create Notification Here</h2>
        </div>

        <div class="container shadow animate__animated animate__fadeInDown animate__delay-1s" style={{padding: 20, marginTop:50}}>
                            <div className='row' style={{marginBottom:20, marginLeft:750}}>
                                <div className='col-md-2'>

                                </div>
                                <div className="col-md-2">

                                </div>
                                <div className='col-md-8'>
                                <button type="button" class="btn btn-success font-weight-bolder" data-toggle="modal" data-target="#addNotify" style={{width:200}} ><i class="fa fa-bullhorn" aria-hidden="true"></i>&nbsp;Add Notification</button>
                                </div>
                            </div>
                            <table class="table table-hover table-striped">
                                <thead>
                                  <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Content</th>
                                    <th scope="col">Created At</th>
                                    
                                  
                                  </tr>
                                </thead>
                                <tbody>
                                    {
                                        records.map((item)=>(
                                            <tr>
                                                <td scope="col">{item.id}</td>
                                                <td scope="col">{item.content}</td>
                                                <td scope="col">{item.created_at}</td>
                                                
                                            
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


                         <div  className="modal fade" id="addNotify" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog " >
            <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title " id="exampleModalLabel">Notification</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
            </div>
            <div class="modal-body">
                <div className='container-fluid'>
                  <form onSubmit={handleNotify}>
                    <div className='row'>
                        <div class="form-group">
                            <label class="font-weight-bolder">
                                Add Content
                            </label>
                            <textarea className="form-control" style={{width:400}} name="content" placeholder="Add Content here........" onChange={handleInput}></textarea>
                            <button type="submit    " class="btn btn-primary" style={{margin:'20px 0px 0px 150px'}}>Send Notification</button>
                           
                        </div>
                    </div>
                    </form>  
                </div>        
            </div>
            <div class="modal-footer">
                
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                
            </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Notify
