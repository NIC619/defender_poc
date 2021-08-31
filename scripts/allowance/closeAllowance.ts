import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getOperator, getSubOperator, oneRoleAccessControlAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const OneRoleAccessControl = await ethers.getContractAt("OneRoleAccessControl", oneRoleAccessControlAddr, operator)
    const operatorStored = await OneRoleAccessControl.callStatic.operator()

    const promptTokenAddrResult = await prompts(
        {
            type: "text",
            name: "tokenAddr",
            message: "token address",
        },
        {
            onCancel: async function () {
                console.log("Exit process")
                process.exit(0)
            },
        },
    )
    const tokenAddr = promptTokenAddrResult.tokenAddr
    const promptAmountResult = await prompts(
        {
            type: "text",
            name: "spender",
            message: "spender",
        },
        {
            onCancel: async function () {
                console.log("Exit process")
                process.exit(0)
            },
        },
    )
    const spender = promptAmountResult.spender

    let tx
    if (operatorStored == operator.address) {
        tx = await OneRoleAccessControl.connect(operator).closeAllowance([tokenAddr], spender)
    } else if (operatorStored == subOperator.address) {
        tx = await OneRoleAccessControl.connect(subOperator).closeAllowance([tokenAddr], spender)
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    console.log(`closeAllowance tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })