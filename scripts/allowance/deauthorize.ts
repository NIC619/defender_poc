import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperator } from "../utils"

async function main() {
    const [OneRoleAccessControlWithTimeLock, contractOperator] = await getContractAndOperator("OneRoleAccessControlWithTimeLock")

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
    tx = await OneRoleAccessControlWithTimeLock.connect(contractOperator).deauthorize([spender])
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
