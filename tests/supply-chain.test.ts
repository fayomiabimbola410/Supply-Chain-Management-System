import { describe, it, expect, beforeEach } from 'vitest'
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts'

describe('supply-chain contract test suite', () => {
  let chain: Chain;
  let deployer: Account;

  beforeEach(() => {
    chain = new Chain();
    deployer = chain.createAccount("deployer", 10000000000);
  });

  it('should add a product', () => {
    const block = chain.mineBlock([
      Tx.contractCall("supply-chain", "add-product", [types.ascii("Product A")], deployer.address)
    ]);
    block.receipts[0].result.expectOk().expectUint(1);
  });

  it('should update product status', () => {
    let block = chain.mineBlock([
      Tx.contractCall("supply-chain", "add-product", [types.ascii("Product B")], deployer.address)
    ]);
    block.receipts[0].result.expectOk().expectUint(1);

    block = chain.mineBlock([
      Tx.contractCall("supply-chain", "update-status", [types.uint(1), types.ascii("shipped")], deployer.address)
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
  });

  it('should transfer product ownership', () => {
    let block = chain.mineBlock([
      Tx.contractCall("supply-chain", "add-product", [types.ascii("Product C")], deployer.address)
    ]);
    block.receipts[0].result.expectOk().expectUint(1);

    const newOwner = chain.createAccount("new-owner", 1000000);
    block = chain.mineBlock([
      Tx.contractCall("supply-chain", "transfer-ownership", [types.uint(1), types.principal(newOwner.address)], deployer.address)
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
  });

  it('should get product details', () => {
    let block = chain.mineBlock([
      Tx.contractCall("supply-chain", "add-product", [types.ascii("Product D")], deployer.address)
    ]);
    block.receipts[0].result.expectOk().expectUint(1);

    const result = chain.callReadOnlyFn("supply-chain", "get-product", [types.uint(1)], deployer.address);
    const expectedProduct = {
      name: types.ascii("Product D"),
      status: types.ascii("created"),
      "current-owner": types.principal(deployer.address)
    };
    result.result.expectSome().expectTuple(expectedProduct);
  });

  it('should get product count', () => {
    let block = chain.mineBlock([
      Tx.contractCall("supply-chain", "add-product", [types.ascii("Product E")], deployer.address),
      Tx.contractCall("supply-chain", "add-product", [types.ascii("Product F")], deployer.address)
    ]);
    block.receipts[0].result.expectOk().expectUint(1);
    block.receipts[1].result.expectOk().expectUint(2);

    const result = chain.callReadOnlyFn("supply-chain", "get-product-count", [], deployer.address);
    result.result.expectOk().expectUint(2);
  });
});