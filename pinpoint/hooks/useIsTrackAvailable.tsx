import { useEffect, useState } from "react"

// track available 1 hr before eventDate until 1 hr after the time
export const useIsTrackAvailable = (eventDate: string | null) => {
    const [isTrackAvailable, setIsTrackAvailable] = useState(false)

    useEffect(() => {
        if(!eventDate){
            setIsTrackAvailable(false)
            return
        }
        const check = () => {
            const oneHourBefore = new Date(eventDate)
            oneHourBefore.setHours(oneHourBefore.getHours() - 1)
            const oneHourAfter = new Date(eventDate)
            oneHourAfter.setHours(oneHourAfter.getHours() + 1)

            setIsTrackAvailable(new Date() <= oneHourAfter && new Date() >= oneHourBefore)
        }

        check()
        const interval = setInterval(check, 60000)
        return () => clearInterval(interval)
    }, [eventDate])

    return isTrackAvailable
}