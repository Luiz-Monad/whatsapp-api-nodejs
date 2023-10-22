import pino, { Logger } from 'pino'
import pinoHttp from 'pino-http'
import prettyPrint from 'pino-pretty'
import config from './config'

const colorCodes = [
    30, // Black
    31, // Red
    32, // Green
    33, // Yellow
    34, // Blue
    35, // Magenta
    36, // Cyan
    37, // White
    90, // Bright Black
    91, // Bright Red
    92, // Bright Green
    93, // Bright Yellow
    94, // Bright Blue
    95, // Bright Magenta
    96, // Bright Cyan
    97, // Bright White
]

const loggerColors: Record<string, number> = {}
const usedColors: Record<number, boolean> = {}

function getRandomUnusedColor (): number {
    const unusedColors = colorCodes.filter((code) => !usedColors[code])
    if (unusedColors.length === 0) {
        // All colors have been used, just select a random color
        return colorCodes[Math.floor(Math.random() * colorCodes.length)]
    } else {
        const selected = unusedColors[Math.floor(Math.random() * unusedColors.length)]
        usedColors[selected] = true
        return selected
    }
}

function getColorForLogger (loggerName: string): number {
    if (!loggerColors[loggerName]) {
        loggerColors[loggerName] = getRandomUnusedColor()
    }
    return loggerColors[loggerName]
}

function getAnsiColor (code: number): string {
    return `\x1b[${code}m`
}

function colorizeMessage (loggerName: string): string {
    const colorCode = getColorForLogger(loggerName)
    return `${getAnsiColor(colorCode)}${loggerName}${getAnsiColor(0)}`
}

function getStream () {
    return prettyPrint({
        ignore: 'pid,hostname',
        customPrettifiers: {
            name: (msg) => colorizeMessage(`${msg}`),
        },
    })
}

export function getHttpLogger () {
    if (config.log.httpLevel === 'silent') return null
    return pinoHttp(
        {
            name: 'http',
            level: config.log.httpLevel,
        },
        getStream()
    )
}

export function getWaLogger (instanceId: string) {
    return pino(
        {
            name: `wasock/${instanceId}`,
            level: config.log.waLevel,
        },
        getStream()
    )
}

export function getWaCacheLogger (instanceId: string) {
    return pino(
        {
            name: `cache/${instanceId}`,
            level: config.log.waLevel,
        },
        getStream()
    )
}

export default function getLogger (name: string, instanceId?: string) {
    return pino(
        {
            name: instanceId ? `${name}/${instanceId}` : name,
            level: config.log.level,
        },
        getStream()
    )
}
