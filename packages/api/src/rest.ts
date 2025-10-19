import { removeFalsyValues } from "../../utils/src"

export interface RequestOptions {
  params?: URLSearchParams | Record<string, string | undefined>

  data?: BodyInit | null
  json?: any

  headers?: Record<string, string | undefined>
}

export class RestClient {
  protected readonly BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  protected readonly DEFAULT_TIMEOUT = 30 * 1000

  async request(method: string, endpoint: string, options?: RequestOptions): Promise<Response> {
    // serialize params into query string
    const params = options?.params
      ? options.params instanceof URLSearchParams
        ? `?${options.params}`
        : `?${new URLSearchParams(removeFalsyValues(options.params)).toString()}`
      : ''

    // build full url
    const url = `${this.BASE}${endpoint}${params}`

    if (options?.json) {
      options.data = JSON.stringify(options?.json)
    }

    const res = await fetch(
      url,
      {
        method,
        body: options?.data,
        headers: {
          'content-type': options?.json && 'application/json',
          ...removeFalsyValues(options?.headers)
        }
      }
    )

    return res
  }

  async get(endpoint: string, options?: RequestOptions) {
    return this.request('GET', endpoint, options)
  }

  async post(endpoint: string, options?: RequestOptions) {
    return this.request('POST', endpoint, options)
  }

  async put(endpoint: string, options?: RequestOptions) {
    return this.request('PUT', endpoint, options)
  }

  async patch(endpoint: string, options?: RequestOptions) {
    return this.request('PATCH', endpoint, options)
  }

  async delete(endpoint: string, options?: RequestOptions) {
    return this.request('DELETE', endpoint, options)
  }
}
