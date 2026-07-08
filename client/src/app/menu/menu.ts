import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  @Input() menuItems: any;
  //menuItems: MenuItem[]  = [{"id":"624806d7d4da3a6d12ffb815","name":"Small Steamed Buns","price":150,"imgUrl":"https://pic.pimg.tw/cherrycatme/1597474923-1541391916-g_n.jpg"},{"id":"624806d7d4da3a6d12ffb816","name":"Soy Milk","price":83,"imgUrl":"http://3.bp.blogspot.com/-cGhsQ9bfFEE/U8Ewgc4Vb5I/AAAAAAAACw8/UtAYjb1l0DA/s1600/Yonghe+3.jpg"},{"id":"624806d7d4da3a6d12ffb814","name":"Turnip Cake","price":67,"imgUrl":"http://album.udn.com/community/img/PSN_PHOTO/ichintzeng/f_1540463_1.jpg"},{"id":"624806d7d4da3a6d12ffb811","name":"Egg Wrap","price":83,"imgUrl":"https://live.staticflickr.com/65535/51489501255_50d9e57ee5_c.jpg"},{"id":"624806d7d4da3a6d12ffb80e","name":"Twisted Cruller","price":67,"imgUrl":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg2LQSQpYiREoEuWNe_c1b_fi5nye1o5XztA&usqp=CAU"},{"id":"624806d7d4da3a6d12ffb812","name":"Rice Roll","price":117,"imgUrl":"https://media-cdn.tripadvisor.com/media/photo-s/0b/aa/32/f6/caption.jpg"},{"id":"624806d7d4da3a6d12ffb80f","name":"Baked Wheat Cake","price":67,"imgUrl":"https://media-cdn.tripadvisor.com/media/photo-s/09/4d/be/a4/caption.jpg"},{"id":"624806d7d4da3a6d12ffb810","name":"Pork Bun","price":67,"imgUrl":"https://imgv.azureedge.net/wpupload/2019/03/ct06074-3520-6-03.jpg"},{"id":"624806d7d4da3a6d12ffb817","name":"Rice Milk","price":83,"imgUrl":"http://1.bp.blogspot.com/-bwKRZGY9U6c/U8E6TXJyRfI/AAAAAAAACxU/QqkaEO-2ntw/s1600/Yonghe+6.jpg"},{"id":"624806d7d4da3a6d12ffb813","name":"Fried Egg with Spring Onion","price":50,"imgUrl":"https://static.popdaily.com.tw/u/202105/d429b85f-9f36-491e-bceb-49a77adefd76.jpeg"}]
}