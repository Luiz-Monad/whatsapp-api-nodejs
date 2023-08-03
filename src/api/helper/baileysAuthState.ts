import { proto } from '@whiskeysockets/baileys/WAProto'
import { AuthenticationCreds } from '@whiskeysockets/baileys'
import { Curve, signedKeyPair } from '@whiskeysockets/baileys/lib/Utils/crypto'
import { generateRegistrationId } from '@whiskeysockets/baileys/lib/Utils/generics'
import { randomBytes } from 'crypto'
import { AppType, TypeOfPromise } from './types'
import getDatabaseService from '../service/database'

const initAuthCreds = () => {
    const identityKey = Curve.generateKeyPair()
    return {
        noiseKey: Curve.generateKeyPair(),
        signedIdentityKey: identityKey,
        signedPreKey: signedKeyPair(identityKey, 1),
        registrationId: generateRegistrationId(),
        advSecretKey: randomBytes(32).toString('base64'),
        processedHistoryMessages: [],
        nextPreKeyId: 1,
        firstUnuploadedPreKeyId: 1,
        accountSettings: {
            unarchiveChats: false,
        },
    }
}

const BufferJSON = {
    replacer: (k: any, value: { type: string; data: any }) => {
        if (
            Buffer.isBuffer(value) ||
            value instanceof Uint8Array ||
            value?.type === 'Buffer'
        ) {
            return {
                type: 'Buffer',
                data: Buffer.from(value?.data || value).toString('base64'),
            }
        }

        return value
    },

    reviver: (_: any, value: { buffer: boolean; type: string; data: any; value: any }) => {
        if (
            typeof value === 'object' &&
            !!value &&
            (value.buffer === true || value.type === 'Buffer')
        ) {
            const val = value.data || value.value
            return typeof val === 'string'
                ? Buffer.from(val, 'base64')
                : Buffer.from(val || [])
        }

        return value
    },
}

export default async function useAuthState(app: AppType, key: string) {
    const db = getDatabaseService(app)
    const table = db.table(key)
    const writeData = (data: any, id: string) => {
        return table.replaceOne(
            { _id: id },
            JSON.parse(JSON.stringify(data, BufferJSON.replacer)),
            { upsert: true }
        )
    }
    const readData = async (id: string) => {
        try {
            const data = JSON.stringify(await table.findOne({ _id: id }))
            return JSON.parse(data, BufferJSON.reviver)
        } catch (error) {
            return null
        }
    }
    const removeData = async (id: string) => {
        try {
            await table.deleteOne({ _id: id })
        } catch (_a) {}
    }
    const dropBobbyTable = async () => {
        await table.drop()
    }
    const creds: AuthenticationCreds = (await readData('creds')) || initAuthCreds()
    return {
        state: {
            creds,
            keys: {
                get: async (type: string, ids: string[]) => {
                    const data: Record<string, any> = {}
                    await Promise.all(
                        ids.map(async (id) => {
                            let value = await readData(`${type}-${id}`)
                            if (type === 'app-state-sync-key') {
                                value =
                                    proto.Message.AppStateSyncKeyData.fromObject(
                                        data
                                    )
                            }
                            data[id] = value
                        })
                    )
                    return data
                },
                set: async (data: Record<string, any>) => {
                    const tasks = []
                    for (const category of Object.keys(data)) {
                        for (const id of Object.keys(data[category])) {
                            const value = data[category][id]
                            const key = `${category}-${id}`
                            tasks.push(
                                value ? writeData(value, key) : removeData(key)
                            )
                        }
                    }
                    await Promise.all(tasks)
                },
            },
        },
        saveCreds: () => {
            return writeData(creds, 'creds')
        },
        dropCreds: () => {
            return dropBobbyTable()
        },
    }
}

export type AuthState = TypeOfPromise<ReturnType<typeof useAuthState>>