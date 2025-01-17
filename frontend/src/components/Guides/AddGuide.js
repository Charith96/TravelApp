import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultImage from "../../images/vector.jpg";
import { storage } from "../../firebase";
import Progress from "./Progress";
import './styles.css'
import { Link } from "react-router-dom";



const invoiceRegx = RegExp(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/gm);
const formValid = formErrors => {
    let valid = true;
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });
    return valid;
};

export default class AddGuide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registrationNo: "",
            name: "",
            address: "",
            email: "",
            phoneNo: Number,
            language: "",
            availability: "",

            //Firebase Image Upload States
            file: null,
            uploadPercentage: 0,

            NoItemImg: defaultImage,
            imgLink: "",

            formErrors: {
                registrationNo:"",
                phoneNo: Number,
                name: "",
                email: ""

            }

        }
    }

    uploadImage(e) {
        if (e.target.files[0] !== null) {
            const uploadTask = storage
                .ref(`products/${e.target.files[0].name}`)
                .put(e.target.files[0]);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    //progress function
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    this.setState({ uploadPercentage: progress });
                },
                (error) => {
                    //error function
                    console.log(error);
                },
                () => {
                    //complete function
                    storage
                        .ref("products")
                        .child(e.target.files[0].name)
                        .getDownloadURL()
                        .then((url) => {
                            console.log(url);
                            this.setState({ imgLink: url });
                        });
                }
            );
        } else {
            alert("Error Upload Image First")
        }
    }



    handleInputChange = (e) => {
        // validaons
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        switch (name) {
            
            case "registrationNo":
                formErrors.registrationNo =
                value.length < 5 || value.length > 7
                        ? "Guide registrationNo number should have charactor between 5 to 7"
                        : "";
                break;
            case "name":
                formErrors.name =
                    value.length < 5
                        ? "Minimum charchter must be 5"
                        : "";
                break;
            case "email":
                formErrors.email = invoiceRegx.test(value)
                    ? ""
                    : "Please enter a valid email address";
                break;
            case "phoneNo":
                formErrors.phoneNo =
                    value.length < 10 || value.length > 10
                        ? "Please enter a valid phone number"
                        : "";
                break;
            default:
                break;
        }
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));

        this.setState({
            ...this.state,
            [name]: value
        });
    };

    onSubmit = (e) => {
        e.preventDefault();

        if (formValid(this.state.formErrors)) {


            const { registrationNo, name, address, email, phoneNo, language, availability, imgLink } = this.state;

            const data = {
                registrationNo: registrationNo,
                name: name,
                address: address,
                email: email,
                phoneNo: phoneNo,
                language: language,
                availability: availability,
                imgLink: imgLink,

            }
            console.log(data)
            axios.post("http://localhost:5001/guide/add", data).then((res) => {
                if (res.data.success) {
                    toast(`New Guide Added`, {
                        type: toast.TYPE.SUCCESS,
                        autoClose: 4000
                    });
                    this.setState(
                        {
                            registrationNo: "",
                            name: "",
                            address: "",
                            email: "",
                            phoneNo: Number,
                            language: "",
                            availability: "",

                        }
                    )
                };
            });
        }
        else {
            toast(`😀 Plaese fill out the field. `, {
                type: toast.TYPE.ERROR,
                autoClose: 4000
            });

        }
    };

    render() {
        const { formErrors } = this.state;

        return (
            <div className="container containerTop">
                <div className="row ">

                    <div className="col-12">
                        <div className="row">
                            <div className="col position-relative link">
                                <p><a href="/get_guide">Guide Management</a> {'>'} Add New Guide</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-9 position-relative">
                                <h2>Add New Guide</h2>

                            </div>
                            <hr className="hr" style={{ height: '2px', color: '#0a90e8' }} />
                        </div>
                        <div className="shadowBoxForm">
                            <form onSubmit={this.onSubmit}>
                                <div className="row">
                                    <div className="col-6 form">
                                        <div className="form-row">
                                            {/* Registration No */}
                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Registration No:</label>
                                                <input type="text"
                                                    className="form-control"
                                                    name="registrationNo"
                                                    minLength="4"
                                                    maxLength="7"
                                                    placeholder="Enter Registration No"
                                                    value={this.state.registrationNo}
                                                    onChange={this.handleInputChange} />
                                            
                                            {formErrors.registrationNo.length < 5 || formErrors.registrationNo.length > 7 && (
                                            <span style={{ color: 'red' }} className="errorMessage">{formErrors.registrationNo}</span>
                                            )} 

                                            </div>
                                            {/* Guide Name */}
                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Guide Name</label>
                                                <input type="text"
                                                    className="form-control"
                                                    name="name"
                                                    placeholder="Enter Guide Name"
                                                    value={this.state.name}
                                                    onChange={this.handleInputChange} />

                                                {formErrors.name.length > 5 && (
                                                    <span style={{ color: 'red' }} className="errorMessage">{formErrors.name}</span>
                                                )}

                                            </div>

                                            {/* Address */}

                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Address</label>
                                                <input type="text"
                                                    className="form-control"
                                                    name="address"
                                                    placeholder="Enter Address"
                                                    value={this.state.address}
                                                    onChange={this.handleInputChange} />
                                            </div>

                                            {/* Email */}
                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Email</label>
                                                <input type="email"
                                                    className={"form-control"}
                                                    name="email"
                                                    placeholder="Enter email"
                                                    value={this.state.email}
                                                    onChange={this.handleInputChange} />
                                                {formErrors.email.length > 0 && (
                                                    <span style={{ color: 'red', fontWeight: 'bold' }} className="errorMessage">{formErrors.email}</span>
                                                )}
                                            </div>

                                            {/* Phone */}
                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Phone No</label>
                                                <input type="number"
                                                    className="form-control"
                                                    name="phoneNo"
                                                    placeholder="Enter PhoneNo"
                                                    value={this.state.phoneNo}
                                                    onChange={this.handleInputChange} />

                                                {formErrors.phoneNo.length < 10 || formErrors.phoneNo.length > 10 && (
                                                    <span style={{ color: 'red' }} className="errorMessage">{formErrors.phoneNo}</span>
                                                )}
                                                

                                            </div>

                                            {/* Language */}
                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Language</label>
                                                <select id="language" className="form-control" name="language" onChange={this.handleInputChange} value={this.state.language} required>
                                                    <option selected>Choose Language</option>
                                                    <option value="English">English</option>
                                                    <option value="Tamil,English">Tamil,English</option>
                                                    <option value="German,English">German,English </option>
                                                    <option value="French,English">French,English </option>
                                                </select>
                                       
                                            </div>



                                            {/* availability */}
                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label style={{ marginBottom: '5px' }}>Availability</label>
                                                <select id="availability" className="form-control" name="availability" onChange={this.handleInputChange} value={this.state.availability} required>
                                                    <option selected>Choose Availability</option>
                                                    <option value="Available">Available</option>
                                                    <option value="Unavailable">Unavailable</option>
                                                </select>

                                             
                                            </div>



                                            <div>
                                                <button type="reset" className="btn btn-outline-success sub_btn2"><i class="far fa-times-circle"></i>&nbsp;Reset</button>
                                                <button type="submit" className="btn btn-primary sub_btn" onClick={this.onSubmit}><i class="far fa-save"></i>&nbsp;Add</button>

                                            </div>

                                        </div>

                                    </div>


                                    {/* add image */}
                                    <div className="col-6 guideImage">

                                        {this.state.imgLink ? (
                                            <img
                                                src={this.state.imgLink}
                                                alt="productImg"
                                                style={{ width: "400px", marginLeft: "62px", display: "flex", flexDirection: "column" }}
                                            />
                                        ) : (
                                            <img
                                                src={this.state.NoItemImg}
                                                alt="productImg"
                                                style={{ width: "400px", marginLeft: "62px", display: "flex", flexDirection: "column" }}
                                            />
                                        )}
                                        <div className="row">
                                            <div className="form-group" style={{ width: "500px", marginTop: "40px", marginLeft: "10px" }}>
                                                <Progress percentage={this.state.uploadPercentage} />
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: '50px', maxWidth: '525px' }}>
                                            <div class="input-group mb-3">
                                                <input type="file" class="form-control" id="inputGroupFile02" name="ImgLink" style={{ borderRadius: '20px' }}
                                                    onChange={(e) => { this.setState({ file: e.target.files[0] }); this.uploadImage(e); }} />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>





                </div>
            </div>

        );
    };
};