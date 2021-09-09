import { ethers } from "hardhat"
import { getDeployer, getMoreSecuredOperator, upgradeProxyAddr } from "../utils"

async function main() {
    const moreSecuredOperator = getMoreSecuredOperator()

    const UpgradeProxy = await ethers.getContractAt("TransparentUpgradeableProxy", upgradeProxyAddr, moreSecuredOperator)

    // Deploying new UpgradeProxyImplementation
    console.log("Deploying new UpgradeProxyImplementation...")
    const newUpgradeProxyImplementation = await (
        await ethers.getContractFactory("UpgradeProxyImplementation", moreSecuredOperator)
    ).deploy()
    await newUpgradeProxyImplementation.deployTransaction.wait()
    console.log(`New UpgradeProxyImplementation contract address: ${newUpgradeProxyImplementation.address}`)

    // const tx = await UpgradeProxy.connect(moreSecuredOperator).upgradeToAndCall(
    //     newUpgradeProxyImplementation.address,
    //     newUpgradeProxyImplementation.interface.encodeFunctionData("initialize", [moreSecuredOperator.address])
    // )
    const tx = await UpgradeProxy.connect(moreSecuredOperator).upgradeTo(
        newUpgradeProxyImplementation.address,
    )
    console.log(`upgradeTo tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
