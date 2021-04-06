import { Application } from '@loopback/core';
import { Client, expect } from '@loopback/testlab';
import { TypeORMDataSource } from '../../datasources';
import { setupApplication } from '../helpers/application.helper';
import { givenInitialisedDatabase } from '../helpers/database.helper';

describe('InstrumentController', () => {
  let app: Application;
  let client: Client;
  let datasource: TypeORMDataSource;

  before('setupApplication', async () => {
    ({ app, client, datasource } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  beforeEach('Initialise Database', function () {
    return givenInitialisedDatabase(datasource);
  });

  const requestUrl = '/api/instruments';

  describe('GET /instruments', () => {
    context('without filter', () => {
      it('should return an array of instruments', (done) => {
        client
          .get(requestUrl)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) throw err;

            expect(res.body).to.be.an.Array();
            res.body.forEach((instrument) => {
              expect(instrument).to.have.property('pid');
              expect(instrument).to.have.property('name');
              expect(instrument).to.have.property('facility');
              expect(instrument).to.have.property('score');
            });
            done();
          });
      });
    });

    context('where name is equal to LoKI', () => {
      it('should return an array of instruments matching the query', (done) => {
        const filter = JSON.stringify({
          where: {
            name: 'LoKI'
          }
        });
        client
          .get(requestUrl + '?filter=' + filter)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) throw err;

            expect(res.body).to.be.an.Array();
            res.body.forEach((instrument) => {
              expect(instrument).to.have.property('pid');
              expect(instrument).to.have.property('name');
              expect(instrument.name).to.equal('LoKI');
              expect(instrument).to.have.property('facility');
              expect(instrument).to.have.property('score');
            });
            done();
          });
      });
    });

    context('where facility is equal to ESS, with pagination', () => {
      it('should return an array of instruments matching the query', (done) => {
        const filter = JSON.stringify({
          where: {
            facility: 'ESS'
          },
          skip: 0,
          limit: 3
        });
        client
          .get(requestUrl + '?filter=' + filter)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) throw err;

            expect(res.body).to.be.an.Array();
            expect(res.body.length).to.equal(3);
            res.body.forEach((instrument) => {
              expect(instrument).to.have.property('pid');
              expect(instrument).to.have.property('name');
              expect(instrument).to.have.property('facility');
              expect(instrument.facility).to.equal('ESS');
              expect(instrument).to.have.property('score');
            });
            done();
          });
      });
    });
  });

  describe('GET /instruments/{id}', () => {
    it('should return the instrument with the requested pid', (done) => {
      client
        .get(requestUrl + '/' + encodeURIComponent('20.500.12269/0f98fcf2-7bd7-430e-ad20-d47031ca8f71'))
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body).to.have.property('pid');
          expect(res.body['pid']).to.equal('20.500.12269/0f98fcf2-7bd7-430e-ad20-d47031ca8f71');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('facility');
          done();
        });
    });
  });
});
