const Block=require('./block')

describe('Block',()=>{
    let data,lastBlock,block
    beforeEach(()=>{
        data='bar'
        lastBlock=Block.genesis()
        block=Block.mineBlock(lastBlock,data)
    })
    it('sets the `data` to match the input',()=>{
        expect(block.data).toEqual(data)
    })
    it('sets the `lastHash` to macth the hash of the last block', function () {
        expect(block.lastHash).toEqual(lastBlock.hash)
    });
})