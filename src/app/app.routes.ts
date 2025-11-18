import { Routes } from '@angular/router';
import { AuthPage } from './iam/pages/auth-page/auth-page';
import { ClientsPage } from './clients/pages/clients-page/clients-page';
import { MainLayout } from './public/components/main-layout/main-layout';
import { EditClientsPage } from './clients/pages/edit-clients-page/edit-clients-page';
import { CreateClientsPage } from './clients/pages/create-clients-page/create-clients-page';
import { AuthGuard } from './shared/guards/auth.guard';
import {NoAccessPage} from './public/pages/no-access-page/no-access-page';
import {NotFoundPage} from './public/pages/not-found-page/not-found-page';

export const routes: Routes = [
  { path: "", redirectTo: "/auth", pathMatch: "full" },
  { path: "auth", component: AuthPage },
  { path: "no-access", component: NoAccessPage },
  {
    path: "",
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: "home", redirectTo: "clients", pathMatch: "full" },
      { path: "clients", component: ClientsPage },
      { path: "clients/create", component: CreateClientsPage },
      { path: "clients/edit/:id", component: EditClientsPage },
      { path: "**", component: NotFoundPage }
    ]
  },
];
