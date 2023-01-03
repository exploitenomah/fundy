// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import './Campaign.sol';

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
      return deployedCampaigns;
    }
}
