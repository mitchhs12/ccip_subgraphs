import {
  MessageExecuted as MessageExecutedEvent,
  OffRampAdded as OffRampAddedEvent,
  OffRampRemoved as OffRampRemovedEvent,
  OnRampSet as OnRampSetEvent,
  Router,
} from "../generated/Router/Router";
import { EVM2EVMOffRamp } from "../generated/Router/EVM2EVMOffRamp";
import { Message, OffRamp, OnRamp } from "../generated/schema";
import { nameFromSource } from "./sourceChainName";
import { Bytes } from "@graphprotocol/graph-ts";

export function handleMessageExecuted(event: MessageExecutedEvent): void {
  let offRamp = OffRamp.load(event.params.offRamp);
  let message = new Message(event.params.messageId);
  if (offRamp) {
    // offRamp will always exist and be approved before a valid message is received.
    message.offRamp = offRamp.id;
    message.calldataHash = event.params.calldataHash;

    message.blockNumber = event.block.number;
    message.blockTimestamp = event.block.timestamp;
    message.transactionHash = event.transaction.hash;
    message.save();
  }
}

export function handleOffRampAdded(event: OffRampAddedEvent): void {
  let offRamp = OffRamp.load(event.params.offRamp);
  if (offRamp === null) {
    // If offRamp does not exist, create it.
    offRamp = new OffRamp(event.params.offRamp);
    let name = nameFromSource.get(event.params.sourceChainSelector.toString());
    offRamp.name = name ? name : "Unknown Source Chain";
    offRamp.sourceChainSelector = event.params.sourceChainSelector;
  }
  let EVM2EVMOffRampContract = EVM2EVMOffRamp.bind(event.params.offRamp);
  let supportedTokens = EVM2EVMOffRampContract.try_getSupportedTokens();
  offRamp.supportedTokens = supportedTokens.reverted
    ? []
    : supportedTokens.value.map<Bytes>((address) => Bytes.fromUint8Array(address));

  let typeAndVersion = EVM2EVMOffRampContract.try_typeAndVersion();
  offRamp.typeAndVersion = typeAndVersion.reverted ? "Unknown" : typeAndVersion.value;
  offRamp.isActive = true;

  offRamp.blockNumberLastUpdated = event.block.number;
  offRamp.blockTimestampLastUpdated = event.block.timestamp;
  offRamp.transactionHashLastUpdated = event.transaction.hash;
  offRamp.save();
}

export function handleOffRampRemoved(event: OffRampRemovedEvent): void {
  let offRamp = OffRamp.load(event.params.offRamp);

  // We return if offRamp does not exist.
  if (offRamp === null) {
    return;
  }
  offRamp.isActive = false;
  offRamp.save();
}

export function handleOnRampSet(event: OnRampSetEvent): void {
  let onRamp = new OnRamp(event.params.onRamp);
  let name = nameFromSource.get(event.params.destChainSelector.toString());
  onRamp.name = name ? name : "Unknown Destination Chain";
  let contract = Router.bind(event.params.onRamp);

  let typeAndVersion = contract.try_typeAndVersion();
  onRamp.typeAndVersion = typeAndVersion.reverted ? "Unknown" : typeAndVersion.value;

  onRamp.destChainSelector = event.params.destChainSelector;
  onRamp.blockNumberSet = event.block.number;
  onRamp.blockTimestampSet = event.block.timestamp;
  onRamp.transactionHashSet = event.transaction.hash;
  onRamp.save();
}
