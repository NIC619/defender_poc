import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperator } from "../utils"

async function main() {
    const [OneRoleAccessControl, contractOperator] = await getContractAndOperator("OneRoleAccessControl")

    const promptDependencyResult = await prompts(
        {
            type: "text",
            name: "importantDepedencyAddr",
            message: "importantDepedency address",
        },
        {
            onCancel: async function () {
                console.log("Exit process")
                process.exit(0)
            },
        },
    )
    const newDependency = promptDependencyResult.importantDepedencyAddr

    let tx
    tx = await OneRoleAccessControl.connect(contractOperator).upgradeImportantDependency(newDependency)
    console.log(`upgradeImportantDependency tx sent: ${tx.hash}`)
    await tx.wait()

    const importantDepedencyAddrStored = await OneRoleAccessControl.callStatic.importantDepedency()
    if (importantDepedencyAddrStored != newDependency) {
        throw new Error(`Wrong someParam: ${importantDepedencyAddrStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
