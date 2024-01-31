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

import { EVM2EVMOffRamp } from "../generated/Router/EVM2EVMOffRamp";
import { Bytes, BigInt, Address, ethereum } from "@graphprotocol/graph-ts";
import { handleMessageExecuted, handleOffRampAdded, handleOffRampRemoved, handleOnRampSet } from "../src/router";
import {
  createMessageExecutedEvent,
  createOffRampAddedEvent,
  createOffRampRemovedEvent,
  createOnRampSetEvent,
} from "./router-utils";

describe("OffRamp", () => {
  beforeEach(() => {
    let contractAddress = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
    let addressArray = ethereum.Value.fromAddressArray([
      Address.fromString("0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"),
    ]);
    createMockedFunction(contractAddress, "getSupportedTokens", "getSupportedTokens():(address[])").returns([
      addressArray,
    ]);

    let contract = EVM2EVMOffRamp.bind(contractAddress);
    let result = contract.getSupportedTokens();
    assert.equals(ethereum.Value.fromAddressArray(result), addressArray);

    let sourceChainSelector = BigInt.fromString("3734403246176062136");
    let offRamp = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
    let newOffRampEvent = createOffRampAddedEvent(sourceChainSelector, offRamp);
    handleOffRampAdded(newOffRampEvent);

    let messageId = Bytes.fromHexString("0x30a2aee56d769e573076b28748aabaccf31f7dd2d8199df527b35b714c799575");
    // let sourceChainSelector = BigInt.fromString("9284632837123596123");
    // let offRamp = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
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
    let addressArray = ethereum.Value.fromAddressArray([
      Address.fromString("0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"),
    ]);
    createMockedFunction(offRampAddress2, "getSupportedTokens", "getSupportedTokens():(address[])").returns([
      addressArray,
    ]);
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
  });

  test("A Message calldataHash is saved", () => {
    assert.fieldEquals(
      "Message",
      "0x30a2aee56d769e573076b28748aabaccf31f7dd2d8199df527b35b714c799575",
      "calldataHash",
      "0xc1b87e59bdf3d0dc9389d03be40170eb3547776bfb7839bfe668b97fb3894013"
    );
  });
});

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

describe("handleOnRampSet", () => {
  beforeAll(() => {
    let contractAddress = Address.fromString("0x46b639a3c1a4cbfd326b94a2db7415c27157282f");
    let mockTypeAndVersion = ethereum.Value.fromString("EVM2EVMOffRamp 1.2.0");
    createMockedFunction(contractAddress, "typeAndVersion", "typeAndVersion():(string)").returns([mockTypeAndVersion]);

    let contract = EVM2EVMOffRamp.bind(contractAddress);
    let result = contract.typeAndVersion();
    assert.equals(ethereum.Value.fromString(result), mockTypeAndVersion);

    log.info("handleOnRampSet {}", [result]);

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
