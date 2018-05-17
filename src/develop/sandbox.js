import React                from 'react';
import qs                   from 'qs';
import {Route}              from 'react-router-dom';

import { fetch, addTask }   from 'domain-task';
import __request            from '../store/__request';
import update               from 'immutability-helper';

import * as Grid            from '../lib/grid';

import Quantity             from '../components/utility/quantity';

import StoreTest            from './store-test';

var Hammer =                require('react-hammerjs');

import { 
    BasicInput,
    NameInput,
    EmailInput,
    PhoneInput,
    SelectInput,
    SearchInputCity,
    SearchInputAddress,
    Dropdown
}                           from '../components/utility/input';

import * as Validation      from '../lib/validation';

import './sandbox.less';

import * as TabView         from '../components/utility/tab-view';
import ReviewsContainer     from '../components/reviews/reviews-container';
import InfoList             from '../components/utility/info-list';

import SnackBar             from '../components/utility/snack-bar';

import {ProductCartButton}  from '../components/utility/buttons';

import Currency             from '../components/utility/currency';

import CartPopup            from '../components/utility/cart-popup';
import {ProductCardView}    from '../components/utility/cart-popup';

import SignForm             from '../components/utility/sign-form';

import LeftMenu             from '../components/utility/left-menu';

import RCT                  from './reviewCollectionTest';

import MailLine             from "../components/utility/mail-line";

import SocialButton         from '../components/utility/social-button';

import Banner               from '../components/utility/banner';

import Map                  from '../components/utility/map';

import RecenlyViewed        from '../components/recenly-viewed/recenly-viewed-small';

import {RecenlyViewedBlock}    from '../components/utility/recenly-viewed';

import ItemRow              from '../components/utility/item-row';

import ProductRow           from '../components/utility/product-row';

import ValueSwitch          from '../components/utility/value-switch';

import MenuListGrid         from '../components/utility/menu-list-grid';

import SlideContainer       from '../components/utility/slide-container';

import { 
    ButtonChevronRight,
    ProductCartButtonTest
}                           from '../components/utility/buttons';

import Tile                 from '../components/utility/tile';
import GalleryView          from '../components/utility/gallery-view';
import Gallery              from '../components/gallery';

import ImageGalleryLoader   from '../components/utility/image-gallery-loader';
import { ImageGallery } from '../store/__models';

const ModelData = {
    model: "",
    art: "",
    title: "",
    description: "",
    seo: "",
    seoDescription: "",
    sex: 0,
    season: 0,
    year: 17,
    manufacture: "CN",
    brand: "NB",
    materialComposition: "",
    clothingStyle: "",
    size: "",
    additional: ""
}

const ModelValidation = [
    Validation.validationModel({ field: "title", required: true }),
    Validation.validationModel({ field: "model", required: true, maxLength: 6, minLength: 6, regexp: /^\d+$/ }),
    Validation.validationModel({ field: "seo", required: true, regexp: /^\d+$/ }),
]

function Validate({value: inputValue, validation}) {
    let valid = null;
    _.each(validation, ({type, value: validationValue}) => {
        switch(type) {
            case 'required': {
                if(validationValue == false) {
                    valid = true
                } else {
                    valid = inputValue.length > 0
                }
            } break;
            case 'min-length': {
                valid = inputValue.length >= validationValue;
            } break;
            case 'max-length': {
                valid = inputValue.length <= validationValue;
            } break;
            case 'length': {
                valid = inputValue.length == validationValue;
            } break;
            case 'email': {
                var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                valid = regexp.test(inputValue);
            } break;
            case 'regexp': {
                valid = validationValue.test(inputValue);
            } break;
            case 'scope': {
                valid = inputValue.scope === validationValue;
            } break;
        }
    });

    return valid;
}

const TTTT = (props) => {
    return(
        <ul>
            {
                _.map(props.images, (image, index) => {
                    console.log(image.image);
                    return(
                        <li key={index}>
                            <img src={image.image.src} />
                        </li>
                    )
                })
            }
        </ul>
    )
}

