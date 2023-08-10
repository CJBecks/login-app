import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Calendar Components
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule
  ],
  declarations: [
    CalendarDayComponent
  ],
  exports: [
    CalendarDayComponent
  ]
})
export class CalendarModule { }
