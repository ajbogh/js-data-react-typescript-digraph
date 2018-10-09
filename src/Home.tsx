import * as moment from 'moment';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { store } from './Store';

interface IHomeProps {
  match: any;
  history: any;
}

interface IHomeState {
  hoverIndex?: number;
  workflows: any[];
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
  public static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props: IHomeProps) {
    super(props);
    store.findAll('workflow', { with: ['user'] });
    this.state = this.getState();
  }

  public componentDidMount () {
    store.on('all', this.onChange);
  }

  public componentWillUnmount () {
    store.off('all', this.onChange);
  }

  public onChange = () => {
    this.setState(this.getState());
  }

  public getState() {
    return {
      workflows: store.getAll('workflow') || null
    };
  }

  public getRowColor(index: number) {
    const { hoverIndex } = this.state;
    if (index === hoverIndex) {
      return 'lightblue';
    }
    return (index % 2 === 0 ? 'white' : 'lightgrey');
  }

  public onHover = (e: React.SyntheticEvent<Element>) => {
    const target: HTMLElement = e.target as HTMLElement;
    this.setState({
      hoverIndex: target.dataset.index ? parseInt(target.dataset.index, 10) : undefined
    });
  };
  public offHover = (e: React.SyntheticEvent<Element>) => {
    this.setState({
      hoverIndex: undefined
    });
  };

  public navigateToWorkflow = (e: React.SyntheticEvent<Element>) => {
    const target: HTMLElement = e.target as HTMLElement;
    if (target.parentElement && target.parentElement.dataset.uuid) {
      this.props.history.push(`/workflow/${target.parentElement.dataset.uuid}`);
    }

  };

  public renderCampaignList() {
    if (!this.state.workflows) {
      return null;
    }

    return <React.Fragment>
      {this.state.workflows.map((workflow, index) => {
        return <tr key={workflow.workflowUUID} style={{
          background: this.getRowColor(index)
        }} data-index={index}
          data-uuid={workflow.uuid}
          onMouseOver={this.onHover}
          onMouseOut={this.offHover}
          onClick={this.navigateToWorkflow}>
          <td data-index={index} >{workflow.name}</td>
          <td data-index={index} >{(workflow.user ? workflow.user.name : null)}</td>
          <td data-index={index} >{moment(workflow.createdAt).format('MMM YYYY')}</td>
          <td data-index={index} >{moment(workflow.updatedAt).format('MMM YYYY')}</td>
        </tr>
      })}
    </React.Fragment>;
  }

  public render () {
    return (
      <div className="Home">
        <table style={{ border: '1px solid lightgrey'}}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created By</th>
              <th>Date Created</th>
              <th>Date Updated</th>
            </tr>
          </thead>
          <tbody>
            {this.renderCampaignList()}
          </tbody>
        </table>
      </div>
    )
  }
}