import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { renderGrid, renderCarousel } from '@giphy/js-components';
import { throttle } from 'lodash'

@Component({
  selector: 'app-project-comprehend',
  templateUrl: './project-comprehend.component.html',
  styleUrls: ['./project-comprehend.component.css']
})
export class ProjectComprehendComponent implements OnInit {
  readonly hour: number = 36000;
  response: Observable<SongResponse>;
  jwt: Observable<string>;
  jwtGenDateTime: number
  giphyFetch: GiphyFetch;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.giphyFetch = new GiphyFetch(environment.giphyApiKey);
    this.getToken();
    this.getAnalysis();
  }

  getToken() {
    if (!this.jwtGenDateTime || (Date.now() - this.jwtGenDateTime) > this.hour) {
      this.jwtGenDateTime = Date.now();
      this.jwt = this.http.get<string>(environment.authTokenServiceUrl + encodeURIComponent(environment.authTokenSecret), {
        responseType: 'text' as 'json'
      });
    }
  };

  getAnalysis() {
    this.jwt.subscribe(res => {
      this.response = this.http.get<SongResponse>(environment.textAnalysisServiceUrl, {
        headers: {
          "Authorization": "Bearer " + res
        }
      });

      this.response.subscribe(val => {
        // Gets an array of words in the title ending at the first parenthesis.
        const titleWordArray = val.title.substring(0, val.title.indexOf("("))
          .split(" ").filter(x => x.toLowerCase() != "a" && x.toLowerCase() != "an" && x.toLowerCase() != "the");
        const searchText = titleWordArray.join(" ");
        document.getElementById("giphySearchText").innerHTML = searchText;
        // this.makeGrid(document.getElementById("giphyGrid"), searchText, 15);
        this.makeCarousel(document.getElementById("giphyGrid"), searchText, 15);
      });
    });
  };

  getGifs(searchText: string, numberOfGifs: number) {
    return this.giphyFetch.search(searchText, { limit: numberOfGifs });
  }

  makeGrid(targetEl: HTMLElement, searchText: string, numberOfGifs: number) {
    const render = () => {
      return renderGrid(
        {
          width: innerWidth,
          fetchGifs: () => this.getGifs(searchText, numberOfGifs),
          columns: 2,
          gutter: 6
        },
        targetEl
      )
    };
    const resizeRender = throttle(render, 500);
    window.addEventListener('resize', resizeRender, false);
    const remove = render();
    return {
      remove: () => {
        remove();
        window.removeEventListener('resize', resizeRender, false);
      }
    }
  }

  makeCarousel(mountNode: HTMLElement, searchText: string, numberOfGifs: number) {
    renderCarousel(
      {
        gifHeight: 200,
        fetchGifs: () => this.getGifs(searchText, numberOfGifs),
        gutter: 6,
        user: null
      },
      mountNode
    );
  }
}

class SongResponse {
  title: string;
  song: string;
  sentiment: string;
  url: string;
}
