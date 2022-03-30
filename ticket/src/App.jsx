import './assets/css/bootstrap.min.css';
import './assets/css/icofont.min.css';
import './assets/css/animate.min.css';
import 'react-modal-video/css/modal-video.min.css'
import './assets/css/style.css';
import './assets/css/responsive.css';
import 'react-phone-input-2/lib/style.css'
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import AppRouter from './Routes';
import Preloader from './components/Shared/Preloader';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import { ToastContainer } from 'react-toastify';

class App extends React.Component {
    state = {
        loading: true
    };

    componentDidMount() {
        this.demoAsyncCall().then(() => this.setState({ loading: false }));
    }

    demoAsyncCall = () => {
        return new Promise((resolve) => setTimeout(() => resolve(), 2000));
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    {this.state.loading ? <Preloader /> : ''}
                    <AppRouter />
                    <ToastContainer />
                </PersistGate>
            </Provider>
        );
    }
}

export default App;
