import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperators } from "../utils"
import { importantParamLowerBound, importantParamUpperBound } from "../autotask/pause/OneRoleAccessControl"

async function main() {
    const [OneRoleAccessControl, , lessSecuredOperator, ] = await getContractAndOperators("OneRoleAccessControl")

    const promptImportantParamResult = await prompts(
        {
            type: "number",
            name: "importantParam",
            message: `important param, number between ${importantParamLowerBound} and ${importantParamUpperBound}, otherwise it would trigger Sentinel `,
        },
        {
            onCancel: async function () {
                console.log("Exit process")
                process.exit(0)
            },
        },
    )
    const newImportantParam = promptImportantParamResult.importantParam

    let tx
    tx = await OneRoleAccessControl.connect(lessSecuredOperator).setImportantParam(newImportantParam)
    console.log(`setImportantParam tx sent: ${tx.hash}`)
    await tx.wait()

    const paramStored = await OneRoleAccessControl.callStatic.importantParam()
    if (paramStored != newImportantParam) {
        throw new Error(`Wrong importantParam: ${paramStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
