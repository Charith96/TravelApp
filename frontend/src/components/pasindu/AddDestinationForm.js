import React, { useState } from "react";
import Styled from "styled-components";
import axios from "axios";
import styled from "styled-components";
import defaultImage from "../../images/defaultImage.jpg";
import { districts, provinces, colors } from "./data";
import spinner from "../../images/spinner.gif";

export default function AddDestinationForm() {
  const [img, setImg] = useState(defaultImage);
  const [isLoading, setisLoading] = useState(false);
  const [district, setdistrict] = useState("none");
  const [province, setprovince] = useState("none");
  const [destination, setdestination] = useState("");
  const [city, setcity] = useState("");
  const [description, setdescription] = useState("");
  const [destinationError, setdestinationError] = useState("");
  const [cityError, setcityError] = useState("");
  const [districtError, setdistrictError] = useState("");
  const [provinceError, setprovinceError] = useState("");
  const [descriptionError, setdescriptionError] = useState("");
  const [imgError, setimgError] = useState("");
  const [errors, seterrors] = useState([]);

  const clear = () => {
    setcity("");
    setdistrict("none");
    setprovince("none");
    setdestination("");
    setdescription("");
    setImg(defaultImage);
  };
  const formHandler = async (e) => {
    seterrors([]);
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:5001/destinations/add",
      { district, province, destination, city, description, image: img }
    );
    if (district === "none")
      seterrors((oldArr) => [
        ...oldArr,
        { msg: "District should be selected" },
      ]);
    if (province === "none")
      seterrors((oldArr) => [
        ...oldArr,
        { msg: "Province should be selected" },
      ]);
    if (response.data.success) window.location = "/destinations";
    if (response.data.error) {
      response.data.error.map((item) => {
        seterrors((oldArr) => [...oldArr, { msg: item.msg }]);
      });
    }
  };
  // const validation = () => {
  //   setdestinationError("");
  //   setcityError("");
  //   setdistrictError("");
  //   setprovinceError("");
  //   setdescriptionError("");
  //   setimgError("");

  //   if (destination === "") {
  //     setdestinationError("Destination can't be empty!");
  //   }
  //   if (city === "") {
  //     setcityError("City can't be empty!");
  //   }
  //   if (district === "none") {
  //     setdistrictError("District has to be selected!");
  //   }
  //   if (province === "none") {
  //     setprovinceError("Province has to be selected!");
  //   }
  //   if (description === "") {
  //     setdescriptionError("Description can't be empty!");
  //   }
  //   if (img === defaultImage) {
  //     setimgError("Add an Image");
  //   } else if (
  //     destinationError === "" &&
  //     cityError === "" &&
  //     districtError === "" &&
  //     provinceError === "" &&
  //     descriptionError === "" &&
  //     imgError === ""
  //   ) {
  //     return true;
  //   }
  // };
  const imageHandler = (evt) => {
    setisLoading(true);
    var f = evt.target.files[0]; // FileList object
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
      return async function (e) {
        var binaryData = e.target.result;
        //Converting Binary Data to base 64
        var base64String = window.btoa(binaryData);
        //showing file converted to base64
        const res = await axios.post(
          "http://localhost:5001/destinations/upload",
          {
            path: base64String,
          }
        );
        setisLoading(false);
        setImg(res.data.imgUrl);
      };
    })(f);
    // // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
  };

  const uploadButtonClickHandler = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <MainDiv>
      <H2>Add Destination Details</H2>
      {errors.length > 0
        ? errors.map((i, index) => {
            return <Span key={index}>{errors[index].msg}</Span>;
          })
        : null}
      <FormGrid onSubmit={formHandler}>
        <Column>
          {destinationError.length > 0 ? (
            <Span>{destinationError}</Span>
          ) : (
            <Span style={{ visibility: "hidden" }}></Span>
          )}
          <TextInput
            placeholder="Destination"
            type="text"
            value={destination}
            onChange={(e) => setdestination(e.target.value)}
          />
          {cityError.length > 0 ? (
            <Span>{cityError}</Span>
          ) : (
            <Span style={{ visibility: "hidden" }}></Span>
          )}
          <TextInput
            placeholder="City"
            type="text"
            onChange={(e) => setcity(e.target.value)}
            value={city}
          />
          {districtError.length > 0 ? (
            <Span>{districtError}</Span>
          ) : (
            <Span style={{ visibility: "hidden" }}></Span>
          )}
          <Dropdown
            onChange={(e) => setdistrict(e.target.value)}
            value={district}
          >
            <option value="none" disabled hidden>
              District
            </option>
            {districts.map((item) => {
              return (
                <option value={item} key={item}>
                  {item}
                </option>
              );
            })}
          </Dropdown>
          {provinceError.length > 0 ? (
            <Span>{provinceError}</Span>
          ) : (
            <Span style={{ visibility: "hidden" }}></Span>
          )}
          <Dropdown
            onChange={(e) => setprovince(e.target.value)}
            value={province}
          >
            <option value="none" disabled hidden>
              Province
            </option>
            {provinces.map((item) => {
              return (
                <option value={item} key={item}>
                  {item}
                </option>
              );
            })}
          </Dropdown>
          {descriptionError.length > 0 ? (
            <Span>{descriptionError}</Span>
          ) : (
            <Span style={{ visibility: "hidden" }}></Span>
          )}
          <TextInputBox
            placeholder="Description"
            rows={8}
            onChange={(e) => setdescription(e.target.value)}
            value={description}
          />
          <Button
            color={colors.darkerGreen}
            style={{ marginRight: "2%" }}
            onClick={clear}
            type="button"
          >
            Clear
          </Button>
          <ButtonSecondary color={colors.darkerGreen} type="submit">
            Add Destination
          </ButtonSecondary>
        </Column>
        <Column>
          <Center>
            <ImageContainner>
              {isLoading ? <Spinner src={spinner} /> : <Image src={img} />}
            </ImageContainner>
            {imgError.length > 0 ? (
              <Span style={{ marginLeft: "15px", width: "90%" }}>
                {imgError}
              </Span>
            ) : (
              <Span style={{ visibility: "hidden" }}></Span>
            )}
            <FileInput type="file" onChange={imageHandler} id="fileInput" />
            <UploadButton
              color={colors.darkerGreen}
              type="button"
              onClick={uploadButtonClickHandler}
            >
              <I className="fas fa-images"></I>Upload Image
            </UploadButton>
          </Center>
        </Column>
      </FormGrid>
    </MainDiv>
  );
}

