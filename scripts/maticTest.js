
async function connectWeth() {
    let weth = await ethers.getContractAt("TestToken", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
    console.log("connected weth");
    return weth;
}

async function getRouter() {
    return "0xE592427A0AEce92De3Edee1F18E0157C05861564";
}

async function connectToken() {
    return await ethers.getContractAt("TestToken", "0x3b484b82567a09e2588a13d54d032153f0c0aee0");
}

async function deployMaker() {
    const WhaleMaker = await ethers.getContractFactory("WhaleMaker");
    const whaleMaker = await WhaleMaker.deploy({gasLimit: 900000});
    console.log("Maker deployed to address:", whaleMaker.address);
    return whaleMaker;
}

async function connectMaker() {
    return await ethers.getContractAt("WhaleMaker", "0xa87121eda32661c0c178f06f8b44f12f80ae4e88");
}

async function connectBuyer() {
    return await ethers.getContractAt("WhaleBuyer", "0x9AA9925b0579a3Bc9a08D20E35Dd4A3e7c7e4234");
}

async function deployBuyer(maker, token, weth) {
    const WhaleBuyer = await ethers.getContractFactory("WhaleBuyer");
    let whaleBuyer = await WhaleBuyer.deploy(
        getRouter(),
        "0xb82d251b7e92832dCcb7F3C6F03Ae20f2D7eE597",
        maker.address,
        token.address,
        weth.address,
        {gasPrice: ethers.BigNumber.from(web3.utils.toWei("100", "gwei")), gasLimit: ethers.BigNumber.from("700000")}
    );
    console.log("Contract deployed to address:", whaleBuyer.address);
    return whaleBuyer;
}

async function main() {
    let weth = await connectWeth();
    let token = await connectToken();
   // let maker = await deployMaker();
   let maker = await connectMaker();
  // await maker.toggleSaleStatus({gasLimit: 900000,gasPrice: web3.utils.toWei("60","gwei")});

    let buyer = await deployBuyer(maker, token, weth);
    //let buyer = await connectBuyer();

   /* await token.approve(buyer.address, "5000000",{gasLimit: 900000, gasPrice: web3.utils.toWei("60","gwei")});
    console.log("approved");
    let bought = await buyer.buy("5000000", "1", ""+(Date.now() + 1000*60*5), {gasLimit: 900000,gasPrice: web3.utils.toWei("60","gwei")})
    console.log(bought);
    console.log(await maker.balanceOf("0x329121b9817b6945f2486A643fC427aaf58520b2", {gasLimit: 900000}));
    console.log(await maker.totalSupply());*/
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })