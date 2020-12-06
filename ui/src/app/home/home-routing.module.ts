import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeRootComponent } from './home-root/home-root.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent,
        children:[
          { path: '', component: HomeRootComponent }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
