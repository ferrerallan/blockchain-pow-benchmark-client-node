import crypto from 'crypto';
import Validation from './validation';
import BlockInfo from './blockInfo';

export default class Block {
  index: number;
  hash: string;
  timestamp: number;
  data: string;
  previousHash: string;
  nonce: number;
  miner: string;

  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.timestamp = block?.timestamp || Date.now();
    this.data = block?.data || '';
    this.previousHash = block?.previousHash || '';
    this.hash = block?.hash || this.getHash();
    this.nonce = block?.nonce || 0;
    this.miner = block?.miner || '';
  }

  getHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
        this.timestamp +
        this.data +
        this.previousHash +
        this.nonce +
        this.miner
      )
      .digest('hex');
  }

  isValid(
    previousHash: string,
    previousIndex: number,
    difficulty: number
  ): Validation {
    if (this.index < 0)
      return new Validation(false, 'index must be greater than 0');
    if (this.previousHash !== previousHash)
      return new Validation(false, 'incorrect previous hash');
    if (previousIndex != this.index - 1)
      return new Validation(false, 'incorrect previous index');
    if (!this.nonce || !this.nonce) return new Validation(false, 'no mined');

    const prefix = new Array(difficulty + 1).join('0');

    if (!this.hash.startsWith(prefix))
      return new Validation(false, 'incorrect hash');

    return new Validation(true, '');
  }

  mine(difficulty: number, miner: string) {
    this.miner = miner;
    const prefix = new Array(difficulty + 1).join('0');

    do {
      this.nonce++;
      this.hash = this.getHash();
    } while (!this.hash.startsWith(prefix));
  }

  static fromBlockInfo(blockinfo: BlockInfo): Block {
    const block = new Block({
      index: blockinfo.index,
      data: blockinfo.data,
      previousHash: blockinfo.previousHash,
    } as Block);
    
    return block;
  }
}
