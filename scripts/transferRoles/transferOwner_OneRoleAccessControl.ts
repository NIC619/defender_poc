import { ethers } from "hardhat"
import { getContractAndOperator, getOperator, getSubOperator } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const [OneRoleAccessControl, contractOperator] = await getContractAndOperator("OneRoleAccessControl")

    let tx, newOperatorAddr
    if (contractOperator.address == operator.address) {
        newOperatorAddr = subOperator.address
    } else if (contractOperator.address == subOperator.address) {
        newOperatorAddr = operator.address
    }
    tx = await OneRoleAccessControl.connect(contractOperator).transferOwnership(newOperatorAddr)
    console.log(`transferOwnership tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
