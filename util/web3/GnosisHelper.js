const Web3 = require("web3");

function getConditionId(oracle, questionId, outcomeSlotCount) {
    return Web3.utils.soliditySha3(
        {t: "address", v: oracle},
        {t: "bytes32", v: questionId},
        {t: "uint", v: outcomeSlotCount}
    );
}

exports.getConditionId = getConditionId;
