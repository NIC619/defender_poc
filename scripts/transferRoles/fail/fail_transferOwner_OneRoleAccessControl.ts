import { ethers } from "hardhat"
import { getAttacker, getContractAndOperator } from "../utils"

async function main() {
    const attacker = getAttacker()

    const [OneRoleAccessControl, ] = await getContractAndOperator("OneRoleAccessControl")

    let tx
    tx = await OneRoleAccessControl.connect(attacker).transferOwnership(
        attacker.address,
        {
            gasLimit: 100000,
        }
    )
    console.log(`fail transferOwnership tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
