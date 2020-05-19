import { Injectable } from '@angular/core';
import { Connection, ConnectionOptions, createConnection, Repository } from 'typeorm';
import { Settings } from './settings';
import { Experiment } from '../../models/experiment.entity';
import { Test } from '../../models/test.entity';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public connection: Promise<Connection>;
  private readonly options: ConnectionOptions;

  constructor() {
    Settings.initialize();
    this.options = {
      type: 'sqlite',
      database: Settings.dbPath,
      entities: [Experiment, Test],
      synchronize: true,
      logging: 'all',
    };
    this.connection = createConnection(this.options);
  }

  async getLatestExperiments() {
    return (await this.connection).getRepository(Experiment)
      .createQueryBuilder("experiment")
      .orderBy("dateLastModify", "DESC")
      .limit(3).getMany()
  }
}
