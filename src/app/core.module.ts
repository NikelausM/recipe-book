import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RecipeService } from "./recipes/recipe.service";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { DataStorageService } from "./shared/data-storage.service";

// Services are automatically injected at the root level
@NgModule({
  providers: [
    RecipeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule { }