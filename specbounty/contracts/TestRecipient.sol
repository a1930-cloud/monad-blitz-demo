// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
/// @notice Testnet-only role separation harness. Controlled by the deployer's session, not an autonomous agent.
contract TestRecipient {
    address public immutable controller;
    constructor(address owner) { controller = owner; }
    function relay(address target, bytes calldata data) external {
        require(msg.sender == controller, "Controller only");
        (bool ok, bytes memory result) = target.call(data);
        if (!ok) assembly { revert(add(result,32),mload(result)) }
    }
    receive() external payable {}
}
