import React                    from 'react';
import {
    NavLink
}                               from 'react-router-dom';

import { Nodes }                from '../../store/__routes';
import * as Grid                from '../../lib/grid';
import MailLine                 from '../utility/mail-line';
import SocialButton             from '../utility/social-button';
import Logo                     from '../utility/logo';

const FooterMenu = (props) => {
    return(
        <div className="footer-menu">
            <NavLink
                to={props.root.path || '/'}
                className="footer-menu__title">
                    {props.root.title}
            </NavLink>
            {
                _.map(props.nodes, (node, index) => {
                    return(<NavLink
                        key={index}
                        to={node.path}
                        className="footer-menu__item">
                            {node.title}
                    </NavLink>)
                })
            }
        </div>
    )
}

class Controller extends React.Component {
    render() {
        return(
            <footer>
                <MailLine />
                <Grid.Row className="footer-body">
                    <Grid.Container>
                        <Grid.Col lg={4}>
                            <Grid.VerticalGrid>
                                <div><Logo /></div>
                                <div className="footer-social">
                                    <span className="footer-social__title">{"Мы в соц.сетях"}</span>
                                    <SocialButton icon={"vk"} href={""} />
                                    <SocialButton icon={"fb"} href={""} />
                                    <SocialButton icon={"ok"} href={""} />
                                    <SocialButton icon={"ig"} href={""} />
                                    <SocialButton icon={"pt"} href={""} />
                                </div>
                            </Grid.VerticalGrid>
                        </Grid.Col>
                        <Grid.Col lg={3}>
                            <FooterMenu
                                root={Nodes('catalog')}
                                nodes={Nodes(['ladies', 'gents', 'kids', 'accessories', 'jewelry'])}/>
                        </Grid.Col>
                        <Grid.Col lg={3}>
                            <FooterMenu
                                root={Nodes('company')}
                                nodes={Nodes(['news', 'contacts', 'shops', 'wholesale', 'cashback'])}/>
                        </Grid.Col>
                        <Grid.Col lg={3}>
                            <FooterMenu
                                root={Nodes('info')}
                                nodes={Nodes(['faq', 'payments', 'shipping', 'warranty'])}/>
                        </Grid.Col>
                        <Grid.Col lg={3}>
                            <FooterMenu
                                root={Nodes('account')}
                                nodes={Nodes(['personal', 'history', 'wishlist', 'preferences'])}/>
                        </Grid.Col>
                    </Grid.Container>
                </Grid.Row>
                <div className="bottom-logo"></div>
                <div className="bottom-copyright">{"© 2018 Scarfinity. Все права защищены."}</div>
            </footer>
        )
    }
}

export default Controller;
