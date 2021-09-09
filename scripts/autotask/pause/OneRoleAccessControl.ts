import { ethers } from "ethers"

export const importantParamLowerBound = 30
export const importantParamUpperBound = 80

export async function handler(event) {
    const contractAddr = event.request.body.sentinel.address
    const { alchemyApiToken, sentinelPrivKey } = event.secrets
    const url = `https://eth-kovan.alchemyapi.io/v2/${alchemyApiToken}`
    const provider = new ethers.providers.JsonRpcProvider(url)
    const sentinel = new ethers.Wallet(sentinelPrivKey, provider)

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
                    await sentinel.sendTransaction({
                        to: contractAddr,
                        data: pauseFuncSig
                    })
                    paused = true
                    break
                }
            } else if ((r.type == "function") && (r.signature.startsWith("setAllowance"))) {
                // Pause the contract if token list was set to an unexpected addresses
                for (const addr of r.params._tokenList) {
                    if (!expectedAllowanceTokenList.includes(addr)) {
                        await sentinel.sendTransaction({
                            to: contractAddr,
                            data: pauseFuncSig
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
