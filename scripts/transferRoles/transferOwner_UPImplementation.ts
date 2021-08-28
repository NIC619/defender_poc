import { ethers } from "hardhat"
import { getOperator, getSubOperator, upgradeProxyAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const UpgradeProxy = await ethers.getContractAt("UpgradeProxyImplementation", upgradeProxyAddr)
    const operatorStored = await UpgradeProxy.callStatic.operator()

    let tx
    if (operatorStored == operator.address) {
        tx = await UpgradeProxy.connect(operator).transferOwnership(subOperator.address)
    } else if (operatorStored == subOperator.address) {
        tx = await UpgradeProxy.connect(subOperator).transferOwnership(operator.address)
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    console.log(`transferOwnership tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
