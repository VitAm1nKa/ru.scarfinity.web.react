import React from 'react';

import { fetch, addTask }   from 'domain-task';
import __request            from '../store/__request';
import update               from 'immutability-helper';

import Layout               from './__layout';
import * as Grid            from '../lib/grid';

import { 
    BasicInput,
    TextArea,
    SelectInput
}                           from '../components/utility/input';
import Divider              from 'material-ui/Divider';
import RaisedButton         from 'material-ui/RaisedButton';

const Category = {
    title: "",
    description: "",
    seo: "",
    seoDescription: "",
    parentId: 0,
    sortOrder: 0,
    columns: 0
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = Category;
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {

    }

    categoryNumber() {
        if(this.props.match.params.id == 'new') {
            return "Новая"
        }
        
        return this.props.match.params.id;
    }

    handleChange(event, type) {
        this.setState(Object.assign({}, {[type]: event.target.value}));
    }

    saveCategory() {
        __request({
            method: 'POST',
            url: `api/catalogPage`,
            body: this.state
        })
        .then(response => response.json())
        .then(({type, data}) => {
            if(type == 'success') {
                this.setState(Category);
            }
        });
    }

    render() {
        return(
            <Layout title={`Категория (#${this.categoryNumber()})`}>
                <Grid.VerticalGrid>
                    {/* General Start*/}
                    <Grid.Row>
                        <Grid.Container>
                            <Grid.Col>
                                <h3>Основное</h3>
                            </Grid.Col>
                            <Grid.Col lg={8} md={8}>
                                <BasicInput
                                    value={this.state.title}
                                    placeholder={"Название"}
                                    onChange={e => {this.handleChange(e, "title")}}/>
                                <BasicInput
                                    value={this.state.seo}
                                    placeholder={"Seo"}
                                    onChange={e => this.handleChange(e, "seo")}/>
                                <TextArea
                                    value={this.state.description}
                                    placeholder={"Описание"}
                                    onChange={e => this.handleChange(e, "description")}/>
                            </Grid.Col>
                            <Grid.Col lg={8} md={8}>
                                <BasicInput
                                    value={this.state.parentId}
                                    placeholder={"Родительский каталог"}
                                    onChange={e => this.handleChange(e, "parentId")}/>
                                <BasicInput
                                    value={this.state.sortOrder}
                                    placeholder={"Сортировка"}
                                    onChange={e => this.handleChange(e, "sortOrder")}/>
                                <TextArea
                                    value={this.state.seoDescrition}
                                    placeholder={"Seo описание"}
                                    onChange={e => this.handleChange(e, "seoDescrition")}/>
                            </Grid.Col>
                            <Grid.Col style={{textAlign: "right"}}>
                                <RaisedButton
                                    primary
                                    label={"Сохранить"}
                                    onClick={this.saveCategory.bind(this)}/>
                            </Grid.Col>
                        </Grid.Container>
                    </Grid.Row>
                </Grid.VerticalGrid>
            </Layout>
        )
    }
}

export default Controller;
