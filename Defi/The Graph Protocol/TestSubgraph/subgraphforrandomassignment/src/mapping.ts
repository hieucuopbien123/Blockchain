import { Assign as AssignEvent } from "../generated/RandomAssignment/RandomAssignment"
import { AddressValue, Address } from "../generated/schema";

export function handleAssign(event: AssignEvent): void {
  let val = AddressValue.load(event.params.value.toString());
  if(!val){
    val = new AddressValue(event.params.value.toString());
    val.count = 0;
  }
  
  let address = Address.load(event.params.addr.toHexString());
  if(!address){
    val.count++;
    address = new Address(event.params.addr.toHexString());
    address.timesChange = 0;
  }
  address.blockNumber = event.block.number;
  address.timesChange++;
  address.timestamp = event.block.timestamp;
  address.currentValue = event.params.value;
  address.save();
  val.save();
}
