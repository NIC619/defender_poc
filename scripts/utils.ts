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

export const getSentinelAddr = () => {
    // Use Defender Relayer as the Sentinel
    const sentinelAddr = process.env.DEFENDER_RELAYER_ADDRESS
    if (sentinelAddr === undefined) throw Error("Sentinel address not provided")

    return sentinelAddr
}

export const getContractAndOperators = async (contractName: string) => {
    const moreSecuredOperator = getMoreSecuredOperator()
    const lessSecuredOperator = getLessSecuredOperator()
    const errandOperator = getErrandOperator()

    let isUpgradeProxy = false
    let contractAddr, contract
    if (contractName == "UpgradeProxyImplementation") {
        isUpgradeProxy = true
        contractAddr = upgradeProxyAddr
    } else if (contractName == "OneRoleAccessControl") {
        contractAddr = oneRoleAccessControlAddr
    } else if (contractName == "OneRoleAccessControlWithTimeLock") {
        contractAddr = oneRoleAccessControlWithTimeLockAddr
    } else {
        throw Error(`Invalid contract name: ${contractName}`)
    }
    contract = await ethers.getContractAt(contractName, contractAddr)
    const moreSecuredOperatorStored = isUpgradeProxy ? "" : await contract.callStatic.moreSecuredOperator()
    const lessSecuredOperatorStored = await contract.callStatic.lessSecuredOperator()
    const errandOperatorStored = await contract.callStatic.errandOperator()

    if (!isUpgradeProxy && moreSecuredOperatorStored != moreSecuredOperator.address) {
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

export const defaultValidBlacklistTokenAddr = "0x0000000000000000000000000000000000000aaa"

export const defaultValidSpenderAddr = "0x0000000000000000000000000000000000000aaa"

export const callProxyAddr = "0x1E8b65D0562f89A1Bd951ADD5354d9a374dfe550"

export const upgradeProxyAddr = "0xd4c037782a1D181701e697ad80aB56A40c6be9Bb"

export const upgradeProxyImplementationAddr = "0x1E0D76E9556a8089cdb3822436104378E3572103"

export const oneRoleAccessControlAddr = "0x4Ed59b1E11E1460f4Ff5c5ae2895d7bd7c93E713"

export const oneRoleAccessControlWithTimeLockAddr = "0x0d975AEB0ee9EFd0682A303987aF2018e2917189"

export const testConditionAddr = "0xddD10b48CE74a0640725b24775a3CE4EC7549A62"