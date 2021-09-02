import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperator } from "../utils"

async function main() {
    const [OneRoleAccessControlWithTimeLock, contractOperator] = await getContractAndOperator("OneRoleAccessControlWithTimeLock")

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
    tx = await OneRoleAccessControlWithTimeLock.connect(contractOperator).blacklist([newToken], [true])
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
