export  interface ParentData {
  _id: string;
  name: string;
  email?: string;
}

export interface ChildData {
  _id: string;
  name: string;
  age: number;
  parentId: ParentData;
}
