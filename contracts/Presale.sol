// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

/**
 * ██████╗ ██████╗ ███████╗███████╗ █████╗ ██╗     ███████╗
 * ██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██║     ██╔════╝
 * ██████╔╝██████╔╝█████╗  ███████╗███████║██║     █████╗
 * ██╔═══╝ ██╔══██╗██╔══╝  ╚════██║██╔══██║██║     ██╔══╝
 * ██║     ██║  ██║███████╗███████║██║  ██║███████╗███████╗
 * ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝
 */

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

library TransferHelper {
    function safeApprove(address token, address to, uint value) internal {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'MAPPY_TransferHelper: APPROVE_FAILED');
    }

    function safeTransfer(address token, address to, uint value) internal {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'MAPPY_TransferHelper: TRANSFER_FAILED');
    }

    function safeTransferFrom(address token, address from, address to, uint value) internal {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'MAPPY_TransferHelper: TRANSFER_FROM_FAILED');
    }
    
    // sends ETH or an erc20 token
    function safeTransferBaseToken(address token, address payable to, uint value, bool isERC20) internal {
        if (!isERC20) {
            to.transfer(value);
        } else {
            (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
            require(success && (data.length == 0 || abi.decode(data, (bool))), 'MAPPY_TransferHelper: TRANSFER_FAILED');
        }
    }
}

