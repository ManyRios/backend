const Provider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const FixedProductMarketMakerFactoryArtifact = require("./abi/FixedProductMarketMakerFactory.json");
const FixedProductMarketMakerArtifact = require("./abi/FixedProductMarketMaker.json");
const ConditionalTokensArtifact = require("./abi/ConditionalTokens.json");
const WallfairTokenArtifact = require("./abi/WallfairToken.json");
const {getConditionId} = require("./GnosisHelper");

const infuraUrl = 'http://localhost:7545';
const menmoric = 'gun concert fault upgrade world midnight sleep rough sick collect noodle want'

const CONTRACT_ADDRESS_MARKET_MAKER_FACTORY = '0x271573C3b8b45ec3822f0E44576253f9392B578b';
const CONTRACT_ADDRESS_WALLFAIR_TOKEN = '0x8B74A2Aa1b1e87a60ac5891C659De5dFB8Ec056b';
const CONTRACT_ADDRESS_CONDITIONAL_TOKENS = '0x73Ad385a1674Ed3723BEf474A9Ae2C3AEc5B5303';


function getWeb3() {
    const provider = new Provider(menmoric, infuraUrl);
    return new Web3(provider);
}

async function getAccount() {
    return (await getWeb3().eth.getAccounts())[0];
}

function getWallfairToken() {
    const web3 = getWeb3();
    return new web3.eth.Contract(
        WallfairTokenArtifact.abi,
        CONTRACT_ADDRESS_WALLFAIR_TOKEN
    );
}

function getFixedProductMarketMakerFactory() {
    const web3 = getWeb3();
    return new web3.eth.Contract(
        FixedProductMarketMakerFactoryArtifact.abi,
        CONTRACT_ADDRESS_MARKET_MAKER_FACTORY
    );
}

function getFixedProductMarketMaker(marketMakerAddress) {
    const web3 = getWeb3();
    return new web3.eth.Contract(
        FixedProductMarketMakerArtifact.abi,
        marketMakerAddress
    );
}

function getConditionalTokens() {
    const web3 = getWeb3();
    return new web3.eth.Contract(
        ConditionalTokensArtifact.abi,
        CONTRACT_ADDRESS_CONDITIONAL_TOKENS
    );
}

async function prepareConditionalToken(numOutcomes) {
    const account = await getAccount();
    const {prepareCondition} = getConditionalTokens().methods;
    const questionId = Web3.utils.randomHex(32);

    await prepareCondition(account, questionId, numOutcomes).send({from: account});
    return questionId;
}

async function createMarketMaker(numOutcomes) {
    const account = await getAccount();
    const questionId = await prepareConditionalToken(numOutcomes);

    const {createFixedProductMarketMaker} = getFixedProductMarketMakerFactory().methods;

    const conditionIds = [getConditionId(account, questionId, numOutcomes)];

    try {
        const result = await createFixedProductMarketMaker(
            CONTRACT_ADDRESS_CONDITIONAL_TOKENS,
            CONTRACT_ADDRESS_WALLFAIR_TOKEN,
            conditionIds,
            Web3.utils.toBN(3e15)
        ).send({from: account});
        return result.events.FixedProductMarketMakerCreation.returnValues.fixedProductMarketMaker;
    } catch (e) {
        console.log(e);
    }
}

exports.getWeb3 = getWeb3;
exports.getAccount = getAccount;
exports.getWallfairToken = getWallfairToken;
exports.getFixedProductMarketMakerFactory = getFixedProductMarketMakerFactory;
exports.getFixedProductMarketMaker = getFixedProductMarketMaker;
exports.getConditionalTokens = getConditionalTokens;
exports.prepareConditionalToken = prepareConditionalToken;
exports.createMarketMaker = createMarketMaker;
