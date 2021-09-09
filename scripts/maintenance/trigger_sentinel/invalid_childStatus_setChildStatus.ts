import {  ethers } from "hardhat"
import { getContractAndOperators } from "../../utils"
import { expectedChildStatus } from "../../autotask/pause/UpgradeProxyImplementation"

async function main() {
    const [UpgradeProxy, , lessSecuredOperator, ] = await getContractAndOperators("UpgradeProxyImplementation")

    const tx = await UpgradeProxy.connect(lessSecuredOperator).setChildStatus(!expectedChildStatus)
    console.log(`setChildStatus tx sent: ${tx.hash}`)
    console.log("This should trigger Sentinel...")
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
