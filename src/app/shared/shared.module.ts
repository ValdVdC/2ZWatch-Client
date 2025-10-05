import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Components
import { ErrorMessage } from './components/error-message/error-message'
import { Loading } from './components/loading/loading';
import { Pagination } from './components/pagination/pagination';
import { SearchBar } from './components/search-bar/search-bar';

// Pipes
import { TruncatePipe } from './pipes/truncate.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  declarations: [
    ErrorMessage,
    Loading,
    Pagination,
    SearchBar,
    TruncatePipe,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ErrorMessage,
    Loading,
    Pagination,
    SearchBar,
    TruncatePipe,
    SafeUrlPipe
  ]
})
export class SharedModule { }