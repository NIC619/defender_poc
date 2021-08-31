import { ethers } from "hardhat"
import { getOperator, getSubOperator, oneRoleAccessControlAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const OneRoleAccessControl = await ethers.getContractAt("OneRoleAccessControl", oneRoleAccessControlAddr)
    const operatorStored = await OneRoleAccessControl.callStatic.operator()

    let tx
    if (operatorStored == operator.address) {
        tx = await OneRoleAccessControl.connect(operator).transferOwnership(subOperator.address)
    } else if (operatorStored == subOperator.address) {
        tx = await OneRoleAccessControl.connect(subOperator).transferOwnership(operator.address)
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    console.log(`transferOwnership tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
