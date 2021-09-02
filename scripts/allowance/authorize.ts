import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getOperator, getSubOperator, oneRoleAccessControlWithTimeLockAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const OneRoleAccessControlWithTimeLock = await ethers.getContractAt("OneRoleAccessControlWithTimeLock", oneRoleAccessControlWithTimeLockAddr)
    const operatorStored = await OneRoleAccessControlWithTimeLock.callStatic.operator()
    const timelockActivatedStored = await OneRoleAccessControlWithTimeLock.callStatic.timelockActivated()

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
    const newSpender = promptSpenderResult.spenderAddr

    let tx, actualOperator
    if (operatorStored == operator.address) {
        actualOperator = operator
    } else if (operatorStored == subOperator.address) {
        actualOperator = subOperator
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    tx = await OneRoleAccessControlWithTimeLock.connect(actualOperator).authorize([newSpender])
    console.log(`authorize tx sent: ${tx.hash}`)
    await tx.wait()

    if (timelockActivatedStored != true) {
        console.log("No timelock, should completed authorize")
        const isAuthorizedStored = await OneRoleAccessControlWithTimeLock.callStatic.isAuthorized(newSpender)
        if (isAuthorizedStored != true) {
            throw new Error(`Wrong isAuthorized: ${isAuthorizedStored}`)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
