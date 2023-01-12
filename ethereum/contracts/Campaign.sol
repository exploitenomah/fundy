// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvers;
    }
    address public manager;
    string public about;
    uint256 public minimumContribution;
    mapping(address => bool) public contributors;
    uint256 public contributorsCount;
    Request[] public requests;

    modifier restrictToManager() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, address creator, string memory desc) {
        manager = creator;
        about = desc;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.sender != manager);
        require(msg.value > minimumContribution);
        contributors[msg.sender] = true;
        contributorsCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restrictToManager {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(contributors[msg.sender]);
        require(!request.approvers[msg.sender]);

        request.approvers[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restrictToManager {
        Request storage request = requests[index];

        require(!request.complete);
        require(request.approvalCount > (contributorsCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}
