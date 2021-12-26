
async function connectWeth() {
    let weth = await ethers.getContractAt("TestToken", "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270");
    console.log("connected weth");
    return weth;
}

async function getRouter() {
    return "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
}

async function connectToken() {
    return await ethers.getContractAt("TestToken", "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174");
}

async function deployMaker() {
    const WhaleMaker = await ethers.getContractFactory("WhaleMaker");
    const whaleMaker = await WhaleMaker.deploy({gasLimit: 900000});
    console.log("Maker deployed to address:", whaleMaker.address);
    return whaleMaker;
}

async function connectMaker() {
    return await ethers.getContractAt("WhaleMaker", "0x717c4b2636df0C76d8d500C0a2457f86bB98f3fD");
}

async function connectBuyer() {
    return await ethers.getContractAt("WhaleBuyer", "0x27b0055Cc9B503F09EB434Fc5A5db06c62C4D282");
}

async function deployBuyer(maker, token, weth) {
    const WhaleBuyer = await ethers.getContractFactory("WhaleBuyer");
    let whaleBuyer = await WhaleBuyer.deploy(
        getRouter(),
        "0x88f3C15523544835fF6c738DDb30995339AD57d6",
        maker.address,
        token.address,
        weth.address
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

    //let buyer = await deployBuyer(maker, token, weth);
    let buyer = await connectBuyer();
    let cost = await buyer.getCost();
    console.log("Cost:",cost);
    await token.approve(buyer.address, cost*100,{gasLimit: 900000, gasPrice: web3.utils.toWei("60","gwei")});
    console.log("approved");
    let bought = await buyer.buy(cost, 1, Date.now() + 100000, {gasLimit: 900000,gasPrice: web3.utils.toWei("60","gwei")})
    console.log(bought);
    console.log(await maker.balanceOf("0x329121b9817b6945f2486A643fC427aaf58520b2", {gasLimit: 900000}));
    console.log(await maker.totalSupply());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })