import { vi, describe, it, expect } from 'vitest'
import { fileToBase64 } from './fileToBase64'

class MockFileReader {
  public result: string | ArrayBuffer | null = null
  public onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null
  public onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null
  readAsDataURL(file: Blob) {
    // Simula um base64
    const base64 = Buffer.from('hello').toString('base64')
    this.result = `data:text/plain;base64,${base64}`
    // chama onload async
    setTimeout(() => {
      this.onload && this.onload.call(this as unknown as FileReader, new ProgressEvent('load'))
    }, 0)
  }
}

// @ts-expect-error override global
global.FileReader = MockFileReader as unknown as typeof FileReader

// jsdom has File, but ensure available in env

describe('fileToBase64', () => {
  it('converte File em base64 sem prefixo data:', async () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'test.bin', { type: 'application/octet-stream' })
    const base64 = await fileToBase64(file)
    expect(base64).toBe(Buffer.from('hello').toString('base64'))
  })
})