contract Presale is ReentrancyGuard, Ownable {
    using Address for address;
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct PresaleInfo {
        address sale_token; // Sale token
        uint256 token_rate; // 1 base token = ? s_tokens, fixed price
        uint256 raise_min; // Maximum base token BUY amount per buyer
        uint256 raise_max; // The amount of presale tokens up for presale
        uint256 softcap; // Minimum raise amount
        uint256 hardcap; // Maximum raise amount
        uint256 presale_start;
        uint256 presale_end;
    }

    struct PresaleStatus {
        bool force_failed; // Set this flag to force fail the presale
        uint256 raised_amount; // Total base currency raised (usually ETH)
        uint256 sold_amount; // Total presale tokens sold
        uint256 token_withdraw; // Total tokens withdrawn post successful presale
        uint256 base_withdraw; // Total base tokens withdrawn on presale failure
        uint256 num_buyers; // Number of unique participants
    }

    struct BuyerInfo {
        uint256 base; // Total base token (usually ETH) deposited by user, can be withdrawn on presale failure
        uint256 sale; // Num presale tokens a user owned, can be withdrawn on presale success
    }
    
    struct TokenInfo {
        string name;
        string symbol;
        uint256 totalsupply;
        uint256 decimal;
    }
  
    PresaleInfo public presale_info;
    PresaleStatus public status;
    TokenInfo public tokeninfo;

    mapping(address => BuyerInfo) public buyers;

    event UserDepsitedSuccess(address, uint256);
    event UserWithdrawSuccess(uint256);
    event UserWithdrawTokensSuccess(uint256);

    address deadaddr = 0x000000000000000000000000000000000000dEaD;
    uint256 public lock_delay;

    uint256 private constant privilegedTime = 10 * 60; // 10 min

    constructor () {}

    function init_presale (
        address _sale_token,
        uint256 _token_rate,
        uint256 _raise_min, 
        uint256 _raise_max, 
        uint256 _softcap, 
        uint256 _hardcap,
        uint256 _presale_start,
        uint256 _presale_end
        ) public onlyOwner {

        require(_sale_token != address(0), "MAPPY_Init: Zero Address");
        
        presale_info.sale_token = address(_sale_token);
        presale_info.token_rate = _token_rate;
        presale_info.raise_min = _raise_min;
        presale_info.raise_max = _raise_max;
        presale_info.softcap = _softcap;
        presale_info.hardcap = _hardcap;

        presale_info.presale_end = _presale_end;
        presale_info.presale_start =  _presale_start;
        
        //Set token token info
        tokeninfo.name = IERC20Metadata(presale_info.sale_token).name();
        tokeninfo.symbol = IERC20Metadata(presale_info.sale_token).symbol();
        tokeninfo.decimal = IERC20Metadata(presale_info.sale_token).decimals();
        tokeninfo.totalsupply = IERC20Metadata(presale_info.sale_token).totalSupply();
    }

    function presaleStatus() public view returns (uint256) {
        if ((block.timestamp > presale_info.presale_end) && (status.raised_amount < presale_info.softcap)) {
            return 3; // Failure
        }
        if (status.raised_amount >= presale_info.hardcap) {
            return 2; // Wonderful - reached to Hardcap
        }
        if ((block.timestamp > presale_info.presale_end) && (status.raised_amount >= presale_info.softcap)) {
            return 2; // SUCCESS - Presale ended with reaching Softcap
        }
        if ((block.timestamp >= presale_info.presale_start) && (block.timestamp <= presale_info.presale_end)) {
            return 1; // ACTIVE - Deposits enabled, now in Presale
        }
            return 0; // QUEUED - Awaiting start block
    }
    
    // Accepts msg.value for eth or _amount for ERC20 tokens
    function userDeposit () public payable nonReentrant {
        require(presaleStatus() == 1, "Not Active");
        require(presale_info.raise_min <= msg.value, "MAPPY_Deposit: Balance is insufficent");
        require(presale_info.raise_max >= msg.value, "MAPPY_Deposit: Balance is too much");

        BuyerInfo storage buyer = buyers[msg.sender];

        uint256 amount_in = msg.value;
        uint256 allowance = presale_info.raise_max.sub(buyer.base);
        uint256 remaining = presale_info.hardcap - status.raised_amount;

        allowance = allowance > remaining ? remaining : allowance;
        if (amount_in > allowance) {
            amount_in = allowance;
        }

        uint256 tokensSold = amount_in.mul(presale_info.token_rate);

        require(tokensSold > 0, "MAPPY_Deposit: ZERO TOKENS");
        require(status.raised_amount * presale_info.token_rate <= IERC20(presale_info.sale_token).balanceOf(address(this)), "Token remain error");
        
        if (buyer.base == 0) {
            status.num_buyers++;
        }
        buyers[msg.sender].base = buyers[msg.sender].base.add(amount_in);
        buyers[msg.sender].sale = buyers[msg.sender].sale.add(tokensSold);
        status.raised_amount = status.raised_amount.add(amount_in);
        status.sold_amount = status.sold_amount.add(tokensSold);
        
        // return unused ETH
        if (amount_in < msg.value) {
            payable(msg.sender).transfer(msg.value.sub(amount_in));
        }
        
        emit UserDepsitedSuccess(msg.sender, msg.value);
    }
    
    // withdraw presale tokens
    // percentile withdrawls allows fee on transfer or rebasing tokens to still work
    function userWithdrawTokens () public nonReentrant {
        require(presaleStatus() == 2, "MAPPY_Withdraw: Not succeeded"); // Success
        require(block.timestamp >= presale_info.presale_end + lock_delay, "MAPPY_Withdraw: Token Locked."); // Lock duration check
        
        BuyerInfo storage buyer = buyers[msg.sender];
        uint256 remaintoken = status.sold_amount.sub(status.token_withdraw);
        require(remaintoken >= buyer.sale, "MAPPY_Withdraw: Nothing to withdraw.");
        
        TransferHelper.safeTransfer(address(presale_info.sale_token), msg.sender, buyer.sale);
        
        status.token_withdraw = status.token_withdraw.add(buyer.sale);
        buyers[msg.sender].sale = 0;
        buyers[msg.sender].base = 0;
        
        emit UserWithdrawTokensSuccess(buyer.sale);
    }
    
    // On presale failure
    // Percentile withdrawls allows fee on transfer or rebasing tokens to still work
    function userWithdrawBaseTokens () public nonReentrant {
        require(presaleStatus() == 3, "MAPPY_Withdraw_Base: Not failed."); // FAILED
        
        // Refund
        BuyerInfo storage buyer = buyers[msg.sender];
        
        uint256 remainingBaseBalance = address(this).balance;
        
        require(remainingBaseBalance >= buyer.base, "MAPPY_Withdraw_Base: Nothing to withdraw.");

        status.base_withdraw = status.base_withdraw.add(buyer.base);
        
        address payable reciver = payable(msg.sender);
        reciver.transfer(buyer.base);

        if(msg.sender == owner()) {
            ownerWithdrawTokens();
        }

        buyer.base = 0;
        buyer.sale = 0;
        
        emit UserWithdrawSuccess(buyer.base);
    }
    
    // On presale failure
    // Allows the owner to withdraw the tokens they sent for presale
    function ownerWithdrawTokens () private onlyOwner {
        require(presaleStatus() == 3, "MAPPY_Withdraw_Base_Owner: Only failed status."); // FAILED
        TransferHelper.safeTransfer(address(presale_info.sale_token), owner(), IERC20(presale_info.sale_token).balanceOf(address(this)));
        
        emit UserWithdrawSuccess(IERC20(presale_info.sale_token).balanceOf(address(this)));
    }

    function withdrawICOCoin (address _address) public onlyOwner {
        address payable reciver = payable(_address);
        reciver.transfer(address(this).balance);
    }

    function getTimestamp () public view returns (uint256) {
        return block.timestamp;
    }

    function setLockDelay (uint256 delay) public onlyOwner {
        lock_delay = delay;
    }

    function remainingBurn() public onlyOwner {
        require(presaleStatus() == 2, "MAPPY_Burn: Not succeeded"); // Success
        require(presale_info.hardcap * presale_info.token_rate >= status.sold_amount, "MAPPY_Burn: Nothing to burn");
        
        uint256 rushTokenAmount = presale_info.hardcap * presale_info.token_rate - status.sold_amount;

        TransferHelper.safeTransfer(address(presale_info.sale_token), address(deadaddr), rushTokenAmount);
    }
}