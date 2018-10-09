// DataStore is mostly recommended for use in the browser
import {
  DataStore,
  utils
} from 'js-data'
import { HttpAdapter } from 'js-data-http';
import * as relations from './Relations';
import * as schemas from './Schemas';


// function convertToDate(record: any): Date {
//   if (typeof record.created_at === 'string') {
//     record.created_at = new Date(record.created_at)
//   }
//   if (typeof record.updated_at === 'string') {
//     record.updated_at = new Date(record.updated_at)
//   }
//   return new Date();
// }

export const adapter = new HttpAdapter({
  // Our API sits behind the /api path
  basePath: '/api'
})
export const store = new DataStore({
  mapperDefaults: {
    // // Override the original to make sure the date properties are actually Date
    // // objects
    // createRecord(props: any, opts: any): any {
    //   const result = this.constructor.prototype.createRecord.call(this, props, opts);
    //   if (Array.isArray(result)) {
    //     result.forEach(convertToDate)
    //   } else if ((this as any).is(result)) {
    //     convertToDate(result)
    //   }
    //   return result
    // }
  }
});

store.registerAdapter('http', adapter, { default: true });

// The User Resource
export const User = store.defineMapper('user', {
  // Our API endpoints use plural form in the path
  endpoint: 'users',
  relations: relations.user,
  schema: schemas.UserSchema,
  getLoggedInUser() {
    if (this.loggedInUser) {
      return utils.resolve(this.loggedInUser)
    }
    return store.getAdapter('http').GET('/api/users/loggedInUser')
      .then((response: any) => {
        const user = this.loggedInUser = response.data
        if (user) {
          this.loggedInUser = store.add('user', user)
        }
        return this.loggedInUser
      })
  }
});

export const Workflow = store.defineMapper('workflow', {
  // Our API endpoints use plural form in the path
  endpoint: 'workflows',
  idAttribute: 'workflowUUID',
  relations: relations.workflow,
  schema: schemas.WorkflowSchema,
  wrap(data: any, opts: any) {
    if (opts.op === 'afterFindAll') {
      const result: any = [];
      if (data) {
        data.forEach((workflow: any) => {
          const workflowData: any = { ...workflow };
          if (workflow.nodes != null) {
            workflowData.edges = [];
            workflow.nodes.forEach((node: any) => {
              workflowData.edges.push(node.outBoundEdges.map((edge: any) => {
                return {
                  handleText: edge.priority,
                  source: node.nodeUUID,
                  target: edge.toNodeUUID,
                  type: edge.type
                };
              }));
            });
            // convert nodes object to nodes array
            const nodesArr = Object.keys(workflowData.nodes).map((node: any) => {
              const viewData = JSON.parse(node.meta).viewData;
              node.x = viewData.x;
              node.y = viewData.y;
              return node;
            });
            workflowData.nodes = [...nodesArr];
          }
          result.push(workflowData);
        });
      }
      return this.createRecord(result);
    } else {
      const result: any = {...data};
      if (data.nodes != null) {
        const nodes = data.nodes;
        result.edges = [];

        Object.keys(nodes).forEach((nodeKey: string) => {
          const node = nodes[nodeKey];
          result.edges = result.edges.concat(Object.keys(node.outBoundEdges).map((edgeKey: string) => {
            const edge = node.outBoundEdges[edgeKey];
            return {
              handleText: edge.priority,
              source: node.nodeUUID,
              target: edge.toNodeUUID,
              type: edge.type
            };
          }));
        });

        // convert nodes object to nodes array
        const nodesArr = Object.keys(data.nodes).map(nodeKey => {
          const node = data.nodes[nodeKey];
          const viewData = JSON.parse(node.meta).viewData;
          node.x = viewData.x;
          node.y = viewData.y;
          return data.nodes[nodeKey];
        });
        result.nodes = [...nodesArr];
      }
      return this.createRecord(result);
    }

  }
});