import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperators } from "../utils"

async function main() {
    const [UpgradeProxy, , lessSecuredOperator, ] = await getContractAndOperators("UpgradeProxyImplementation")

    const promptStatusResult = await prompts(
        {
            type: "confirm",
            name: "childStatus",
            message: "child status (activated or not)",
        },
        {
            onCancel: async function () {
                console.log("Exit process")
                process.exit(0)
            },
        },
    )
    const newChilStatus = promptStatusResult.childStatus

    const tx = await UpgradeProxy.connect(lessSecuredOperator).setChildStatus(newChilStatus)
    console.log(`setChildStatus tx sent: ${tx.hash}`)
    await tx.wait()

    const childStatusStored = await UpgradeProxy.callStatic.isChildEnabled()
    if (childStatusStored != newChilStatus) {
        throw new Error(`Wrong isChildEnabled: ${childStatusStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
