import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {Chart} from 'chart.js';
import {AnalyticsPage} from "../shared/interfaces";

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit {

  @ViewChild('gain', {static: false}) gainRef: ElementRef;
  @ViewChild('order', {static: false}) orderRef: ElementRef;
  average: number;
  pending = true;

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    }
    const orderConfig: any = {
      label: 'Выручка',
      color: 'rgb(54, 162, 235)'
    }

    this.service.getAnalytics().subscribe((data: AnalyticsPage) =>{
     this.average = data.average;
      gainConfig.labels = data.chart.map(item => item.label);
      gainConfig.data = data.chart.map(item => item.gain);

       //temp value for graphics Gain
      // gainConfig.labels.push("21.12.2019");
      // gainConfig.data.push(77000);
      // gainConfig.labels.push("22.12.2019");
      // gainConfig.data.push(7000);
      //
      //
      //
      //
      // orderConfig.labels = data.chart.map(item => item.label);
      // orderConfig.data = data.chart.map(item => item.order);

      //temp value for graphics Order
      // orderConfig.labels.push("21.12.2019");
      // orderConfig.data.push(7);
      // orderConfig.labels.push("22.12.2019");
      // orderConfig.data.push(2);

      const gainCtx = this.gainRef.nativeElement.getContext('2d');
      const orderCtx = this.orderRef.nativeElement.getContext('2d');
      gainCtx.canvas.height = '300px';
      orderCtx.canvas.height = '300px';
      new Chart(gainCtx, createChartConfig(gainConfig));
      new Chart(orderCtx, createChartConfig(orderConfig));
      this.pending = false;
    })
  }

}
function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responcive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
