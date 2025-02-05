import { get_account } from "@completium/experiment-ts";
import { bridge } from "../tests/binding/Bridge";

async function deployBridge() {
  const alice = get_account('alice');
  const Bridge = new bridge();

  await Bridge.deploy(alice.get_address(), { as: alice });

  console.log('DEPLOYED ADDRESS : ', Bridge.get_address());
}

deployBridge().catch(console.error);