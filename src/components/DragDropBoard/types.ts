
export interface BoardComponent {
  id: string;
  type: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
  zIndex?: number;
  value?: boolean | number;
}
