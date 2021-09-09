import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperators } from "../utils"

async function main() {
    const [OneRoleAccessControlWithTimeLock, , lessSecuredOperator, ] = await getContractAndOperators("OneRoleAccessControlWithTimeLock")

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

    const tx = await OneRoleAccessControlWithTimeLock.connect(lessSecuredOperator).deauthorize([spender])
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
