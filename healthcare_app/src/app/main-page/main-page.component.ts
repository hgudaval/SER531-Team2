import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  constructor(private http: HttpClient) { }

  rootURL = "http://ec2-35-91-52-236.us-west-2.compute.amazonaws.com:3030/healthcare-dataset/query";
  searchText: any;
  outputText: any;
  entities: any[] = [];

  search() {
    let outMap :any
    let inMap :any

    let query
    if (this.searchText) {
      query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "SELECT ?s ?p ?o WHERE{ ?s rdfs:label ?name . " +
        "?s ?p ?o" +
        " FILTER( regex(?name, \"" + this.searchText + "\", \"i\" ) )  }"
    } else {
      query = "SELECT * WHERE{ ?s ?p ?o . }"
    }
    
    this.http.get<any>(this.rootURL, { params: { 'query': query } }).subscribe((res) => {
      this.outputText = ''
      console.log(res)
      res['results']['bindings'].forEach((triple: any) => {
        if (inMap[triple.o.value]) {
          inMap[triple.o.value] += 1
        } else {
          inMap[triple.o.value] = 1
        }
        if (outMap[triple.s.value]) {
          outMap[triple.s.value] += 1
        } else {
          outMap[triple.s.value] = 1
        }
      
        let txt: String[] = [];
        if (triple.p.value.split('#')[1] != 'type' && triple.p.value.split('#')[1] != 'label') {
          ['s', 'p', 'o'].forEach(x => {
            if (triple[x].type === 'uri') {
              txt.push("<" + triple[x].value + ">")
            } else if (triple[x].type === 'literal') {
              txt.push("\"" + triple[x].value + "\"")
            }
          })
          this.outputText += txt[0] + ' ' + txt[1] + ' ' + txt[2] + ' .\n'
        }
      })

    })
  }

  
}
