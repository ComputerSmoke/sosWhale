async function main() {

    let swapRouter = await ethers.getContractAt("ISwapRouter", "0xE592427A0AEce92De3Edee1F18E0157C05861564");
    let usdc = await ethers.getContractAt("IERC20", "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174");
    let matic = await ethers.getContractAt("IERC20", "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270");

    params = {
        tokenIn: usdc.address,
        tokenOut: matic.address,
        fee: 500,
        recipient: "0x329121b9817b6945f2486A643fC427aaf58520b2",
        deadline: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        amountInMaximum: "999999999999999999999",
        amountOut: ""+web3.utils.toWei("0.5", "ether"),
        sqrtPriceLimitX96: 0
    };

    await usdc.approve(swapRouter.address, "999999999999999999999", {gasLimit: 900000});
    console.log(await swapRouter.exactOutputSingle(params), {gasLimit: 9000000});
}

main();