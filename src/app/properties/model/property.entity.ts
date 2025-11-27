export class Property {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  address: string;
  salesManId: number;

  //temp
  m2: number;
  rooms: number;

  constructor(property: {
    id?: number;
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    address?: string;
    salesManId?: number;

    //temp
    m2?: number;
    rooms?: number;
  }) {
    this.id = property.id || 0;
    this.title = property.title || '';
    this.description = property.description || '';
    this.price = property.price || 0;
    this.currency = property.currency || "PEN";
    this.address = property.address || '';
    this.salesManId = property.salesManId || 0;

    //temp
    this.m2 = property.m2 || 0;
    this.rooms = property.rooms || 0;
  }
}
