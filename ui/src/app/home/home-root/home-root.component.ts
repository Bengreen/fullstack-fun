import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SimpleService } from 'src/app/core/simple.service';
import gql from "graphql-tag";

@Component({
  templateUrl: './home-root.component.html',
  styleUrls: ['./home-root.component.scss']
})
export class HomeRootComponent implements OnInit {

  constructor(
    private simple: SimpleService,
    private apollo: Apollo
    ) { }

  public config: any = {};
  public graphqlHttp: any = {};
  public graphql: any = {};

  ngOnInit(): void {
    this.simple.getConfig().subscribe(
      (config) => {
        this.config = config;
      }
    )
  }

  getGraphQlHttp(): void {
    console.log('trying to get graphQl HTTP');
    this.simple.getGraphQl().subscribe(
      (graphqlHttp) => {
        this.graphqlHttp = graphqlHttp;
      },
      (error) => {
        console.log('Got error:', error);
        this.graphqlHttp = {
          error: error.error,
          status: error.status,
        }
      }
    )
  }

  // Following: https://www.telerik.com/blogs/graphql-angular-how-to-make-a-graphql-query
  // Also to consider: https://angular.schule/blog/2018-06-apollo-graphql-code-generator
  getGraphQl(): void {
    console.log('trying to get graphQl');
    this.apollo.query<any>({
      query: gql`
      {
        accounts {
          name
          email
          password
        }
      }
      `
    }).subscribe(
      ({data, loading}) => {
        this.graphql = data;
        console.log('Got GraphQL:', data, loading);
      },
      (error) => {
        console.log('Error was: ', error);
      }
    )
  }



}
