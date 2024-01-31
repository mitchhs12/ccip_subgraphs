import { newMockEvent } from "matchstick-as";
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts";
import { MessageExecuted, OffRampAdded, OffRampRemoved, OnRampSet } from "../generated/Router/Router";

export function createMessageExecutedEvent(
  messageId: Bytes,
  sourceChainSelector: BigInt,
  offRamp: Address,
  calldataHash: Bytes
): MessageExecuted {
  let messageExecutedEvent = changetype<MessageExecuted>(newMockEvent());
  messageExecutedEvent.parameters = new Array();
  messageExecutedEvent.parameters.push(new ethereum.EventParam("messageId", ethereum.Value.fromFixedBytes(messageId)));
  messageExecutedEvent.parameters.push(
    new ethereum.EventParam("sourceChainSelector", ethereum.Value.fromUnsignedBigInt(sourceChainSelector))
  );
  messageExecutedEvent.parameters.push(new ethereum.EventParam("offRamp", ethereum.Value.fromAddress(offRamp)));
  messageExecutedEvent.parameters.push(
    new ethereum.EventParam("calldataHash", ethereum.Value.fromFixedBytes(calldataHash))
  );
  return messageExecutedEvent;
}

export function createOffRampAddedEvent(sourceChainSelector: BigInt, offRamp: Address): OffRampAdded {
  let offRampAddedEvent = changetype<OffRampAdded>(newMockEvent());
  offRampAddedEvent.parameters = new Array();
  offRampAddedEvent.parameters.push(
    new ethereum.EventParam("sourceChainSelector", ethereum.Value.fromUnsignedBigInt(sourceChainSelector))
  );
  offRampAddedEvent.parameters.push(new ethereum.EventParam("offRamp", ethereum.Value.fromAddress(offRamp)));
  return offRampAddedEvent;
}

export function createOffRampRemovedEvent(sourceChainSelector: BigInt, offRamp: Address): OffRampRemoved {
  let offRampRemovedEvent = changetype<OffRampRemoved>(newMockEvent());
  offRampRemovedEvent.parameters = new Array();
  offRampRemovedEvent.parameters.push(
    new ethereum.EventParam("sourceChainSelector", ethereum.Value.fromUnsignedBigInt(sourceChainSelector))
  );
  offRampRemovedEvent.parameters.push(new ethereum.EventParam("offRamp", ethereum.Value.fromAddress(offRamp)));
  return offRampRemovedEvent;
}

export function createOnRampSetEvent(destChainSelector: BigInt, onRamp: Address): OnRampSet {
  let onRampSetEvent = changetype<OnRampSet>(newMockEvent());
  onRampSetEvent.parameters = new Array();
  onRampSetEvent.parameters.push(
    new ethereum.EventParam("destChainSelector", ethereum.Value.fromUnsignedBigInt(destChainSelector))
  );
  onRampSetEvent.parameters.push(new ethereum.EventParam("onRamp", ethereum.Value.fromAddress(onRamp)));

  return onRampSetEvent;
}
