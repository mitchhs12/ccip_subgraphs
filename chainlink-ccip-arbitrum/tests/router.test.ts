import { assert, describe, test, clearStore, beforeAll, afterAll } from "matchstick-as/assembly/index";
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts";
import { handleMessageExecuted, handleOffRampAdded, handleOffRampRemoved, handleOnRampSet } from "../src/router";
import {
  createMessageExecutedEvent,
  createOffRampAddedEvent,
  createOffRampRemovedEvent,
  createOnRampSetEvent,
} from "./router-utils";

describe("handleNewMessage", () => {
  beforeAll(() => {
    let messageId = Bytes.fromHexString("0x30a2aee56d769e573076b28748aabaccf31f7dd2d8199df527b35b714c799575");
    let sourceChainSelector = BigInt.fromString("9284632837123596123");
    let offRamp = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
    let calldataHash = Bytes.fromHexString("0xC1B87E59BDF3D0DC9389D03BE40170EB3547776BFB7839BFE668B97FB3894013");
    let newMessageExecutedEvent = createMessageExecutedEvent(messageId, sourceChainSelector, offRamp, calldataHash);
    handleMessageExecuted(newMessageExecutedEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("A Message was created", () => {
    assert.entityCount("Message", 1);
  });

  test("Message created and stored", () => {
    assert.fieldEquals(
      "Message",
      "0x30a2aee56d769e573076b28748aabaccf31f7dd2d8199df527b35b714c799575",
      "sourceChainSelector",
      "9284632837123596123"
    );
    assert.fieldEquals(
      "Message",
      "0x30a2aee56d769e573076b28748aabaccf31f7dd2d8199df527b35b714c799575",
      "offRampAddress",
      "0x46b639a3c1a4cbfd326b94a2db7415c27157282f"
    );
    assert.fieldEquals(
      "Message",
      "0x30a2aee56d769e573076b28748aabaccf31f7dd2d8199df527b35b714c799575",
      "calldataHash",
      "0xc1b87e59bdf3d0dc9389d03be40170eb3547776bfb7839bfe668b97fb3894013"
    );
  });
});

describe("handleNewOnRamp", () => {
  beforeAll(() => {
    let sourceChainSelector = BigInt.fromString("9284632837123596123");
    let offRamp = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
    let newOffRampEvent = createOffRampAddedEvent(sourceChainSelector, offRamp);
    handleOffRampAdded(newOffRampEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("Offramp can be added", () => {
    assert.entityCount("OffRamp", 1);
  });

  test("Offramp is stored properly", () => {
    assert.fieldEquals(
      "OffRamp",
      "0x46b639a3c1a4cbfd326b94a2db7415c27157282f",
      "sourceChainSelector",
      "9284632837123596123"
    );
    assert.fieldEquals("OffRamp", "0x46b639a3c1a4cbfd326b94a2db7415c27157282f", "name", "Arbitrum");
  });

  test("Offramp is stored and then deactivated when removed", () => {
    assert.entityCount("OffRamp", 1);
    assert.fieldEquals("OffRamp", "0x46b639a3c1a4cbfd326b94a2db7415c27157282f", "isActive", "true");
    let sourceChainSelector = BigInt.fromString("9284632837123596123");
    let offRamp = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
    let newOffRampEvent = createOffRampRemovedEvent(sourceChainSelector, offRamp);
    handleOffRampRemoved(newOffRampEvent);
    assert.fieldEquals("OffRamp", "0x46b639a3c1a4cbfd326b94a2db7415c27157282f", "isActive", "false");
    assert.entityCount("OffRamp", 1);
  });
});

describe("handleOnRampSet", () => {
  beforeAll(() => {
    let sourceChainSelector = BigInt.fromString("9284632837123596123");
    let onRamp = Address.fromString("0xedFc22336Eb0B9B11Ff37C07777db27BCcDe3C65");
    let onRampSetEvent = createOnRampSetEvent(sourceChainSelector, onRamp);
    handleOnRampSet(onRampSetEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("OnRamp can be added", () => {
    assert.entityCount("OnRamp", 1);
  });

  test("OnRamp is stored properly", () => {
    assert.fieldEquals(
      "OnRamp",
      "0xedFc22336Eb0B9B11Ff37C07777db27BCcDe3C65",
      "sourceChainSelector",
      "9284632837123596123"
    );
  });

  test("OnRamp is stored and then deactivated when removed", () => {
    assert.entityCount("OffRamp", 1);
    assert.fieldEquals("OffRamp", "0x46b639a3c1a4cbfd326b94a2db7415c27157282f", "isActive", "true");
    let sourceChainSelector = BigInt.fromString("9284632837123596123");
    let offRamp = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
    let newOffRampEvent = createOffRampRemovedEvent(sourceChainSelector, offRamp);
    handleOffRampRemoved(newOffRampEvent);
    assert.fieldEquals("OffRamp", "0x46b639a3c1a4cbfd326b94a2db7415c27157282f", "isActive", "false");
    assert.entityCount("OffRamp", 1);
  });
});
