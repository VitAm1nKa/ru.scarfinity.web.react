import React        from 'react';
import {connect}    from 'react-redux';
import update       from 'immutability-helper';

import {
    BasicInput,
    PhoneInput,
    EmailInput
}                   from '../utility/input';
import {
    BasicButton
}                   from '../utility/buttons';
import {
    PageHeader
}                   from '../utility/titles';

import {
    BreadCrumb
}                   from '../navigation/bread-crumbs';

import Paper        from 'material-ui/Paper';

import Validate     from '../../lib/validation';
import * as Grid    from '../../lib/grid';

class Controller extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            firstname: props.person.firstName,
            lastname: props.person.lastName,
            phone: props.person.phone,
            email: props.person.email,
            validationModel: {
                lastname: {
                    validation: [
                        {type: 'required'},
                        {type: 'regexp', value: /^[a-zа-я ,.'-]+$/i}
                ]},
                firstname: {
                    validation: [
                        {type: 'required'},
                        {type: 'regexp', value: /^[a-zа-я ,.'-]+$/i}
                ]},
                email: {
                    validation: [
                        {type: 'required'},
                        {type: 'email'}
                ]},
                phone: {
                    validation: [
                        {type: 'required'},
                        {type: 'length', value: 18}
                ]}
            }
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        console.log(inputName, inputValue);

        this.setState({
            [inputName]: inputValue,
            validationModel: update(this.state.validationModel, {[inputName]: {$merge: {
                valid: true ? Validate(inputValue, this.state.validationModel[inputName].validation) : null
            }}})
        });
    }

    render() {
        return(
            <Grid.VerticalGrid>
                <BreadCrumb seo='personal-data' title='Персональные данные' />
                <PageHeader title="Персональные данные" />
                <Paper className="personal-paper">
                    <Grid.VerticalGrid>
                        <BasicInput
                            name="lastname"
                            value={this.state.lastname}
                            onChange={this.handleChange}
                            valid={this.state.validationModel.lastname}
                            placeholder="Фамилия"/>
                        <BasicInput
                            name="firstname"
                            value={this.state.firstname}
                            onChange={this.handleChange}
                            valid={this.state.validationModel.firstname}
                            placeholder="Имя"/>
                        <PhoneInput
                            name="phone"
                            value={this.state.phone}
                            onChange={this.handleChange}
                            valid={this.state.validationModel.phone}
                            placeholder="Телефон"/>
                        <BasicInput
                            name="email"
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            valid={this.state.validationModel.email}
                            placeholder="E-mail"/>
                        <Grid.Row className={"personal-data-bottom"}>
                            <Grid.Container>
                                <Grid.Col lg={12} md={12}>
                                </Grid.Col>
                                <Grid.Col lg={4} md={4}>
                                <BasicButton 
                                    title="Сохранить изменения"
                                    onClick={() => {}}/>
                                </Grid.Col>
                            </Grid.Container>
                        </Grid.Row>
                    </Grid.VerticalGrid>
                </Paper>
            </Grid.VerticalGrid>
        )
    }
}

export default connect(
    state => state.person
)(Controller);