class TTT extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageGallery: null
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const imageGallery = new ImageGallery({
            id: 1,
            images: [
                {id: 1, path: 'http://pbs.bento.storage.s3.amazonaws.com/hostedbento-prod/filer_public/Big%20Pacific/Photos/BigPacific_Promo_Thumb.jpg'},
                {id: 2, path: 'https://pp.userapi.com/c834203/v834203702/afbf5/a7iPxpQPpVg.jpg'},
                {id: 3, path: 'http://zoompf.com/wp-content/uploads/2015/04/rose-301406_640.jpg'}
            ]
        });

        this.setState({imageGallery});
    }

    render() {
        return(
            <div>
                <ImageGalleryLoader imageGallery={this.state.imageGallery}>
                    <TTTT />
                </ImageGalleryLoader>
                <button onClick={this.handleClick}>{"CLICKKKK"}</button>
            </div>
        )
    }
}

const Hohoho = (props) => {
    function omo(e) {
        console.log(e);
        e.target.classList.remove('hover');
    }

    return(
        <div
            className="hohoho" onMouseUp={omo}>
        </div>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            inCart: false,
            data: {
                country: {value: '', validation: [{type: 'required'}]},
                city: {value: '', validation: [
                    {type: 'required'},
                    {type: 'scope', value: 'GOOGLE'}
                ]},
                address: {value: '', validation: [{type: 'required'}]},
                lastname: {value: '', validation: [
                    {type: 'required'},
                    {type: 'regexp', value: /^[a-zа-я ,.'-]+$/i}
                ]},
                firstname: {value: '', validation: [
                    {type: 'required'},
                    {type: 'regexp', value: /^[a-zа-я ,.'-]+$/i}
                ]},
                email: {value: '', validation: [
                    {type: 'required'},
                    {type: 'email'}
                ]},
                phone: {value: '', validation: [
                    {type: 'required'},
                    {type: 'length', value: 18}
                ]},
                test: {value: ''}
            },
            products: [],
            sliderOpen: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleValidate = this.handleValidate.bind(this);
        this.handleInterval = this.handleInterval.bind(this);
        this.handleSliderToggle = this.handleSliderToggle.bind(this);
    }

    handleChange(event) {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        this.setState({
            data: update(this.state.data, {[inputName]: {$merge: {
                value: inputValue,
                valid: false ? Validate(data[inputName]) : null
            }}})
        });
    }

    handleValidate() {
        let valid = true;

        _.forIn(this.state.data, (value, key) => {
            const itemValid = Validate(value);
            valid = (itemValid == null ? true : itemValid) && valid;
            this.state.data = update(this.state.data, {[key]: {$merge: {valid: itemValid}}})
        })

        this.setState({
            modelValid: valid
        });

        return valid;
    }

    componentWillMount() {
        this.setState({
            review: <ReviewsContainer reviewsCollectionId={1}/>
        });
    }

    handleInterval(e) {
        console.log(e);
    }

    hb() {
        // this.setState({inCart: true});
        setTimeout(() => {this.setState({inCart: true})}, 2000)
        // this.setState({inCart: true});
    }

    handleSliderToggle() {
        this.setState({sliderOpen: !this.state.sliderOpen});
    }

    render() {
        const options = [{id: 1, value: 'Russia'}]
        const infoListItems = [
            {title: "Категория", value: "Женщинам"},
            {title: "Пол", value: "Женский"},
            {title: "Артикул", value: "АРТ123"},
            {title: "Страна производства", value: "Китай"}
        ]

        const productRowItems = [
            {title: "Шарф-хомут 1"},
            {title: "Шарф-хомут 2"},
            {title: "Шарф-хомут 3"},
            {title: "Шарф-хомут 4"},
            {title: "Шарф-хомут 5"},
            {title: "Шарф-хомут 6"},
            {title: "Шарф-хомут 7"},
            {title: "Шарф-хомут 8"}
        ]

        console.log(this.state.products);

        return(
            <div>
                <button onClick={this.handleSliderToggle}>{"Слайдер"}</button>
                <SlideContainer open={this.state.sliderOpen}>
                    <p>Ullamco nulla sit labore culpa voluptate dolore amet fugiat in irure adipisicing deserunt commodo. Adipisicing labore tempor ex ullamco voluptate exercitation non est labore commodo ipsum anim. Cillum consequat excepteur magna Lorem incididunt veniam in eu laborum minim. Nostrud qui magna laborum aliquip qui exercitation culpa reprehenderit anim culpa pariatur ipsum dolor nostrud.</p>
                    <p>Ullamco nulla sit labore culpa voluptate dolore amet fugiat in irure adipisicing deserunt commodo. Adipisicing labore tempor ex ullamco voluptate exercitation non est labore commodo ipsum anim. Cillum consequat excepteur magna Lorem incididunt veniam in eu laborum minim. Nostrud qui magna laborum aliquip qui exercitation culpa reprehenderit anim culpa pariatur ipsum dolor nostrud.</p>
                    <p>Ullamco nulla sit labore culpa voluptate dolore amet fugiat in irure adipisicing deserunt commodo. Adipisicing labore tempor ex ullamco voluptate exercitation non est labore commodo ipsum anim. Cillum consequat excepteur magna Lorem incididunt veniam in eu laborum minim. Nostrud qui magna laborum aliquip qui exercitation culpa reprehenderit anim culpa pariatur ipsum dolor nostrud.</p>
                    <p>Ullamco nulla sit labore culpa voluptate dolore amet fugiat in irure adipisicing deserunt commodo. Adipisicing labore tempor ex ullamco voluptate exercitation non est labore commodo ipsum anim. Cillum consequat excepteur magna Lorem incididunt veniam in eu laborum minim. Nostrud qui magna laborum aliquip qui exercitation culpa reprehenderit anim culpa pariatur ipsum dolor nostrud.</p>
                    <p>Ullamco nulla sit labore culpa voluptate dolore amet fugiat in irure adipisicing deserunt commodo. Adipisicing labore tempor ex ullamco voluptate exercitation non est labore commodo ipsum anim. Cillum consequat excepteur magna Lorem incididunt veniam in eu laborum minim. Nostrud qui magna laborum aliquip qui exercitation culpa reprehenderit anim culpa pariatur ipsum dolor nostrud.</p>
                    <p>Ullamco nulla sit labore culpa voluptate dolore amet fugiat in irure adipisicing deserunt commodo. Adipisicing labore tempor ex ullamco voluptate exercitation non est labore commodo ipsum anim. Cillum consequat excepteur magna Lorem incididunt veniam in eu laborum minim. Nostrud qui magna laborum aliquip qui exercitation culpa reprehenderit anim culpa pariatur ipsum dolor nostrud.</p>
                </SlideContainer>
                <Hohoho />
                {/* <SignForm /> */}
                <MenuListGrid />
                <StoreTest />
                {/**  -------------------  **/}
                {/* <Route path='/' component={Gallery} />} /> */}
                {/* <TTT /> */}
                <Gallery/>
                <Grid.Row>
                    <Grid.Container>
                        <Grid.Col lg="4"><Tile></Tile></Grid.Col>
                        <Grid.Col lg="4"><Tile></Tile></Grid.Col>
                        <Grid.Col lg="8"><Tile size={2}></Tile></Grid.Col>
                    </Grid.Container>
                </Grid.Row>
                <ProductCartButtonTest />
                <ButtonChevronRight title={"Расчитать"} />
                <ValueSwitch items={["20", "40", "60"]} title="Показывать по:"/>
                <RecenlyViewed />
                {/* <Map /> */}
                <SocialButton />
                <MailLine />
                <RCT />
                <LeftMenu />
                <div className="test-triangle"></div>
                <Dropdown 
                    options={options}
                    name="country"
                    placeholder="Выберите страну"
                    value={this.state.data.country.value}
                    valid={this.state.data.country.valid}
                    onChange={this.handleChange}/>
                <SearchInputCity
                    name="city"
                    value={this.state.data.city.value}
                    valid={this.state.data.city.valid}
                    placeholder="Введите город"
                    onChange={this.handleChange}/>
                <SearchInputAddress
                    name="address"
                    value={this.state.data.address.value}
                    valid={this.state.data.address.valid}
                    placeholder="Введите адрес"
                    onChange={this.handleChange}/>
                <BasicInput
                    name="lastname"
                    value={this.state.data.lastname.value}
                    valid={this.state.data.lastname.valid}
                    placeholder="Фамилия"
                    onChange={this.handleChange}/>
                <BasicInput
                    name="firstname"
                    value={this.state.data.firstname.value}
                    valid={this.state.data.firstname.valid}
                    placeholder="Имя"
                    onChange={this.handleChange}/>
                <BasicInput
                    name="email"
                    value={this.state.data.email.value}
                    valid={this.state.data.email.valid}
                    placeholder="E-mail"
                    onChange={this.handleChange}/>
                <PhoneInput
                    name="phone"
                    value={this.state.data.phone.value}
                    valid={this.state.data.phone.valid}
                    placeholder="Телефон"
                    onChange={this.handleChange}/>

                <button onClick={this.handleValidate}>Validate</button>
            </div>
        )
    }
}


export default Controller;