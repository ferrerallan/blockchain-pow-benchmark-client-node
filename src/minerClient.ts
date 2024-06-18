import axios from "axios";
import BlockInfo from "./lib/blockInfo";
import Block from "./lib/block";
import colors from "colors";

const BLOCKCHAIN_SERVER = 'http://localhost:3000';
const minerWallet = {
    privateKey: '123456',
    publicKey: 'allankey'
};

let totalMined = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function mine() {
    console.clear(); // Limpa o console para começar a exibir os logs novamente
    console.log(colors.white(`### NODE ###`)); // Linha com o total mined
    console.log(colors.cyan(`Total mined: ${totalMined}`)); // Linha com o total mined

    console.log(colors.cyan('Fetching next block info...'));
    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/blocks/next`);
    const blockInfo = data as BlockInfo;

    const newBlock = Block.fromBlockInfo(blockInfo);

    console.log(colors.cyan(`Mining block #${colors.yellow(blockInfo.index.toString())}`));

    try {
        newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);

        console.log(colors.cyan('Block mined! Sending to blockchain...'));

        await axios.post(`${BLOCKCHAIN_SERVER}/blocks/`, newBlock);

        totalMined++;
        setTimeout(() => {
            mine();
        }, 100);
    } catch (e: any) {
        console.clear(); // Limpa o console em caso de erro
        console.log(colors.red('****************'));
        console.log(colors.red('*** YOU LOST ***'));
        console.log(colors.red('****************'));
       
        mine();
    }
}

mine();
