import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core.module';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { Home } from './pages/home/home';
import { Explorer } from './pages/explorer/explorer';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AuthCallback } from './pages/auth-callback/auth-callback';
import { SharedModule } from './shared/shared.module';
 
@NgModule({
  declarations: [
    App,
    Header,
    Footer,
    Home,
    Explorer,
    Login,
    Register,
    AuthCallback,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }

