import ElementInfoBase from './ElementInfoBase';

export default interface ElementInfoTable {
  id: string;
  element: string;
  content: ElementInfoBase[][];
}
