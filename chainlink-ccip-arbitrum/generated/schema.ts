// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal,
} from "@graphprotocol/graph-ts";

export class Message extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Message entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Message must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Message", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Message | null {
    return changetype<Message | null>(
      store.get_in_block("Message", id.toHexString()),
    );
  }

  static load(id: Bytes): Message | null {
    return changetype<Message | null>(store.get("Message", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get offRampName(): string {
    let value = this.get("offRampName");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set offRampName(value: string) {
    this.set("offRampName", Value.fromString(value));
  }

  get sourceChainSelector(): BigInt {
    let value = this.get("sourceChainSelector");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set sourceChainSelector(value: BigInt) {
    this.set("sourceChainSelector", Value.fromBigInt(value));
  }

  get offRampAddress(): Bytes {
    let value = this.get("offRampAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set offRampAddress(value: Bytes) {
    this.set("offRampAddress", Value.fromBytes(value));
  }

  get calldataHash(): Bytes {
    let value = this.get("calldataHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set calldataHash(value: Bytes) {
    this.set("calldataHash", Value.fromBytes(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class OffRamp extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save OffRamp entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type OffRamp must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("OffRamp", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): OffRamp | null {
    return changetype<OffRamp | null>(
      store.get_in_block("OffRamp", id.toHexString()),
    );
  }

  static load(id: Bytes): OffRamp | null {
    return changetype<OffRamp | null>(store.get("OffRamp", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get name(): string {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get isActive(): boolean {
    let value = this.get("isActive");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set isActive(value: boolean) {
    this.set("isActive", Value.fromBoolean(value));
  }

  get sourceChainSelector(): BigInt {
    let value = this.get("sourceChainSelector");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set sourceChainSelector(value: BigInt) {
    this.set("sourceChainSelector", Value.fromBigInt(value));
  }

  get supportedTokens(): Array<Bytes> {
    let value = this.get("supportedTokens");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytesArray();
    }
  }

  set supportedTokens(value: Array<Bytes>) {
    this.set("supportedTokens", Value.fromBytesArray(value));
  }

  get typeAndVersion(): string {
    let value = this.get("typeAndVersion");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set typeAndVersion(value: string) {
    this.set("typeAndVersion", Value.fromString(value));
  }

  get blockNumberLastUpdated(): BigInt {
    let value = this.get("blockNumberLastUpdated");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumberLastUpdated(value: BigInt) {
    this.set("blockNumberLastUpdated", Value.fromBigInt(value));
  }

  get blockTimestampLastUpdated(): BigInt {
    let value = this.get("blockTimestampLastUpdated");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockTimestampLastUpdated(value: BigInt) {
    this.set("blockTimestampLastUpdated", Value.fromBigInt(value));
  }

  get transactionHashLastUpdated(): Bytes {
    let value = this.get("transactionHashLastUpdated");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set transactionHashLastUpdated(value: Bytes) {
    this.set("transactionHashLastUpdated", Value.fromBytes(value));
  }
}

export class OnRamp extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save OnRamp entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type OnRamp must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("OnRamp", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): OnRamp | null {
    return changetype<OnRamp | null>(
      store.get_in_block("OnRamp", id.toHexString()),
    );
  }

  static load(id: Bytes): OnRamp | null {
    return changetype<OnRamp | null>(store.get("OnRamp", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get destChainSelector(): BigInt {
    let value = this.get("destChainSelector");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set destChainSelector(value: BigInt) {
    this.set("destChainSelector", Value.fromBigInt(value));
  }

  get typeAndVersion(): string {
    let value = this.get("typeAndVersion");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set typeAndVersion(value: string) {
    this.set("typeAndVersion", Value.fromString(value));
  }

  get blockNumberLastUpdated(): BigInt {
    let value = this.get("blockNumberLastUpdated");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumberLastUpdated(value: BigInt) {
    this.set("blockNumberLastUpdated", Value.fromBigInt(value));
  }

  get blockTimestampLastUpdated(): BigInt {
    let value = this.get("blockTimestampLastUpdated");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockTimestampLastUpdated(value: BigInt) {
    this.set("blockTimestampLastUpdated", Value.fromBigInt(value));
  }

  get transactionHashLastUpdated(): Bytes {
    let value = this.get("transactionHashLastUpdated");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set transactionHashLastUpdated(value: Bytes) {
    this.set("transactionHashLastUpdated", Value.fromBytes(value));
  }
}
