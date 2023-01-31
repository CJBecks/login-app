import { Component, OnInit } from "@angular/core";

@Component({
    selector: "calendar-day",
    templateUrl: "./calendar-day.component.html",
    styleUrls: ["./calendar-day.component.scss"],
})
export class CalendarDayComponent implements OnInit {

    public choices: IChoices;
    public value: any = 1;

    public calendarDayData: ICalendarDayComponentDataset = {
        today: { date: new Date(), value: null, color: null },
        yesterday: { date: new Date(new Date().setDate(new Date().getDate() - 1)) },
        twoDaysAgo: { date: new Date(new Date().setDate(new Date().getDate() - 2)) },
    };

    public stringValue: string = 'STRING';

    constructor() {
        // Get values from local-storage if they exist.
        this.choices = {
            1: { description: 'First Choice', color: '#ff726b' },
            2: { description: 'Second Choice', color: '#3498DB' },
            3: { description: 'Third Choice', color: '#EFC94C' },
        }
        
        // Get values from local-storage if they exist.
        this.calendarDayData.twoDaysAgo.value = 1;
        this.calendarDayData.twoDaysAgo.color = this.choices[this.calendarDayData.twoDaysAgo.value].color;

        this.calendarDayData.yesterday.value = 2;
        this.calendarDayData.yesterday.color = this.choices[this.calendarDayData.yesterday.value].color;
    }

    ngOnInit() {}
}

// Calendar Day Interfaces
export interface ICalendarDayComponentDataset {
    today: ICalendarDay;
    yesterday: ICalendarDay;
    twoDaysAgo: ICalendarDay;
}

export interface ICalendarDay {
    date: Date;
    value?: number;
    color?: string;
}


// Choices Interface
export interface IChoices {
    [key: number]: { description: string, color: string };
}