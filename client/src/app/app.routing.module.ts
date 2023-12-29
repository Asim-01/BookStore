// Decorators
import { NgModule } from '@angular/core';

// Modules
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

// Components
import { HomeComponent } from './components/landing/home/home.component';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('./components/user/user.module').then(m => m.UserModule)

  },
  {
    path: 'book',
    loadChildren: () => import('./components/book/book.module').then(m => m.BookModule)
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { preloadingStrategy: PreloadAllModules }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
