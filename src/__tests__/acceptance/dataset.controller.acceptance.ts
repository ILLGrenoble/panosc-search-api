import { Application } from '@loopback/core';
import { Client, expect } from '@loopback/testlab';
import { TypeORMDataSource } from '../../datasources';
import { setupApplication } from '../helpers/application.helper';
import { givenInitialisedDatabase } from '../helpers/database.helper';

describe('DatasetController', () => {
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

  const requestUrl = '/api/datasets';

  describe('GET /datasets', () => {
    context('without filter', () => {
      it('should return en array of datasets', (done) => {
        client
          .get(requestUrl)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) throw err;

            expect(res.body).to.be.an.Array();
            res.body.forEach((dataset) => {
              expect(dataset).to.have.property('pid');
              expect(dataset).to.have.property('title');
              expect(dataset).to.have.property('isPublic');
              expect(dataset).to.have.property('creationDate');
              expect(dataset).to.have.property('score');
            });
            done();
          });
      });
    });

    context('where technique is x-ray absorption', () => {
      it('should return en array of datasets matching the technique', (done) => {
        const filter = JSON.stringify({
          include: [
            {
              relation: 'techniques',
              scope: {
                where: {
                  name: 'x-ray absorption'
                }
              }
            }
          ]
        });
        client
          .get(requestUrl + '?filter=' + filter)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) throw err;

            expect(res.body).to.be.an.Array();
            expect(res.body.length).to.equal(2);
            res.body.forEach((dataset) => {
              expect(dataset).to.have.property('pid');
              expect(dataset).to.have.property('title');
              expect(dataset).to.have.property('isPublic');
              expect(dataset).to.have.property('creationDate');
              expect(dataset).to.have.property('score');
              expect(dataset).to.have.property('techniques');
              expect(dataset.techniques).to.be.an.Array().and.not.empty;
              dataset.techniques.forEach((technique) => {
                expect(technique.name).to.equal('x-ray absorption');
              });
            });
            done();
          });
      });
    });

    context('where parameters has a photon energy in the range 880-990 eV', () => {
      it('should return en array of datasets matching the parameter', (done) => {
        const filter = JSON.stringify({
          include: [
            {
              relation: 'parameters',
              scope: {
                where: {
                  and: [
                    {
                      name: 'photon_energy'
                    },
                    {
                      value: {
                        between: [880, 990]
                      }
                    },
                    {
                      unit: 'eV'
                    }
                  ]
                }
              }
            }
          ]
        });
        client
          .get(requestUrl + '?filter=' + filter)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) throw err;

            expect(res.body).to.be.an.Array();
            expect(res.body.length).to.equal(1);
            res.body.forEach((dataset) => {
              expect(dataset).to.have.property('pid');
              expect(dataset).to.have.property('title');
              expect(dataset).to.have.property('isPublic');
              expect(dataset).to.have.property('creationDate');
              expect(dataset).to.have.property('score');
              expect(dataset).to.have.property('parameters');
              expect(dataset.parameters).to.be.Array().and.not.empty;
              dataset.parameters.forEach((parameter) => {
                expect(parameter.name).to.equal('photon_energy');
                expect(parameter.value).to.be.within(880, 990);
                expect(parameter.unit).to.equal('eV');
              });
            });
            done();
          });
      });
    });

    context('where parameters includes a solid sample containing copper', () => {
      it('should return en array of datasets matching the parameter', (done) => {
        const filter = JSON.stringify({
          include: [
            {
              relation: 'parameters',
              scope: {
                where: {
                  or: [
                    {
                      and: [
                        {
                          name: 'sample_state'
                        },
                        {
                          value: 'solid'
                        }
                      ]
                    },
                    {
                      and: [
                        {
                          name: 'chemical_formula'
                        },
                        {
                          value: 'Cu'
                        }
                      ]
                    }
                  ]
                }
              }
            }
          ]
        });
        client
          .get(requestUrl + '?filter=' + filter)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) throw err;

            expect(res.body).to.be.an.Array();
            expect(res.body.length).to.equal(1);
            res.body.forEach((dataset) => {
              expect(dataset).to.have.property('pid');
              expect(dataset).to.have.property('title');
              expect(dataset).to.have.property('isPublic');
              expect(dataset).to.have.property('creationDate');
              expect(dataset).to.have.property('score');
              expect(dataset).to.have.property('parameters');
              expect(dataset.parameters).to.be.Array().and.not.empty;
              expect(dataset.parameters[0].name).to.equal('chemical_formula');
              expect(dataset.parameters[0].value).to.equal('Cu');
              expect(dataset.parameters[1].name).to.equal('sample_state');
              expect(dataset.parameters[1].value).to.equal('solid');
            });
            done();
          });
      });
    });

    context('where parameters has a temperature below 80 °C', () => {
      it('should return en array of datasets matching the parameter', (done) => {
        const filter = JSON.stringify({
          include: [
            {
              relation: 'parameters',
              scope: {
                where: {
                  and: [
                    {
                      name: 'temperature'
                    },
                    {
                      value: {
                        lt: 80
                      }
                    },
                    {
                      unit: 'celsius'
                    }
                  ]
                }
              }
            }
          ]
        });
        client
          .get(requestUrl + '?filter=' + filter)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) throw err;

            expect(res.body).to.be.an.Array();
            expect(res.body.length).to.equal(1);
            res.body.forEach((dataset) => {
              expect(dataset).to.have.property('pid');
              expect(dataset).to.have.property('title');
              expect(dataset).to.have.property('isPublic');
              expect(dataset).to.have.property('creationDate');
              expect(dataset).to.have.property('score');
              expect(dataset).to.have.property('parameters');
              expect(dataset.parameters).to.be.Array().and.not.empty;
              dataset.parameters.forEach((parameter) => {
                expect(parameter.name).to.equal('temperature');
                expect(parameter.value).to.be.lessThan(80);
                expect(parameter.unit).to.equal('celsius');
              });
            });
            done();
          });
      });
    });

    // context('where file matches text `file1`', () => {
    //   it('should return en array of datasets matching the query', (done) => {
    //     const filter = JSON.stringify({
    //       include: [
    //         {
    //           relation: 'files',
    //           scope: {
    //             where: {
    //               text: 'file1'
    //             }
    //           }
    //         }
    //       ]
    //     });
    //     client
    //       .get(requestUrl + '?filter=' + filter)
    //       .set('Accept', 'application/json')
    //       .expect(200)
    //       .expect('Content-Type', /json/)
    //       .end((err, res) => {
    //         if (err) throw err;

    //         expect(res.body).to.be.an.Array();
    //         expect(res.body.length).to.equal(1);
    //         res.body.forEach((dataset) => {
    //           expect(dataset).to.have.property('pid');
    //           expect(dataset).to.have.property('title');
    //           expect(dataset).to.have.property('isPublic');
    //           expect(dataset).to.have.property('creationDate');
    //           expect(dataset).to.have.property('score');
    //           expect(dataset).to.have.property('files');
    //           expect(dataset.files).to.be.Array().and.not.empty;
    //           dataset.files.forEach((file) => {
    //             expect(file.name).to.match('file1');
    //           });
    //         });
    //         done();
    //       });
    //   });
    // });
  });

  describe('GET /datasets/{id}', () => {
    it('should return the dataset with the requested id', (done) => {
      client
        .get(requestUrl + '/' + encodeURIComponent('20.500.12269/panosc-dataset1'))
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body).to.have.property('pid');
          expect(res.body['pid']).to.equal('20.500.12269/panosc-dataset1');
          expect(res.body).to.have.property('title');
          expect(res.body).to.have.property('isPublic');
          expect(res.body).to.have.property('creationDate');
          done();
        });
    });
  });
});
