import { ethers } from "hardhat"
import { getOperator, getSubOperator, oneRoleAccessControlAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const OneRoleAccessControl = await ethers.getContractAt("OneRoleAccessControl", oneRoleAccessControlAddr)
    const operatorStored = await OneRoleAccessControl.callStatic.operator()

    let tx, actualOperator, newOperatorAddr
    if (operatorStored == operator.address) {
        actualOperator = operator
        newOperatorAddr = subOperator.address
    } else if (operatorStored == subOperator.address) {
        actualOperator = subOperator
        newOperatorAddr = operator.address
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    tx = await OneRoleAccessControl.connect(actualOperator).transferOwnership(newOperatorAddr)
    console.log(`transferOwnership tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
