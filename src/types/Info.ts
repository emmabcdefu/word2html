import ElementInfo from './ElementInfo';

export default interface Info {
  path: string;
  content: ElementInfo[];
  style: string;
  navbar: boolean;
  imagesClickable: boolean;
}
