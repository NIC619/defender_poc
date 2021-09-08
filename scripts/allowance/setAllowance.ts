import {  ethers } from "hardhat"
import { defaultValidAllowanceTokenAddr, getContractAndOperators } from "../utils"

async function main() {
    const [OneRoleAccessControl, , lessSecuredOperator, ] = await getContractAndOperators("OneRoleAccessControl")

    let tx
    tx = await OneRoleAccessControl.connect(lessSecuredOperator).setAllowance([defaultValidAllowanceTokenAddr])
    console.log(`setAllowance tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
