import { PrismaClient } from '@prisma/client'
import { pagination } from 'prisma-extension-pagination'

function extendClient(base: PrismaClient) {
  return base.$extends(
    pagination({
      pages: {
        limit: 10, // set default limit to 10
        includePageCount: true, // include counters by default
      },
    }),
  )
}

class UntypedExtendedClient extends PrismaClient {
  constructor(options?: ConstructorParameters<typeof PrismaClient>[0]) {
    super(options)

    return extendClient(this) as this
  }
}

const ExtendedPrismaClient = UntypedExtendedClient as unknown as new (
  options?: ConstructorParameters<typeof PrismaClient>[0],
) => ReturnType<typeof extendClient>

export { ExtendedPrismaClient }
