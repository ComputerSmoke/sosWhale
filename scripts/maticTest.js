async function getFactory() {
    let factory = await ethers.getContractAt("IUniswapV3Factory", "0x1F98431c8aD98523631AE4a59f267346ea31F984");
    console.log("got factory")
    return factory;
}

async function deployWeth() {
    const WETH = await ethers.getContractFactory("WETH9");
    return await WETH.deploy();
}

async function connectWeth() {
    let weth = await ethers.getContractAt("IWETH", "0xc778417E063141139Fce010982780140Aa0cD5Ab");
    console.log("connected weth");
    return weth;
}

async function deployTestToken() {
    let token = await ethers.getContractAt("IERC20", "0xaD6D458402F60fD3Bd25163575031ACDce07538D");
    return token;
}

async function deployMaker() {
    const WhaleMaker = await ethers.getContractFactory("WhaleMaker");
    const whaleMaker = await WhaleMaker.deploy();
    console.log("Maker deployed to address:", whaleMaker.address);
    return whaleMaker;
}
async function connectMaker() {
    return await ethers.getContractAt("WhaleMaker", "0xBAe0438C6a8d89Cd27c3a175C9f7e90cfccE33E2");
}

async function deployBuyer(factory, weth, token, maker) {
    const WhaleBuyer = await ethers.getContractFactory("WhaleBuyer");
    let whaleBuyer = await WhaleBuyer.deploy(
        factory,
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
    let token = await deployTestToken();
    let maker = await connectMaker();

    let buyer = await deployBuyer(factory, weth, token, maker);
    console.log(await buyer.getCost());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })