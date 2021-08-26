import { ethers } from "hardhat"
import { getDeployer } from "./utils"

async function main() {
    const deployer = getDeployer()

    // Deploying UpgradeProxyImplementation
    console.log("Deploying UpgradeProxyImplementation...")
    const UpgradeProxyImplementation = await (
        await ethers.getContractFactory("UpgradeProxyImplementation", deployer)
    ).deploy()
    await UpgradeProxyImplementation.deployTransaction.wait()
    console.log(`UpgradeProxyImplementation contract address: ${UpgradeProxyImplementation.address}`)

    // Deploying UpgradeProxy
    console.log("Deploying UpgradeProxy...")
    const UpgradeProxy = await (
        await ethers.getContractFactory("TransparentUpgradeableProxy", deployer)
    ).deploy(
        UpgradeProxyImplementation.address,
        deployer.address,
        UpgradeProxyImplementation.interface.encodeFunctionData("initialize", [])
    )
    await UpgradeProxy.deployTransaction.wait()
    console.log(`UpgradeProxy contract address: ${UpgradeProxy.address}`)

    const implementation = await UpgradeProxy.connect(deployer).callStatic.implementation()
    if (implementation !== UpgradeProxyImplementation.address) {
        throw new Error("Wrong implementation")
    }
    const admin = await UpgradeProxy.connect(deployer).callStatic.admin()
    if (admin !== deployer.address) {
        throw new Error("Wrong admin")
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
