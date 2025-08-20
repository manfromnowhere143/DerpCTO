// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract DerpToken is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    string public constant name = "DERP";
    string public constant symbol = "DERP";
    uint8 public constant decimals = 18;
    uint256 private constant _totalSupply = 369000000 * 10**18; // 369 million tokens
    
    address public owner;
    address public constant teamWallet = 0x69fccadc506D79Fd30F2d26a3F41aF8929f298f9;
    address public pancakeswapPair;
    bool public tradingEnabled = false;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        
        // Calculate allocations
        uint256 teamAllocation = _totalSupply * 10 / 100; // 10% = 36,900,000 tokens
        uint256 ownerAllocation = _totalSupply - teamAllocation; // 90% = 332,100,000 tokens
        
        // Send 10% to team wallet
        _balances[teamWallet] = teamAllocation;
        emit Transfer(address(0), teamWallet, teamAllocation);
        
        // Send 90% to deployer (for liquidity)
        _balances[msg.sender] = ownerAllocation;
        emit Transfer(address(0), msg.sender, ownerAllocation);
    }
    
    function totalSupply() public pure override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        // Only allow transfers if trading is enabled OR if adding liquidity
        require(
            tradingEnabled || 
            msg.sender == owner && (recipient == pancakeswapPair || pancakeswapPair == address(0)),
            "Trading not enabled"
        );
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
    
    function allowance(address _owner, address spender) public view override returns (uint256) {
        return _allowances[_owner][spender];
    }
    
    function approve(address spender, uint256 amount) public override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        // Only allow if trading enabled OR owner adding liquidity
        require(
            tradingEnabled || 
            sender == owner && (recipient == pancakeswapPair || pancakeswapPair == address(0)),
            "Trading not enabled"
        );
        require(_balances[sender] >= amount, "Insufficient balance");
        require(_allowances[sender][msg.sender] >= amount, "Allowance exceeded");
        
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        _allowances[sender][msg.sender] -= amount;
        
        emit Transfer(sender, recipient, amount);
        return true;
    }
    
    function setPancakeswapPair(address _pair) external onlyOwner {
        pancakeswapPair = _pair;
    }
    
    function enableTrading() external onlyOwner {
        tradingEnabled = true;
    }
    
    function renounceOwnership() external onlyOwner {
        owner = address(0);
    }
}
