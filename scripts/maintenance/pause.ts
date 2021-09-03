import {  ethers } from "hardhat"
import { getContractAndOperator } from "../utils"

async function main() {
    const [OneRoleAccessControl, contractOperator] = await getContractAndOperator("OneRoleAccessControl")

    const tx = await OneRoleAccessControl.connect(contractOperator).pause()
    console.log(`pause tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
