import { ethers } from "hardhat"
import { getDeployer, getErrandOperator, getLessSecuredOperator, getMoreSecuredOperator, getSentinel } from "../utils"

async function main() {
    const deployer = getDeployer()
    const moreSecuredOperator = getMoreSecuredOperator()
    const lessSecuredOperator = getLessSecuredOperator()
    const errandOperator = getErrandOperator()
    const sentinel = getSentinel()

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
        moreSecuredOperator.address,
        UpgradeProxyImplementation.interface.encodeFunctionData("initialize", [
            lessSecuredOperator.address,
            errandOperator.address,
            sentinel.address
        ])
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
    const moreSecuredOperatorStored = await UpgradeProxy.connect(lessSecuredOperator).callStatic.moreSecuredOperator()
    if (moreSecuredOperatorStored !== moreSecuredOperator.address) {
        throw new Error(`Wrong moreSecuredOperator: ${moreSecuredOperatorStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
