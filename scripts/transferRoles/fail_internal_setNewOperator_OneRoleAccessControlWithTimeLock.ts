import { ethers } from "hardhat"
import { callProxyAddr, getAttacker, getContractAndOperator } from "../utils"

async function main() {
    const attacker = getAttacker()
    const CallProxy = await ethers.getContractAt("CallProxy", callProxyAddr)
    const [OneRoleAccessControlWithTimeLock, ] = await getContractAndOperator("OneRoleAccessControlWithTimeLock")

    const tx = await CallProxy.connect(attacker).proxy(
        OneRoleAccessControlWithTimeLock.address,
        OneRoleAccessControlWithTimeLock.interface.encodeFunctionData("setNewOperator", [attacker.address]),
        {
            gasLimit: 100000,
        }
    )
    console.log(`fail setNewOperator tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
