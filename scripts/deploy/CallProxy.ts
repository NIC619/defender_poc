import { ethers } from "hardhat"
import { getDeployer, getOperator } from "../utils"

async function main() {
    const deployer = getDeployer()
    const operator = getOperator()

    // Deploying CallProxy
    console.log("Deploying CallProxy...")
    const CallProxy = await (
        await ethers.getContractFactory("CallProxy", deployer)
    ).deploy()
    await CallProxy.deployTransaction.wait()
    console.log(`CallProxy contract address: ${CallProxy.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
