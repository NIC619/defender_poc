import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperator } from "../utils"

async function main() {
    const [OneRoleAccessControlWithTimeLock, contractOperator] = await getContractAndOperator("OneRoleAccessControlWithTimeLock")

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

    let tx
    tx = await OneRoleAccessControlWithTimeLock.connect(contractOperator).authorize([newSpender])
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
