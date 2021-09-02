import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperator } from "../utils"

async function main() {
    const [UpgradeProxy, contractOperator] = await getContractAndOperator("UpgradeProxyImplementation")

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

    let tx
    tx = await UpgradeProxy.connect(contractOperator).setChildStatus(newChilStatus)
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
