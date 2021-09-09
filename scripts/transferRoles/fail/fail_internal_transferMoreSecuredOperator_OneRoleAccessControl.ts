import { ethers } from "hardhat"
import { callProxyAddr, getAttacker, getContractAndOperators } from "../../utils"

async function main() {
    const attacker = getAttacker()
    const CallProxy = await ethers.getContractAt("CallProxy", callProxyAddr)
    const [OneRoleAccessControl, ] = await getContractAndOperators("OneRoleAccessControl")

    const tx = await CallProxy.connect(attacker).proxy(
        OneRoleAccessControl.address,
        OneRoleAccessControl.interface.encodeFunctionData("transferMoreSecuredOperator", [attacker.address]),
        {
            gasLimit: 100000,
        }
    )
    console.log(`fail internal transferMoreSecuredOperator tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
