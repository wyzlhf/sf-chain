// const Block=require('./blockchain/block')
// const Blockchain=require('./blockchain')
// const Wallet=require('./wallet')
// const wallet=new Wallet()
const ChainUtil=require('./chain-util')



// const block=new Block('foo','bar','zoo','baz')
// console.log(block.toString())
// console.log(Block.genesis().toString())
//
// const fooBlock=Block.mineBlock(Block.genesis(),'foo')
// console.log(fooBlock.toString())
//
// const bc=new Blockchain()
// for(let i=0;i<10;i++){
//     console.log(bc.addBlock(`foo ${i}`).toString())
// }
//
// console.log(wallet.toString())

console.log(ChainUtil.id())