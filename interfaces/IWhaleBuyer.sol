// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface IWhaleBuyer {
    /**
     * Buy _num WHALE with $SOS using specified _maxExchangeRate to mitigate frontrunning.
     * max exchange rate is a sqrt(sos/eth) Q64.96 value.
     */
    function buy(uint256 _cost, uint256 _num) external;
    /**
     * Get the current price of the sos pool as a sqrt(sos/eth) Q64.96 value.
     */
    function getCost() external view returns (uint256);
}