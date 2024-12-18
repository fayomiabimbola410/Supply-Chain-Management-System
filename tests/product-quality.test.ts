import { describe, it, expect, beforeEach } from 'vitest'
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts'

describe('product-quality contract test suite', () => {
  let chain: Chain;
  let deployer: Account;

  beforeEach(() => {
    chain = new Chain();
    deployer = chain.createAccount("deployer", 10000000000);
  });

  it('should add a rating', () => {
    const block = chain.mineBlock([
      Tx.contractCall("product-quality", "add-rating", [types.uint(1), types.uint(4)], deployer.address)
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
  });

  it('should not allow invalid ratings', () => {
    const block = chain.mineBlock([
      Tx.contractCall("product-quality", "add-rating", [types.uint(1), types.uint(6)], deployer.address)
    ]);
    block.receipts[0].result.expectErr().expectUint(400);
  });

  it('should calculate average rating correctly', () => {
    let block = chain.mineBlock([
      Tx.contractCall("product-quality", "add-rating", [types.uint(1), types.uint(4)], deployer.address),
      Tx.contractCall("product-quality", "add-rating", [types.uint(1), types.uint(5)], deployer.address)
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectBool(true);

    const result = chain.callReadOnlyFn("product-quality", "get-average-rating", [types.uint(1)], deployer.address);
    result.result.expectOk().expectUint(4);
  });

  it('should return zero for products with no ratings', () => {
    const result = chain.callReadOnlyFn("product-quality", "get-average-rating", [types.uint(2)], deployer.address);
    result.result.expectOk().expectUint(0);
  });

  it('should get rating count', () => {
    let block = chain.mineBlock([
      Tx.contractCall("product-quality", "add-rating", [types.uint(1), types.uint(3)], deployer.address),
      Tx.contractCall("product-quality", "add-rating", [types.uint(1), types.uint(4)], deployer.address)
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectBool(true);

    const result = chain.callReadOnlyFn("product-quality", "get-rating-count", [types.uint(1)], deployer.address);
    result.result.expectOk().expectUint(2);
  });
});