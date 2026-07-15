import { Routes } from "@angular/router";
import { Start } from "./pages/start/start";
import { Menu } from "./pages/menu/menu";
import { Checkout } from "./pages/checkout/checkout";
import { Pay } from "./pages/pay/pay";
import { Done } from "./pages/done/done";
import { Status } from "./pages/status/status";
import { Kitchen } from "./pages/kitchen/kitchen";

export const routes: Routes = [
  { path: '', component: Start, title: "Start" },
  { path: 'menu', component: Menu, title: "Menu" },
  { path: 'checkout', component: Checkout, title: "Checkout" },
  { path: 'pay', component: Pay, title: "Pay" },
  { path: 'done', component: Done, title: "Done" },
  { path: 'status', component: Status, title: "Status" },
  { path: 'kitchen', component: Kitchen, title: "Kitchen" },
  { path: '**', component: Start, title: "Start" }
];