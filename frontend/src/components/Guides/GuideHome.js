import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import './styles.css'
import {toast} from 'react-toastify';
import {jsPDF} from 'jspdf'
import 'jspdf-autotable'
import Logo from "../../images/Logo.png";

// import './estyle.css';


export default class GuideHome extends Component {
constructor(props){
    super(props);

    this.state={
        guide:[]
    };
}

//export PDF.

 


componentDidMount(){
    this.retrieveGuide();
}

retrieveGuide(){
    axios.get(`http://localhost:5001/guides`).then(res=>{
    if(res.data.success){
        this.setState({
            guide:res.data.existingGuide
        });
        console.log(this.state.guide);

    }
       
    });
}


onDelete = (id) => {
  axios.delete(`http://localhost:5001/guide/delete/${id}`).then((res) => {
    toast("Deleted Successfully", {
      type: toast.TYPE.ERROR,
      autoClose: 4000
  });
    this.retrieveGuide();
  })
}

filterData(guide,searchKey){
  const result=guide.filter((guide)=>
  guide.registrationNo.toLowerCase().includes(searchKey)||
  guide.name.toLowerCase().includes(searchKey)||
  guide.address.toLowerCase().includes(searchKey)||
  guide.language.toLowerCase().includes(searchKey)||
  guide.availability.toLowerCase().includes(searchKey)

  )
  this.setState({guide:result})
}



handleSearchArea=(e)=>{
  // console.log(e.currentTarget.value);
  const searchKey=e.currentTarget.value;
  axios.get(`http://localhost:5001/guides`).then(res=>{
    if(res.data.success){
      this.filterData(res.data.existingGuide,searchKey)
    }
  });
}


exportPDF = () => {
 

  // let bodyData = [];
  // let length = guide.length;
  // let x = 1;
  // console.log(guide);
  const data = this.state.guide.map(dlt=> [dlt.registrationNo,dlt.name  ,dlt.address,dlt.email,dlt.phoneNo,dlt.language,dlt.availability])
  // for (let i = 0; i < length; i++) {
  //   bodyData.push([
  //     x++,
  //     guide[i].registrationNo,
  //     guide[i].name,
  //     guide[i].address,
  //     guide[i].email,
  //     guide[i].phoneNo,
  //     guide[i].language,
  //     guide[i].availability,
  //   ]);
  // } 
  // //save json data to bodydata in order to print in the pdf table

  const doc = new jsPDF({ orientation: "portrait" });
  var time = new Date().toLocaleString();
  doc.setFontSize(27);
  doc.text(`Guide Details Report`, 105, 35, null, null, "center");
  doc.setFontSize(10);
  doc.text(`(Generated on ${time})`, 105, 39, null, null, "center");
  doc.setFontSize(14);
  // doc.text("Thilina Hardware", 105, 20, null, null, "center");
  // doc.text("No 55, Main Road, Horana", 105, 25, null, null, "center");
  doc.addImage(Logo, "JPEG", 90, 0, 25, 25);
  doc.autoTable({
    theme: "grid",
    styles: { halign: "center" },
    headStyles: { fillColor:"#38B000" },
    startY: 44,
    head: [
      ["RNo", "Name", "Address	", "Email", "PhoneNo", "Languages" ,"Availability"],
    ],
    body: data,
  });
  doc.save("Guides.pdf");
 }

  render() {
    return (
      <div className="container" >
        <div className="row">
          <div className="col-lg-9 mt-2 mb-2">

            </div>
            <div className="col-lg-3 mt-2 mb-2 ">
              <input
              className="form-control"
              type="search"
              placeholder="🔍 Search"
              name="searchQuery"
              onChange={this.handleSearchArea}></input>

            </div>

        </div> 
            <div className="py-4">
            <h1>Guides</h1>
            

        <div className="row">
          <div className="col-lg-9 mt-2 mb-2">
           {/* add button  */}
           <Link to="/guide_add" className="btn btn-warning"><i className="fas fa-user-plus"></i>&nbsp;Add Guide</Link>&nbsp;
          <Link onClick={()=>this.exportPDF()} to="#" className="btn btn-success"><i class="fas fa-download"></i>&nbsp;Download Report</Link>
           </div>
        </div>



            <table class=" table table-striped borde" >
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Registion No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Address</th>
                    <th scope="col">Email</th>
                    <th scope="col">PhoneNo</th>
                    <th scope="col">Languages</th>
                    <th scope="col">Availability</th>
                    <th scope="col">Action</th>
                    
                    
                    </tr>
                </thead>
                <tbody>
                   {this.state.guide.map((guide,index)=> (
                      <tr key={index}>
                          <th scope="row">G{index + 1}</th>
                          <td>
                             <a href={`/guide/${guide._id}`} style={{textDecoration:'none'}}>
                              {guide.registrationNo}
                            </a>
                            </td>
                            
                          <td>{guide.name}</td>
                          <td>{guide.address}</td>
                          <td>{guide.email}</td>
                          <td>{guide.phoneNo}</td>
                          <td>{guide.language}</td>
                          <td>{guide.availability}</td>
                         
                          
                          <td>
                               
                            <Link className="btn btn-outline-warning" to={`/guide_update/${guide._id}`}>
                              <i className="fas fa-edit"></i> &nbsp;Update
                            
                            </Link>
                            &nbsp;
                            <Link className="btn btn-danger" onClick={()=>this.onDelete(guide._id)}><i className="far fa-trash-alt"></i>&nbsp;Delete</Link>
                                
                            </td>
                      </tr>
                    ))}

                </tbody>
                </table>
               
                
                
 
            </div>
        </div>
    )
  }
}