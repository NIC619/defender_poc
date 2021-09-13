import { ethers } from "hardhat"
import { defaultImportantDependency, defaultParam, getDeployer, getErrandOperator, getLessSecuredOperator, getMoreSecuredOperator, getSentinelAddr } from "../utils"

async function main() {
    const deployer = getDeployer()
    const moreSecuredOperator = getMoreSecuredOperator()
    const lessSecuredOperator = getLessSecuredOperator()
    const errandOperator = getErrandOperator()
    const sentinelAddr = getSentinelAddr()

    // Deploying OneRoleAccessControl
    console.log("Deploying OneRoleAccessControl...")
    const OneRoleAccessControl = await (
        await ethers.getContractFactory("OneRoleAccessControl", deployer)
    ).deploy(
        moreSecuredOperator.address,
        lessSecuredOperator.address,
        errandOperator.address,
        sentinelAddr
    )
    await OneRoleAccessControl.deployTransaction.wait()
    console.log(`OneRoleAccessControl contract address: ${OneRoleAccessControl.address}`)

    const moreSecuredOperatorStored = await OneRoleAccessControl.connect(deployer).callStatic.moreSecuredOperator()
    if (moreSecuredOperatorStored !== moreSecuredOperator.address) {
        throw new Error(`Wrong moreSecuredOperator: ${moreSecuredOperatorStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
