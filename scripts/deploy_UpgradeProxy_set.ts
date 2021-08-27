import { ethers } from "hardhat"
import { getDeployer, getOperator } from "./utils"

async function main() {
    const deployer = getDeployer()
    const operator = getOperator()

    // Deploying UpgradeProxyImplementation
    console.log("Deploying UpgradeProxyImplementation...")
    const UpgradeProxyImplementation = await (
        await ethers.getContractFactory("UpgradeProxyImplementation", deployer)
    ).deploy()
    await UpgradeProxyImplementation.deployTransaction.wait()
    console.log(`UpgradeProxyImplementation contract address: ${UpgradeProxyImplementation.address}`)

    // Deploying UpgradeProxy
    console.log("Deploying UpgradeProxy...")
    let UpgradeProxy = await (
        await ethers.getContractFactory("TransparentUpgradeableProxy", deployer)
    ).deploy(
        UpgradeProxyImplementation.address,
        deployer.address,
        UpgradeProxyImplementation.interface.encodeFunctionData("initialize", [operator.address])
    )
    await UpgradeProxy.deployTransaction.wait()
    console.log(`UpgradeProxy contract address: ${UpgradeProxy.address}`)

    const implementation = await UpgradeProxy.connect(deployer).callStatic.implementation()
    if (implementation !== UpgradeProxyImplementation.address) {
        throw new Error(`Wrong implementation: ${implementation}`)
    }
    const admin = await UpgradeProxy.connect(deployer).callStatic.admin()
    if (admin !== deployer.address) {
        throw new Error(`Wrong admin: ${admin}`)
    }
    UpgradeProxy = UpgradeProxyImplementation.attach(UpgradeProxy.address)
    const operatorStored = await UpgradeProxy.connect(operator).callStatic.operator()
    if (operatorStored !== operator.address) {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
