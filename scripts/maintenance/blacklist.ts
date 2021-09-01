import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getOperator, getSubOperator, oneRoleAccessControlWithTimeLockAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const OneRoleAccessControlWithTimeLock = await ethers.getContractAt("OneRoleAccessControlWithTimeLock", oneRoleAccessControlWithTimeLockAddr)
    const operatorStored = await OneRoleAccessControlWithTimeLock.callStatic.operator()

    const promptTokenResult = await prompts(
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
    const newToken = promptTokenResult.tokenAddr

    let tx
    if (operatorStored == operator.address) {
        tx = await OneRoleAccessControlWithTimeLock.connect(operator).blacklist([newToken], [true])
    } else if (operatorStored == subOperator.address) {
        tx = await OneRoleAccessControlWithTimeLock.connect(subOperator).blacklist([newToken], [true])
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    console.log(`blacklist tx sent: ${tx.hash}`)
    await tx.wait()

    const isBlacklistedStored = await OneRoleAccessControlWithTimeLock.callStatic.isBlacklisted(newToken)
    if (isBlacklistedStored == true) {
        throw new Error(`Wrong isBlacklisted: ${isBlacklistedStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
