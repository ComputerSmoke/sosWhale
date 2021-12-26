// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface IWhaleMaker {
    function buy(uint256 num) external payable;

     function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function totalSupply() external view returns (uint);
}