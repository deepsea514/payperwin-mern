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
            <Favicon url={'/images/favicon.png'} />
            <article className="maintenance-article">
                <center><img src="/images/logo-blue.png" /></center>
                <h1 className="pt-5">We'll be back soon!</h1>
                <div className="pt-3">
                    <p>Sorry for the inconvenience but we're performing some maintenance at the moment. We'll be back online shortly!</p>
                    <p>&mdash; The PAYPERWIN Team</p>
                </div>
            </article>
        </div>
    );
}