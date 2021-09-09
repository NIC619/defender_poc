import {  ethers } from "hardhat"
import { getAttacker, getContractAndOperators } from "../../utils"

async function main() {
    const attacker = getAttacker()
    const [OneRoleAccessControl, ] = await getContractAndOperators("OneRoleAccessControl")

    let tx
    tx = await OneRoleAccessControl.connect(attacker).setAllowance(
        [attacker.address],
        {
            gasLimit: 100000,
        }
    )
    console.log(`fail setAllowance tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })