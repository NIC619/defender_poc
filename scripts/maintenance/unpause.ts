import {  ethers } from "hardhat"
import { getContractAndOperators } from "../utils"

async function main() {
    const [OneRoleAccessControl, moreSecuredOperator, , ] = await getContractAndOperators("OneRoleAccessControl")

    const tx = await OneRoleAccessControl.connect(moreSecuredOperator).unpause()
    console.log(`unpause tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
