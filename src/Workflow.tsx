import * as PropTypes from 'prop-types';
import * as React from 'react';
import { GraphView } from 'react-digraph';
import GraphConfig from './graphConfig';
import { store } from './Store';

import './Workflow.css';

interface IWorkflowProps {
  match: any;
}

interface IWorkflowState {
  workflow: any;
}

export default class Workflow extends React.Component<IWorkflowProps, IWorkflowState>{
  public static contextTypes = {
    router: PropTypes.object.isRequired
  };
  constructor(props: IWorkflowProps) {
    super(props);
    store.find('workflow', this.props.match.params.uuid, { with: ['user'] });
    this.state = this.getState();
  }

  public componentDidUpdate(prevProps: IWorkflowProps) {
    if (prevProps.match.params.uuid !== this.props.match.params.uuid) {
      // store.find('workflow', this.props.match.params.uuid, { with: ['user'] });
    }
  }
  public componentDidMount() {
    store.on('all', this.onChange);
  }
  public componentWillUnmount() {
    store.off('all', this.onChange);
  }
  public onChange = () => {
    console.log("onChange");
    this.setState(this.getState());
  }

  public getState() {
    console.log(store.get('workflow', this.props.match.params.uuid));
    return {
      workflow: store.get('workflow', this.props.match.params.uuid) || null
    }
  }

  public render() {
    const { workflow } = this.state;
    console.log(workflow);
    const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;

    if (!workflow) {
      return <div>Workflow not found!</div>;
    }

    console.log(workflow.nodes, workflow.edges, NodeTypes, NodeSubtypes, EdgeTypes);

    return (
      <div className="workflow">
        <div>{workflow.name}</div>
        {workflow.user && (
          <React.Fragment>
            <div>{workflow.user.name}</div>
            <div>{workflow.user.email}</div>
          </React.Fragment>
        )}
        {workflow.nodes && <GraphView
          nodes={workflow.nodes}
          edges={workflow.edges}
          nodeKey="nodeUUID"
          readOnly={true}
          nodeTypes={NodeTypes}
          nodeSubtypes={NodeSubtypes}
          edgeTypes={EdgeTypes}
        />}
      </div>
    )
  }
}
