import { Routes } from "@angular/router";
import { Start } from "./pages/start/start";
import { Menu } from "./pages/menu/menu";
import { Checkout } from "./pages/checkout/checkout";
import { Pay } from "./pages/pay/pay";
import { Done } from "./pages/done/done";
import { Status } from "./pages/status/status";
import { Kitchen } from "./pages/kitchen/kitchen";

export const routes: Routes = [
  { path: '', component: Start },
  { path: 'menu', component: Menu },
  { path: 'checkout', component: Checkout },
  { path: 'pay', component: Pay },
  { path: 'done', component: Done },
  { path: 'status', component: Status },
  { path: 'kitchen', component: Kitchen },
  { path: '**', component: Start }
];