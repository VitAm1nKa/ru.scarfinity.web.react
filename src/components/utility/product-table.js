import React            from 'react';
import Measure          from 'react-measure';
import NavLink          from 'react-router-dom/NavLink';
import Currency         from './currency';
import ImageContainer   from './image-container';
import ColorPicker      from './color-picker';

import './product-table.less';

const TableTitle = (props) => <span className="product-table__title" data-full={props.title} data-small={props.title2}></span>
const TableIcon = (props) => <span className="product-table__icon">{props.glyph}</span>

const ColorContainer = (props) => <div className="product-table__color-container">
        <span className="product-table__color-container__title">{"Цвет:"}</span>
        <ColorPicker 
            count={1}
            colors={[props.colorCode || -1]}
            unselectable/>
    </div>

const TableRow = (props) => {
    // Метод, отрисовывающей общую концепцию
    // На его основе, реализуются все линии таблицы (шапка, линия товара)
    return(
        <div className="product-table__row">
            <div className="product-table__row__utitlity">{props.utility}</div>
            <div className="product-table__row__image">{props.image}</div>
            <div className="product-table__row__content">{props.content}</div>
            <div className="product-table__row__price">{props.price}</div>
            <div className="product-table__row__icon">{props.leftIcon}</div>
            <div className="product-table__row__quantity">{props.quantity}</div>
            <div className="product-table__row__icon">{props.rightIcon}</div>
            <div className="product-table__row__line-total">{props.lineTotal}</div>
        </div>
    )
}

const ProductTableFooter = (props) => {
    return(
        <div className="product-table__footer">
            <div className="product-table__footer__title">
                {"Подытог:"}<span>{<Currency original={props.subTotal || 0} fontSize={15} />}</span>
            </div>
            <div className="product-table__footer__title">
                {"Доставка:"}<span>{<Currency original={props.freight || 0} fontSize={15}/>}</span>
            </div>
            <div className="product-table__footer__title">
                {"Итого:"}<span>{<Currency original={props.totalDue || 0} fontSize={22} fontWeight={500}/>}</span>
            </div>
        </div>
    )
}

const ProductTableContent = (props) => {
    return(
        <div className="product-table__content">
            <NavLink
                to={props.path || '/'}
                className="product-table__content__title">{props.title}</NavLink>
            <div className="product-table__content__description">{props.description}</div>
        </div>
    )
}

const ProductTableHeader = (props) => {
    // Хедер таблицы
    return(
        <TableRow 
            content={<TableTitle title="Наименование" title2="Наменование" />}
            price={<TableTitle title="Цена" title2="Цена" />}
            quantity={<TableTitle title="Количество" title2="Кол-во" />}
            lineTotal={<TableTitle title="Сумма" title2="Сумма" />}
        />
    )
}

const ProductTableLine = (props) => {
    return(
        <TableRow 
            utility={null}
            image={<ImageContainer imageUrl={props.line.product.image.getPreview()}/>}
            content={<ProductTableContent 
                title={props.line.product.title}
                path={props.line.product.path}
                description={<ColorContainer 
                    colorCode={props.line.product.colorCode}
                />}
            />}
            price={<Currency original={props.line.unitPrice} />}
            leftIcon={<TableIcon glyph={"×"} />}
            quantity={props.line.orderQty}
            rightIcon={<TableIcon glyph={"="} />}
            lineTotal={<Currency original={props.line.lineTotal} />}
        />
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dimensions: {
                width: -1,
                height: -1
            }
        }

        this.handleResize = this.handleResize.bind(this);
    }

    handleResize(contentRect) {
        this.setState({dimensions: contentRect.bounds});
    }

    render() {
        return(
            <Measure
                bounds
                onResize={this.handleResize}>
                    {({measureRef}) => 
                        <div
                            ref={measureRef}
                            className="product-table">
                                <ProductTableHeader />
                                {
                                    _.map(this.props.lines, line => 
                                        <ProductTableLine
                                            key={line.productId}
                                            line={line}/>
                                    )
                                }
                                <ProductTableFooter {...this.props.orderInfo}/>
                        </div>
                    }
            </Measure>
        )
    }
}

export default Controller;