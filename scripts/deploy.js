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
    const TestToken = await ethers.getContractFactory("TestToken");
    const token = await TestToken.deploy(web3.utils.toWei("10000000", "ether"));
    console.log("Test token deployed to address:", token.address);
    return token;
}

async function deployMaker() {
    const WhaleMaker = await ethers.getContractFactory("WhaleMaker");
    const whaleMaker = await WhaleMaker.deploy();
    console.log("Maker deployed to address:", whaleMaker.address);
    return whaleMaker;
}

async function deployBuyer(factory, maker, token, weth) {
    const WhaleBuyer = await ethers.getContractFactory("WhaleBuyer");
    let whaleBuyer = await WhaleBuyer.deploy(
        factory.address,
        maker.address,
        token.address,
        weth.address,
        {gasLimit: 900000}
    );
    console.log("Contract deployed to address:", whaleBuyer.address);
    return whaleBuyer;
}
async function createPool(factory, token, weth) {
    await factory.createPool(
        token.address, 
        weth.address, 
        10000,
        {gasLimit: 900000}
    );
    console.log("made pool at address ", await factory.getPool(
        token.address, 
        weth.address, 
        10000,
        {gasLimit: 900000}
    ));
}
async function getPool(factory, token, weth) {
    let pool = await ethers.getContractAt(
        "IUniswapV3Pool", 
        await factory.getPool(
            token.address, 
            weth.address, 
            10000,
            {gasLimit: 900000}
        )
    );
    console.error("got pool");
    return pool;
}
async function addLiquidity(pool) {
    await pool.mint(
        "0x329121b9817b6945f2486A643fC427aaf58520b2",
        1,
        1, 
        web3.utils.toWei("0.1", "ether"), 
        0, 
        {gasLimit: 900000}
    );
    console.log("added liquidity");
}
async function getFactory() {
    let factory = await ethers.getContractAt("IUniswapV3Factory", "0x1F98431c8aD98523631AE4a59f267346ea31F984");
    console.log("got factory")
    return factory;
}

async function getWeth() {
    let weth = await ethers.getContractAt("IWETH", "0xc778417E063141139Fce010982780140Aa0cD5Ab");
    await weth.deposit({value: web3.utils.toWei("0.1", "ether")});
    console.log("got weth");
}

async function getTestToken() {
    return await ethers.getContractAt("TestToken", "0xACc5CE545a0F14ea0FC88ff3954900b46EebE543");
}
async function getMaker() {
    return await ethers.getContractAt("WhaleMaker", "0x01A51239CD19b4eF102816B1BD37ac42fBA9fe4b");
}
async function getBuyer() {
    return await ethers.getContractAt("WhaleBuyer", "0x6B6346041042F831C17e2E47a0f6497eE20AA783");
}

async function initPool(pool) {
    await pool.initialize("19807040628566084398385987584");
    console.log("Pool initialized");
}

async function main() {
    let factory = await getFactory();
    //let weth = await deployWeth();
    let weth = await connectWeth();
    //let token = await deployTestToken();
    let token = await getTestToken();
    //let maker = await deployMaker();
    let maker = await getMaker();
    let buyer = await deployBuyer(factory, maker, token, weth);
    //let buyer = await getBuyer();
    await getWeth(weth);
    await createPool(factory, token, weth);
    let pool = await getPool(factory, token, weth);
    await initPool(pool);
    await addLiquidity(pool);
    console.error("getting cost");
    let price = await buyer.getCost({gasPrice: 30000});
    console.error("Price:",price);
  //  await buyer.buy(price, 1, {gasLimit: 900000});
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })