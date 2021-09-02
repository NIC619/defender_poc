import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getOperator, getSubOperator, oneRoleAccessControlAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const OneRoleAccessControl = await ethers.getContractAt("OneRoleAccessControl", oneRoleAccessControlAddr, operator)
    const operatorStored = await OneRoleAccessControl.callStatic.operator()

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

    let tx, actualOperator
    if (operatorStored == operator.address) {
        actualOperator = operator
    } else if (operatorStored == subOperator.address) {
        actualOperator = subOperator
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    tx = await OneRoleAccessControl.connect(actualOperator).upgradeImportantDependency(newDependency)
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
