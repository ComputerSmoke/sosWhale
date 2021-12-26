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

async function deployBuyer(maker, token) {
    const WhaleBuyer = await ethers.getContractFactory("WhaleBuyer");
    const whaleBuyer = await whaleBuyer.deploy(
        whale.address,
        token.address,
        "0xc778417E063141139Fce010982780140Aa0cD5Ab"
    );
    console.log("Contract deployed to address:", whaleBuyer.address);
    return whaleBuyer;
}
async function createPool(factory, token) {
    await factory.createPool(token.address, "0xc778417E063141139Fce010982780140Aa0cD5Ab", 10000);
    let Pool = await ethers.getContractFactory("IUniswapV3Pool");
    let pool = Pool.attach(factory.getPool(_sos, _weth, 10000));
    return pool;
}
async function addLiquidity(pool) {
    pool.mint("0x0000000000000000000000000000000000000000",tickLower, tickUpper, web3.toWei("0.6", "ether"), "");
}
async function getFactory() {
    let Factory = await ethers.getContractFactory("IUniswapV3Factory");
    return Factory.attach("0x1F98431c8aD98523631AE4a59f267346ea31F984");
}

async function getWeth() {
    let WETH = await ether.getContractFactory("IWETH");
    let weth = WETH.attach("0xc778417E063141139Fce010982780140Aa0cD5Ab");
    weth.deposit({value: web3.utils.toWei("0.6", "ether")});
}
  
async function main() {
    let token = await deployTestToken();
    let maker = await deployMaker();
    let buyer = await deployBuyer(maker, token);
    let factory = await getFactory();
    await getWeth();
    let pool = await createPool(factory, token);
    await addLiquidity(pool);
    let price = buyer.getCost();
    console.log("Price:",price);
    buyer.buy(price, 1);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })