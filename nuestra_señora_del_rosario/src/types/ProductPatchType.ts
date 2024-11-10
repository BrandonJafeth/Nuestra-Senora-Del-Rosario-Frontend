// types/ProductPatchType.ts
export interface ProductPatchType {
  op: 'replace' | 'add' | 'remove';
  path: string;
  value: string;
}
