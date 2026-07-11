import { Routes } from "@angular/router";
import { Start } from "./start/start";
import { Menu } from "./menu/menu";
import { Checkout } from "./checkout/checkout";
import { Pay } from "./pay/pay";
import { Done } from "./done/done";
import { Status } from "./status/status";

export const routes: Routes = [
  { path: '', component: Start },
  { path: 'menu', component: Menu },
  { path: 'checkout', component: Checkout },
  { path: 'pay', component: Pay },
  { path: 'done', component: Done },
  { path: 'status', component: Status },
  { path: '**', component: Start } 
];