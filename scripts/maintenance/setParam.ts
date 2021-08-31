import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getOperator, getSubOperator, oneRoleAccessControlAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const OneRoleAccessControl = await ethers.getContractAt("OneRoleAccessControl", oneRoleAccessControlAddr, operator)
    const operatorStored = await OneRoleAccessControl.callStatic.operator()

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
    if (operatorStored == operator.address) {
        tx = await OneRoleAccessControl.connect(operator).setSomeParam(newParam)
    } else if (operatorStored == subOperator.address) {
        tx = await OneRoleAccessControl.connect(subOperator).setSomeParam(newParam)
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
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
