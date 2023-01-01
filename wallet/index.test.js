const Wallet=require('./index')
const TransactionPool=require('./transaction-pool')
const Blockchain=require('../blockchain')
const {INITIAL_BALANCE} = require("../config");

describe('Wallet',()=>{
    let wallet,tp,bc
    beforeEach(()=>{
        wallet=new Wallet()
        tp=new TransactionPool()
        bc=new Blockchain()
    })
    describe('creating a transaction',()=>{
        let transaction,sendAmount,recipient
        beforeEach(()=>{
            sendAmount=50
            recipient='r4nd0m-4ddr355'
            transaction=wallet.createTransaction(recipient,sendAmount,bc,tp)
        })
        describe('and doing the same transaction',()=>{
            beforeEach(()=>{
                wallet.createTransaction(recipient,sendAmount,bc,tp)
            })
            it('should double the sendAmount subtracted from the wallet balance', function () {
                expect(transaction.outputs.find(output=>output.address===wallet.publicKey).amount)
                        .toEqual(wallet.balance-sendAmount*2)
            });
            it('should clone the sendAmount output for the recipient', function () {
                expect(transaction.outputs.filter(output=>output.address===recipient)
                        .map(output=>output.amount)).toEqual([sendAmount,sendAmount])
            });
        })
    })
    describe('calculating a balance',()=>{
        let addBalance,repeatAdd,senderWallet
        beforeEach(()=>{
            senderWallet=new Wallet()
            addBalance=100
            repeatAdd=3
            for(let i=0;i<repeatAdd;i++){
                senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp)
            }
            bc.addBlock(tp.transactions)
        })
        it('should calculate the balance for blockchain transactions matching the recipient', function () {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE+(addBalance*repeatAdd))
        });
        it('should calculate the balance for blockchain transactions matching the sender', function () {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE-(addBalance*repeatAdd))
        });
        describe('and the recipient cunducts a transaction',()=>{
            let subtractBalance,recipientBalance
            beforeEach(()=>{
                tp.clear()
                subtractBalance=60
                recipientBalance=wallet.calculateBalance(bc)
                wallet.createTransaction(senderWallet.publicKey,subtractBalance,bc,tp)
                bc.addBlock(tp.transactions)
            })
            describe('and the sender sends another transacion to the recipient',()=>{
                beforeEach(()=>{
                    tp.clear()
                    senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp)
                    bc.addBlock(tp.transactions)
                })
                it('should calculate the recipient balance only using transactions since its most recent one', function () {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance-subtractBalance+addBalance)
                });
            })
        })
    })
})