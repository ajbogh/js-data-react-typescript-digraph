import { Schema  } from 'js-data';

export const UserSchema = new Schema({
  $schema: 'http://json-schema.org/draft-04/schema#', // optional
  description: 'Schema for User records', // optional
  properties: {
    email: { type: 'string' },
    firstName: { type: 'string' },
    id: { type: 'string' },
    lastName: { type: 'string' },
    name: {
      get(): string {
        const self: any = this;
        return `${self.firstName} ${self.lastName}`;
      },
      type: 'string'
    }
  },
  title: 'User', // optional
  type: 'object'
});

export const WorkflowSchema = new Schema({
  properties: {
    allowUserReentry: { type: ['boolean', 'null'] },
    createdAt: { type: 'string' },
    createdAtMillis: { type: 'string' },
    createdByEmail: { type: 'string' },
    createdByUUID: { type: 'string' },
    deletedAt: { type: ['string', 'null'] },
    deletedAtMillis: { type: ['string', 'null'] },
    description: { type: ['string', 'null'] },
    // edges: { type: ['array', 'null'] },
    exitEdges: { type: ['array', 'null'] },
    filters: { type: ['string', 'null'] },
    flushedAt: { type: ['string', 'null'] },
    flushedAtMillis: { type: ['string', 'null'] },
    flushingHistory: { type: ['array', 'null'] },
    meta: { type: 'object' },
    metaData: { type: 'object' },
    name: { type: 'string' },
    nodes: { type: ['array', 'null'] },
    // outBoundEdges: { type: ['object', 'null'] },
    preconditionEdges: { type: ['array', 'null'] },
    priority: { type: ['number', 'null'] },
    rootUUID: { type: ['string', 'null'] },
    state: { type: 'number' },
    status: { type: 'string' },
    type: { type: 'string' },
    updatedAt: { type: 'string' },
    updatedAtMillis: { type: 'string' },
    uuid: { type: 'string' },
    version: { type: ['number', 'null'] },
    workflowUUID: { type: 'string', indexed: true }
  },
  type: 'object'
});