import {
  MessageExecuted as MessageExecutedEvent,
  OffRampAdded as OffRampAddedEvent,
  OffRampRemoved as OffRampRemovedEvent,
  OnRampSet as OnRampSetEvent,
  Router,
} from "../generated/Router/Router";
import { EVM2EVMOffRamp } from "../generated/Router/EVM2EVMOffRamp";
import { Message, OffRamp, OnRamp } from "../generated/schema";

export function handleMessageExecuted(event: MessageExecutedEvent): void {
  let message = new Message(event.params.messageId);
  message.sourceChainSelector = event.params.sourceChainSelector;
  message.offRampName = "Arbitrum";
  message.offRampAddress = event.params.offRamp;
  message.calldataHash = event.params.calldataHash;

  message.blockNumber = event.block.number;
  message.blockTimestamp = event.block.timestamp;
  message.transactionHash = event.transaction.hash;
  message.save();
}

export function handleOffRampAdded(event: OffRampAddedEvent): void {
  let offRamp = OffRamp.load(event.params.offRamp);
  if (offRamp === null) {
    // If offRamp does not exist, create it.
    offRamp = new OffRamp(event.params.offRamp);
    let EVM2EVMOffRampContract = EVM2EVMOffRamp.bind(event.params.offRamp);
    offRamp.supportedTokens = EVM2EVMOffRampContract.getSupportedTokens();
    offRamp.name = "Arbitrum";
    offRamp.sourceChainSelector = event.params.sourceChainSelector;
  }
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
  let contract = Router.bind(event.params.onRamp);
  onRamp.destChainSelector = event.params.destChainSelector;
  onRamp.blockNumberLastUpdated = event.block.number;
  onRamp.typeAndVersion = contract.typeAndVersion();
  onRamp.blockNumberLastUpdated = event.block.number;
  onRamp.blockTimestampLastUpdated = event.block.timestamp;
  onRamp.transactionHashLastUpdated = event.transaction.hash;
  onRamp.save();
}
