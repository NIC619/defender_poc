import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperators } from "../utils"

async function main() {
    const [OneRoleAccessControl, moreSecuredOperator, , ] = await getContractAndOperators("OneRoleAccessControl")

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
    tx = await OneRoleAccessControl.connect(moreSecuredOperator).upgradeImportantDependency(newDependency)
    console.log(`upgradeImportantDependency tx sent: ${tx.hash}`)
    await tx.wait()

    const importantDepedencyAddrStored = await OneRoleAccessControl.callStatic.importantDepedency()
    if (importantDepedencyAddrStored != newDependency) {
        throw new Error(`Wrong importantDepedency: ${importantDepedencyAddrStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
