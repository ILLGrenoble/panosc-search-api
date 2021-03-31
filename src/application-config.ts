export class ApplicationConfig {
  database: {
    type: string;
    host: string;
    port: string;
    userName: string;
    password: string;
    name: string;
    schema: string;
    synchronize: boolean;
    logging: boolean;
  };

  logging: {
    level: string;
  };

  constructor(data?: Partial<ApplicationConfig>) {
    Object.assign(this, data);
  }
}

let applicationConfig: ApplicationConfig;

export function APPLICATION_CONFIG(): ApplicationConfig {
  if (applicationConfig == null) {
    applicationConfig = {
      database: {
        type: process.env.SEARCH_API_DATABASE_TYPE,
        host: process.env.SEARCH_API_DATABASE_HOST,
        port: process.env.SEARCH_API_DATABASE_PORT,
        userName: process.env.SEARCH_API_DATABASE_USERNAME,
        password: process.env.SEARCH_API_DATABASE_PASSWORD,
        name: process.env.SEARCH_API_DATABASE_NAME,
        schema: process.env.SEARCH_API_DATABASE_SCHEMA,
        synchronize: process.env.SEARCH_API_DATABASE_SYNCHRONIZE === 'true',
        logging: process.env.SEARCH_API_DATABASE_LOGGING === 'true'
      },
      logging: {
        level: process.env.SEARCH_API_LOG_LEVEL
      }
    };
  }

  return applicationConfig;
}
