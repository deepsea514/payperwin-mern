import React, { useEffect } from "react";
import { setTitle } from '../libs/documentTitleBuilder';
import Favicon from 'react-favicon';

export default function Maintenance({ maintenance, history }) {
    useEffect(() => {
        if (!maintenance) {
            history.push('/')
        }
    }, [maintenance])
    setTitle({ pageTitle: 'We are in maintenance mode.' });
    return (
        <div className="maintenance-container">
            <Favicon url={'/images/favicon-2.ico'} />
            <article className="maintenance-article">
                <center><img src="/media/logos/payperwin-web-dark.png" /></center>
                <h1 className="pt-5">We&rsquo;ll be back soon!</h1>
                <div className="pt-3">
                    <p>Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment. We&rsquo;ll be back online shortly!</p>
                    <p>&mdash; The PPW Team</p>
                </div>
            </article>
        </div>
    );
}