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
  id: string | undefined,
  items: OrderedItem[] | undefined | null,
  status: string | undefined,
  number: number,
  option: string
}