const MainDiv = Styled.div`
margin:0px auto;
background-color:white;
width:100%;
display:flex;
flex-direction: column;
min-height:100vh;
`;

const H2 = Styled.h2`
margin:20px 0px 0px 20px;
`;

const Button = Styled.button`
width:49%;
background-color: ${(props) => props.color};
color: ${(props) => props.fontColor || "white"};
border: 2px solid ${(props) => props.color};
border-radius:5px; 
font-weight:bold;
padding: 8px 14px;
&:hover{
  filter: brightness(85%);
  cursor:pointer;
}`;
const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 50% 50%;
  margin: 20px;
`;
const Column = styled.div`
  //background-color: red;
  width: 100%;
  padding-right: 20px;
`;

const TextInput = styled.input`
  width: 100%;
  padding-left: 5px;
  height: 40px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid;
`;

const Span = styled.p`
  width: 100%;
  margin: 15px 0px 0px 20px;
  color: red;
  font-weight: bold;
  font-size: 14px;
`;

const TextInputBox = styled.textarea`
  width: 100%;
  padding: 5px;
  resize: none;
  margin-bottom: 20px;
  border-radius: 5px;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
`;
const Spinner = styled.img`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
`;
const ImageContainner = styled.div`
  width: 90%;
  height: 300px;
  margin-top: 15px;
  margin-bottom: 0px;
  border: 1px solid ${colors.darkerGreen};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Center = Styled.div`
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
`;

const FileInput = styled.input`
  opacity: 0;
  margin: 0px;
  padding: 0px;
`;
const UploadButton = styled.button`
  border: 1px solid ${(props) => props.color};
  display: inline-block;
  border-radius: 5px;
  font-weight: bold;
  padding: 8px 14px;
  width: 90%;
  background-color: ${(props) => props.color};
  margin: 0px;
  color: white;
  &:hover {
    filter: brightness(85%);
    cursor: pointer;
  }
`;
const ButtonSecondary = Styled.button`
width: 49%;
background-color: white;
color: ${(props) => props.color || "black"};
border: 2px solid ${(props) => props.color};
border-radius:5px ;
font-weight:bold;
padding: 8px 14px;
&:hover{
  background-color:${(props) => props.color};
  color: white;
  cursor:pointer;
}`;
const Dropdown = styled.select`
  width: 100%;
  padding-left: 5px;
  height: 40px;
  margin-bottom: 20px;
  border-radius: 5px;
  border-style: solid;
`;
const I = styled.i`
  margin: 0px 7px;
`;
