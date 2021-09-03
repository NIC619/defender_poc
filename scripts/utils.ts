import { ethers } from "hardhat"

export const getDeployer = () => {
    const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY
    if (deployerPrivateKey === undefined) throw Error("Deployer private key not provided")

    const deployer = new ethers.Wallet(deployerPrivateKey, ethers.provider)

    return deployer
}

export const getOperator = () => {
    const operatorPrivateKey = process.env.OPERATOR_PRIVATE_KEY
    if (operatorPrivateKey === undefined) throw Error("Operator private key not provided")

    const operator = new ethers.Wallet(operatorPrivateKey, ethers.provider)

    return operator
}

export const getSubOperator = () => {
    const subOperatorPrivateKey = process.env.SUB_OPERATOR_PRIVATE_KEY
    if (subOperatorPrivateKey === undefined) throw Error("Sub operator private key not provided")

    const operator = new ethers.Wallet(subOperatorPrivateKey, ethers.provider)

    return operator
}

export const getContractAndOperator = async (contractName: string) => {
    const operator = getOperator()
    const subOperator = getSubOperator()

    let contractAddr, contract, operatorStored
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
    operatorStored = await contract.callStatic.operator()

    let contractOperator
    if (operatorStored == operator.address) {
        contractOperator = operator
    } else if (operatorStored == subOperator.address) {
        contractOperator = subOperator
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
 
    return [contract, contractOperator]
}

export const getAttacker = () => {
    const attackerPrivateKey = process.env.ATTACKER_PRIVATE_KEY
    if (attackerPrivateKey === undefined) throw Error("Sub operator private key not provided")

    const operator = new ethers.Wallet(attackerPrivateKey, ethers.provider)

    return operator
}

export const defaultParam = ethers.BigNumber.from(199)

export const defaultImportantDependency = "0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead"

export const callProxyAddr = "0x1E8b65D0562f89A1Bd951ADD5354d9a374dfe550"

export const upgradeProxyAddr = "0x5827B6815Fdb97774Ea31E790c8503e7B9014917"

export const upgradeProxyImplementationAddr = "0x77a6302d81154603Ac32d031275E9C9103B50D29"

export const oneRoleAccessControlAddr = "0xBcd29fBcF28749D3015Da2c87230dD2eb6FA19C3"

export const oneRoleAccessControlWithTimeLockAddr = "0x9D1F313beb8342673E4f90a4c7Dd04C292984208"