import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperator } from "../utils"

async function main() {
    const [OneRoleAccessControl, contractOperator] = await getContractAndOperator("OneRoleAccessControl")

    const promptParamResult = await prompts(
        {
            type: "number",
            name: "param",
            message: "some param",
        },
        {
            onCancel: async function () {
                console.log("Exit process")
                process.exit(0)
            },
        },
    )
    const newParam = promptParamResult.param

    let tx
    tx = await OneRoleAccessControl.connect(contractOperator).setSomeParam(newParam)
    console.log(`setSomeParam tx sent: ${tx.hash}`)
    await tx.wait()

    const paramStored = await OneRoleAccessControl.callStatic.someParam()
    if (paramStored != newParam) {
        throw new Error(`Wrong someParam: ${paramStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
