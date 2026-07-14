export interface MenuItem {
  id: string,
  name: string,
  price: number,
  img_url: string
}

export interface OrderedItem {
  id: string,
  name: string,
  price: number,
  quantity: number
}

export interface Order {
  id?: string,
  items?: OrderedItem[],
  status?: string,
  number: number,
  option: string
}