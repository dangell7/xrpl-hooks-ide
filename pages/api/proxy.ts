import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { url, opts } = req.body
        const r = await fetch(url, opts);
        if (!r.ok) throw (r.statusText)

        const data = await r.json()
        return res.json(data)
    } catch (error) {
        console.warn(error)
        return res.status(500).json({ message: "Something went wrong!" })
    }
}
