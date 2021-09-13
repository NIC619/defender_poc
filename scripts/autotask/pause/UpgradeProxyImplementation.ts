import { ethers } from "ethers"
import { Relayer } from "defender-relay-client"

export const expectedChild = "0x0000000000000000000000000000000000000bbb"

export async function handler(event) {
    const relayer = new Relayer(event)
    const contractAddr = event.request.body.sentinel.address

    const pauseFuncSig = "0x8456cb59"

    if (event.request.body.transaction.status == '0x1') {
        const matchReasons = event.request.body.matchReasons
        for (const r of matchReasons) {
            if ((r.type == "function") && (r.signature.startsWith("upgradeChild"))) {
                // Pause the contract if child set to an unexpected addresses
                if (r.params._newChildAddr != expectedChild) {
                    await relayer.sendTransaction({
                        to: contractAddr,
                        data: pauseFuncSig,
                        gasLimit: 100000
                    })
                }
            }
        }
    }

    return {}
}
