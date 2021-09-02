import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getOperator, getSubOperator, upgradeProxyAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const UpgradeProxy = await ethers.getContractAt("UpgradeProxyImplementation", upgradeProxyAddr, operator)
    const operatorStored = await UpgradeProxy.callStatic.operator()

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

    let tx, actualOperator
    if (operatorStored == operator.address) {
        actualOperator = operator
    } else if (operatorStored == subOperator.address) {
        actualOperator = subOperator
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    tx = await UpgradeProxy.connect(actualOperator).setChildStatus(newChilStatus)
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
