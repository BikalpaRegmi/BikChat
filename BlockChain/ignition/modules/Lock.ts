import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const BIKCHAT = buildModule('BikChatModule', (m) => {
  const toDeploy = m.contract("BIKCHAT");
  return { toDeploy };
});

export default BIKCHAT;