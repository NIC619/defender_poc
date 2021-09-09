import { ethers } from "hardhat"
import { getContractAndOperators } from "../../utils"
import { expectedChild, expectedChildStatus } from "../../autotask/pause/UpgradeProxyImplementation"

async function main() {
    const [UpgradeProxy, , lessSecuredOperator, ] = await getContractAndOperators("UpgradeProxyImplementation")

    const invalidChild = "0x0000000000000000000000000000000000000fff"
    // @ts-ignore
    if (invalidChild == expectedChild) {
        throw new Error(`invalidChild are the same as expectedChild: ${invalidChild}`)
    }
    const tx = await UpgradeProxy.connect(lessSecuredOperator).upgradeChild(invalidChild, expectedChildStatus)
    console.log(`upgradeChild tx sent: ${tx.hash}`)
    console.log("This should trigger Sentinel...")
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
