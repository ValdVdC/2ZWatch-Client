import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Components
import { ErrorMessage } from './components/error-message/error-message'
import { Loading } from './components/loading/loading';
import { Pagination } from './components/pagination/pagination';
import { SearchBar } from './components/search-bar/search-bar';
import { PasswordStrengthComponent } from './components/password-strength/password-strength';
import { ImageSkeletonComponent } from './components/image-skeleton/image-skeleton';
import { VideoPlayerModalComponent } from './components/video-player-modal/video-player-modal';

// Directives
import { ImageFallbackDirective } from './directives/image-fallback.directive';

// Pipes
import { TruncatePipe } from './pipes/truncate.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  declarations: [
    ErrorMessage,
    Loading,
    Pagination,
    SearchBar,
    PasswordStrengthComponent,
    TruncatePipe,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ImageSkeletonComponent,
    ImageFallbackDirective,
    VideoPlayerModalComponent
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ErrorMessage,
    Loading,
    Pagination,
    SearchBar,
    PasswordStrengthComponent,
    TruncatePipe,
    SafeUrlPipe,
    ImageSkeletonComponent,
    ImageFallbackDirective,
    VideoPlayerModalComponent
  ]
})
export class SharedModule { }