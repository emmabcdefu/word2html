import ElementInfoBase from './ElementInfoBase';

export default interface ElementInfo {
  id: string;
  element: string;
  number?: boolean;
  small?: boolean;
  click?: boolean;
  width?: string;
  height?: string;
  content: string | ElementInfoBase[][];
}
