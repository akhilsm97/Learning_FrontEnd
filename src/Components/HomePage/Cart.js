  import React, {useEffect,useState} from 'react'
import Footer from './Footer'
import axios from 'axios'
import { API_URL } from '../Payment/config';

function Cart({ username }) {
  console.log("USERNAME IS",username)
  const [datas, setDatas]= useState({})
  useEffect(()=>{
      axios
      .get(`http://127.0.0.1:8000/cart_details/${username}`)
      .then((response)=>{
          setDatas(response.data)
      })
      .catch((error)=>{
          console.log("error")
      })
  })
  const [cartCount, setCartCount] = useState({});
  useEffect(()=>{
    axios
    .get(`http://127.0.0.1:8000/C_count/${username}`)
    .then((response)=>{
      setCartCount(response.data)
    })
    .catch((error)=>{
        console.log("error")
    })
},[username] )
  
const [cartTotal, setCartTotal] = useState({});
  useEffect(()=>{
    axios
    .get(`http://127.0.0.1:8000/C_total/${username}`)
    .then((response)=>{
      setCartTotal(response.data)
    })
    .catch((error)=>{
        console.log("error")
    })
}, )

const [getData, setGetData] = useState({})
const getDetails=(id)=>{
  fetch('http://127.0.0.1:8000/Cart_Detail/' + id)
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
          console.error('Error fetching courses:', error);
          // Optionally, you can handle the error state here
      });
};

const handleDeleteCart=((id) =>{
  fetch(`http://127.0.0.1:8000/Cart/${id}/delete/ ` ,
      {method: 'DELETE'})
      .then(()=>{
          console.log("Deleted")  

      })
  
  }
)
const number = 34
  return (
   <>
   <section class="pt-5 pb-5">
  <div class="container">
    <div class="row w-100">
        <div class="col-lg-12 col-md-12 col-12">
            <h3 class="display-5 mb-2 text-center">Cart Details</h3>
            <p class="mb-5 text-center">
                <i class="text-info font-weight-bold">{cartCount.C_count}</i> courses in your cart</p>
            <table id="shoppingCart" class="table table-condensed table-responsive">
                <thead>
                    <tr>
                        <th style={{width:"60%"}}>Course</th>
                        <th style={{width:"12%"}}>Price</th>
                        <th style={{width:"10%"}}>Quantity</th>
                        <th style={{width:"16%"}}></th>
                    </tr>
                </thead>
                <tbody>
                {Array.isArray(datas) && datas.map((dataItem, index) => (

                        <tr>
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
                          <td class="actions" data-th="">
                              <div class="text-right">
                                  <button class="btn btn-white border-secondary bg-white btn-md mb-2">
                                  <i class="fa fa-refresh" aria-hidden="true"></i>
                                  </button>&nbsp;
                                  <button class="btn btn-white border-secondary bg-white btn-md mb-2" data-toggle="modal" data-target="#myModalzz"  onClick={()=>getDetails(dataItem.id)}>
                                  <i class="fa fa-trash-o" aria-hidden="true"></i>
                                  </button>
                              </div>
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
        <form action={`${API_URL}/create-checkout-session/${number}/`} method='POST'>
            <button type='submit' class="btn btn-primary mb-4 btn-lg pl-5 pr-5">Checkout</button>
            </form>
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
   </>
  )
}

export default Cart
