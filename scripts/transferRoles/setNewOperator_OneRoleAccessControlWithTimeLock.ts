import { ethers } from "hardhat"
import { getContractAndOperator, getOperator, getSubOperator } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const [OneRoleAccessControlWithTimeLock, contractOperator] = await getContractAndOperator("OneRoleAccessControlWithTimeLock")

    let tx, newOperatorAddr
    if (contractOperator.address == operator.address) {
        newOperatorAddr = subOperator.address
    } else if (contractOperator.address == subOperator.address) {
        newOperatorAddr = operator.address
    }
    tx = await OneRoleAccessControlWithTimeLock.connect(contractOperator).setNewOperator(newOperatorAddr)
    console.log(`setNewOperator tx sent: ${tx.hash}`)
    await tx.wait()

    const pendingOperatorStored = await OneRoleAccessControlWithTimeLock.callStatic.pendingOperator()
    if (pendingOperatorStored != newOperatorAddr) {
        throw new Error(`Wrong pendingOperator: ${pendingOperatorStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
