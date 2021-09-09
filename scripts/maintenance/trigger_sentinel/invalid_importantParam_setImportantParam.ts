import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperators } from "../../utils"
import { importantParamLowerBound } from "../../autotask/pause/OneRoleAccessControl"

async function main() {
    const [OneRoleAccessControl, , lessSecuredOperator, ] = await getContractAndOperators("OneRoleAccessControl")

    const invalidParam = importantParamLowerBound - 1
    const tx = await OneRoleAccessControl.connect(lessSecuredOperator).setImportantParam(invalidParam)
    console.log(`setImportantParam tx sent: ${tx.hash}`)
    console.log("This should trigger Sentinel...")
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
