// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol';
import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol';
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IWhaleBuyer.sol";
import "../interfaces/IWhaleMaker.sol";
import "../interfaces/IWETH.sol";

contract WhaleBuyer is IWhaleBuyer {
    using SafeERC20 for IERC20;
    //Addresses of supported tokens
    IERC20 immutable sos;
    //Address of weth
    IWETH weth;
    //Uniswap V3 router for exchanging tokens to weth
    IUniswapV3Pool immutable sosPool;
    //NFT Contract
    IWhaleMaker immutable whaleMaker;
    //Parameterized nft, sos, and weth addresses.
    constructor(address _whaleMaker, address _sos, address _weth) {
        IUniswapV3Factory factory = IUniswapV3Factory(0x1F98431c8aD98523631AE4a59f267346ea31F984);
        sosPool = IUniswapV3Pool(factory.getPool(_sos, _weth, 10000));
        sos = IERC20(_sos);
        weth = IWETH(_weth);
        whaleMaker = IWhaleMaker(_whaleMaker);
    }
    
    /**
     * Buy _num WHALE with $SOS using specified _maxExchangeRate to mitigate frontrunning.
     * max exchange rate is a sqrt(sos/eth) Q64.96 value. 
     * Cost should be obtained with an offchain call to exchangeRate to prevent frontrunning. 
     */
    function buy(uint256 _cost, uint256 _mintNum) external {
        //Get the SOS to buy with
        sos.safeTransferFrom(msg.sender, address(this), _cost);
        //Convert it to WETH
        (int256 amount0, int256 amount1) = sosPool.swap(
            address(this), 
            true, 
            -0.5 ether,
            0x00ffffffffffffffffffffffffffffffffffffffff,//do not limit price, we check after that we are able to mint.
            ""
        );
        //Convert the WETH to ETH
        weth.withdraw(0.5 ether);
        //Buy the NFT
        uint id = whaleMaker.totalSupply()+1;
        whaleMaker.buy{value: 0.5 ether}(_mintNum);
        //Transfer the NFT to buyer
        whaleMaker.safeTransferFrom(address(this), msg.sender, id);
        //Refund dust SOS
        uint256 dust = sos.balanceOf(address(this));
        if(dust > 0) sos.safeTransferFrom(address(this), msg.sender, dust);
    }
    /**
     * Get the price of a mint with 2% slippage tolerance.
     */
    function getCost() external view returns (uint256) {
        (uint160 price,,,,,,) = sosPool.slot0();
        return (uint256(price**2) * uint256(.5 ether)) / uint256(10 * 94) * 102 / 100;
    }
}