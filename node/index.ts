import {ClientsConfig, Service, ServiceContext, method, LRUCache, RecorderState} from '@vtex/api'

import { Clients } from './clients'
import { returnAppGetSchemas } from './middlewares/returnAppGetSchemas'
import { generateReturnsSchema } from './middlewares/generateReturnsSchema'
import { receiveDocuments } from './middlewares/receiveDocuments'
import { receiveCategories } from './middlewares/receiveCategories'
import { saveMasterdataDocuments } from './middlewares/saveMasterdataDocuments'
import { saveMasterdataPartialDocuments } from './middlewares/saveMasterdataPartialDocuments'
import { createGiftCard } from './middlewares/createGiftCard'
import { getGiftCard } from './middlewares/getGiftCard'
import { sendMail } from './middlewares/sendMail'

const TIMEOUT_MS = 5000
const memoryCache = new LRUCache<string, any>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache
    }
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {}
}

export default new Service({
  clients,
  routes: {
    getSchemas: method({
      GET: returnAppGetSchemas
    }),
    generateSchema: method({
      PUT: generateReturnsSchema
    }),
    getDocuments: method({
      GET: receiveDocuments
    }),
    getCategories: method({
      GET: receiveCategories
    }),
    saveDocuments: method({
      POST: saveMasterdataDocuments
    }),
    savePartialDocument: method({
      POST: saveMasterdataPartialDocuments
    }),
    createGiftCard: method({
      POST: createGiftCard
    }),
    getGiftCard: method({
      GET: getGiftCard
    }),
    sendMail: method({
      POST: sendMail
    })
  },
})