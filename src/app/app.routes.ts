import { Routes } from '@angular/router';
import { AuthPage } from './iam/pages/auth-page/auth-page';
import { ClientsPage } from './clients/pages/clients-page/clients-page';
import { MainLayout } from './public/components/main-layout/main-layout';
import { EditClientsPage } from './clients/pages/edit-clients-page/edit-clients-page';
import { CreateClientsPage } from './clients/pages/create-clients-page/create-clients-page';
import { AuthGuard } from './shared/guards/auth.guard';
import {NoAccessPage} from './public/pages/no-access-page/no-access-page';
import {NotFoundPage} from './public/pages/not-found-page/not-found-page';
import {PropertiesPage} from './properties/pages/properties-page/properties-page';
import {CreatePropertiesPage} from './properties/pages/create-properties-page/create-properties-page';
import {EditPropertiesPage} from './properties/pages/edit-properties-page/edit-properties-page';
import {PlanPage} from './plans/pages/plans-page/plan-page';
import {CreatePlanPage} from './plans/pages/create-plans-page/create-plan-page';
import {EditPlanPage} from './plans/pages/edit-plans-page/edit-plan-page';
import {DetailPlanPage} from './plans/pages/detail-plans-page/detail-plan-page';
import {ClaimsFormPage} from './public/components/claims-form-page/claims-form-page';

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
      { path: "properties", component: PropertiesPage },
      { path: "properties/create", component: CreatePropertiesPage },
      { path: 'properties/edit/:id', component: EditPropertiesPage },
      { path: "plans", component: PlanPage },
      { path: "plans/create", component: CreatePlanPage },
      { path: "plans/:id", component: DetailPlanPage },
      { path: 'plans/edit/:id', component: EditPlanPage },
      { path: 'claims', component: ClaimsFormPage },
      { path: "**", component: NotFoundPage },


    ]
  },
];
