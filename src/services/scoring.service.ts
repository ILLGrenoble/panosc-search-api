import {bind, BindingScope} from '@loopback/core';
import axios from 'axios';
import {APPLICATION_CONFIG} from '../application-config';
import {Document} from '../models';

@bind({scope: BindingScope.SINGLETON})
export class ScoringService {
  async score(docs: Promise<Document[]>, query: string) {
    const documents = await docs;
    const itemsId = documents.map(x => x.pid);
    try {
      const response = (await axios.post(APPLICATION_CONFIG().scoring.url + 'score', {itemsId: itemsId, query: query})).data;
      response.scores.forEach(element => {
        const docIndex = documents.findIndex(x => x.pid == element.itemId);
        if (docIndex != -1) {
          documents[docIndex].score = element.score;
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
}
