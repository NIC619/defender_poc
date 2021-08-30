import { ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getOperator, getSubOperator, upgradeProxyAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const UpgradeProxy = await ethers.getContractAt("UpgradeProxyImplementation", upgradeProxyAddr, operator)
    const operatorStored = await UpgradeProxy.callStatic.operator()

    const promptChildAddrResult = await prompts(
        {
            type: "text",
            name: "childAddr",
            message: "child address",
        },
        {
            onCancel: async function () {
                console.log("Exit process")
                process.exit(0)
            },
        },
    )
    const newChildAddr = promptChildAddrResult.childAddr

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
    if (operatorStored == operator.address) {
        tx = await UpgradeProxy.connect(operator).upgradeChild(newChildAddr, newChilStatus)
    } else if (operatorStored == subOperator.address) {
        tx = await UpgradeProxy.connect(subOperator).upgradeChild(newChildAddr, newChilStatus)
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    console.log(`upgradeChild tx sent: ${tx.hash}`)
    await tx.wait()

    const childAddrStored = await UpgradeProxy.callStatic.childAddr()
    if (childAddrStored != newChildAddr) {
        throw new Error(`Wrong childAddr: ${childAddrStored}`)
    }
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
