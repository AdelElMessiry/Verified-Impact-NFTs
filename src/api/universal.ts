import { getDeploy } from '../utils/contract-utils';
import { CONNECTION } from '../constants/blockchain';
// global func using to fetch the hash deploy details
export async function getDeployDetails(deployHash: string) {
  return await getDeploy(CONNECTION.NODE_ADDRESS!, deployHash);
}
