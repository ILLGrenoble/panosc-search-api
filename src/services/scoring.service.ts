import {bind, BindingScope} from '@loopback/core';
import axios from 'axios';
import {APPLICATION_CONFIG} from '../application-config';
import {Document} from '../models';
import {errMsg} from '../utils';

interface Score {
  itemId: string,
  score: number,
}

@bind({scope: BindingScope.SINGLETON})
export class ScoringService {
  async score(documents: Document[], query: string): Promise<void> {
    try {
      // Get all documents IDs
      const documentIds = documents.map(document => document.pid);

      // Get scores from PSS
      const response = await axios.post(APPLICATION_CONFIG().scoring.url + 'score', {itemsId: documentIds, query: query});
      const scores: Score[] = response.data.scores;

      // Put all scores back into the documents
      scores.forEach((element: Score) => {
        const document = documents.find(document => document.pid === element.itemId);
        if (document) {
          document.score = element.score;
        }
      });

    } catch (error) {
      throw new Error(`Failed to get scores: ${errMsg(error)}`)
    }
  }
}
