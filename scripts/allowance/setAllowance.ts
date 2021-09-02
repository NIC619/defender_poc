import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperator } from "../utils"

async function main() {
    const [OneRoleAccessControl, contractOperator] = await getContractAndOperator("OneRoleAccessControl")

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
    tx = await OneRoleAccessControl.connect(contractOperator).setAllowance([tokenAddr], spender)
    console.log(`setAllowance tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
