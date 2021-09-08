import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { defaultInvalidAllowanceTokenAddr, defaultValidAllowanceTokenAddr, getContractAndOperators } from "../../utils"

async function main() {
    const [OneRoleAccessControl, , lessSecuredOperator, ] = await getContractAndOperators("OneRoleAccessControl")

    let tx
    tx = await OneRoleAccessControl.connect(lessSecuredOperator).setAllowance([defaultInvalidAllowanceTokenAddr])
    console.log(`setAllowance tx sent: ${tx.hash}`)
    console.log("This should trigger Sentinel...")
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
