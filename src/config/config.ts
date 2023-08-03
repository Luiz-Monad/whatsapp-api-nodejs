
// Port number
const PORT = process.env.PORT || '3333'
const TOKEN = process.env.TOKEN || ''
const PROTECT_ROUTES = !!(process.env.PROTECT_ROUTES && process.env.PROTECT_ROUTES === 'true')

const RESTORE_SESSIONS_ON_START_UP = !!(process.env.RESTORE_SESSIONS_ON_START_UP && process.env.RESTORE_SESSIONS_ON_START_UP === 'true')

const APP_URL = process.env.APP_URL || false

const LOG_LEVEL = process.env.LOG_LEVEL

const INSTANCE_MAX_RETRY_QR = process.env.INSTANCE_MAX_RETRY_QR || 2

const CLIENT_PLATFORM = process.env.CLIENT_PLATFORM || 'Whatsapp MD'
const CLIENT_BROWSER = process.env.CLIENT_BROWSER || 'Chrome'
const CLIENT_VERSION = process.env.CLIENT_VERSION || '4.0.0'

type DATABASE_KIND_TYPE = 'mongodb' | 'localfs' | 'azuretable'

// Enable or disable storage
const DATABASE_ENABLED = !!(process.env.DATABASE_ENABLED && process.env.DATABASE_ENABLED === 'true')
// What kind of storage to use ('localfs' | 'azuretable' | 'mongodb')
const DATABASE_KIND = <DATABASE_KIND_TYPE> process.env.DATABASE_KIND || 'localfs'

// URL of the file system storage
const LOCALFS_PATH = process.env.LOCALFS_PATH || 'tmp'

// URL of the Azure Table
const AZURETABLE_URL = process.env.AZURETABLE_URL || 'https://storageaccount.core.windows.net'

// Enable or disable Mongo DB
const MONGODB_ENABLED = !!(process.env.MONGODB_ENABLED && process.env.MONGODB_ENABLED === 'true')
// URL of the Mongo DB
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/WhatsAppInstance'

// Enable or disable webhook globally on project
const WEBHOOK_ENABLED = !!(process.env.WEBHOOK_ENABLED && process.env.WEBHOOK_ENABLED === 'true')
// Webhook URL
const WEBHOOK_URL = process.env.WEBHOOK_URL
// Receive message content in webhook (Base64 format)
const WEBHOOK_BASE64 = !!(process.env.WEBHOOK_BASE64 && process.env.WEBHOOK_BASE64 === 'true')
// allowed events which should be sent to webhook
const WEBHOOK_ALLOWED_EVENTS = process.env.WEBHOOK_ALLOWED_EVENTS?.split(',') || ['all']

// Enable or disable websockets globally on project
const WEBSOCKET_ENABLED = !!(process.env.WEBSOCKET_ENABLED && process.env.WEBSOCKET_ENABLED === 'true')

// Mark messages as seen
const MARK_MESSAGES_READ = !!(process.env.MARK_MESSAGES_READ && process.env.MARK_MESSAGES_READ === 'true')

export default {
    port: PORT,
    token: TOKEN,
    restoreSessionsOnStartup: RESTORE_SESSIONS_ON_START_UP,
    appUrl: APP_URL,
    log: {
        level: LOG_LEVEL,
    },
    instance: {
        maxRetryQr: INSTANCE_MAX_RETRY_QR,
    },
    database: {
        enabled: MONGODB_ENABLED || DATABASE_ENABLED,
        kind: MONGODB_ENABLED ? 'mongodb' : DATABASE_KIND,
    },
    localfs: {
        path: LOCALFS_PATH,
        options: {
        }
    },
    azuretable: {
        url: AZURETABLE_URL,
        options: {
        }
    },
    mongoose: {
        url: MONGODB_URL,
        options: {
            // useCreateIndex: true,
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        },
    },
    browser: {
        platform: CLIENT_PLATFORM,
        browser: CLIENT_BROWSER,
        version: CLIENT_VERSION,
    },
    webhookEnabled: WEBHOOK_ENABLED,
    webhookUrl: WEBHOOK_URL,
    webhookBase64: WEBHOOK_BASE64,
    websocketEnabled: WEBSOCKET_ENABLED,
    protectRoutes: PROTECT_ROUTES,
    markMessagesRead: MARK_MESSAGES_READ,
    webhookAllowedEvents: WEBHOOK_ALLOWED_EVENTS
}
