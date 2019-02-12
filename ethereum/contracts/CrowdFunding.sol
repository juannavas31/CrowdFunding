pragma solidity >=0.4.22<0.6.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        // this contract is going to deploy a new instance of Campaign contract.
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        address newCampaignAddress = address(newCampaign);
        deployedCampaigns.push(newCampaignAddress);
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign{
    struct Request{
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender]=true;
        approversCount++;
    }

    function createRequest(string memory description,
                            uint value,
                            address payable recipient) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
            });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public{
        Request storage request = requests[index];

        require(approvers[msg.sender]); // require that the sender is a contributor
        require(!request.approvals[msg.sender]); // the approver cannot vote more than once

        request.approvals[msg.sender]=true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount/2));

        //we transfer the money of the request to the intended recipient
        // as recipient field is an address, it has a function transfer
        request.recipient.transfer(request.value);
        // the request is finished, we mark it as complete, so it cannot be finalized again
        request.complete=true;
    }

    function getSummary() public view returns(uint, uint, uint, uint, address) {
        return(
            minimumContribution,
            this.Balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint){
        return (requests.lenght);
    }


}
