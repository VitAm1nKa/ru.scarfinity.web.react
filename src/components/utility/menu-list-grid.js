import React    from 'react';
import NavLink  from 'react-router-dom/NavLink';

import './menu-list-grid.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: this.getLists(props.nodes)
        }
    }

    compactList(list, max = 0) {
        if(max == 0) {
            list.nodes = null;
        } else if(list.NodesCount() - max > 0) {
            list.nodes = (_.take(list.nodes, max - 1));
            list.more = true;
        }

        return list;
    }

    getLists(nodes) {
        if(nodes == null)
            return null;

        // Отсортировать элементы по количеству 
        var items = _.reverse(_.sortBy(nodes, node => node.NodesCount()));
        var chunks = Math.ceil(items.length / 3);

        let columns = [[], [], []];

        // Разбить элементы по группам
        for(var i = 0; i < items.length; i++) {
            const index = i % 3;
            const item = items[i];
            if(index == 0) {
                if(_.reduce(columns[1], (sum, n) => sum + n.NodesCount(), 0) < 13 && columns[1].length < Math.min(3, chunks)) {
                    columns[1].push(item);
                } else if(_.reduce(columns[0], (sum, n) => sum + n.NodesCount(), 0) < 13 && columns[0].length < Math.min(3, chunks)) {
                    columns[0].push(item);
                } else {
                    columns[2].push(item);
                }
            } else if(index == 1) {
                if(_.reduce(columns[0], (sum, n) => sum + n.NodesCount(), 0) < 13 && columns[0].length < Math.min(3, chunks)) {
                    columns[0].push(item);
                } else {
                    columns[2].push(item);
                }
            } else {
                columns[2].push(item);
            }
        }

        if(chunks == 1) {
            columns = _.reverse(_.sortBy(columns, c => c.length));
        }

        columns[2] = _.take(columns[2], 7);

        // Обработка колонок
        _.each(columns, column => {
            const count = column.length;
            if(count == 1) {
                column[0] = this.compactList(column[0], 13);
            }
            if(count == 2) {
                const r = column[0].NodesCount() / column[1].NodesCount();
                if(r <= 6 / 5) {
                    column[0] = this.compactList(column[0], 6);
                    column[1] = this.compactList(column[1], 5);
                } else if(r < 7 / 4) {
                    column[0] = this.compactList(column[0], 7);
                    column[1] = this.compactList(column[1], 4);
                } else {
                    column[0] = this.compactList(column[0], 8);
                    column[1] = this.compactList(column[1], 3);
                }
            }
            if(count == 3) {
                column[0] = this.compactList(column[0], 3);
                column[1] = this.compactList(column[1], 3);
                column[2] = this.compactList(column[2], 3);
            }
            if(count == 4) {
                column[0] = this.compactList(column[0], 4);
                column[1] = this.compactList(column[1], 3);
                column[2] = this.compactList(column[2]);
                column[3] = this.compactList(column[3]);
            }
            if(count == 5) {
                column[0] = this.compactList(column[0], 5);
                column[1] = this.compactList(column[1]);
                column[2] = this.compactList(column[2]);
                column[3] = this.compactList(column[3]);
                column[4] = this.compactList(column[4]);
            }
            if(count == 6) {
                column[0] = this.compactList(column[0], 3);
                column[1] = this.compactList(column[1]);
                column[2] = this.compactList(column[2]);
                column[3] = this.compactList(column[3]);
                column[4] = this.compactList(column[4]);
                column[5] = this.compactList(column[5]);
            }
            if(count == 7) {
                column[0] = this.compactList(column[0]);
                column[1] = this.compactList(column[1]);
                column[2] = this.compactList(column[2]);
                column[3] = this.compactList(column[3]);
                column[4] = this.compactList(column[4]);
                column[5] = this.compactList(column[5]);
                column[6] = this.compactList(column[6]);
            }
        });

        return columns;
    }

    render() {
        if(this.state.columns != null) { 
            return(
                <div className="menu-list-grid">
                    {
                        _.map(this.state.columns, (column, index) => <div key={index}>
                            {
                                _.map(column, node => {
                                    return(
                                        <div
                                            className="menu-list-grid-block" 
                                            key={node.productCategoryId}>
                                                <NavLink
                                                    to={node.path}
                                                    className="menu-list-grid-block__title">
                                                        {node.title}
                                                </NavLink>
                                                {
                                                    _.map(node.nodes, subNode => {
                                                        return(
                                                            <NavLink
                                                                to={subNode.path}
                                                                key={subNode.productCategoryId}
                                                                className="menu-list-grid-block__item">
                                                                    {subNode.title}
                                                            </NavLink>
                                                        )
                                                    })
                                                }
                                                {
                                                    node.more == true &&
                                                    <NavLink
                                                        to={node.path}
                                                        className="menu-list-grid-block__more">
                                                            {"Смотреть еще"}
                                                    </NavLink>
                                                }
                                        </div>
                                    )
                                })
                            }
                        </div>)
                    }
                </div>
            )
        }

        return null;
    }
}

export default Controller;