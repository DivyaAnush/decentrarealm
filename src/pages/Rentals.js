import React from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import logo from "../images/airbnbred.jpg";
import { ConnectButton, Icon, Button, useNotification, TabList, Tab } from "web3uikit";
import RentalsMap from "../components/RentalsMap";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import User from "../components/User";
import bg from "../images/bg1.jpg";
import travel from "../travel";
import web3 from "web3";


const Rentals = () => {
  const { state: searchFilters } = useLocation();
  const [highLight, setHighLight] = useState();
  // const { Moralis, account } = useMoralis();
  //const [rentalsList, setRentalsList] = useState();
  const [coOrdinates, setCoOrdinates] = useState([]);
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  
   
  const handleSuccess= () => {
    dispatch({
      type: "success",
      message: `Nice! You are going to ${searchFilters.destination}!!`,
      title: "Booking Succesful",
      position: "topL",
    });
  };

  const handleError= (msg) => {
    dispatch({
      type: "error",
      message:"Already Booked For Requested Date",
      title: "Booking Failed",
      position: "topL",
    });
  };

  const handleNoAccount= () => {
    dispatch({
      type: "error",
      message: `You need to connect your wallet to book a Hotel`,
      title: "Not Connected",
      position: "topL",
    });
  };
  const rentalsList = [
    {
      attributes: {
        city: "New York",
        unoDescription: "3 Guests • 2 Beds • 2 Rooms",
        dosDescription: "Wifi • Kitchen • Living Area",
        imgUrl:
          "https://ipfs.moralis.io:2053/ipfs/QmS3gdXVcjM72JSGH82ZEvu4D7nS6sYhbi5YyCw8u8z4pE/media/3",
        lat: "40.716862",
        long: "-73.999005",
        name: "Apartment in China Town",
        pricePerDay: "2",
      },
    },

    {
      attributes: {
        city: "New York",
        unoDescription: "3 Guests • 2 Beds • 2 Rooms",
        dosDescription: "Wifi • Kitchen • Living Area",
        imgUrl:
          "https://ipfs.moralis.io:2053/ipfs/QmS3gdXVcjM72JSGH82ZEvu4D7nS6sYhbi5YyCw8u8z4pE/media/3",
        lat: "40.716862",
        long: "-73.999005",
        name: "Apartment in China Town",
        pricePerDay: "5",
      },
    },

  ];

  let cords = [];
  rentalsList.forEach((e) => {
    cords.push({ lat: e.attributes.lat, lng: e.attributes.long });
  });

  // useEffect(() => {
  //   async function fetchRentalsList() {
  //     const Rentals = Moralis.Object.extend("Rentals");
  //     const query = new Moralis.Query(Rentals);
  //     query.equalTo("city", searchFilters.destination);
  //     query.greaterThanOrEqualTo("maxGuests_decimal", searchFilters.guests);

  //     const result = await query.find();

  //     let cords = [];
  //     result.forEach((e) => {
  //       cords.push({ lat: e.attributes.lat, lng: e.attributes.long });
  //     });

  //     setCoOrdinates(cords);
  //     setRentalsList(result);
  //   }

  //   fetchRentalsList();
  // }, [searchFilters]);


  const bookRental = async function (start, end, id, dayPrice) {
    
    for (
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt).toISOString().slice(0, 10)); // yyyy-mm-dd
      
    }
    // dayPrice =2;

    let options = {
      contractAddress: "0x137022Fb1fE6e2B0B6939C0d500fA97CEED8Aef7",
      functionName: "addDatesBooked",
      abi: [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "newBookings",
              "type": "string[]"
            }
          ],
          "name": "addDatesBooked",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
        
      ],
      
      params: {
        id: id,
        newBookings: arr,
      },
      
      //  msgValue: Moralis.Units.ETH(dayPrice * arr.length),
      
      
    }
    
    
    // console.log(arr);
    // console.log(Moralis.Units.ETH(dayPrice * arr.length))

    // await contractProcessor.fetch({
    //   params: options,
    //   onSuccess: () => {
    //     handleSuccess();
    //   },
    //   onError: (error) => {
    //     handleError(error.data.message)
    //   }
    // });

  }
  const {ethereum} = window;

  // CONNECT TO METAMASK
  let[account, setAccount] = useState("");
  const connectMetamask = async () => {
    if(window.ethereum !== "undefined") {
      const accounts = await ethereum.request({ method: "eth_requestAccounts"});
      setAccount(accounts[0]);
    } else {
      alert("install metamask first");
    }
  }

  let calculateDate = () => {
    const startDate = new Date(searchFilters.checkIn).toISOString().slice(0, 10);
    const endDate = new Date(searchFilters.checkOut).toISOString().slice(0, 10);;
    const diffInMs = new Date(endDate) - new Date(startDate)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays}
  
  const sendData =async (e) => {
    if (!account) {
      // alert("connect to Wallet");
      handleNoAccount();
      return;
    }
    console.log(account)

    let numberOfDays = calculateDate();
    let totalPrice =numberOfDays *(+e.attributes.pricePerDay);
    console.log(numberOfDays)
    console.log(totalPrice)
    console.log(e.attributes.pricePerDay)
    

    await travel.methods.addDatesBooked(0,[""]).send({
      from: account,
      // to:"0x8307bCb2282a35E9aa4317440fBf6cEA7B4d8b22",
      
      value: web3.utils.toWei(totalPrice.toString(), "ether"),
       
    });
    
    
    // alert("booking successfull");
    handleSuccess();
    
  }
  
  


  return (
    <>

      <div className="container">
        <div className="containerGradinet"></div>
      </div>

      <div className="topBanner">
        <div className="logoclass" >
          <Link to="/">
            <img className="logo" src={logo} alt="logo"></img>
          </Link>
        </div>
        <div>
            <h2 className="logotext">Decentralized Realm</h2>
        </div>
        <div className="scrolltext">
        <marquee behavior="scroll" direction="Left"><h1>World's first 100% Web3 Enabled Hotel Reservation System!</h1></marquee>
      </div>

        <div /*className="lrContainers"*/>
          {/* {account &&
          <User account={account} />
        }
          <ConnectButton /> */}
          <button onClick={connectMetamask}><strong>CONNECT Wallet</strong></button><br/>
          <p>{account}</p>
        </div>
      </div>
      
      <div className="searchReminder">
          <div className="filter">{searchFilters.destination}</div>
          <div className="vl"/>
          <div className="filter">
            {`
           ${searchFilters.checkIn.toLocaleString("default", {
             month: "short",
           })} 
           ${searchFilters.checkIn.toLocaleString("default", {
             day: "2-digit",
           })} 
           - 
           ${searchFilters.checkOut.toLocaleString("default", {
             month: "short",
           })} 
           ${searchFilters.checkOut.toLocaleString("default", {
             day: "2-digit",
           })}
          `}
          </div>
          <div className="vl" />
          <div className="filter">{searchFilters.guests} Guest</div>
          <div className="searchFiltersIcon">
            <Icon fill="#ffffff" size={20} svg="search" />
          </div>
        </div>

      <hr className="line" />
      <div className="rentalsContent">
        <div className="rentalsContentL">
          Stays Available For Your Destination
          {rentalsList &&
            rentalsList.map((e, i) => {
              return (
                <>
                  <hr className="line2" />
                  <div className={highLight == i ? "rentalDivH " : "rentalDiv"}>
                    <img className="rentalImg" src={e.attributes.imgUrl} ></img>
                    <div className="rentalInfo">
                      <div className="rentalTitle"><div to={"/rooms"}>{e.attributes.name}</div></div>
                      <div className="rentalDesc">
                        {e.attributes.unoDescription}
                      </div>
                      <div className="rentalDesc">
                        {e.attributes.dosDescription}
                      </div>
                      <div className="bottomButton">
                      {console.log(searchFilters.checkIn)}
                      {console.log(searchFilters.checkOut)}
                      <Button 
                         onClick = {() => sendData(e)}
                       
                         text="Book now" />
                        {/* <Button 
                        onClick={() => {
                          if(account1){
                          bookRental(
                            searchFilters.checkIn,
                            searchFilters.checkOut,
                            
                            
                            // e.attributes.uid_decimal.value.$numberDecimal,
                            // Number(e.attributes.pricePerDay_decimal.value.$numberDecimal)
                          )}else{
                            handleNoAccount()
                          }
                        }
                        }
                        text="Book now" /> */}
                        <div className="price">
                          <Icon fill="#090909" size={10} svg="matic" />{" "}
                          {e.attributes.pricePerDay} / Day 
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
        <div className="rentalsContentR">
          <RentalsMap locations={coOrdinates} setHighLight={setHighLight} />
        </div>
      </div>
    </>
  );
};

export default Rentals;