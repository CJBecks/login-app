import { Component, OnInit } from "@angular/core";

@Component({
    selector: "calendar-day",
    templateUrl: "./calendar-day.component.html",
    styleUrls: ["./calendar-day.component.scss"],
})
export class CalendarDayComponent implements OnInit {

    public choices: IChoices;

    public isActive:boolean = false;

    public calendarDayData: ICalendarDayComponentDataset = {
        twoDaysFromNow: { date: new Date(new Date().setDate(new Date().getDate() + 2)) },
        tomorrow: { date: new Date(new Date().setDate(new Date().getDate() + 1)) },
        today: { date: new Date() },
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
        this.calendarDayData.twoDaysAgo.description = this.choices[this.calendarDayData.twoDaysAgo.value].description;

        this.calendarDayData.yesterday.value = 2;
        this.calendarDayData.yesterday.color = this.choices[this.calendarDayData.yesterday.value].color;
        this.calendarDayData.yesterday.description = this.choices[this.calendarDayData.twoDaysAgo.value].description;

    }

    ngOnInit() {
        setTimeout(() => {
            this.isActive = true;
        }, 250);
    }

    public selection(item: { description: string, color: string }):void {
        this.calendarDayData.today.description = item.description;
    }
} 

// Calendar Day Interfaces
export interface ICalendarDayComponentDataset {
    twoDaysFromNow: ICalendarDay;
    tomorrow: ICalendarDay;
    today: ICalendarDay;
    yesterday: ICalendarDay;
    twoDaysAgo: ICalendarDay;
}

export interface ICalendarDay {
    date: Date;
    value?: number;
    color?: string;
    description?: string,
}


// Choices Interface
export interface IChoices {
    [key: number]: { description: string, color: string };
}