import { ethers } from "hardhat"
import { getDeployer, getOperator, upgradeProxyAddr } from "../utils"

async function main() {
    const deployer = getDeployer()
    const operator = getOperator()

    const UpgradeProxy = await ethers.getContractAt("TransparentUpgradeableProxy", upgradeProxyAddr, deployer)

    // Deploying new UpgradeProxyImplementation
    console.log("Deploying new UpgradeProxyImplementation...")
    const newUpgradeProxyImplementation = await (
        await ethers.getContractFactory("UpgradeProxyImplementation", deployer)
    ).deploy()
    await newUpgradeProxyImplementation.deployTransaction.wait()
    console.log(`New UpgradeProxyImplementation contract address: ${newUpgradeProxyImplementation.address}`)

    // const tx = await UpgradeProxy.connect(deployer).upgradeToAndCall(
    //     newUpgradeProxyImplementation.address,
    //     newUpgradeProxyImplementation.interface.encodeFunctionData("initialize", [operator.address])
    // )
    const tx = await UpgradeProxy.connect(deployer).upgradeTo(
        newUpgradeProxyImplementation.address,
    )
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
