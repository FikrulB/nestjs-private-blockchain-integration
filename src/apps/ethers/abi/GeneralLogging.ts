export default [
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "activity",
						"type": "bytes32"
					},
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "userId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "userEmail",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "userAgent",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "userIp",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "data",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "interactTo",
						"type": "address"
					}
				],
				"internalType": "struct GeneralUserLogging.Logger",
				"name": "log",
				"type": "tuple"
			}
		],
		"name": "recordLog",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_adminableContract",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "activity",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "interactTo",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "userId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "userEmail",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "userAgent",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "userIp",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "data",
				"type": "string"
			}
		],
		"name": "UserLog",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "adminableContract",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]