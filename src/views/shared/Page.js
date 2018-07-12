import React            from 'react';
import { connect }      from 'react-redux';
import { withRouter }   from 'react-router-dom';

import {
    environmentActionCreators
}                       from '../../store/environment';
import {
    pageLoadingActions
}                       from '../../store/navigation';
import {
    reduxLog
}                       from '../../store/values';

import { PageMeta, SitePage }     from '../../models/PageMeta';
import { __sitePage } from '../../store/api-requests';

export function withPage(WrappedComponent, pageId = '__page') {
    class Controller extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                pageLoading: false,
                pageLoadingProgress: 0,
                sitePage: null,
                baseBreadCrumbs: [],
                breadCrumbs: []
            }

            this.initializePage = this.initializePage.bind(this);
            this.setPageData = this.setPageData.bind(this);
        }

        componentWillMount() {
            // При первой загрузке страницы, занести информацию в окружение
            this.state.sitePage = _.find(this.props.pages, p => p.pageId === pageId);
            if(this.state.sitePage == null) {
                this.state.sitePage = new SitePage({ pageId });
                this.props.pushPageMeta(this.state.sitePage);
            }
        }

        initializePage({ seo, breadCrumbs }, callback) {
            if(seo) {
                // Загрузка инфомации о странице
                if(this.state.sitePage.pageMeta == null) {
                    __sitePage.Get.Single(seo)(
                        data => {
                            this.setPageData({ 
                                pageMeta: new PageMeta(data),
                                breadCrumbs: { seo: data.seo, title: data.title }
                            }, true);
                        },
                        error => {
                            this.setPageData({ 
                                pageMeta: new PageMeta({ title: '404' }),
                                breadCrumbs: []
                            }, true);
                        }
                    )
                }
            } else {
                // Устанавливаем базовые хлебные крошки для данной страницы
                // Когда информация о странице не одрузамевает запроса на мету
                // this.setBreadCrumbs(breadCrumbs, true);
            }

            if(callback) {
                callback(pageData => {
                    // Этот колбек может быть вызван асинхронным методом при загрузке страницы
                    // Вызов данного метода необходим для уточнения меты страницы
                    // И хлебных крошек
                    // Например когда загружается каталог, товар, пост блога, отзыв и тд.
                    if(pageData != null) {
                        this.setPageData(pageData);
                    } else {
                        this.setPageData({
                            pageMeta: new PageMeta({ title: '404' }),
                            breadCrumbs: []
                        });
                    }
                }, () => {
                    // on complete
                });
            }
        }

        setPageData(pageData, base = false) {
            if(pageData != null) {
                if(pageData.pageMeta != null) {
                    if(base) {
                        this.state.sitePage.pageMeta = _.merge({}, pageData.pageMeta, this.state.sitePage.pageMeta);
                    } else {
                        this.state.sitePage.pageMeta = _.merge({}, this.state.sitePage.pageMeta, pageData.pageMeta);
                    }

                    this.state.sitePage.pageId = pageId;
                }

                if(pageData.breadCrumbs != null) {
                    if(base) {
                        this.state.sitePage.baseBreadCrumbs = _.flatten([pageData.breadCrumbs]);
                    } else {
                        this.state.sitePage.breadCrumbs = _.flatten([pageData.breadCrumbs]);
                    }
                }
                
                this.props.setPageMeta(this.state.sitePage);
            }
        }

        componentWillUnmount() {
            // Удаляем данные о странице из стора
            this.props.popPageMeta(pageId);
        }

        render() {
            return <WrappedComponent
                {...this.props} 
                initializePage={this.initializePage}
                setPageData={(pageData) => this.setPageData(pageData)}
                logMessage={this.props.reduxLog} />;
        }
    }

    return connect(state => ({
        pages: state.environment.pageMetaList
    }), Object.assign({}, environmentActionCreators, pageLoadingActions, reduxLog))(Controller);
}

export default withPage;

