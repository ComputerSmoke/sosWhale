async function getFactory() {
    let factory = await ethers.getContractAt("IUniswapV3Factory", "0x1F98431c8aD98523631AE4a59f267346ea31F984");
    console.log("got factory")
    return factory;
}

async function connectWeth() {
    let weth = await ethers.getContractAt("IWETH", "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270");
    console.log("connected weth");
    return weth;
}

async function connectToken() {
    return await ethers.getContractAt("TestToken", "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174");
}

async function deployMaker() {
    const WhaleMaker = await ethers.getContractFactory("WhaleMaker");
    const whaleMaker = await WhaleMaker.deploy();
    console.log("Maker deployed to address:", whaleMaker.address);
    return whaleMaker;
}

async function connectMaker() {
    return await ethers.getContractAt("WhaleMaker", "0x0F62CeB23b125724285509Ef1e460Bc4EcADc0d4");
}

async function deployBuyer(factory, weth, token, maker) {
    const WhaleBuyer = await ethers.getContractFactory("WhaleBuyer");
    let whaleBuyer = await WhaleBuyer.deploy(
        "0x88f3C15523544835fF6c738DDb30995339AD57d6",
        maker.address,
        token.address,
        weth.address,
        {gasLimit: 900000}
    );
    console.log("Contract deployed to address:", whaleBuyer.address);
    return whaleBuyer;
}

async function main() {
    let factory = await getFactory();
    let weth = await connectWeth();
    let token = await connectToken();
    let maker = await deployMaker();

    let buyer = await deployBuyer(factory, weth, token, maker);
    console.log(await buyer.getCost());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })