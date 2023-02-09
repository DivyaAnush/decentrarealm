import React from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import logo from "../images/Ascendion.jpg";
import { ConnectButton, Icon, Button, useNotification } from "web3uikit";
import RentalsMap from "../components/RentalsMap";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
// import User from "../components/User";

import { ethers } from "ethers";
import abi from "../abi.json";

const Rentals = () => {
  const { state: searchFilters } = useLocation();
  const [highLight, setHighLight] = useState();
  const { Moralis, account } = useMoralis();
  const [rentalsList, setRentalsList] = useState();
  const [coOrdinates, setCoOrdinates] = useState([]);
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  const contractAddress = "0xA15571803c3EA8F8D226E4e8D760d1d84ee6f0E0";
  const expectedChainId = 80001; // Example: Mumbai test network

  async function validateChainId(provider) {
    const network = await provider.getNetwork();

    if (network.chainId !== expectedChainId) {
      const error = `Expected to be on chain ID ${expectedChainId}, but got ${network.chainId}`;
      console.error(error);
      handleError("Please Connect to Mumbai Testnet!");
      return false;
    }

    console.log("Chain ID is as expected");
    return true;
  }

  const handleSuccess = () => {
    dispatch({
      type: "success",
      message: `Nice! You are going to ${searchFilters.destination}!!`,
      title: "Booking Succesful",
      position: "topL",
    });
  };

  const handleError = (msg) => {
    dispatch({
      type: "error",
      message: `${msg}`,
      title: "Booking Failed",
      position: "topL",
    });
  };

  const handleNoAccount = () => {
    dispatch({
      type: "error",
      message: `You need to connect your wallet to book a rental`,
      title: "Not Connected",
      position: "topL",
    });
  };

  useEffect(() => {
    async function fetchRentalsList() {
      try {
        let Rentals = [];
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Request access to the user's Ethereum account
        await window.ethereum.send("eth_requestAccounts");
        const contract = new ethers.Contract(contractAddress, abi, provider);

        if (await validateChainId(provider)) {
          const rentalInfo = await contract.functions.getRentals();
          console.log(rentalInfo);
          Rentals.push(rentalInfo);
        }

        const formattedData = Rentals[0][0].map((hotel) => {
          return {
            attributes: {
              city: hotel.city,
              unoDescription: hotel.unoDescription,
              dosDescription: hotel.dosDescription,
              imgUrl: hotel.imgUrl,
              lat: hotel.lat,
              long: hotel.long,
              name: hotel.name,
              pricePerDay: hotel.pricePerDay.toString(),
              maxGuests: hotel.maxGuests.toString(),
              id: hotel.id.toString(),
            },
          };
        });

        const filteredData = formattedData.filter(
          (hotel) =>
            hotel.attributes.city === searchFilters.destination &&
            searchFilters.guests <= parseInt(hotel.attributes.maxGuests)
        );
        setRentalsList(filteredData);

        const result = filteredData;

        let cords = [];
        result.forEach((e) => {
          cords.push({ lat: e.attributes.lat, lng: e.attributes.long });
        });
        setCoOrdinates(cords);
        setRentalsList(result);
      } catch (err) {
        console.log(err);
      }
    }

    fetchRentalsList();
  }, [searchFilters]);

  const bookRental = async function (start, end, id, dayPrice) {
    console.log(id, typeof id, dayPrice, typeof dayPrice);
    try {
      for (
        var arr = [], dt = new Date(start);
        dt <= end;
        dt.setDate(dt.getDate() + 1)
      ) {
        arr.push(new Date(dt).toISOString().slice(0, 10)); // yyyy-mm-dd
      }

      async function sendTransaction(contract, id, newBookings, totalPrice) {
        const price = ethers.utils.parseEther(totalPrice).toString(); // The price to pay, in wei
        console.log(price);

        try {
          const tx = await contract.addDatesBooked(id, newBookings, {
            value: price,
          });
          console.log("Transaction sent", tx);
          handleSuccess();
        } catch (err) {
          handleError(err.data.message);
          console.error(err);
        }
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Request access to the user's Ethereum account
      await window.ethereum.send("eth_requestAccounts");
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      if (await validateChainId(provider)) {
        const rentalId = id; // The id of the rental
        const newBookings = arr; // An array of strings representing the dates to book
        const price = (dayPrice * arr.length).toString();
        await sendTransaction(contract, rentalId, newBookings, price);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="topBanner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo"></img>
          </Link>
        </div>
        <div className="searchReminder">
          <div className="filter">{searchFilters.destination}</div>
          <div className="vl" />
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
        <div className="lrContainers">
          {/* {account && <User account={account} />} */}
          <ConnectButton />
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
                    <img className="rentalImg" src={e.attributes.imgUrl}></img>
                    <div className="rentalInfo">
                      <div className="rentalTitle">{e.attributes.name}</div>
                      <div className="rentalDesc">
                        {e.attributes.unoDescription}
                      </div>
                      <div className="rentalDesc">
                        {e.attributes.dosDescription}
                      </div>
                      <div className="bottomButton">
                        <Button
                          onClick={() => {
                            if (account) {
                              bookRental(
                                searchFilters.checkIn,
                                searchFilters.checkOut,
                                Number(e.attributes.id),
                                Number(e.attributes.pricePerDay)
                              );
                            } else {
                              handleNoAccount();
                            }
                          }}
                          text="Stay Here"
                        />
                        <div className="price">
                          <Icon fill="#808080" size={10} svg="matic" />{" "}
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
