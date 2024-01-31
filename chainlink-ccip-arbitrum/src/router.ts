import {
  MessageExecuted as MessageExecutedEvent,
  OffRampAdded as OffRampAddedEvent,
  OffRampRemoved as OffRampRemovedEvent,
  OnRampSet as OnRampSetEvent,
} from "../generated/Router/Router";
import { Message, OffRamp, OnRamp } from "../generated/schema";

export function handleMessageExecuted(event: MessageExecutedEvent): void {
  let message = new Message(event.params.messageId);
  message.sourceChainSelector = event.params.sourceChainSelector;
  message.offRampAddress = event.params.offRamp;
  message.calldataHash = event.params.calldataHash;
  message.blockNumberReceived = event.block.number;
  message.blockTimestampReceived = event.block.timestamp;
  message.transactionHash = event.transaction.hash;
  message.save();
}

export function handleOffRampAdded(event: OffRampAddedEvent): void {
  let offRamp = new OffRamp(event.params.offRamp);
  offRamp.sourceChainSelector = event.params.sourceChainSelector;
  offRamp.name = "Arbitrum";
  offRamp.isActive = true;
  offRamp.transactionHash = event.transaction.hash;
  offRamp.blockNumberModified = event.block.number;
  offRamp.blockTimestampModified = event.block.timestamp;
  offRamp.save();
}

export function handleOffRampRemoved(event: OffRampRemovedEvent): void {
  let offRamp = OffRamp.load(event.params.offRamp);

  // We return early if offRamp does not exist.
  if (offRamp === null) {
    return;
  }
  offRamp.isActive = false;
  offRamp.save();
}

export function handleOnRampSet(event: OnRampSetEvent): void {
  let onRamp = new OnRamp(event.params.onRamp);
  onRamp.destChainSelector = event.params.destChainSelector;
  onRamp.blockNumber = event.block.number;
  onRamp.blockTimestamp = event.block.timestamp;
  onRamp.transactionHash = event.transaction.hash;
  onRamp.save();
}
