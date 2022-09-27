import React, { Component , useRef } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import { KeyCodeUtils, LanguageUtils } from "../../utils";
import './Login.scss';
import { FormattedMessage } from 'react-intl';

import adminService from '../../services/adminService';

class Login extends Component {
    constructor(props) {
        super(props);
        this.btnLogin = React.createRef();
    }

    initialState = {
        username: '',
        password: '',
        loginError: ''
    }

    state = {
        ...this.initialState
    };

    refresh = () => {
        this.setState({
            ...this.initialState
        })
    }

    onUsernameChange = (e) => {
        this.setState({ username: e.target.value })
    }

    onPasswordChange = (e) => {
        this.setState({ password: e.target.value })
    }

    redirectToSystemPage = () => {
        const { navigate } = this.props;
        const redirectPath = '/system/user-manage';
        navigate(`${redirectPath}`);
    }

    processLogin = () => {
        const { username, password } = this.state;

        const { adminLoginSuccess, adminLoginFail } = this.props;
        let loginBody = {
            username: 'admin',
            password: '123456'
        }
        //sucess
        let adminInfo = {
            "tlid": "0",
            "tlfullname": "Administrator",
            "custype": "A",
            "accessToken": "eyJhbGciOiJIU"
        }

        adminLoginSuccess(adminInfo);
        this.refresh();
        this.redirectToSystemPage();
        try {
            adminService.login(loginBody)
        } catch (e) {
            console.log('error login : ', e)
        }

    }

    handlerKeyDown = (event) => {
        const keyCode = event.which || event.keyCode;
        if (keyCode === KeyCodeUtils.ENTER) {
            event.preventDefault();
            if (!this.btnLogin.current || this.btnLogin.current.disabled) return;
            this.btnLogin.current.click();
        }
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handlerKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handlerKeyDown);
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    
    render() {
        function handleEyeClick(e) {
            let inputPW = document.querySelector('.password')
            if (inputPW.type == 'text') {
                inputPW.type = 'password'
                e.target.className = 'fa-regular fa-eye-slash'
            } else
            {
                inputPW.type = 'text'
                e.target.className = 'fa-regular fa-eye'
            }
            
        }
        const { username, password, loginError } = this.state;
        const { lang } = this.props;
        return (
            <div className='wrapper'>
                <div className='login'>
                    <div className='header'>
                        <h1>LOGIN</h1>
                        <p>Please enter your login and password</p>
                    </div>
                    <div className='inputGroup'>
                        <input placeholder='User name'></input>
                    </div>
                    <div className='inputGroup'>
                        <input type='password' className='password' placeholder='Password'></input>
                        <i class="fa-regular fa-eye" onClick={(e)=>handleEyeClick(e)}></i>
                    </div>
                    <div className='forgot-pass'><a>Forgot password?</a></div>
                    <div className='submit'><button>Login</button></div>
                    <div className='login-with'>
                        <i className="fa-brands fa-google"></i> 
                        <i className="fa-brands fa-facebook"></i>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
        adminLoginFail: () => dispatch(actions.adminLoginFail()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
