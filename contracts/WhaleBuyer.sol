// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "../interfaces/IWhaleBuyer.sol";
import "../interfaces/IWhaleMaker.sol";
import "../interfaces/IWETH9.sol";

contract WhaleBuyer is IWhaleBuyer,ERC721Holder {
    using SafeERC20 for IERC20;
    //Addresses of supported tokens
    IERC20 sos;
    //Address of weth
    IWETH9 weth;
    //Uniswap V3 router for exchanging tokens to weth
    IUniswapV3Pool sosPool;
    ISwapRouter router;
    //NFT Contract
    IWhaleMaker whaleMaker;
    //Parameterized nft, sos, and weth addresses.
    constructor(address _router, address _pool, address _whaleMaker, address _sos, address _weth) {
        router = ISwapRouter(_router);
        sosPool = IUniswapV3Pool(_pool);
        sos = IERC20(_sos);
        weth = IWETH9(_weth);
        whaleMaker = IWhaleMaker(_whaleMaker);
        sos.approve(_router, 0x00ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    }
    
    /**
     * Buy _num WHALE with $SOS using specified _maxExchangeRate to mitigate frontrunning.
     * max exchange rate is a sqrt(sos/eth) Q64.96 value. 
     * Cost should be obtained with an offchain call to exchangeRate to prevent frontrunning. 
     */
    function buy(uint256 _cost, uint256 _mintNum, uint256 _deadline) external override {
        //Get the SOS to buy with
        sos.safeTransferFrom(msg.sender, address(this), _cost*_mintNum);
        address[] memory path = new address[](2);
        path[0] = address(sos);
        path[1] = address(weth);
        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter.ExactOutputSingleParams({
            tokenIn: address(sos),
            tokenOut: address(weth),
            fee: 10000,
            recipient: address(this),
            deadline: _deadline,
            amountOut: 0.5 ether*_mintNum,
            amountInMaximum: _cost,
            sqrtPriceLimitX96: 0
        });
        //Convert it to WETH
        router.exactOutputSingle(params);
        //Convert WETH to ETH
        weth.withdraw(0.5 ether*_mintNum);
        //Buy the NFT
        uint id = whaleMaker.totalSupply()+1;
        whaleMaker.buy{value: 0.5 ether*_mintNum}(_mintNum);
        //Transfer the NFT to buyer
        for(uint i = 0; i < _mintNum; i++) {
            whaleMaker.safeTransferFrom(address(this), msg.sender, id+i);
        }

        //Refund dust ETH
        uint256 dust = sos.balanceOf(address(this));
        if(dust > 0) sos.safeTransfer(msg.sender, dust);
    }
    /**
     * Get the price of a mint with 10% slippage tolerance.
     */
    function getCost() external override view returns (uint256) {
        (uint160 price,,,,,,) = sosPool.slot0();
        return ((110 * 0.5 ether * uint256(price) ** 2) / 2 ** 192) / 100;
    }
    fallback() external payable{
        
    }
    
    receive() external payable{
        
    }
}