import React from "react";
import ReactDOM from 'react-dom';
import { Link } from 'gatsby'
import { connect } from "react-redux";
import logo from "../../assets/images/logo_bmwf.svg"
import {EditableText} from "react-easy-editables";
import {loadPageData, updatePage, validateAccessCode} from "../../redux/actions";

const mapDispatchToProps = dispatch => {
  return {
    onUpdatePageData: (page, id, data) => {
      dispatch(updatePage(page, id, data));
    },
    onLoadPageData: data => {
      dispatch(loadPageData(data));
    },
    validateAccessCode: (code) => {
      dispatch(validateAccessCode(code));
    },
  };
};

const mapStateToProps = state => {
  return {
    pageData: state.page.data,
    accessGranted: state.adminTools.accessGranted,
  };
};

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false
    }
  }

  componentDidMount() {
    this.appRoot = document.querySelector('.nl-page');
    this.container = document.createElement('div');
    this.appRoot.appendChild(this.container);
  }

  handleClick = (e) => {
    e.preventDefault();
    document.querySelector(e.target.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    this.setState({ menuIsOpen: false })
  }

  toggleMenu = (e) => {
    e.preventDefault();
    this.setState({ menuIsOpen: !this.state.menuIsOpen })
  }

  onSave = id => content => {
    this.props.onUpdatePageData("home", id, content);
  };

  menu = () => {
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.allPages.home.content);

    return (
      <div className={`menu animate__animated animate__slideInDown ${this.state.menuIsOpen ? 'is-active' : ''}`}>
        <a className='menu-item' href="#intro" onClick={this.handleClick}><EditableText content={content["nav-link-text-1"]} onSave={this.onSave("nav-link-text-1")} /></a>
        <a className='menu-item' href="#program-elements" onClick={this.handleClick}><EditableText content={content["nav-link-text-2"]} onSave={this.onSave("nav-link-text-2")} /></a>
        <a className='menu-item' href="#connecting-tree" onClick={this.handleClick}><EditableText content={content["nav-link-text-3"]} onSave={this.onSave("nav-link-text-3")} /></a>
        <a className='menu-item' href="#participants" onClick={this.handleClick}><EditableText content={content["nav-link-text-4"]} onSave={this.onSave("nav-link-text-4")} /></a>
        <a className='menu-item' href="#connect" onClick={this.handleClick}><EditableText content={content["nav-link-text-5"]} onSave={this.onSave("nav-link-text-5")} /></a>
        <a className='menu-item' href="#session-materials" onClick={this.handleClick}><EditableText content={content["nav-link-text-6"]} onSave={this.onSave("nav-link-text-6")} /></a>
      </div>
    )
  }

  render() {
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.allPages.home.content);

    return (
      <nav className={`navbar`}>
        <div className="logo">
          <Link to={'/'} className="display-flex"><img src={logo} alt="BMW Foundation | Herbert Quant"/></Link>
        </div>
        {
          this.props.accessGranted &&
          <React.Fragment>
          <div className='navbar-items'>
            <a className='navbar-item menu-item' href="#menu" onClick={this.toggleMenu}>{this.state.menuIsOpen ? 'Close' : 'Menu'}</a>
            <a className='navbar-item' href="#intro" onClick={this.handleClick}><EditableText content={content["nav-link-text-1"]} onSave={this.onSave("nav-link-text-1")} /></a>
            <a className='navbar-item' href="#program-elements" onClick={this.handleClick}><EditableText content={content["nav-link-text-2"]} onSave={this.onSave("nav-link-text-2")} /></a>
            <a className='navbar-item' href="#connecting-tree" onClick={this.handleClick}><EditableText content={content["nav-link-text-3"]} onSave={this.onSave("nav-link-text-3")} /></a>
            <a className='navbar-item' href="#participants" onClick={this.handleClick}><EditableText content={content["nav-link-text-4"]} onSave={this.onSave("nav-link-text-4")} /></a>
            <a className='navbar-item' href="#connect" onClick={this.handleClick}><EditableText content={content["nav-link-text-5"]} onSave={this.onSave("nav-link-text-5")} /></a>
            <a className='navbar-item' href="#session-materials" onClick={this.handleClick}><EditableText content={content["nav-link-text-6"]} onSave={this.onSave("nav-link-text-6")} /></a>
          </div>
          {
            this.container && ReactDOM.createPortal(this.menu(), this.container)
          }
          </React.Fragment>
        }
      </nav>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
