

/**
 * The BlockInfo interface
 */
export default interface BlockInfo {
    data: string;
    index: number;
    previousHash: string;
    difficulty: number;
    maxDifficulty: number;
    feePerTx: number;
}