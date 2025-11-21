/**
 * Type declarations for lz4js
 * LZ4 compression library for JavaScript
 */

declare module 'lz4js' {
  /**
   * Compress data using LZ4 algorithm
   * @param data - Input data to compress (Uint8Array or Buffer)
   * @returns Compressed data as Uint8Array
   */
  export function compress(data: Uint8Array | Buffer): Uint8Array;

  /**
   * Decompress LZ4 compressed data
   * @param data - Compressed data (Uint8Array or Buffer)
   * @returns Decompressed data as Uint8Array
   */
  export function decompress(data: Uint8Array | Buffer): Uint8Array;

  /**
   * Get maximum compressed size for given input size
   * @param size - Input data size
   * @returns Maximum possible compressed size
   */
  export function compressBound(size: number): number;
}
