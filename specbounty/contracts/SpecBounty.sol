// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Customer-attested specification hardening. No claim of onchain quality verification.
contract SpecBounty {
    enum Phase { Open, Hardened, Frozen, Submitted, Complete, Expired }
    struct Task {
        address customer;
        address hunter;
        address worker;
        bytes32 specHash;
        bytes32 evidenceHash;
        bytes32 deliveryHash;
        uint256 bounty;
        uint256 reward;
        uint64 deadline;
        Phase phase;
    }
    mapping(bytes32 => Task) public tasks;
    mapping(address => uint256) public credit;
    bool private locked;
    event Created(bytes32 indexed id, address indexed customer, bytes32 specHash, uint256 bounty, uint256 reward, uint64 deadline);
    event Counterexample(bytes32 indexed id, address indexed hunter, bytes32 evidenceHash);
    event BountyApproved(bytes32 indexed id, address indexed hunter, uint256 amount);
    event SpecFrozen(bytes32 indexed id, bytes32 specHash);
    event Delivery(bytes32 indexed id, address indexed worker, bytes32 deliveryHash);
    event Completed(bytes32 indexed id, address indexed worker, uint256 amount);
    event Expired(bytes32 indexed id, uint256 refund);
    event Withdrawn(address indexed payee, uint256 amount);
    modifier exists(bytes32 id) { require(tasks[id].customer != address(0), "Unknown task"); _; }
    modifier customer(bytes32 id) { require(msg.sender == tasks[id].customer, "Customer only"); _; }
    modifier active(bytes32 id) { require(block.timestamp < tasks[id].deadline, "Deadline passed"); _; }

    function create(bytes32 id, bytes32 specHash, uint256 bounty, uint256 reward, uint64 deadline) external payable {
        require(id != bytes32(0) && specHash != bytes32(0), "Empty hash");
        require(tasks[id].customer == address(0), "Task exists");
        require(deadline > block.timestamp && deadline <= block.timestamp + 30 days, "Invalid deadline");
        require(bounty > 0 && reward > 0 && msg.value == bounty + reward, "Invalid funding");
        tasks[id] = Task(msg.sender,address(0),address(0),specHash,bytes32(0),bytes32(0),bounty,reward,deadline,Phase.Open);
        emit Created(id,msg.sender,specHash,bounty,reward,deadline);
    }
    // One outstanding claim per task. Customer may reject so another hunter can submit.
    function submitCounterexample(bytes32 id, bytes32 evidenceHash) external exists(id) active(id) {
        Task storage t = tasks[id];
        require(t.phase == Phase.Open && t.hunter == address(0), "Claim unavailable");
        require(msg.sender != t.customer && evidenceHash != bytes32(0), "Invalid claim");
        t.hunter = msg.sender; t.evidenceHash = evidenceHash;
        emit Counterexample(id,msg.sender,evidenceHash);
    }
    function rejectCounterexample(bytes32 id) external exists(id) customer(id) active(id) {
        Task storage t = tasks[id];
        require(t.phase == Phase.Open && t.hunter != address(0), "No pending claim");
        t.hunter = address(0); t.evidenceHash = bytes32(0);
    }
    function approveCounterexample(bytes32 id) external exists(id) customer(id) active(id) {
        Task storage t = tasks[id];
        require(t.phase == Phase.Open && t.hunter != address(0), "No pending claim");
        t.phase = Phase.Hardened;
        uint256 amount = t.bounty; t.bounty = 0; credit[t.hunter] += amount;
        emit BountyApproved(id,t.hunter,amount);
    }
    function freeze(bytes32 id, bytes32 repairedHash) external exists(id) customer(id) active(id) {
        Task storage t = tasks[id];
        require(t.phase == Phase.Hardened, "Harden first");
        require(repairedHash != bytes32(0) && repairedHash != t.specHash, "New spec required");
        t.specHash = repairedHash; t.phase = Phase.Frozen;
        emit SpecFrozen(id,repairedHash);
    }
    function submitDelivery(bytes32 id, bytes32 expectedSpec, bytes32 deliveryHash) external exists(id) active(id) {
        Task storage t = tasks[id];
        require(t.phase == Phase.Frozen && expectedSpec == t.specHash, "Spec mismatch");
        require(msg.sender != t.customer && deliveryHash != bytes32(0), "Invalid delivery");
        t.worker = msg.sender; t.deliveryHash = deliveryHash; t.phase = Phase.Submitted;
        emit Delivery(id,msg.sender,deliveryHash);
    }
    function rejectDelivery(bytes32 id) external exists(id) customer(id) active(id) {
        Task storage t = tasks[id]; require(t.phase == Phase.Submitted, "No delivery");
        t.worker = address(0); t.deliveryHash = bytes32(0); t.phase = Phase.Frozen;
    }
    function approveDelivery(bytes32 id) external exists(id) customer(id) active(id) {
        Task storage t = tasks[id]; require(t.phase == Phase.Submitted, "No delivery");
        uint256 amount = t.reward; t.reward = 0; t.phase = Phase.Complete; credit[t.worker] += amount;
        emit Completed(id,t.worker,amount);
    }
    function expire(bytes32 id) external exists(id) {
        Task storage t = tasks[id];
        require(block.timestamp >= t.deadline && t.phase != Phase.Complete && t.phase != Phase.Expired, "Not expirable");
        uint256 amount = t.bounty + t.reward; t.bounty = 0; t.reward = 0; t.phase = Phase.Expired;
        credit[t.customer] += amount; emit Expired(id,amount);
    }
    function withdraw() external {
        require(!locked, "Reentry"); uint256 amount = credit[msg.sender]; require(amount > 0, "No credit");
        locked = true; credit[msg.sender] = 0;
        (bool ok,) = payable(msg.sender).call{value:amount}(""); require(ok, "Transfer failed");
        locked = false; emit Withdrawn(msg.sender,amount);
    }
}
