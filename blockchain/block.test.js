const Block=require('./block')
const {DIFFICULTY}=require('../config')

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
    it('should generates a hash that matches the difficulty', function () {
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty))
    });
    it('should lowers the difficulty for slowly mined blocks', function () {
        expect(Block.adjustDifficulty(block,block.timestamp+360000)).toEqual(block.difficulty-1)
    });
    it('should raise the difficulty for quickly mined blocks', function () {
        expect(Block.adjustDifficulty(block,block.timestamp+1)).toEqual(block.difficulty+1)
    });
})