import { ethers } from "hardhat"
import { getContractAndOperators } from "../utils"
import { expectedChild } from "../autotask/pause/UpgradeProxyImplementation"

async function main() {
    const [UpgradeProxy, , lessSecuredOperator, ] = await getContractAndOperators("UpgradeProxyImplementation")

    const tx = await UpgradeProxy.connect(lessSecuredOperator).upgradeChild(expectedChild, true)
    console.log(`upgradeChild tx sent: ${tx.hash}`)
    await tx.wait()

    const childAddrStored = await UpgradeProxy.callStatic.childAddr()
    if (childAddrStored != expectedChild) {
        throw new Error(`Wrong childAddr: ${childAddrStored}`)
    }
    const childStatusStored = await UpgradeProxy.callStatic.isChildEnabled()
    if (childStatusStored != true) {
        throw new Error(`Wrong isChildEnabled: ${childStatusStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
