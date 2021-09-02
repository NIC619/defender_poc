import { ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperator } from "../utils"

async function main() {
    const [UpgradeProxy, contractOperator] = await getContractAndOperator("UpgradeProxyImplementation")

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
    tx = await UpgradeProxy.connect(contractOperator).upgradeChild(newChildAddr, newChilStatus)
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
