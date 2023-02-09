import Web3 from "web3";
window.ethereum.request({ method: "eth_requestAccounts" });

const web3 = new Web3(window.ethereum);

// 0x7Ae1b555c06bD13f91a6AcbAF5E65edfD0E813B1
// 0x39E62C6d1E797d0504217c20BBE174EE6d5a4444
const address = '0x7Ae1b555c06bD13f91a6AcbAF5E65edfD0E813B1';
const abi = [
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
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "city",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "lat",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "long",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "unoDescription",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dosDescription",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imgUrl",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "maxGuests",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pricePerDay",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "datesBooked",
				"type": "string[]"
			}
		],
		"name": "addRentals",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string[]",
				"name": "datesBooked",
				"type": "string[]"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "booker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "city",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "imgUrl",
				"type": "string"
			}
		],
		"name": "newDatesBooked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "city",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "lat",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "long",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "unoDescription",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "dosDescription",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "imgUrl",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "maxGuests",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pricePerDay",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string[]",
				"name": "datesBooked",
				"type": "string[]"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "renter",
				"type": "address"
			}
		],
		"name": "rentalCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getRental",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rentalIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export default new web3.eth.Contract(abi, address);