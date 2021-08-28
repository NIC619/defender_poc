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

export const defaultParam = ethers.BigNumber.from(199)

export const defaultImportantDependency = "0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead"

export const upgradeProxyAddr = "0x5827B6815Fdb97774Ea31E790c8503e7B9014917"

export const upgradeProxyImplementationAddr = "0x77a6302d81154603Ac32d031275E9C9103B50D29"

export const oneRoleAccessControlAddr = ""

export const oneRoleAccessControlWithTimeLockAddr = ""