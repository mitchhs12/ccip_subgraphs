import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  createMockedFunction,
  afterEach,
  beforeEach,
} from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { Message, OffRamp, OnRamp } from "../generated/schema";

import { EVM2EVMOffRamp } from "../generated/Router/EVM2EVMOffRamp";
import { Bytes, BigInt, Address, ethereum } from "@graphprotocol/graph-ts";
import { handleMessageExecuted, handleOffRampAdded, handleOffRampRemoved, handleOnRampSet } from "../src/router";
import {
  createMessageExecutedEvent,
  createOffRampAddedEvent,
  createOffRampRemovedEvent,
  createOnRampSetEvent,
} from "./router-utils";

///// OFFRAMP TESTS /////
describe("OffRamp", () => {
  beforeEach(() => {
    let contractAddress = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
    let mockTypeAndVersion = ethereum.Value.fromString("EVM2EVMOnRamp 1.2.0");
    let addressArray = ethereum.Value.fromAddressArray([
      Address.fromString("0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"),
    ]);
    createMockedFunction(contractAddress, "getSupportedTokens", "getSupportedTokens():(address[])").returns([
      addressArray,
    ]);
    createMockedFunction(contractAddress, "typeAndVersion", "typeAndVersion():(string)").returns([mockTypeAndVersion]);

    let contract = EVM2EVMOffRamp.bind(contractAddress);
    let result = contract.getSupportedTokens();
    assert.equals(ethereum.Value.fromAddressArray(result), addressArray); // mock function successfully working

    let sourceChainSelector = BigInt.fromString("3734403246176062136");
    let offRamp = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
    let newOffRampEvent = createOffRampAddedEvent(sourceChainSelector, offRamp);
    handleOffRampAdded(newOffRampEvent);

    let messageId = Bytes.fromHexString("0x30a2aee56d769e573076b28748aabaccf31f7dd2d8199df527b35b714c799575");
    let calldataHash = Bytes.fromHexString("0xC1B87E59BDF3D0DC9389D03BE40170EB3547776BFB7839BFE668B97FB3894013");
    let newMessageExecutedEvent = createMessageExecutedEvent(messageId, sourceChainSelector, offRamp, calldataHash);
    handleMessageExecuted(newMessageExecutedEvent);
  });

  afterEach(() => {
    clearStore();
  });

  test("Offramp can be added", () => {
    assert.entityCount("OffRamp", 1);
  });

  test("Offramp source chain selector is correct", () => {
    assert.fieldEquals(
      "OffRamp",
      "0x46b639a3c1a4cbfd326b94a2db7415c27157282f",
      "sourceChainSelector",
      "3734403246176062136"
    );
  });

  test("Offramp name is correct", () => {
    assert.fieldEquals("OffRamp", "0x46b639a3c1a4cbfd326b94a2db7415c27157282f", "name", "Optimism mainnet");
  });

  test("Handles if name is not found", () => {
    let offRampAddress2 = Address.fromString("0x09dbc4a902199bbe7f7ec29b3714731786f2e878");
    let mockTypeAndVersion = ethereum.Value.fromString("EVM2EVMOnRamp 1.2.0");
    let addressArray = ethereum.Value.fromAddressArray([
      Address.fromString("0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"),
    ]);
    createMockedFunction(offRampAddress2, "getSupportedTokens", "getSupportedTokens():(address[])").returns([
      addressArray,
    ]);
    createMockedFunction(offRampAddress2, "typeAndVersion", "typeAndVersion():(string)").returns([mockTypeAndVersion]);

    let sourceChainSelector = BigInt.fromString("9403546176061112136"); // unknown sourceChainSelector
    let offRamp = Address.fromString("0x09dbc4a902199bbe7f7ec29b3714731786f2e878");
    let newOffRampEvent = createOffRampAddedEvent(sourceChainSelector, offRamp);
    handleOffRampAdded(newOffRampEvent);
    assert.fieldEquals("OffRamp", "0x09dbc4a902199bbe7f7ec29b3714731786f2e878", "name", "Unknown Source Chain");
  });

  test("Offramp is stored and then deactivated when removed", () => {
    assert.fieldEquals("OffRamp", "0x46b639a3c1a4cbfd326b94a2db7415c27157282f", "isActive", "true");
    let sourceChainSelector = BigInt.fromString("9284632837123596123");
    let offRamp = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
    let newOffRampEvent = createOffRampRemovedEvent(sourceChainSelector, offRamp);
    handleOffRampRemoved(newOffRampEvent);
    assert.fieldEquals("OffRamp", "0x46b639a3c1a4cbfd326b94a2db7415c27157282f", "isActive", "false");
    assert.entityCount("OffRamp", 1);
  });

  test("A Message can be saved", () => {
    assert.entityCount("Message", 1);
    assert.fieldEquals(
      "Message",
      "0x30a2aee56d769e573076b28748aabaccf31f7dd2d8199df527b35b714c799575",
      "id",
      "0x30a2aee56d769e573076b28748aabaccf31f7dd2d8199df527b35b714c799575"
    );
  });

  test("Can view offRamp from message", () => {
    let messageId = Bytes.fromHexString("0x30a2aee56d769e573076b28748aabaccf31f7dd2d8199df527b35b714c799575");
    let message = Message.load(messageId)!;
    assert.fieldEquals("Message", message.id.toHexString(), "offRamp", "0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
  });

  test("Can view message from offramp", () => {
    let offRampAddress = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
    let offRamp = OffRamp.load(offRampAddress)!;
    let messages = offRamp.Messages.load();
    assert.fieldEquals(
      "Message",
      messages[0].id.toHexString(),
      "id",
      "0x30a2aee56d769e573076b28748aabaccf31f7dd2d8199df527b35b714c799575"
    );
  });
});

///// MESSAGE TESTS /////
describe("Message", () => {
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

  test("A Message cannot be created if the offRamp doesn't exist", () => {
    assert.entityCount("Message", 0);
  });
});

///// ONRAMP TESTS /////
describe("handleOnRampSet", () => {
  beforeEach(() => {
    let onRampAddress = Address.fromString("0xedfc22336eb0b9b11ff37c07777db27bccde3c65");
    let mockTypeAndVersion = ethereum.Value.fromString("EVM2EVMOffRamp 1.2.0");
    createMockedFunction(onRampAddress, "typeAndVersion", "typeAndVersion():(string)").returns([mockTypeAndVersion]);

    let contract = EVM2EVMOffRamp.bind(onRampAddress);
    let result = contract.typeAndVersion();
    assert.equals(ethereum.Value.fromString(result), mockTypeAndVersion); // mock function successfully working

    let destChainSelector = BigInt.fromString("9284632837123596123");
    let onRampSetEvent = createOnRampSetEvent(destChainSelector, onRampAddress);
    handleOnRampSet(onRampSetEvent);
  });

  afterEach(() => {
    clearStore();
  });

  test("OnRamp can be added", () => {
    assert.entityCount("OnRamp", 1);
  });

  // This test should theoretically never happen, but it's good to test for it.
  test("OnRamp name is unknown", () => {
    let onRampAddress = Address.fromString("0xdafea492d9c6733ae3d56b7ed1adb60692c98bc5");
    let mockTypeAndVersion = ethereum.Value.fromString("EVM2EVMOnRamp 1.2.0");
    createMockedFunction(onRampAddress, "typeAndVersion", "typeAndVersion():(string)").returns([mockTypeAndVersion]);
    let destChainSelector = BigInt.fromString("1111111111111111111");
    let onRampSetEvent = createOnRampSetEvent(destChainSelector, onRampAddress);
    handleOnRampSet(onRampSetEvent);
    assert.fieldEquals("OnRamp", "0xdafea492d9c6733ae3d56b7ed1adb60692c98bc5", "name", "Unknown Destination Chain");
  });

  test("OnRamp is stored properly", () => {
    assert.entityCount("OnRamp", 1);
    assert.fieldEquals(
      "OnRamp",
      "0xedfc22336eb0b9b11ff37c07777db27bccde3c65",
      "destChainSelector",
      "9284632837123596123"
    );
  });

  test("OnRamp is updated properly", () => {
    assert.entityCount("OnRamp", 1);
    assert.fieldEquals(
      "OnRamp",
      "0xedfc22336eb0b9b11ff37c07777db27bccde3c65",
      "destChainSelector",
      "9284632837123596123"
    );
    let onRampAddress = Address.fromString("0x849c5ed5a80f5b408dd4969b78c2c8fdf0565bfe");
    let mockTypeAndVersion = ethereum.Value.fromString("EVM2EVMOnRamp 1.2.0");
    createMockedFunction(onRampAddress, "typeAndVersion", "typeAndVersion():(string)").returns([mockTypeAndVersion]);
    let destChainSelector = BigInt.fromString("4051577828743386545");
    let onRampSetEvent = createOnRampSetEvent(destChainSelector, onRampAddress);
    handleOnRampSet(onRampSetEvent);
    assert.entityCount("OnRamp", 2);
    assert.fieldEquals(
      "OnRamp",
      "0x849c5ed5a80f5b408dd4969b78c2c8fdf0565bfe",
      "destChainSelector",
      "4051577828743386545"
    );
  });
});
