import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { CognitoService } from 'src/app/common/cognito.service';
import { UserService } from 'src/app/common/user.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  constructor(public userService: UserService, private http: HttpClient){
  }

  ngOnInit() {

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: chartExample1.data
		});
  }

  public callEndpoint() {
      const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.userService.activeUser.jwt}`
        });
      const requestOptions = { headers: headers };
      this.http
          .get('https://dzdggqurla.execute-api.us-east-1.amazonaws.com/test', requestOptions)
          .subscribe((res: any) => {
              console.log(res);
          });
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

}
