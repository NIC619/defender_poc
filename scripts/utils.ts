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

export const upgradeProxyAddr = "0x26a93448dFe50f97caBe9FFb3D9a23F6500d9c3A"

export const upgradeProxyImplementationAddr = "0xC01ff08c44Da3425bbac26c48958CE99cAa2F798"