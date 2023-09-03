import {
  TokenURIUpdated as TokenURIUpdatedEvent,
  TokenMetadataURIUpdated as TokenMetadataURIUpdatedEvent,
  Transfer as TransferEvent,
  Token as TokenContract
} from "../generated/Token/Token"

import {
  Token, User
} from '../generated/schema'

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.params.tokenId.toString());
  if (!token) {
    token = new Token(event.params.tokenId.toString());
    token.creator = event.params.to.toHexString(); // Address lưu như này
    token.tokenID = event.params.tokenId; // Các thuộc tính sau dấu chấm là của entities khai báo trong schema.graphql 
    token.createdAtTimestamp = event.block.timestamp;

    let tokenContract = TokenContract.bind(event.address); // Khi muốn thao tác với các hàm trong contract(call func)
    token.contentURI = tokenContract.tokenURI(event.params.tokenId);
    token.metadataURI = tokenContract.tokenMetadataURI(event.params.tokenId);
  }
  token.owner = event.params.to.toHexString();
  token.save();

  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}

export function handleTokenURIUpdated(event: TokenURIUpdatedEvent): void {
let token = Token.load(event.params._tokenId.toString());
if (!token) return;
token.contentURI = event.params._uri;
token.save();
}
 
export function handleTokenMetadataURIUpdated(event: TokenMetadataURIUpdatedEvent): void {
  let token = Token.load(event.params._tokenId.toString());
  if (!token) return;
  token.metadataURI = event.params._uri;
  token.save();
}