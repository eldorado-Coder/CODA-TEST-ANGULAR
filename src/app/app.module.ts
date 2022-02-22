import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MiaAuthInterceptor, MiaAuthModule, MIA_AUTH_PROVIDER } from '@agencycoda/mia-auth';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MiaCoreModule, MIA_GOOGLE_STORAGE_PROVIDER } from '@agencycoda/mia-core';
import { MiaTableModule } from '@agencycoda/mia-table';
import { MiaFormModule } from '@agencycoda/mia-form';
import { MiaLoadingModule } from '@agencycoda/mia-loading';
import { ClientComponent } from './pages/client/client.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    // Agency Coda Modules
    MiaCoreModule,
    MiaAuthModule,
    MiaTableModule,
    MiaLoadingModule,
    MiaFormModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: MIA_AUTH_PROVIDER,
      useValue: {
        baseUrl: environment.baseUrl
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MiaAuthInterceptor,
      multi: true
    },
    {
      provide: MIA_GOOGLE_STORAGE_PROVIDER,
      useValue: {
        bucket: environment.cloudStorageBucket
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
