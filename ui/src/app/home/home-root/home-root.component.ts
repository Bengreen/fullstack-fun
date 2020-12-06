import { Component, OnInit } from '@angular/core';
import { SimpleService } from 'src/app/core/simple.service';

@Component({
  templateUrl: './home-root.component.html',
  styleUrls: ['./home-root.component.scss']
})
export class HomeRootComponent implements OnInit {

  constructor(private simple: SimpleService) { }

  public config: any = {};
  public graphql: any = {};

  ngOnInit(): void {
    this.simple.getConfig().subscribe(
      (config) => {
        this.config = config;
      }
    )
  }

  getGraphQl(): void {
    console.log('trying to get graphQl');
    this.simple.getGraphQl().subscribe(
      (graphql) => {
        this.graphql = graphql;
      }
    )
  }



}
