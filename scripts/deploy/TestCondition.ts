import { ethers } from "hardhat"
import { getDeployer } from "../utils"

async function main() {
    const deployer = getDeployer()

    // Deploying TestCondition
    console.log("Deploying TestCondition...")
    const TestCondition = await (
        await ethers.getContractFactory("TestCondition", deployer)
    ).deploy()
    await TestCondition.deployTransaction.wait()
    console.log(`TestCondition contract address: ${TestCondition.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
