export interface Recipe {
  id: number;
  name: string;
  time: 5 | 10 | 15 | 20 | 30 | 40 | 60;
  remarks: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
