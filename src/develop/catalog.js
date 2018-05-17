import React                from 'react';
import { connect }          from 'react-redux';
import { NavLink }          from 'react-router-dom';

import { fetch, addTask }   from 'domain-task';
import __request            from '../store/__request';
import update               from 'immutability-helper';

import RaisedButton         from 'material-ui/RaisedButton';
import FlatButton           from 'material-ui/FlatButton';
import Dialog               from 'material-ui/Dialog';
import TextField            from 'material-ui/TextField';
import Divider              from 'material-ui/Divider';

class DialogController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    handleOpen() {
        this.setState({open: true});
    };
    
    handleAdd() {
        this.setState({
            open: false
        }, () => {
            let fetchTask = 
                __request({
                    method: 'POST',
                    url: `api/catalogPage`,
                    body: {
                        title: this.titleString || "",
                        seo: this.seoString || "",
                        parentCatalogPage: this.props.catalogPageId
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if(data.type == 'success') {
                        this.props.onSuccess(data.data);
                    } else {
                        this.props.onError(data.type);
                    }
                });
        });
    }

    handleClose() {
        this.setState({open: false});
    };

    render() {
        const actions = [
            <FlatButton
                label="Отмена"
                primary={true}
                onClick={this.handleClose}
            />,       
            <FlatButton
                label="Добавить"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleAdd}
            />, 
        ]

        return(
            <div>
                <Dialog 
                    title={"Добавление новой страницы каталога"}
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}>
                        <TextField
                            onChange={(e, v) => {this.titleString = v}}
                            hintText="Название"
                            floatingLabelText="Название"/>
                        <Divider />
                        <TextField
                            onChange={(e, v) => {this.seoString = v}}
                            hintText="Seo"
                            floatingLabelText="Seo"/>
                        <Divider />
                </Dialog>
                <RaisedButton
                    label="Добавить"
                    secondary={true}
                    disabled={this.state.loading}
                    onClick={this.handleOpen}/>
            </div>
        )
    }
}

const TableView = (props) => {
    return(
        <div>
            <h3>{props.title}<span>&nbsp;{props.path}</span></h3>
            <table>
                <tbody>
                    <tr>
                        <th>Title</th>
                        <th>Seo</th>
                        <th>Path</th>
                        <th>Перейти</th>
                    </tr>
                    {
                        _.map(props.nodes, (node, index) =>
                            <tr key={index}>
                                <td><NavLink to={`/dev/catalog/${node.id}`}>{node.title}</NavLink></td>
                                <td>{node.seo}</td>
                                <td>{node.path}</td>
                                <td>+</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: null,
            open: false
        }
    }

    componentWillMount() {
        this.state.catalogPageId = this.props.match.params.id || 2;
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        this.state.catalogPageId = nextProps.match.params.id || 2;
        this.loadData();
    }

    loadData(pageId = 1) {
        this.setState({
            loading: true
        }, () => {
            let fetchTask = 
                __request({
                    method: 'GET',
                    url: `api/catalogPage/${this.state.catalogPageId}`
                })
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        loading: false,
                        data: data.data
                    });
                });

            addTask(fetchTask);
        });
    }

    postMessage(message, messageType = '') {
        this.setState({
            message: message,
            messageType: messageType
        }, () => {
            setTimeout(() => {
                this.setState({
                    message: null
                })
            }, 2500)
        });
    }

    handleSuccessAdd(data) {
        this.setState({
            data: update(this.state.data, {nodes: {$push: [data]}})
        }, () => {
            console.log(this.state.data);
        });
        this.postMessage('success', '');
    }

    handleErrorAdd(type) {
        this.postMessage(`Error: ${type}`, '');
    }

    render() {
        return(
            <div>
                {
                    this.state.loading ? <div>Загрузка</div> :
                    <TableView {...this.state.data}/>
                }
                <div className="catalog-bottom-row">
                    <span className="develop-catalog-message">
                        {
                            this.state.message != null &&
                            this.state.message
                        }
                    </span>
                    <DialogController
                        catalogPageId={this.state.catalogPageId}
                        onSuccess={this.handleSuccessAdd.bind(this)}
                        onError={this.handleErrorAdd.bind(this)}/>
                </div>
            </div>
        )
    }
}

const mstp = (state, ownProps) => {
    return {
        
    }
}

const mdtp = (dispatch) => {
    return {
        
    }
}

export default connect(mstp, mdtp)(Controller);