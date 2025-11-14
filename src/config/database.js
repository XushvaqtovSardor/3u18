import knex from 'knex';
import knexConfig from '../data/knexfile.js';

const db = knex(knexConfig.development);

export default db;
