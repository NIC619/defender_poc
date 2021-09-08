import { ethers } from "hardhat"

export const getDeployer = () => {
    const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY
    if (deployerPrivateKey === undefined) throw Error("Deployer private key not provided")

    const deployer = new ethers.Wallet(deployerPrivateKey, ethers.provider)

    return deployer
}

export const getMoreSecuredOperator = () => {
    const moreSecuredOperatorPrivateKey = process.env.MORE_SECURED_OPERATOR_PRIVATE_KEY
    if (moreSecuredOperatorPrivateKey === undefined) throw Error("More secured moreSecuredOperator private key not provided")

    const moreSecuredOperator = new ethers.Wallet(moreSecuredOperatorPrivateKey, ethers.provider)

    return moreSecuredOperator
}

export const getLessSecuredOperator = () => {
    const lessSecuredOperatorPrivateKey = process.env.LESS_SECURED_OPERATOR_PRIVATE_KEY
    if (lessSecuredOperatorPrivateKey === undefined) throw Error("Less secured moreSecuredOperator private key not provided")

    const lessSecuredOperator = new ethers.Wallet(lessSecuredOperatorPrivateKey, ethers.provider)

    return lessSecuredOperator
}

export const getErrandOperator = () => {
    const errandOperatorPrivateKey = process.env.ERRAND_OPERATOR_PRIVATE_KEY
    if (errandOperatorPrivateKey === undefined) throw Error("Errand moreSecuredOperator private key not provided")

    const errandOperator = new ethers.Wallet(errandOperatorPrivateKey, ethers.provider)

    return errandOperator
}

export const getSentinel = () => {
    const sentinelPrivateKey = process.env.SENTINEL_PRIVATE_KEY
    if (sentinelPrivateKey === undefined) throw Error("Sentinel private key not provided")

    const sentinel = new ethers.Wallet(sentinelPrivateKey, ethers.provider)

    return sentinel
}

export const getContractAndOperators = async (contractName: string) => {
    const moreSecuredOperator = getMoreSecuredOperator()
    const lessSecuredOperator = getLessSecuredOperator()
    const errandOperator = getErrandOperator()

    let contractAddr, contract
    if (contractName == "UpgradeProxyImplementation") {
        contractAddr = upgradeProxyAddr
    } else if (contractName == "OneRoleAccessControl") {
        contractAddr = oneRoleAccessControlAddr
    } else if (contractName == "OneRoleAccessControlWithTimeLock") {
        contractAddr = oneRoleAccessControlWithTimeLockAddr
    } else {
        throw Error(`Invalid contract name: ${contractName}`)
    }
    contract = await ethers.getContractAt(contractName, contractAddr)
    const moreSecuredOperatorStored = await contract.callStatic.moreSecuredOperator()
    const lessSecuredOperatorStored = await contract.callStatic.lessSecuredOperator()
    const errandOperatorStored = await contract.callStatic.errandOperator()

    if (moreSecuredOperatorStored != moreSecuredOperator.address) {
        throw new Error(`Wrong moreSecuredOperator: ${moreSecuredOperatorStored}`)
    }
    if (lessSecuredOperatorStored != lessSecuredOperator.address) {
        throw new Error(`Wrong lessSecuredOperator: ${lessSecuredOperatorStored}`)
    }
    if (errandOperatorStored != errandOperator.address) {
        throw new Error(`Wrong errandOperator: ${errandOperatorStored}`)
    }
 
    return [contract, moreSecuredOperator, lessSecuredOperator, errandOperator]
}

export const getAttacker = () => {
    const attackerPrivateKey = process.env.ATTACKER_PRIVATE_KEY
    if (attackerPrivateKey === undefined) throw Error("Attacker private key not provided")

    const attacker = new ethers.Wallet(attackerPrivateKey, ethers.provider)

    return attacker
}

export const defaultParam = ethers.BigNumber.from(199)

export const defaultImportantDependency = "0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead"

export const defaultValidAllowanceTokenAddr = "0x0000000000000000000000000000000000000aaa"

export const defaultInvalidAllowanceTokenAddr = "0x0000000000000000000000000000000000000fff"

export const callProxyAddr = "0x1E8b65D0562f89A1Bd951ADD5354d9a374dfe550"

export const upgradeProxyAddr = "0x5827B6815Fdb97774Ea31E790c8503e7B9014917"

export const upgradeProxyImplementationAddr = "0x77a6302d81154603Ac32d031275E9C9103B50D29"

export const oneRoleAccessControlAddr = "0xa88efB15C2980f5eC7a189C2CcdEC3cf3d3BBb1c"

export const oneRoleAccessControlWithTimeLockAddr = "0x9D1F313beb8342673E4f90a4c7Dd04C292984208"