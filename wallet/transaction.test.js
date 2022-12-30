const Transaction=require('./transaction')
const Wallet=require('./index')

describe('Transaction',()=>{
    let transaction,wallet,recipient,amount
    beforeEach(()=>{
        wallet=new Wallet()
        amount=50
        recipient='r3c1p13nt'
        transaction=Transaction.netTransaction(wallet,recipient,amount)
    })
    it('should output the `amount` subtracted from the wallet balance', function () {
        expect(transaction.outputs.find(output=>output.address===wallet.publicKey).amount)
                .toEqual(wallet.balance-amount)
    });
    it('should output the `amount` added to the recipient', function () {
        expect(transaction.outputs.find(output=>output.address===recipient).amount)
                .toEqual(amount)
    });
    it('should input the balance of the wallet', function () {
        expect(transaction.input.amount).toEqual(wallet.balance)
    });
    it('should validate a valid transaction', function () {
        expect(Transaction.verifyTransaction(transaction)).toBe(true)
    });
    it('should invalidate a corrupt transaction', function () {
        transaction.outputs[0].amount=50000
        expect(Transaction.verifyTransaction(transaction)).toBe(false)
    });

    describe('transacting with an amount that exceeds the balance',()=>{
        beforeEach(()=>{
            amount=50000
            transaction=Transaction.netTransaction(wallet,recipient,amount)
        })
        it('should not create the transaction', function () {
            expect(transaction).toEqual(undefined)
        });
    })

    describe('and updating a transaction',()=>{
        let nextAmount,nextRecipient
        beforeEach(()=>{
            nextAmount=20
            nextRecipient='n3xt-4ddr355'
            transaction=transaction.update(wallet,nextRecipient,nextAmount)
        })
        it(`should subtract the next amount from the sender's output`, function () {
            expect(transaction.outputs.find(output=>output.address===wallet.publicKey).amount)
                    .toEqual(wallet.balance-amount-nextAmount)
        });
        it('should output an amount for the next recipient', function () {
            expect(transaction.outputs.find(output=>output.address===nextRecipient).amount)
                    .toEqual(nextAmount)
        });
    })
})