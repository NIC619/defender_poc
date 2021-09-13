import { ethers } from "ethers"
import { Relayer } from "defender-relay-client"

export const importantParamLowerBound = 30
export const importantParamUpperBound = 80

export async function handler(event) {
    const relayer = new Relayer(event)
    const contractAddr = event.request.body.sentinel.address

    const pauseFuncSig = "0x8456cb59"
    const expectedAllowanceTokenList = [
        "0x0000000000000000000000000000000000000aaa",
        "0x0000000000000000000000000000000000000bbb",
        "0x0000000000000000000000000000000000000ccc"
    ]

    let paused = false
    if (event.request.body.transaction.status == '0x1') {
        const matchReasons = event.request.body.matchReasons
        for (const r of matchReasons) {
            if (paused) break

            if ((r.type == "function") && (r.signature.startsWith("setImportantParam"))) {
                // Pause the contract if importandParam was set to an unexpected value
                if ((r.params._importantParam < importantParamLowerBound) || (r.params._importantParam > importantParamUpperBound)) {
                    await relayer.sendTransaction({
                        to: contractAddr,
                        data: pauseFuncSig,
                        gasLimit: 100000
                    })
                    paused = true
                    break
                }
            } else if ((r.type == "function") && (r.signature.startsWith("setAllowance"))) {
                // Pause the contract if token list was set to an unexpected addresses
                for (const addr of r.params._tokenList) {
                    if (!expectedAllowanceTokenList.includes(addr)) {
                        await relayer.sendTransaction({
                            to: contractAddr,
                            data: pauseFuncSig,
                            gasLimit: 100000
                        })
                        paused = true
                        break
                    }
                }
            }
        }
    }

    return {}
}
