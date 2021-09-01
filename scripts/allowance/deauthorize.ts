import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getOperator, getSubOperator, oneRoleAccessControlWithTimeLockAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const OneRoleAccessControlWithTimeLock = await ethers.getContractAt("OneRoleAccessControlWithTimeLock", oneRoleAccessControlWithTimeLockAddr)
    const operatorStored = await OneRoleAccessControlWithTimeLock.callStatic.operator()

    const promptSpenderResult = await prompts(
        {
            type: "text",
            name: "spenderAddr",
            message: "spender address",
        },
        {
            onCancel: async function () {
                console.log("Exit process")
                process.exit(0)
            },
        },
    )
    const spender = promptSpenderResult.spenderAddr

    let tx
    if (operatorStored == operator.address) {
        tx = await OneRoleAccessControlWithTimeLock.connect(operator).deauthorize([spender])
    } else if (operatorStored == subOperator.address) {
        tx = await OneRoleAccessControlWithTimeLock.connect(subOperator).deauthorize([spender])
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    console.log(`deauthorize tx sent: ${tx.hash}`)
    await tx.wait()

    const isAuthorizedStored = await OneRoleAccessControlWithTimeLock.callStatic.isAuthorized(spender)
    if (isAuthorizedStored == true) {
        throw new Error(`Wrong isAuthorized: ${isAuthorizedStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
